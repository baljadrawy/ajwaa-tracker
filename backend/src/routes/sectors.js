const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../config/db');
const { authenticateToken, roleCheck } = require('../middleware/auth');
const { logError } = require('../middleware/errorLogger');

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name FROM sectors ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    console.error('Get sectors error:', error);
    logError({ req, statusCode: 500, error });
    res.status(500).json({ error: 'حدث خطأ في الخادم' });
  }
});

// ⚠️ المسارات الثابتة يجب أن تكون قبل /:id
router.get('/departments/list', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, sector_id FROM departments ORDER BY name'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get departments error:', error);
    logError({ req, statusCode: 500, error });
    res.status(500).json({ error: 'حدث خطأ في الخادم' });
  }
});

router.get('/phases/list', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name FROM phases ORDER BY name'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get phases error:', error);
    logError({ req, statusCode: 500, error });
    res.status(500).json({ error: 'حدث خطأ في الخادم' });
  }
});

router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT id, name FROM sectors WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'القطاع غير موجود' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get sector error:', error);
    logError({ req, statusCode: 500, error });
    res.status(500).json({ error: 'حدث خطأ في الخادم' });
  }
});

router.post(
  '/',
  authenticateToken,
  roleCheck('admin'),
  [body('name').notEmpty().withMessage('اسم القطاع مطلوب')],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name } = req.body;
      const result = await pool.query(
        'INSERT INTO sectors (name, created_by) VALUES ($1, $2) RETURNING id, name',
        [name, req.user.id]
      );

      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Create sector error:', error);
      logError({ req, statusCode: 500, error });
      res.status(500).json({ error: 'حدث خطأ في الخادم' });
    }
  }
);

router.post(
  '/departments',
  authenticateToken,
  roleCheck('admin'),
  [
    body('name').notEmpty().withMessage('اسم الإدارة مطلوب'),
    body('sectorId').notEmpty().withMessage('القطاع مطلوب')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, sectorId } = req.body;
      const result = await pool.query(
        'INSERT INTO departments (name, sector_id) VALUES ($1, $2) RETURNING id, name, sector_id',
        [name, sectorId]
      );

      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Create department error:', error);
      logError({ req, statusCode: 500, error });
      res.status(500).json({ error: 'حدث خطأ في الخادم' });
    }
  }
);

router.post(
  '/phases',
  authenticateToken,
  roleCheck('admin'),
  [body('name').notEmpty().withMessage('اسم المرحلة مطلوب')],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name } = req.body;
      const result = await pool.query(
        'INSERT INTO phases (name, created_by) VALUES ($1, $2) RETURNING id, name',
        [name, req.user.id]
      );

      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Create phase error:', error);
      logError({ req, statusCode: 500, error });
      res.status(500).json({ error: 'حدث خطأ في الخادم' });
    }
  }
);

router.put(
  '/:id',
  authenticateToken,
  roleCheck('admin'),
  [body('name').notEmpty().withMessage('اسم القطاع مطلوب')],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const { name } = req.body;

      const result = await pool.query(
        'UPDATE sectors SET name = $1 WHERE id = $2 RETURNING id, name',
        [name, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'القطاع غير موجود' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error('Update sector error:', error);
      logError({ req, statusCode: 500, error });
      res.status(500).json({ error: 'حدث خطأ في الخادم' });
    }
  }
);

router.delete('/:id', authenticateToken, roleCheck('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM sectors WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'القطاع غير موجود' });
    }

    res.json({ message: 'تم حذف القطاع بنجاح' });
  } catch (error) {
    console.error('Delete sector error:', error);
    logError({ req, statusCode: 500, error });
    res.status(500).json({ error: 'حدث خطأ في الخادم' });
  }
});

// ─── تعديل وحذف الإدارات ─────────────────────────────────────────────
router.put('/departments/:id', authenticateToken, roleCheck('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, sectorId } = req.body;
    const updates = [];
    const values = [];
    let i = 1;
    if (name) { updates.push(`name = $${i++}`); values.push(name); }
    if (sectorId) { updates.push(`sector_id = $${i++}`); values.push(sectorId); }
    if (!updates.length) return res.status(400).json({ error: 'لا توجد تحديثات' });
    values.push(id);
    const result = await pool.query(`UPDATE departments SET ${updates.join(', ')} WHERE id = $${i} RETURNING id, name, sector_id`, values);
    if (!result.rows.length) return res.status(404).json({ error: 'الإدارة غير موجودة' });
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update department error:', error);
    logError({ req, statusCode: 500, error });
    res.status(500).json({ error: 'حدث خطأ في الخادم' });
  }
});

router.delete('/departments/:id', authenticateToken, roleCheck('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM departments WHERE id = $1 RETURNING id', [id]);
    if (!result.rows.length) return res.status(404).json({ error: 'الإدارة غير موجودة' });
    res.json({ message: 'تم حذف الإدارة بنجاح' });
  } catch (error) {
    console.error('Delete department error:', error);
    logError({ req, statusCode: 500, error });
    res.status(500).json({ error: 'حدث خطأ في الخادم' });
  }
});

// ─── تعديل وحذف المراحل ──────────────────────────────────────────────
router.put('/phases/:id', authenticateToken, roleCheck('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'الاسم مطلوب' });
    const result = await pool.query('UPDATE phases SET name = $1 WHERE id = $2 RETURNING id, name', [name, id]);
    if (!result.rows.length) return res.status(404).json({ error: 'المرحلة غير موجودة' });
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update phase error:', error);
    logError({ req, statusCode: 500, error });
    res.status(500).json({ error: 'حدث خطأ في الخادم' });
  }
});

router.delete('/phases/:id', authenticateToken, roleCheck('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM phases WHERE id = $1 RETURNING id', [id]);
    if (!result.rows.length) return res.status(404).json({ error: 'المرحلة غير موجودة' });
    res.json({ message: 'تم حذف المرحلة بنجاح' });
  } catch (error) {
    console.error('Delete phase error:', error);
    logError({ req, statusCode: 500, error });
    res.status(500).json({ error: 'حدث خطأ في الخادم' });
  }
});

module.exports = router;
