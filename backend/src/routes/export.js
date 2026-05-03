const express = require('express');
const ExcelJS = require('exceljs');
const pool = require('../config/db');
const { authenticateToken, roleCheck } = require('../middleware/auth');
const { logError } = require('../middleware/errorLogger');

const router = express.Router();

// ألوان GACA
const COLORS = {
  headerBg: '140046',   // Brand Dark Blue
  headerFg: 'FFFFFF',
  accent:   '23EBA5',   // Brand Green
  rowAlt:   'F4F6FB',
  border:   'E5E7EB',
  status: {
    'جديدة':         'DBEAFE',  // أزرق فاتح
    'تحت الإجراء':   'FEF3C7',  // أصفر فاتح
    'مغلقة':         'D1FAE5',  // أخضر فاتح
  },
  priority: {
    'حرجة':    'FEE2E2',
    'عالية':   'FFEDD5',
    'متوسطة':  'FEF9C3',
    'منخفضة':  'F0FDF4',
  },
};

router.get('/excel', authenticateToken, roleCheck('admin', 'manager', 'coordinator'), async (req, res) => {
  try {
    const { service, status, priority, classification, impact, responsibility, startDate, endDate } = req.query;
    const isCoordinator = req.user.role === 'coordinator';

    let queryStr = `
      SELECT
        t.ticket_number, s.name as service_name,
        t.environment, t.description,
        t.classification, t.impact, t.priority, t.status, t.responsibility,
        t.observed_date, t.expected_resolution_date, t.closed_date,
        u.full_name as created_by_name
      FROM tickets t
      LEFT JOIN services s ON t.service_id = s.id
      LEFT JOIN users u ON t.created_by = u.id
      WHERE 1=1
    `;

    const params = [];
    let idx = 1;

    // المنسق يصدّر تذاكر خدماته + تذاكره العامة فقط
    if (isCoordinator) {
      queryStr += ` AND (s.coordinator_id = $${idx} OR (t.service_id IS NULL AND t.created_by = $${idx}))`;
      params.push(req.user.id);
      idx++;
    }

    if (service)         { queryStr += ` AND t.service_id = $${idx++}`;       params.push(service); }
    if (status)          { queryStr += ` AND t.status = $${idx++}`;            params.push(status); }
    if (priority)        { queryStr += ` AND t.priority = $${idx++}`;          params.push(priority); }
    if (classification)  { queryStr += ` AND t.classification = $${idx++}`;    params.push(classification); }
    if (impact)          { queryStr += ` AND t.impact = $${idx++}`;            params.push(impact); }
    if (responsibility)  { queryStr += ` AND t.responsibility = $${idx++}`;    params.push(responsibility); }
    if (startDate)       { queryStr += ` AND t.observed_date >= $${idx++}`;    params.push(startDate); }
    if (endDate)         { queryStr += ` AND t.observed_date <= $${idx++}`;    params.push(endDate); }

    queryStr += ' ORDER BY t.ticket_number';

    const result = await pool.query(queryStr, params);
    const tickets = result.rows;

    // ---- بناء ملف Excel ----
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'منصة أجواء';
    workbook.created = new Date();

    const sheet = workbook.addWorksheet('ملاحظات أجواء', {
      views: [{ rightToLeft: true }],
      pageSetup: { orientation: 'landscape', fitToPage: true, fitToWidth: 1 },
    });

    // عرض الأعمدة
    sheet.columns = [
      { key: 'ticket_number',             width: 14 },
      { key: 'service_name',              width: 30 },
      { key: 'environment',               width: 18 },
      { key: 'description',               width: 45 },
      { key: 'classification',            width: 16 },
      { key: 'impact',                    width: 18 },
      { key: 'priority',                  width: 14 },
      { key: 'status',                    width: 16 },
      { key: 'responsibility',            width: 16 },
      { key: 'observed_date',             width: 16 },
      { key: 'expected_resolution_date',  width: 20 },
      { key: 'closed_date',               width: 16 },
      { key: 'created_by_name',           width: 20 },
    ];

    // صف الرأس
    const headers = [
      'رقم التذكرة', 'الخدمة', 'حالة البيئة', 'وصف الملاحظة',
      'التصنيف', 'الأثر', 'الأولوية', 'الحالة', 'المسؤولية',
      'تاريخ الرصد', 'تاريخ الحل المتوقع', 'تاريخ الإغلاق', 'أنشئ بواسطة',
    ];

    const headerRow = sheet.addRow(headers);
    headerRow.height = 28;
    headerRow.eachCell(cell => {
      cell.fill   = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.headerBg } };
      cell.font   = { name: 'Arial', bold: true, color: { argb: COLORS.headerFg }, size: 11 };
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true, readingOrder: 'rightToLeft' };
      cell.border = {
        top:    { style: 'thin', color: { argb: COLORS.border } },
        bottom: { style: 'thin', color: { argb: COLORS.border } },
        left:   { style: 'thin', color: { argb: COLORS.border } },
        right:  { style: 'thin', color: { argb: COLORS.border } },
      };
    });

    // صفوف البيانات
    tickets.forEach((t, i) => {
      const row = sheet.addRow([
        t.ticket_number,
        t.service_name || 'عامة',
        t.environment || '',
        t.description || '',
        t.classification || '',
        t.impact || '',
        t.priority || '',
        t.status || '',
        t.responsibility || '',
        formatDate(t.observed_date),
        formatDate(t.expected_resolution_date),
        formatDate(t.closed_date),
        t.created_by_name || '',
      ]);

      row.height = 22;
      const isAlt = i % 2 === 1;

      row.eachCell((cell, colNum) => {
        // لون خلفية الصف
        const statusColor  = colNum === 8  ? COLORS.status[t.status]   : null;
        const priorityColor= colNum === 7  ? COLORS.priority[t.priority]: null;
        const bgColor = statusColor || priorityColor || (isAlt ? COLORS.rowAlt : 'FFFFFF');

        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } };
        cell.font = { name: 'Arial', size: 10 };
        cell.alignment = {
          vertical: 'middle',
          horizontal: colNum === 4 ? 'right' : 'center',
          wrapText: colNum === 4,
          readingOrder: 'rightToLeft',
        };
        cell.border = {
          top:    { style: 'thin', color: { argb: COLORS.border } },
          bottom: { style: 'thin', color: { argb: COLORS.border } },
          left:   { style: 'thin', color: { argb: COLORS.border } },
          right:  { style: 'thin', color: { argb: COLORS.border } },
        };
      });
    });

    // تجميد صف الرأس
    sheet.views = [{ state: 'frozen', ySplit: 1, rightToLeft: true }];

    // فلتر تلقائي
    sheet.autoFilter = { from: 'A1', to: `M1` };

    // صف الملخص
    const summaryRow = sheet.addRow([`إجمالي التذاكر: ${tickets.length}`, '', '', '', '', '', '', '', '', '', '', '', '']);
    summaryRow.getCell(1).font = { bold: true, color: { argb: COLORS.headerBg }, size: 10 };
    summaryRow.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E0E7FF' } };

    // إرسال الملف
    const fileName = `ajwaa-tickets-${new Date().toISOString().slice(0,10)}.xlsx`;
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(fileName)}`);

    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    con