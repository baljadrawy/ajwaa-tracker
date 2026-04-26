# Ajwaa Operations Tracker (متابعة ملاحظات منصة أجواء)

## المشروع
نظام متابعة ملاحظات منصة أجواء (GACA). يستبدل ملف إكسل يدوي بتطبيق ويب متعدد المستخدمين.

**الفريق:** مشرف واحد + 4 منسقين + مدير (قراءة فقط)

## البنية التقنية

```
ajwaa-tracker/
├── docker-compose.yml          # تشغيل الحاويات الثلاث
├── INSTALL_GUIDE.docx          # دليل التثبيت خطوة بخطوة
├── branding/                   # الهوية البصرية واللوقو — المرجع الأساسي للتصميم
├── frontend/                   # React 18 (Vite 5) — RTL عربي
│   ├── Dockerfile              # Multi-stage: Node build → Nginx serve
│   ├── nginx.conf              # SPA routing + API proxy
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   ├── public/
│   │   ├── logo.png            # شعار GACA كامل
│   │   ├── icon.png            # أيقونة GACA
│   │   └── fonts/              # خطوط GACA الرسمية (Co Headline + Co Text)
│   └── src/
│       ├── main.jsx
│       ├── App.jsx             # Routes + ProtectedRoute
│       ├── index.css           # CSS Variables + RTL + خطوط GACA
│       ├── context/
│       │   └── AuthContext.jsx  # JWT auth (localStorage — يبقى بعد إعادة التحميل)
│       ├── services/
│       │   └── api.js          # Axios instance + interceptors
│       ├── components/
│       │   ├── Layout.jsx      # Navbar + Sidebar + RTL
│       │   └── ProtectedRoute.jsx
│       └── pages/
│           ├── LoginPage.jsx
│           ├── DashboardPage.jsx
│           ├── TicketsPage.jsx
│           ├── NewTicketPage.jsx
│           ├── TicketDetailPage.jsx
│           ├── ServicesPage.jsx
│           └── SettingsPage.jsx
├── backend/                    # Node.js 20 + Express 4 + REST API
│   ├── Dockerfile              # Node 20 Alpine
│   ├── package.json
│   └── src/
│       ├── server.js           # Entry point (port 4000)
│       ├── app.js              # Express setup + CORS + routes
│       ├── config/
│       │   └── db.js           # PostgreSQL pool (pg module)
│       ├── middleware/
│       │   └── auth.js         # JWT verify + roleCheck
│       └── routes/
│           ├── auth.js         # POST /login, GET /me
│           ├── users.js        # CRUD مستخدمين (admin only)
│           ├── tickets.js      # CRUD تذاكر + تعليقات + audit + stats
│           ├── services.js     # CRUD خدمات + فلترة
│           ├── sectors.js      # قطاعات + إدارات + مراحل
│           ├── attachments.js  # رفع/تحميل مرفقات (multer, 10MB max)
│           └── export.js       # تصدير CSV بترميز UTF-8
├── db/
│   └── init.sql                # جداول + أنواع + triggers + مشرف افتراضي
├── data/                       # PostgreSQL volume (لا تحذفه!)
├── uploads/                    # مرفقات التذاكر
├── CLAUDE.md
└── DEV_LOG.md
```

**Stack:** React + Node.js/Express + PostgreSQL + Docker Compose
**لغة الواجهة:** عربي RTL بالكامل

## الهوية البصرية

- ملفات الهوية واللوقو في مجلد `branding/`
- **قبل أي عمل على الواجهة:** اقرأ محتويات `branding/` واستخرج الألوان والخطوط والستايل
- اللوقو يظهر في: شريط التنقل العلوي، صفحة تسجيل الدخول، تذييل الصفحة
- الألوان الأساسية والثانوية تُستخرج من ملفات الهوية وتُطبق على كامل الواجهة
- لا تستخدم ألوان افتراضية — دائماً ارجع لـ `branding/`

### الألوان المستخرجة (CSS Variables) — GACA Brand Guidelines Jan 2025
| المتغير | القيمة | الاستخدام |
|---------|--------|-----------|
| `--primary` | `#140046` | Brand Dark Blue — navbar, sidebar, نصوص رئيسية |
| `--primary-mid` | `#313B71` | Brand Blue — عناصر ثانوية |
| `--accent-start` | `#23EBA5` | Brand Bright Green — بداية التدرج، active state |
| `--accent-end` | `#2332E6` | Brand Bright Blue — نهاية التدرج، أزرار |
| `--bg` | `#f4f6fb` | خلفية الصفحات |
| `--card-bg` | `#ffffff` | خلفية البطاقات |

### الخطوط — GACA الرسمية
- **Co Headline** (Bold/Regular/Light) — العناوين والـ card titles
- **Co Text** (Bold/Regular/Light) — النصوص العامة والواجهة
- الخطوط محلية في `frontend/public/fonts/` — لا Google Fonts

## قرارات تقنية

- **PostgreSQL بدل SQLite** — عدة مستخدمين متزامنين، نمو بيانات مستقبلي
- **Docker Compose** — 3 حاويات (frontend + backend + postgres)، تشغيل بأمر واحد
- **JWT للمصادقة** — بسيط وخفيف، بدون OAuth
- **جميع حقول التذكرة إلزامية** — لا يمكن الحفظ بدون تعبئة الكل

## الأدوار والصلاحيات

| الدور | الصلاحيات |
|-------|-----------|
| مشرف | كل شي: خدمات، قطاعات، مراحل، مستخدمين، تذاكر، تصدير |
| منسق | يرى خدماته فقط + تذاكر خدماته فقط + **تعديل حالة الخدمة فقط** + تعليقات + مرفقات |
| مدير | قراءة فقط: داشبورد، تقارير، تصدير إكسل + فلترة الخدمات والتذاكر |

### المنسقون (أسماء اليوزر الرسمية)
| الاسم | اليوزرنيم |
|-------|-----------|
| ماجد حجازي | `mhejazi` |
| أنس سبهاني | `amsabhani` |
| عبدالله المالكي | `aaamalki` |
| محمد خلف الغامدي | `alghamdimk` |

## هيكل التذكرة (جميع الحقول إلزامية)

| الحقل | النوع | القيم |
|-------|-------|-------|
| رقم التذكرة | تلقائي | T-0001 |
| الخدمة | قائمة | من جدول الخدمات |
| حالة البيئة | قائمة | Operation Support / BA |
| وصف الملاحظة | نص حر | — |
| التصنيف | قائمة | تشغيلي / تحليلي / نقل البيانات |
| الأثر | قائمة | عائق تشغيل / غير عائق / تحسيني |
| الأولوية | قائمة | حرجة / عالية / متوسطة / منخفضة |
| الحالة | قائمة | جديدة → تحت الإجراء → مغلقة |
| المسؤولية | قائمة | الهيئة / شركة علم |
| التواريخ | تلقائي | الرصد / المتوقع للحل / الإغلاق |
| المرفقات | ملفات | صور ومستندات |

## هيكل الخدمة

| الحقل | الوصف |
|-------|-------|
| اسم الخدمة | الاسم الرسمي |
| القطاع | يضيفه المشرف |
| الإدارة العامة | داخل القطاع |
| المنسق | من الفريق |
| مالك الخدمة | من الهيئة |
| حالة الخدمة | قيد التطوير / UAT / مطلقة |
| المرحلة | دفعة الإطلاق (1، 2، ...) |

## ميزات إضافية

- **سجل التعليقات** — كل تحديث بالتاريخ واسم الشخص
- **سجل تغيير الحالة (Audit Log)** — الحالة القديمة → الجديدة + مين + متى
- **مرفقات** — صور شاشة ومستندات
- **تصدير Excel حقيقي (XLSX)** — بيانات مفلترة بتنسيق GACA (ألوان + RTL + فلتر تلقائي + تجميد الرأس)، للمشرف والمدير فقط
- **فلترة الخدمات** (مشرف + مدير): قطاع، إدارة، منسق، حالة — مع تفلتر تلقائي للإدارات بناءً على القطاع
- **فلترة التذاكر** (جميع الأدوار): حالة، أولوية، تصنيف، أثر، مسؤولية، خدمة
- **سجل الأخطاء** (مشرف فقط): يسجّل كل خطأ 500 تلقائياً في DB مع method/path/message/user/IP، صفحة `/logs` للعرض والمسح
- **سجل الطلبات (Access Log)** — يسجّل كل طلب وارد في جدول `access_log` مع المدة والمستخدم والـ IP، مع تصدير CSV وفلترة متقدمة
- **حذف التذاكر** — المشرف يحذف أي تذكرة، المنسق يحذف تذاكره بحالة "جديدة" فقط (مع حذف المرفقات والتعليقات والـ audit log)
- **حذف التعليقات** — صاحب التعليق أو المشرف
- **حذف المرفقات** — صاحب المرفق أو المشرف (يحذف الملف من القرص وقاعدة البيانات)
- **استعادة المستخدمين** — المشرف يستعيد أي مستخدم محذوف (soft delete) من صفحة الإعدادات
- **تحسين صفحة التذاكر** — عمود المنشئ (admin/manager)، عمود التاريخ، إجمالي التذاكر، زر مسح الفلاتر
- **تحسين لوحة التحكم** — أشرطة بيانات مرئية، دائرة توزيع المسؤولية، جدول آخر 8 تذاكر قابل للنقر
- **الأرقام اللاتينية** — جميع التواريخ تستخدم `ar-SA-u-nu-latn` لعرض أرقام لاتينية مع نص عربي

## أوامر التشغيل

```bash
# تشغيل
docker compose up -d

# إعادة بناء بدون كاش (بعد تغيير dependencies)
docker compose build --no-cache

# إعادة بناء Frontend فقط (بعد تغيير React)
docker compose build --no-cache frontend && docker compose up -d

# إعادة تشغيل Backend فقط (بعد تغيير JS بدون dependencies)
docker compose restart backend

# عرض اللوقات
docker compose logs -f

# إيقاف
docker compose down

# نسخ احتياطي للقاعدة
docker compose exec postgres pg_dump -U ajwaa ajwaa_db > backup_$(date +%Y%m%d).sql

# استيراد بيانات الخدمات
docker compose exec -T postgres psql -U ajwaa -d ajwaa_db < seed_data.sql

# تشغيل migration على قاعدة موجودة
docker compose exec -T postgres psql -U ajwaa -d ajwaa_db < db/migrate_add_error_log.sql
```

## GitHub

**المستودع:** https://github.com/baljadrawy/ajwaa-tracker

```bash
# سحب آخر تحديث وإعادة البناء الكاملة
cd ~/ajwaa-tracker && git pull origin main && docker compose build --no-cache && docker compose up -d

# سحب وإعادة تشغيل Backend فقط (بدون تغيير dependencies)
cd ~/ajwaa-tracker && git pull origin main && docker compose restart backend

# سحب وإعادة بناء Frontend فقط
cd ~/ajwaa-tracker && git pull origin main && docker compose build --no-cache frontend && docker compose up -d

# أول مرة — ربط المجلد بالمستودع
git init -b main
git remote add origin https://github.com/baljadrawy/ajwaa-tracker.git
git fetch origin
git reset --hard origin/main
```

## سكريبتات التثبيت

| الملف | البيئة | الوصف |
|-------|--------|-------|
| `install-rpi.sh` | Raspberry Pi / Ubuntu ARM64 | تثبيت كامل مع فحص المنافذ والمتطلبات |
| `install-rhel.sh` | RHEL 8/9 / Rocky / AlmaLinux | تثبيت Production على Red Hat Enterprise Linux |

```bash
# تشغيل سكريبت التثبيت
chmod +x install-rhel.sh && sudo ./install-rhel.sh
```

## API Endpoints

| المسار | الوصف |
|--------|-------|
| `POST /api/auth/login` | تسجيل الدخول → JWT token |
| `GET /api/auth/me` | بيانات المستخدم الحالي |
| `GET/POST /api/users` | قائمة + إنشاء مستخدم (admin) |
| `PUT/DELETE /api/users/:id` | تعديل/حذف مستخدم (admin) — الحذف soft delete |
| `GET/POST /api/tickets` | قائمة + إنشاء تذكرة |
| `GET/PUT /api/tickets/:id` | تفاصيل + تعديل تذكرة |
| `GET /api/tickets/stats/dashboard` | إحصائيات الداشبورد ⚠️ قبل /:id |
| `POST /api/tickets/:id/comments` | إضافة تعليق |
| `POST /api/tickets/:id/attachments` | رفع مرفق للتذكرة |
| `GET/POST/PUT/DELETE /api/services` | إدارة الخدمات |
| `GET/POST/PUT/DELETE /api/sectors` | إدارة القطاعات |
| `GET /api/sectors/departments/list` | قائمة كل الإدارات ⚠️ قبل /:id |
| `POST /api/sectors/departments` | إنشاء إدارة |
| `PUT /api/sectors/departments/:id` | تعديل إدارة |
| `DELETE /api/sectors/departments/:id` | حذف إدارة |
| `GET /api/sectors/phases/list` | قائمة كل المراحل ⚠️ قبل /:id |
| `POST /api/sectors/phases` | إنشاء مرحلة |
| `PUT /api/sectors/phases/:id` | تعديل مرحلة |
| `DELETE /api/sectors/phases/:id` | حذف مرحلة |
| `POST /api/attachments/upload/:ticketId` | رفع مرفق (10MB max) |
| `GET /api/attachments/download/:id` | تحميل مرفق |
| `GET /api/export/excel` | تصدير XLSX حقيقي (admin + manager فقط) |
| `DELETE /api/tickets/:id` | حذف تذكرة (admin أي تذكرة، coordinator تذاكره بحالة "جديدة") |
| `DELETE /api/tickets/:id/comments/:commentId` | حذف تعليق (صاحبه أو admin) |
| `DELETE /api/attachments/:id` | حذف مرفق + ملفه من القرص (صاحبه أو admin) |
| `PUT /api/users/:id/restore` | استعادة مستخدم محذوف (admin فقط) |
| `GET /api/logs/errors` | سجل الأخطاء مع فلترة (admin فقط) |
| `GET /api/logs/access` | سجل الطلبات مع فلترة (admin فقط) |
| `GET /api/logs/stats` | إحصائيات اليوم: طلبات، أخطاء، بطيئة، مستخدمين نشطين |
| `GET /api/logs/export` | تصدير CSV للسجلات (admin فقط) |
| `GET /api/logs` | قائمة الأخطاء — للتوافق مع الكود القديم |
| `DELETE /api/logs` | مسح سجل الأخطاء أو الطلبات (admin فقط) |

## قاعدة البيانات

**الاتصال:** `postgres://ajwaa:ajwaa_pass@postgres:5432/ajwaa_db`

**الجداول:** users, sectors, departments, phases, services, tickets, comments, audit_log, attachments, error_log, access_log

**المشرف الافتراضي:** `admin` / `admin123`

## تصحيحات مهمة — أسماء الأعمدة الصحيحة

> ⚠️ الكود الأصلي كان يستخدم أسماء خاطئة — استخدم هذا الجدول مرجعاً دائماً

| الجدول | الخاطئ (لا تستخدم) | الصحيح |
|--------|---------------------|--------|
| `tickets` | `detection_date` | `observed_date` |
| `tickets` | `closure_date` | `closed_date` |
| `tickets` | `created_at` | غير موجود — استخدم `updated_at` |
| `audit_log` | `audit_logs` | `audit_log` (اسم الجدول) |
| `audit_log` | `changed_by` | `user_id` |
| `comments` | `comment_text` | `content` |
| `comments` | `created_by` | `user_id` |
| `attachments` | `uploaded_by` | `user_id` |
| `attachments` | `uploaded_at` | `created_at` |
| `services` | `department` | `department_id` (FK) |
| `services` | `phase` | `phase_id` (FK) |

### تنبيهات تقنية
- مسار `/stats/dashboard` في tickets.js يجب أن يكون **قبل** `/:id`
- مسارات `/departments/list` و `/phases/list` تستعلم من جداولها المباشرة
- هاش كلمة المرور في `init.sql` الآن صحيح (bcrypt حقيقي)
- `PUT /services/:id` — لا يستخدم `roleCheck('admin')` middleware، المنطق داخل المعالج: منسق → حالة فقط + تحقق ملكية، مشرف → تعديل كامل
- `GET /api/users` محمي بـ admin فقط — لا تستدعيه من صفحات يدخلها المنسق
- `user.fullName` هو الحقل الصحيح في الـ JWT payload (وليس `name` أو `full_name`)
- `fetchDropdownData` في ServicesPage تُستدعى فقط إذا `user.role === 'admin' || user.role === 'manager'`
- قيم الأولوية في DB والـ Frontend: **عربية دائماً** — `حرجة / عالية / متوسطة / منخفضة` (لا `critical/high/medium/low`)
- قيم الحالة في DB والـ Frontend: **عربية دائماً** — `جديدة / تحت الإجراء / مغلقة` (لا `new/in-progress/closed`)
- حقل البيئة في tickets يُرسل باسم `environment` (لا `environmentStatus`)
- `GET /api/tickets/:id` يرجع `{ ticket, comments, auditLog, attachments }` — وليس كائناً مسطحاً
- جميع endpoints التعديل في Backend تستخدم `PUT` وليس `PATCH`
- `ticket_number` و `service_name` هما أسماء الأعمدة الصحيحة في response التذاكر (camelCase غير مدعوم)
- التواريخ تستخدم `ar-SA-u-nu-latn` لعرض أرقام لاتينية (0-9) بدلاً من الهندية-العربية (٠-٩)
- `healthcheck` في `docker-compose.prod.yml` يستخدم `wget` وليس `curl` (node:20-alpine لا يحتوي curl)
- `attachmentAPI.delete(id)` في api.js — يحذف المرفق من الـ backend والقرص
- `userAPI.restore(id)` في api.js — يستعيد مستخدم محذوف
- المستخدمون المحذوفون (is_active=false) يظهرون في SettingsPage بشفافية مع زر "استعادة"

## البيانات الأولية (seed_data.sql)

| النوع | العدد | التفاصيل |
|-------|-------|----------|
| منسقون | 4 | mhejazi, amsabhani, alghamdimk, aaamalki |
| قطاعات | 4 | سلامة الطيران، السياسات الاقتصادية، أمن الطيران، النقل الجوي |
| إدارات | 12 | موزعة على القطاعات الأربعة |
| خدمات | 62 | كاملة من ملف الإكسل الأصلي |

**كلمة المرور الافتراضية لجميع الحسابات:** `admin123`

## قواعد مهمة

- دائماً `docker compose build --no-cache` عند تغيير الـ dependencies
- لا تحذف volume الـ postgres بدون نسخ احتياطي (`data/`)
- الواجهة RTL — أي مكون جديد لازم يدعم RTL
- كل migration جديد يتسجل في DEV_LOG.md وينشأ له ملف `db/migrate_*.sql`
- البيانات الأصلية موجودة في `Ajwaa Operation Comments v1.xlsx` (218 ملاحظة + 120 مغلقة + 94 خدمة)
- CSS Modules لكل مكون — ملف `.module.css` مصاحب
- JWT يُخزَّن في `localStorage` — يبقى بعد إعادة التحميل، ينتهي بعد 24 ساعة أو عند تلقي 401
- الـ Backend يستخدم prepared statements لمنع SQL injection
- الـ frontend healthcheck يستخدم `curl` (nginx:alpine لا يحتوي wget)
- منفذ postgres على الرازبري: `5433:5432` (تفادياً لتعارض مع postgres محلي)
- ملفات الـ production في `.env.production` — لا ترفعها لـ GitHub (في .gitignore)
- `exceljs` مضافة لـ Backend dependencies — لازم `build --no-cache` بعد أول pull
