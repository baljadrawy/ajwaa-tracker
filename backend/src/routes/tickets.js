const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../config/db');
const { authenticateToken, roleCheck } = require('../middleware/auth');
const { logError } = require('../middleware/errorLogger');

const router = express.Router();

// ⚠️ مهم: /stats/dashboard يجب أن يكون قبل /:id
router.get('/stats/dashboard', authenticateToken, async (req, res) => {
  try {
    // المنسق يرى إحصائيات خدماته فقط
    const isCoordinator = req.user.role === 'coordinator';
    const whereClause = isCoordinator
      ? `WHERE t.service_id IN (SELECT id FROM services WHERE coordinator_id = $1)`
      : `WHERE 1=1`;
    const params = isCoordinator ? [req.user.id] : [];

    const statusCount = await pool.query(
      `SELECT t.status, COUNT(*) as count FROM tickets t ${whereClause} GROUP BY t.status`, params
    );
    const priorityCount = await pool.query(
      `SELECT t.priority, COUNT(*) as count FROM tickets t ${whereClause} GROUP BY t.priority`, params
    );
    const responsibilityCount = await pool.query(
      `SELECT t.responsibility, COUNT(*) as count FROM tickets t ${whereClause} GROUP BY t.responsibility`, params
    );
    const totalResult = await pool.query(
      `SELECT COUNT(*) as count FROM tickets t ${whereClause}`, params
    );

    // عدد الخدمات (المنسق يرى خدماته فقط)
    const servicesResult = await pool.query(
      isCoordinator
        ? `SELECT COUNT(*) as count FROM services WHERE coordinator_id = $1`
        : `SELECT COUNT(*) as count FROM services`,
      isCoordinator ? [req.user.id] : []
    );

    res.json({
      byStatus: statusCount.rows,
      byPriority: priorityCount.rows,
      byResponsibility: responsibilityCount.rows,
      total: parseInt(totalResult.rows[0].count),
      totalServices: parseInt(servicesResult.rows[0].count),
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    logError({ req, statusCode: 500, error });
    res.status(500).json({ error: 'حدث خطأ في الخادم' });
  }
});

router.get('/', authenticateToken, async (req, res) => {
  try {
    const {
      service,
      status,
      priority,
      classification,
      impact,
      responsibility,
      coordinator,
      startDate,
      endDate,
      limit = 50,
      offset = 0
    } = req.query;

    let queryStr = `
      SELECT
        t.id, t.ticket_number, t.service_id, t.environment, t.description,
        t.classification, t.impact, t.priority, t.status, t.responsibility,
        t.observed_date, t.expected_resolution_date, t.closed_date,
        t.created_by, t.updated_at,
        s.name as service_name,
        u.full_name as created_by_name
      FROM tickets t
      LEFT JOIN services s ON t.service_id = s.id
      LEFT JOIN users u ON t.created_by = u.id
      WHERE 1=1
    `;

    const params = [];
    let paramIndex = 1;

    if (req.user.role === 'coordinator') {
      queryStr += ` AND s.coordinator_id = $${paramIndex++}`;
      params.push(req.user.id);
    }

    if (service) {
      queryStr += ` AND t.service_id = $${paramIndex++}`;
      params.push(service);
    }

    if (status) {
      queryStr += ` AND t.status = $${paramIndex++}`;
      params.push(status);
    }

    if (priority) {
      queryStr += ` AND t.priority = $${paramIndex++}`;
      params.push(priority);
    }

    if (classification) {
      queryStr += ` AND t.classification = $${paramIndex++}`;
      params.push(classification);
    }

    if (impact) {
      queryStr += ` AND t.impact = $${paramIndex++}`;
      params.push(impact);
    }

    if (responsibility) {
      queryStr += ` AND t.responsibility = $${paramIndex++}`;
      params.push(responsibility);
    }

    // فلتر المنسق — للمشرف والمدير فقط (المنسق مقيّد بخدماته تلقائياً)
    if (coordinator && req.user.role !== 'coordinator') {
      queryStr += ` AND s.coordinator_id = $${paramIndex++}`;
      params.push(coordinator);
    }

    if (startDate) {
      queryStr += ` AND t.observed_date >= $${paramIndex++}`;
      params.push(startDate);
    }

    if (endDate) {
      queryStr += ` AND t.observed_date <= $${paramIndex++}`;
      params.push(endDate);
    }

    // البحث النصي: رقم التذكرة أو الوصف
    const { search } = req.query;
    if (search) {
      queryStr += ` AND (t.ticket_number ILIKE $${paramIndex} OR t.description ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    // إجمالي النتائج بدون limit
    const countQuery = queryStr.replace(
      /SELECT[\s\S]*?FROM tickets/,
      'SELECT COUNT(*) as total FROM tickets'
    );
    const countResult = await pool.query(countQuery, params);
    const total = parseInt(countResult.rows[0].total);

    queryStr += ` ORDER BY t.updated_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    params.push(parseInt(limit));
    params.push(parseInt(offset));

    const result = await pool.query(queryStr, params);
    res.json({ tickets: result.rows, total });
  } catch (error) {
    console.error('Get tickets error:', error);
    logError({ req, statusCode: 500, error });
    res.status(500).json({ error: 'حدث خطأ في الخادم' });
  }
});

router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const ticketResult = await pool.query(
      `SELECT
        t.id, t.ticket_number, t.service_id, t.environment, t.description,
        t.classification, t.impact, t.priority, t.status, t.responsibility,
        t.observed_date, t.expected_resolution_date, t.closed_date,
        t.created_by, t.updated_at,
        s.name as service_name,
        u.full_name as created_by_name
      FROM tickets t
      LEFT JOIN services s ON t.service_id = s.id
      LEFT JOIN users u ON t.created_by = u.id
      WHERE t.id = $1`,
      [id]
    );

    if (ticketResult.rows.length === 0) {
      return res.status(404).json({ error: 'التذكرة غير موجودة' });
    }

    const ticket = ticketResult.rows[0];

    // التعليقات — أعمدة صحيحة: user_id, content
    const commentsResult = await pool.query(
      `SELECT
        c.id, c.ticket_id, c.content as comment_text, c.user_id as created_by, c.created_at,
        u.full_name as created_by_name
      FROM comments c
      LEFT JOIN users u ON c.user_id = u.id
      WHERE c.ticket_id = $1
      ORDER BY c.created_at ASC`,
      [id]
    );

    // سجل التغييرات — أعمدة صحيحة: user_id, changed_at
    const auditResult = await pool.query(
      `SELECT
        al.id, al.ticket_id, al.old_status, al.new_status, al.user_id as changed_by, al.changed_at,
        u.full_name as changed_by_name
      FROM audit_log al
      LEFT JOIN users u ON al.user_id = u.id
      WHERE al.ticket_id = $1
      ORDER BY al.changed_at ASC`,
      [id]
    );

    // المرفقات — أعمدة صحيحة: user_id, created_at
    const attachmentsResult = await pool.query(
      `SELECT id, file_name, file_path, user_id as uploaded_by, created_at as uploaded_at
       FROM attachments WHERE ticket_id = $1 ORDER BY created_at DESC`,
      [id]
    );

    res.json({
      ticket,
      comments: commentsResult.rows,
      auditLog: auditResult.rows,
      attachments: attachmentsResult.rows
    });
  } catch (error) {
    console.error('Get ticket error:', error);
    logError({ req, statusCode: 500, error });
    res.status(500).json({ error: 'حدث خطأ في الخادم' });
  }
});

router.post(
  '/',
  authenticateToken,
  roleCheck('admin', 'coordinator'),
  [
    body('environment').notEmpty().withMessage('حالة البيئة مطلوبة'),
    body('description').notEmpty().withMessage('وصف الملاحظة مطلوب'),
    body('classification').notEmpty().withMessage('التصنيف مطلوب'),
    body('impact').notEmpty().withMessage('الأثر مطلوب'),
    body('priority').notEmpty().withMessage('الأولوية مطلوبة'),
    body('responsibility').notEmpty().withMessage('المسؤولية مطلوبة')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        serviceId, environment, description,
        classification, impact, priority, responsibility
      } = req.body;

      // serviceId اختياري — التذكرة العامة لا ترتبط بخدمة
      const result = await pool.query(
        `INSERT INTO tickets
         (service_id, environment, description, classification, impact, priority, status, responsibility, created_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING id, ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, updated_at`,
        [serviceId || null, environment, description, classification, impact, priority, 'جديدة', responsibility, req.user.id]
      );

      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Create ticket error:', error);
      logError({ req, statusCode: 500, error });
      res.status(500).json({ error: 'حدث خطأ في الخادم' });
    }
  }
);

router.put(
  '/:id',
  authenticateToken,
  roleCheck('admin', 'coordinator'),
  async (req, res) => {
    try {
      const { id } = req.params;
      const {
        serviceId, environment, description, classification, impact,
        priority, status, responsibility,
        expectedResolutionDate, closureDate
      } = req.body;

      const ticketResult = await pool.query(
        `SELECT t.*, s.coordinator_id FROM tickets t
         LEFT JOIN services s ON t.service_id = s.id
         WHERE t.id = $1`, [id]
      );
      if (ticketResult.rows.length === 0) {
        return res.status(404).json({ error: 'التذكرة غير موجودة' });
      }

      const ticket = ticketResult.rows[0];

      // المنسق يعدّل تذاكره فقط (التي أنشأها أو تخص خدمته)
      if (req.user.role === 'coordinator') {
        const isOwner = ticket.created_by === req.user.id;
        const isCoordinator = ticket.coordinator_id === req.user.id;
        if (!isOwner && !isCoordinator) {
          return res.status(403).json({ error: 'غير مصرح لك بتعديل هذه التذكرة' });
        }
      }

      const updates = [];
      const values = [];
      let paramIndex = 1;

      // serviceId — المنسق لا يقدر يغير الخدمة إلا المشرف
      if (serviceId !== undefined && req.user.role === 'admin') {
        updates.push(`service_id = $${paramIndex++}`);
        values.push(serviceId || null);
      }
      if (environment) { updates.push(`environment = $${paramIndex++}`); values.push(environment); }
      if (description) { updates.push(`description = $${paramIndex++}`); values.push(description); }
      if (classification) { updates.push(`classification = $${paramIndex++}`); values.push(classification); }
      if (impact) { updates.push(`impact = $${paramIndex++}`); values.push(impact); }
      if (priority) { updates.push(`priority = $${paramIndex++}`); values.push(priority); }
      if (responsibility) { updates.push(`responsibility = $${paramIndex++}`); values.push(responsibility); }
      if (expectedResolutionDate) { updates.push(`expected_resolution_date = $${paramIndex++}`); values.push(expectedResolutionDate); }
      if (closureDate !== undefined) { updates.push(`closed_date = $${paramIndex++}`); values.push(closureDate || null); }

      let statusChanged = false;
      if (status && status !== ticket.status) {
        updates.push(`status = $${paramIndex++}`);
        values.push(status);
        statusChanged = true;
      }

      if (updates.length === 0) {
        return res.status(400).json({ error: 'لا توجد تحديثات' });
      }

      values.push(id);
      const updateQuery = `UPDATE tickets SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`;
      const updatedTicket = await pool.query(updateQuery, values);

      if (statusChanged) {
        await pool.query(
          'INSERT INTO audit_log (ticket_id, old_status, new_status, user_id) VALUES ($1, $2, $3, $4)',
          [id, ticket.status, status, req.user.id]
        );
      }

      res.json(updatedTicket.rows[0]);
    } catch (error) {
      console.error('Update ticket error:', error);
      logError({ req, statusCode: 500, error });
      res.status(500).json({ error: 'حدث خطأ في الخادم' });
    }
  }
);

router.post(
  '/:id/comments',
  authenticateToken,
  [body('commentText').notEmpty().withMessage('نص التعليق مطلوب')],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const { commentText } = req.body;

      const ticketCheck = await pool.query('SELECT id FROM tickets WHERE id = $1', [id]);
      if (ticketCheck.rows.length === 0) {
        return res.status(404).json({ error: 'التذكرة غير موجودة' });
      }

      // العمود في قاعدة البيانات: content و user_id
      const result = await pool.query(
        `INSERT INTO comments (ticket_id, content, user_id)
         VALUES ($1, $2, $3)
         RETURNING id, ticket_id, content as comment_text, user_id as created_by, created_at`,
        [id, commentText, req.user.id]
      );

      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Create comment error:', error);
      logError({ req, statusCode: 500, error });
      res.status(500).json({ error: 'حدث خطأ في الخادم' });
    }
  }
);

// DELETE /api/tickets/:ticketId/comments/:commentId — صاحب التعليق أو المشرف
router.delete('/:ticketId/comments/:commentId', authenticateToken, async (req, res) => {
  try {
    const { ticketId, commentId } = req.params;

    const result = await pool.query(
      'SELECT id, user_id FROM comments WHERE id = $1 AND ticket_id = $2',
      [commentId, ticketId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'التعليق غير موجود' });
    }

    const comment = result.rows[0];

    if (req.user.role !== 'admin' && comment.user_id !== req.user.id) {
      return res.status(403).json({ error: 'غير مصرح لك بحذف هذا التعليق' });
    }

    await pool.query('DELETE FROM comments WHERE id = $1', [commentId]);
    res.json({ message: 'تم حذف التعليق' });
  } catch (error) {
    console.error('Delete comment error:', error);
    logError({ req, statusCode: 500, error });
    res.status(500).json({ error: 'حدث خطأ في الخادم' });
  }
});

// DELETE /api/tickets/:id — المشرف يحذف أي تذكرة، المنسق يحذف تذاكره فقط إذا كانت "جديدة"
router.delete('/:id', authenticateToken, roleCheck('admin', 'coordinator'), async (req, res) => {
  try {
    const { id } = req.params;

    const ticketResult = await pool.query(
      `SELECT t.id, t.status, t.created_by, s.coordinator_id
       FROM tickets t
       LEFT JOIN services s ON t.service_id = s.id
       WHERE t.id = $1`,
      [id]
    );

    if (ticketResult.rows.length === 0) {
      return res.status(404).json({ error: 'التذكرة غير موجودة' });
    }

    const ticket = ticketResult.rows[0];

    // المنسق: يحذف فقط إذا كانت التذكرة "جديدة" وأنشأها هو أو تتبع خدمته
    if (req.user.role === 'coordinator') {
      if (ticket.status !== 'جديدة') {
        return res.status(403).json({ error: 'لا يمكن حذف التذكرة بعد بدء المعالجة' });
      }
      if (ticket.created_by !== req.user.id && ticket.coordinator_id !== req.user.id) {
        return res.status(403).json({ error: 'غير مصرح لك بحذف هذه التذكرة' });
      }
    }

    // حذف المرفقات والتعليقات والـ audit log أولاً ثم التذكرة
    await pool.query('DELETE FROM attachments WHERE ticket_id = $1', [id]);
    await pool.query('DELETE FROM comments WHERE ticket_id = $1', [id]);
    await pool.query('DELETE FROM audit_log WHERE ticket_id = $1', [id]);
    await pool.query('DELETE FROM tickets WHERE id = 