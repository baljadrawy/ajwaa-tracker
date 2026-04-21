const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { logError } = require('../middleware/errorLogger');
const pool = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain'
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('نوع الملف غير مدعوم'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }
});

router.post(
  '/upload/:ticketId',
  authenticateToken,
  upload.single('file'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'لم يتم تحديد ملف' });
      }

      const { ticketId } = req.params;

      const ticketCheck = await pool.query('SELECT id FROM tickets WHERE id = $1', [ticketId]);
      if (ticketCheck.rows.length === 0) {
        fs.unlinkSync(req.file.path);
        return res.status(404).json({ error: 'التذكرة غير موجودة' });
      }

      // إصلاح encoding أسماء الملفات العربية
      // المتصفح يرسل الاسم أحياناً بـ latin1 وأحياناً بـ utf8 حسب الـ browser
      let originalName = req.file.originalname;
      try {
        // حاول تحويل latin1 → utf8
        const converted = Buffer.from(originalName, 'latin1').toString('utf8');
        // إذا النتيجة تحتوي أحرف عربية (> 0x0600) فالتحويل نجح
        if (/[\u0600-\u06FF]/.test(converted)) {
          originalName = converted;
        }
        // وإلا ابقِ الاسم الأصلي (كان utf8 من البداية)
      } catch (e) {
        // ابقِ الاسم الأصلي
      }

      // الأعمدة الصحيحة: user_id, file_name, file_path, file_size, mime_type
      const result = await pool.query(
        `INSERT INTO attachments (ticket_id, file_name, file_path, file_size, mime_type, user_id)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id, file_name, file_path, user_id as uploaded_by, created_at as uploaded_at`,
        [ticketId, originalName, req.file.filename, req.file.size, req.file.mimetype, req.user.id]
      );

      res.status(201).json(result.rows[0]);
    } catch (error) {
      if (req.file) {
        try { fs.unlinkSync(req.file.path); } catch (e) {}
      }
      console.error('Upload attachment error:', error);
      logError({ req, statusCode: 500, error });
      res.status(500).json({ error: 'حدث خطأ في الخادم' });
    }
  }
);

router.get('/download/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT file_name, file_path FROM attachments WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'الملف غير موجود' });
    }

    const { file_name, file_path } = result.rows[0];
    const fullPath = path.join(uploadsDir, file_path);

    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ error: 'الملف غير موجود على الخادم' });
    }

    // دعم أسماء الملفات العربية في Content-Disposition
    const encodedName = encodeURIComponent(file_name);
    res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodedName}`);
    res.sendFile(fullPath);
  } catch (error) {
    console.error('Download attachment error:', error);
    logError({ req, statusCode: 500, error });
    res.status(500).json({ error: 'حدث خطأ في الخادم' });
  }
});

// DELETE /api/attachments/:id — صاحب المرفق أو المشرف
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT file_path, user_id FROM attachments WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'الملف غير موجود' });
    }

    const attachment = result.rows[0];

    if (req.user.role !== 'admin' && attachment.user_id !== req.user.id) {
      return res.status(403).json({ error: 'غير مصرح لك بحذف هذا الملف' });
    }

    const fullPath = path.join(uploadsDir, attachment.file_path);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }

    await pool.query('DELETE FROM attachments WHERE id = $1', [id]);
    res.json({ message: 'تم حذف الملف بنجاح' });
  } catch (error) {
    console.error('Delete attachment error:', error);
    logError({ req, statusCode: 500, error });
    res.status(500).json({ error: 'حدث خطأ في الخادم' });
  }
});

module.exports = router;
