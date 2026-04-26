-- Migration: جعل service_id اختيارياً في جدول tickets (التذاكر العامة)
-- تاريخ: 2026-04-26
-- الاستخدام: docker compose exec -T postgres psql -U ajwaa -d ajwaa_db < db/migrate_general_tickets.sql

-- 1. إزالة قيد NOT NULL من service_id
ALTER TABLE tickets ALTER COLUMN service_id DROP NOT NULL;

-- 2. إزالة الـ FK الحالي المقيّد بـ ON DELETE CASCADE وإعادته بـ ON DELETE SET NULL
ALTER TABLE tickets DROP CONSTRAINT IF EXISTS tickets_service_id_fkey;
ALTER TABLE tickets
  ADD CONSTRAINT tickets_service_id_fkey
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL;

-- تحقق
SELECT column_name, is_nullable
FROM information_schema.columns
WHERE table_name = 'tickets' AND column_name = 'service_id';
