const pool = require('../config/db');

/**
 * يُسجَّل كل خطأ في جدول error_log
 */
async function logError({ req, statusCode, error }) {
  try {
    const method = req?.method || null;
    const path = req?.originalUrl || req?.url || null;
    const userId = req?.user?.id || null;
    const ip = req?.ip || req?.connection?.remoteAddress || null;
    const message = error?.message || String(error);
    const stack = error?.stack || null;

    await pool.query(
      `INSERT INTO error_log (method, path, status_code, error_message, error_stack, user_id, ip)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [method, path, statusCode, message, stack, userId, ip]
    );
  } catch (logErr) {
    console.error('Error logger failed:', logErr.message);
  }
}

/**
 * Middleware يسجّل كل طلب وارد في access_log مع وقت الاستجابة
 */
function requestLogger(req, res, next) {
  const start = Date.now();

  // بعد انتهاء الاستجابة
  res.on('finish', async () => {
    try {
      // تجاهل طلبات الـ health check والـ static files
      const path = req.originalUrl || req.url;
      if (path === '/health' || path.startsWith('/api/logs')) return;

      const duration = Date.now() - start;
      const userId = req.user?.id || null;
      const ip = req.ip || req.connection?.remoteAddress || null;
      const userAgent = req.headers['user-agent']?.substring(0, 200) || null;

      await pool.query(
        `INSERT INTO access_log (method, path, status_code, duration_ms, user_id, ip, user_agent)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [req.method, path, res.statusCode, duration, userId, ip, userAgent]
      );
    } catch (e) {
      // لا تكسر التطبيق
    }
  });

  next();
}

/**
 * Express error-handling middleware — يُضاف آخر شيء في app.js
 */
function errorHandlerMiddleware(err, req, res, next) {
  const statusCode = err.status || err.statusCode || 500;

  logError({ req, statusCode, error: err });

  console.error(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} → ${statusCode}:`, err.message);

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'حجم الملف كبير جداً (الحد الأقصى 10MB)' });
  }

  if (err.message && err.message.includes('نوع الملف')) {
    return res.status(400).json({ error: err.message });
  }

  res.status(statusCode).json({ error: 'حدث خطأ في الخادم', detail: err.message });
}

module.exports = { logError, requestLogger, errorHandlerMiddleware };
