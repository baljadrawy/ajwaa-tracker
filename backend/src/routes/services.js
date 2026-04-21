const express = require('express');
const { body, validationResult, query } = require('express-validator');
const pool = require('../config/db');
const { authenticateToken, roleCheck } = require('../middleware/auth');
const { logError } = require('../middleware/errorLogger');

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  try {
    const { sector, department, phase, coordinator, status } = req.query;

    let queryStr = `
      SELECT
        s.id, s.name, s.sector_id, s.department_id, s.coordinator_id,
        s.service_owner, s.status, s.phase_id, s.created_at,
        sec.name as sector_name,
        d.name as department_name,
        p.name as phase_name,
        u.full_name as coordinator_name
      FROM services s
      LEFT JOIN sectors sec ON s.sector_id = sec.id
      LEFT JOIN departments d ON s.department_id = d.id
      LEFT JOIN phases p ON s.phase_id = p.id
      LEFT JOIN users u ON s.coordinator_id = u.id
      WHERE 1=1
    `;

    const params = [];
    let paramIndex = 1;

    // المنسق يرى خدماته فقط — المشرف والمدير يرون الكل
    if (req.user.role === 'coordinator') {
      queryStr += ` AND s.coordinator_id = $${paramIndex++}`;
      params.push(req.user.id);
    }

    if (sector) {
      queryStr += ` AND s.sector_id = $${paramIndex++}`;
      params.push(sector);
    }

    if (department) {
      queryStr += ` AND s.department_id = $${paramIndex++}`;
      params.push(department);
    }

    if (phase) {
      queryStr += ` AND s.phase_id = $${paramIndex++}`;
      params.push(phase);
    }

    if (coordinator && req.user.role !== 'coordinator') {
      queryStr += ` AND s.coordinator_id = $${paramIndex++}`;
      params.push(coordinator);
    }

    if (status) {
      queryStr += ` AND s.status = $${paramIndex++}`;
      params.push(status);
    }

    queryStr += ' ORDER BY s.created_at DESC';

    const result = await pool.query(queryStr, params);
    res.json(result.rows);
  } catch (error) {
    logError({ req, statusCode: 500, error });
    console.error('Get services error:', error);
    res.status(500).json({ error: 'حدث خطأ في الخادم' });
  }
});

router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT
        s.id, s.name, s.sector_id, s.department_id, s.coordinator_id,
        s.service_owner, s.status, s.phase_id, s.created_at,
        sec.name as sector_name,
        d.name as department_name,
        p.name as phase_name,
        u.full_name as coordinator_name
      FROM services s
      LEFT JOIN sectors sec ON s.sector_id = sec.id
      LEFT JOIN departments d ON s.department_id = d.id
      LEFT JOIN phases p ON s.phase_id = p.id
      LEFT JOIN users u ON s.coordinator_id = u.id
      WHERE s.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'الخدمة غير موجودة' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    logError({ req, statusCode: 500, error });
    console.error('Get service error:', error);
    res.status(500).json({ error: 'حدث خطأ في الخادم' });
  }
});

router.post(
  '/',
  authenticateToken,
  roleCheck('admin'),
  [
    body('name').notEmpty().withMessage('اسم الخدمة مطلوب'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // دعم camelCase و snake_case
      const name = req.body.name;
      const sector_id = req.body.sector_id || req.body.sectorId || null;
      const department_id = req.body.department_id || req.body.departmentId || null;
      const coordinator_id = req.body.coordinator_id || req.body.coordinatorId || null;
      const service_owner = req.body.service_owner || req.body.serviceOwner || null;
      const status = req.body.status || null;
      const phase_id = req.body.phase_id || req.body.phaseId || null;

      const result = await pool.query(
        `INSERT INTO services (name, sector_id, department_id, coordinator_id, service_owner, status, phase_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id, name, sector_id, department_id, coordinator_id, service_owner, status, phase_id`,
        [name, sector_id, department_id, coordinator_id, service_owner, status, phase_id]
      );

      res.status(201).json(result.rows[0]);
    } catch (error) {
      logError({ req, statusCode: 500, error });
      console.error('Create service error:', error);
      res.status(500).json({ error: 'حدث خطأ في الخادم' });
    }
  }
);

router.put(
  '/:id',
  authenticateToken,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { name, sectorId, departmentId, coordinatorId, serviceOwner, status, phaseId } = req.body;

      // المنسق: يقدر يعدل حالة خدماته فقط
      if (req.user.role === 'coordinator') {
        // تحقق أن الخدمة تبع هذا المنسق
        const ownership = await pool.query(
          'SELECT id FROM services WHERE id = $1 AND coordinator_id = $2',
          [id, req.user.id]
        );
        if (ownership.rows.length === 0) {
          return res.status(403).json({ error: 'غير مصرح — هذه الخدمة ليست ضمن خدماتك' });
        }
        // المنسق يعدل الحالة فقط
        if (!status) {
          return res.status(400).json({ error: 'المنسق يستطيع تعديل حالة الخدمة فقط' });
        }
        const result = await pool.query(
          'UPDATE services SET status = $1 WHERE id = $2 RETURNING id, name, status',
          [status, id]
        );
        return res.json(result.rows[0]);
      }

      // المشرف: تعديل كامل
      if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'غير مصرح' });
      }

      const service = await pool.query('SELECT id FROM services WHERE id = $1', [id]);
      if (service.rows.length === 0) {
        return res.status(404).json({ error: 'الخدمة غير موجودة' });
      }

      const updates = [];
      const values = [];
      let paramIndex = 1;

      if (name) {
        updates.push(`name = $${paramIndex++}`);
        values.push(name);
      }

      if (sectorId) {
        updates.push(`sector_id = $${paramIndex++}`);
        values.push(sectorId);
      }

      if (departmentId !== undefined) {
        updates.push(`department_id = $${paramIndex++}`);
        values.push(departmentId || null);
      }

      if (coordinatorId) {
        updates.push(`coordinator_id = $${paramIndex++}`);
        values.push(coordinatorId);
      }

      if (serviceOwner) {
        updates.push(`service_owner = $${paramIndex++}`);
        values.push(serviceOwner);
      }

      if (status && status !== 'null') {
        updates.push(`status = $${paramIndex++}`);
        values.push(status);
      }

      if (phaseId !== undefined && phaseId !== null) {
        updates.push(`phase_id = $${paramIndex++}`);
        values.push(phaseId);
      }

      if (updates.length === 0) {
        return res.status(400).json({ error: 'لا توجد تحديثات' });
      }

      values.push(id);
      const query = `UPDATE services SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING id, name, sector_id, department_id, coordinator_id, service_owner, status, phase_id`;

      const result = await pool.query(query, values);
      res.json(result.rows[0]);
    } catch (error) {
      logError({ req, statusCode: 500, error });
      console.error('Update service error:', error.message, error.detail || '');
      res.status(500).json({ error: 'حدث خطأ في الخادم', detail: error.message });
    }
  }
);

router.delete('/:id', authenticateToken, roleCheck('admin'), async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM services WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'الخدمة غير موجودة' });
    }

    res.json({ message: 'تم حذف الخدمة بنجاح' });
  } catch (error) {
    logError({ req, statusCode: 500, error });
    console.error('Delete service error:', error);
    res.status(500).json({ error: 'حدث خطأ في الخادم' });
  }
});

module.exports = router;
