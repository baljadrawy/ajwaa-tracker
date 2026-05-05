-- Migration: إضافة حقل الدعم المطلوب للتذاكر
-- التاريخ: 2026-05-05

ALTER TABLE tickets
  ADD COLUMN IF NOT EXISTS support_required TEXT;

COMMENT ON COLUMN tickets.support_required IS 'الدعم المطلوب — ما يحتاجه المنسق لإغلاق هذه التذكرة';
