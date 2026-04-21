const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const servicesRoutes = require('./routes/services');
const sectorsRoutes = require('./routes/sectors');
const ticketsRoutes = require('./routes/tickets');
const attachmentsRoutes = require('./routes/attachments');
const exportRoutes = require('./routes/export');
const logsRoutes = require('./routes/logs');
const { errorHandlerMiddleware, requestLogger } = require('./middleware/errorLogger');

const app = express();

// CORS: اقبل الطلبات من الـ frontend سواء كان على localhost أو IP محلي
app.use(cors({
  origin: function(origin, callback) {
    // اسمح بطلبات بدون origin (مثل curl أو same-origin عبر nginx)
    if (!origin) return callback(null, true);
    // اسمح بأي IP محلي أو localhost
    const allowed = [
      /^http:\/\/localhost/,
      /^http:\/\/127\./,
      /^http:\/\/192\.168\./,
      /^http:\/\/10\./,
      /^http:\/\/172\.(1[6-9]|2\d|3[01])\./,
    ];
    if (process.env.FRONTEND_URL) {
      allowed.push(new RegExp('^' + process.env.FRONTEND_URL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    }
    const ok = allowed.some(r => r.test(origin));
    callback(ok ? null : new Error('CORS not allowed'), ok);
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// تسجيل كل الطلبات الواردة
app.use(requestLogger);

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/sectors', sectorsRoutes);
app.use('/api/tickets', ticketsRoutes);
app.use('/api/attachments', attachmentsRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/logs', logsRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Ajwaa Tracker Backend is running' });
});

app.use(errorHandlerMiddleware);

app.use((req, res) => {
  res.status(404).json({ error: 'المسار غير موجود' });
});

module.exports = app;
