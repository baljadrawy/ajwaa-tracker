-- Migration: إضافة جدول سجل الأخطاء
-- شغّله مرة واحدة على الرازبري:
-- docker compose exec -T postgres psql -U ajwaa -d ajwaa_db < db/migrate_add_error_log.sql

CREATE TABLE IF NOT EXISTS error_log (
    id SERIAL PRIMARY KEY,
    method VARCHAR(10),
    path TEXT,
    status_code INTEGER,
    error_message TEXT,
    error_stack TEXT,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    ip VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_error_log_created_at ON error_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_error_log_status_code ON error_log(status_code);

GRANT SELECT, INSERT ON error_log TO ajwaa;
GRANT USAGE ON SEQUENCE error_log_id_seq TO ajwaa;
