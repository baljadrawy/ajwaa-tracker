-- Migration: إضافة جدول access_log لتسجيل كل الطلبات
-- تشغيل: docker compose exec -T postgres psql -U ajwaa -d ajwaa_db < db/migrate_add_access_log.sql

-- جدول تسجيل الطلبات (access log)
CREATE TABLE IF NOT EXISTS access_log (
    id SERIAL PRIMARY KEY,
    method VARCHAR(10),
    path VARCHAR(500),
    status_code INTEGER,
    duration_ms INTEGER,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    ip VARCHAR(50),
    user_agent VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_access_log_created_at ON access_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_access_log_user_id ON access_log(user_id);
CREATE INDEX IF NOT EXISTS idx_access_log_status_code ON access_log(status_code);

-- تحسين error_log: إضافة عمود error_stack إذا ما كان موجوداً
ALTER TABLE error_log ADD COLUMN IF NOT EXISTS error_stack TEXT;

-- حذف السجلات القديمة تلقائياً (أكثر من 30 يوم)
-- يمكن تشغيله يدوياً أو بـ cron
-- DELETE FROM access_log WHERE created_at < NOW() - INTERVAL '30 days';
-- DELETE FROM error_log WHERE created_at < NOW() - INTERVAL '90 days';
