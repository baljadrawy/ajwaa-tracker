const app = require('./app');
require('dotenv').config();

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
  console.log(`Ajwaa Tracker Backend listening on port ${PORT}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
