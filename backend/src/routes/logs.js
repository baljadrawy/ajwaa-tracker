const express = require('express');
const pool = require('../config/db');
const { authenticateToken, roleCheck } = require('../middleware/auth');

const router = express.Router();

// GET /api/logs/errors — سجل الأخطاء (admin فقط)
router.get('/errors', authenticateToken, roleCheck('admin'), async (req, res) => {
  try {
    const { limit = 100, offset = 0, status_code, user_id, date_from, date_to } = req.query;

    let queryStr = `
      SELECT
        el.id, el.method, el.path, el.status_code,
        el.error_message, el.error_stack, el.ip, el.created_at,
        u.username, u.full_name
      FROM error_log el
      LEFT JOIN users u ON el.user_id = u.id
      WHERE 1=1
    `;
    const params = [];
    let idx = 1;

    if (status_code) { queryStr += ` AND el.status_code = $${idx++}`; params.push(parseInt(status_code)); }
    if (user_id)     { queryStr += ` AND el.user_id = $${idx++}`;     params.push(parseInt(user_id)); }
    if (date_from)   { queryStr += ` AND el.created_at >= $${idx++}`; params.push(date_from); }
    if (date_to)     { queryStr += ` AND el.created_at <= $${idx++}`; params.push(date_to + ' 23:59:59'); }

    const countParams = [...params];
    queryStr += ` ORDER BY el.created_at DESC LIMIT $${idx++} OFFSET $${idx++}`;
    params.push(parseInt(limit), parseInt(offset));

    const [result, countResult] = await Promise.all([
      pool.query(queryStr, params),
      pool.query(
        `SELECT COUNT(*) FROM error_log el WHERE 1=1
         ${status_code ? ` AND el.status_code = ${parseInt(status_code)}` : ''}
         ${user_id     ? ` AND el.user_id = ${parseInt(user_id)}` : ''}
         ${date_from   ? ` AND el.created_at >= '${date_from}'` : ''}
         ${date_to     ? ` AND el.created_at <= '${date_to} 23:59:59'` : ''}`
      )
    ]);

    res.json({ logs: result.rows, total: parseInt(countResult.rows[0].count) });
  } catch (error) {
    console.error('Get error logs error:', error.message);
    res.status(500).json({ error: 'فشل تحميل السجل' });
  }
});

// GET /api/logs/access — سجل الطلبات (admin فقط)
router.get('/access', authenticateToken, roleCheck('admin'), async (req, res) => {
  try {
    const { limit = 100, offset = 0, user_id, status_code, date_from, date_to, method } = req.query;

    let queryStr = `
      SELECT
        al.id, al.method, al.path, al.status_code,
        al.duration_ms, al.ip, al.created_at,
        u.username, u.full_name
      FROM access_log al
      LEFT JOIN users u ON al.user_id = u.id
      WHERE 1=1
    `;
    const params = [];
    let idx = 1;

    if (user_id)     { queryStr += ` AND al.user_id = $${idx++}`;    params.push(parseInt(user_id)); }
    if (status_code) { queryStr += ` AND al.status_code = $${idx++}`; params.push(parseInt(status_code)); }
    if (method)      { queryStr += ` AND al.method = $${idx++}`;      params.push(method.toUpperCase()); }
    if (date_from)   { queryStr += ` AND al.created_at >= $${idx++}`; params.push(date_from); }
    if (date_to)     { queryStr += ` AND al.created_at <= $${idx++}`; params.push(date_to + ' 23:59:59'); }

    queryStr += ` ORDER BY al.created_at DESC LIMIT $${idx++} OFFSET $${idx++}`;
    params.push(parseInt(limit), parseInt(offset));

    const countQuery = queryStr.replace(/SELECT[\s\S]*?FROM/, 'SELECT COUNT(*) FROM').replace(/ORDER BY[\s\S]*/, '');
    const countParams = params.slice(0, params.length - 2);

    const [result, countResult] = await Promise.all([
      pool.query(queryStr, params),
      pool.query(countQuery, countParams)
    ]);

    res.json({ logs: result.rows, total: parseInt(countResult.rows[0].count) });
  } catch (error) {
    console.error('Get access logs error:', error.message);
    res.status(500).json({ error: 'فشل تحميل السجل' });
  }
});

// GET /api/logs/stats — إحصائيات سريعة
router.get('/stats', authenticateToken, roleCheck('admin'), async (req, res) => {
  try {
    const [errors, requests, slowReqs, activeUsers] = await Promise.all([
      // إجمالي الأخطاء اليوم
      pool.query(`SELECT COUNT(*) FROM error_log WHERE created_at >= CURRENT_DATE`),
      // إجمالي الطلبات اليوم
      pool.query(`SELECT COUNT(*) FROM access_log WHERE created_at >= CURRENT_DATE`),
      // طلبات بطيئة (أكثر من 2 ثانية) اليوم
      pool.query(`SELECT COUNT(*) FROM access_log WHERE duration_ms > 2000 AND created_at >= CURRENT_DATE`),
      // مستخدمون نشطون اليوم
      pool.query(`SELECT COUNT(DISTINCT user_id) FROM access_log WHERE created_at >= CURRENT_DATE AND user_id IS NOT NULL`),
    ]);

    // توزيع الأخطاء حسب الكود
    const errorsByCode = await pool.query(
      `SELECT status_code, COUNT(*) as count FROM error_log
       WHERE created_at >= CURRENT_DATE GROUP BY status_code ORDER BY count DESC`
    );

    // أكثر المستخدمين نشاطاً اليوم
    const topUsers = await pool.query(
      `SELECT u.full_name, u.username, COUNT(*) as requests
       FROM access_log al
       LEFT JOIN users u ON al.user_id = u.id
       WHERE al.created_at >= CURRENT_DATE AND al.user_id IS NOT NULL
       GROUP BY u.full_name, u.username ORDER BY requests DESC LIMIT 5`
    );

    res.json({
      today: {
        errors: parseInt(errors.rows[0].count),
        requests: parseInt(requests.rows[0].count),
        slowRequests: parseInt(slowReqs.rows[0].count),
        activeUsers: parseInt(activeUsers.rows[0].count),
      },
      errorsByCode: errorsByCode.rows,
      topUsers: topUsers.rows,
    });
  } catch (error) {
    console.error('Get logs stats error:', error.message);
    res.status(500).json({ error: 'فشل تحميل الإحصائيات' });
  }
});

// GET /api/logs/export — تصدير السجلات كـ CSV للتحليل الخارجي
router.get('/export', authenticateToken, roleCheck('admin'), async (req, res) => {
  try {
    const { type = 'errors', date_from, date_to } = req.query;

    let rows, filename, headers;

    if (type === 'access') {
      let q = `
        SELECT al.created_at, al.method, al.path, al.status_code,
          al.duration_ms, al.ip, u.username, u.full_name
        FROM access_log al
        LEFT JOIN users u ON al.user_id = u.id
        WHERE 1=1
        ${date_from ? `AND al.created_at >= '${date_from}'` : ''}
        ${date_to   ? `AND al.created_at <= '${date_to} 23:59:59'` : ''}
        ORDER BY al.created_at DESC LIMIT 10000`;
      const result = await pool.query(q);
      rows = result.rows;
      filename = `access_log_${new Date().toISOString().slice(0,10)}.csv`;
      headers = ['التاريخ', 'Method', 'المسار', 'الكود', 'المدة(ms)', 'IP', 'اليوزرنيم', 'الاسم'];
    } else {
      let q = `
        SELECT el.created_at, el.method, el.path, el.status_code,
          el.error_message, el.ip, u.username, u.full_name
        FROM error_log el
        LEFT JOIN users u ON el.user_id = u.id
        WHERE 1=1
        ${date_from ? `AND el.created_at >= '${date_from}'` : ''}
        ${date_to   ? `AND el.created_at <= '${date_to} 23:59:59'` : ''}
        ORDER BY el.created_at DESC LIMIT 10000`;
      const result = await pool.query(q);
      rows = result.rows;
      filename = `error_log_${new Date().toISOString().slice(0,10)}.csv`;
      headers = ['التاريخ', 'Method', 'المسار', 'الكود', 'الخطأ', 'IP', 'اليوزرنيم', 'الاسم'];
    }

    // بناء CSV مع BOM لدعم العربية في Excel
    const BOM = '\uFEFF';
    const csvLines = [headers.join(',')];
    for (const row of rows) {
      const values = Object.values(row).map(v => {
        if (v === null || v === undefined) return '';
        const str = String(v).replace(/"/g, '""');
        return `"${str}"`;
      });
      csvLines.push(values.join(','));
    }

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`);
    res.send(BOM + csvLines.join('\n'));
  } catch (error) {
    console.error('Export logs error:', error.message);
    res.status(500).json({ error: 'فشل التصدير' });
  }
});

// للتوافق مع الكود القديم — GET /api/logs
router.get('/', authenticateToken, roleCheck('admin'), async (req, res) => {
  try {
    const { limit = 100, offset = 0, status_code } = req.query;
    let queryStr = `
      SELECT el.id, el.method, el.path, el.status_code,
        el.error_message, el.ip, el.created_at,
        u.username, u.full_name
      FROM error_log el
      LEFT JOIN users u ON el.user_id = u.id
      WHERE 1=1
    `;
    const params = [];
    let idx = 1;
    if (status_code) { queryStr += ` AND el.status_code = $${idx++}`; params.push(status_code); }
    queryStr += ` ORDER BY el.created_at DESC LIMIT $${idx++} OFFSET $${idx++}`;
    params.push(parseInt(limit), parseInt(offset));
    const result = await pool.query(queryStr, params);
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM error_log ${status_code ? 'WHERE status_code = $1' : ''}`,
      status_code ? [status_code] : []
    );
    res.json({ logs: result.rows, total: parseInt(countResult.rows[0].count) });
  } catch (error) {
    res.status(500).json({ error: 'فشل تحميل السجل' });
  }
});

// DELETE /api/logs — مسح سجل الأخطاء (admin فقط)
router.delete('/', authenticateToken, roleCheck('admin'), async (req, res) => {
  try {
    const { type = 'errors' } = req.query;
    if (type === 'access') {
      await pool.query('TRUNCATE TABLE access_log RESTART IDENTITY');
      res.json({ message: 'تم مسح سجل الطلبات' });
    } else if (type === 'all') {
      await pool.query('TRUNCATE TABLE error_log RESTART IDENTITY');
      await pool.query('TRUNCATE TABLE access_log RESTART IDENTITY');
      res.json({ message: 'تم مسح جميع السجلات' });
    } else {
      await pool.query('TRUNCATE TABLE error_log RESTART IDENTITY');
      res.json({ message: 'تم مسح سجل الأخطاء' });
    }
  } catch (error) {
    res.status(500).json({ error: 'فشل المسح' });
  }
});

module.exports = router;
