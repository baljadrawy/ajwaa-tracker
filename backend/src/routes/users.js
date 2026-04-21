const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const pool = require('../config/db');
const { logError } = require('../middleware/errorLogger');
const { authenticateToken, roleCheck } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticateToken, roleCheck('admin'), async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, username, full_name, role, is_active, created_at FROM users ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get users error:', error);
    logError({ req, statusCode: 500, error });
    res.status(500).json({ error: 'حدث خطأ في الخادم' });
  }
});

router.get('/:id', authenticateToken, roleCheck('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT id, username, full_name, role, is_active, created_at FROM users WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'المستخدم غير موجود' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get user error:', error);
    logError({ req, statusCode: 500, error });
    res.status(500).json({ error: 'حدث خطأ في الخادم' });
  }
});

router.post(
  '/',
  authenticateToken,
  roleCheck('admin'),
  [
    body('username').notEmpty().withMessage('اسم المستخدم مطلوب'),
    body('fullName').notEmpty().withMessage('الاسم الكامل مطلوب'),
    body('password').isLength({ min: 6 }).withMessage('كلمة المرور يجب أن تكون على الأقل 6 أحرف'),
    body('role').isIn(['admin', 'coordinator', 'manager']).withMessage('الدور غير صحيح')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { username, fullName, password, role } = req.body;

      const existingUser = await pool.query(
        'SELECT id FROM users WHERE username = $1',
        [username]
      );

      if (existingUser.rows.length > 0) {
        return res.status(400).json({ error: 'اسم المستخدم موجود بالفعل' });
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const result = await pool.query(
        'INSERT INTO users (username, full_name, password_hash, role, is_active) VALUES ($1, $2, $3, $4, $5) RETURNING id, username, full_name, role',
        [username, fullName, passwordHash, role, true]
      );

      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Create user error:', error);
      logError({ req, statusCode: 500, error });
      res.status(500).json({ error: 'حدث خطأ في الخادم' });
    }
  }
);

router.put(
  '/:id',
  authenticateToken,
  roleCheck('admin'),
  [
    body('fullName').optional().notEmpty().withMessage('الاسم الكامل لا يمكن أن يكون فارغاً'),
    body('role').optional().isIn(['admin', 'coordinator', 'manager']).withMessage('الدور غير صحيح'),
    body('isActive').optional().isBoolean().withMessage('حالة النشاط غير صحيحة')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const { fullName, role, isActive, password } = req.body;

      const user = await pool.query('SELECT id FROM users WHERE id = $1', [id]);
      if (user.rows.length === 0) {
        return res.status(404).json({ error: 'المستخدم غير موجود' });
      }

      const updates = [];
      const values = [];
      let paramIndex = 1;

      if (fullName) {
        updates.push(`full_name = $${paramIndex++}`);
        values.push(fullName);
      }

      if (role) {
        updates.push(`role = $${paramIndex++}`);
        values.push(role);
      }

      if (isActive !== undefined) {
        updates.push(`is_active = $${paramIndex++}`);
        values.push(isActive);
      }

      if (password) {
        const passwordHash = await bcrypt.hash(password, 10);
        updates.push(`password_hash = $${paramIndex++}`);
        values.push(passwordHash);
      }

      if (updates.length === 0) {
        return res.status(400).json({ error: 'لا توجد تحديثات' });
      }

      values.push(id);
      const query = `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING id, username, full_name, role, is_active`;

      const result = await pool.query(query, values);
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Update user error:', error);
      logError({ req, statusCode: 500, error });
      res.status(500).json({ error: 'حدث خطأ في الخادم' });
    }
  }
);

router.delete('/:id', authenticateToken, roleCheck('admin'), async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'UPDATE users SET is_active = false WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'المستخدم غير موجود' });
    }

    res.json({ message: 'تم حذف المستخدم بنجاح' });
  } catch (error) {
    console.error('Delete user error:', error);
    logError({ req, statusCode: 500, error });
    res.status(500).json({ error: 'حدث خطأ في الخادم' });
  }
});

module.exports = router;
