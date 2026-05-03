-- Migration: إضافة حالة "مفعلة" لنوع service_status_type
-- التاريخ: 2026-05-03
-- التشغيل: docker compose exec -T postgres psql -U ajwaa -d ajwaa_db < db/migrate_add_mufaala_status.sql

ALTER TYPE service_status_type ADD VALUE IF NOT EXISTS 'مفعلة';
