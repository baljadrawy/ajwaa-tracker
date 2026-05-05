-- Migration: إضافة قيمة "عائق غير تشغيلي" لنوع البيانات impact_type
-- التاريخ: 2026-05-05

ALTER TYPE impact_type ADD VALUE IF NOT EXISTS 'عائق غير تشغيلي';
