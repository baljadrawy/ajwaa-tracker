# سجل التطوير — متتبع ملاحظات أجواء

> مرجع سريع لكل قرار وتحديث. الأحدث في الأعلى.

---

## 2026-05-03 — إصلاح الملاحظات العامة + إضافة حالة "مفعلة" + فلتر المنسق + إصلاح التاريخ

### 1. إصلاح الملاحظات العامة (بدون خدمة)

**المشكلة 1 — عرض "-" في خانة الخدمة:**
- **الحل:** استبدال `ticket.service_name || '-'` بشارة `<span className={styles.generalBadge}>عامة</span>`
- أُضيف ستايل `.generalBadge` في `TicketsPage.module.css`

**المشكلة 2 — التذاكر العامة لا تظهر في سجل المنسق:**
- **السبب الجذري:** فلتر المنسق كان `s.coordinator_id = req.user.id` — لكن لما `service_id IS NULL` الـ LEFT JOIN يرجع NULL فلا يطابق أحد
- **الحل في `GET /api/tickets`:**
  ```sql
  AND (s.coordinator_id = $1 OR (t.service_id IS NULL AND t.created_by = $1))
  ```
- **نفس الإصلاح في `GET /stats/dashboard`** — whereClause للمنسق يشمل الآن تذاكره العامة

### الملفات المعدّلة
- `backend/src/routes/tickets.js` — إصلاح فلتري coordinator في list + dashboard
- `frontend/src/pages/TicketsPage.jsx` — شارة "عامة" بدل "-"
- `frontend/src/pages/TicketsPage.module.css` — `.generalBadge` style

---

## 2026-05-03 — إضافة حالة "مفعلة" + فلتر المنسق في التذاكر + إصلاح تنسيق التاريخ

### 1. إضافة حالة خدمة رابعة "مفعلة"

- **قاعدة البيانات:** أُضيفت `'مفعلة'` إلى ENUM `service_status_type`
- **Migration للتثبيتات الحالية:** `db/migrate_add_mufaala_status.sql`
  - `ALTER TYPE service_status_type ADD VALUE IF NOT EXISTS 'مفعلة'`
- **init.sql:** تحديث تعريف الـ ENUM للتثبيتات الجديدة
- **Frontend — ServicesPage.jsx:** إضافة الخيار في 5 أماكن:
  - `STATUS_LABELS` object
  - فورم إنشاء خدمة جديدة
  - شريط الفلاتر (filterStatus)
  - مودال تعديل الحالة (المنسق)
  - مودال التعديل الكامل (المشرف)
  - رتّبت جميع القوائم بترتيب منطقي: قيد التطوير → UAT → مطلقة → مفعلة

**تشغيل Migration على قاعدة موجودة:**
```bash
docker compose exec -T postgres psql -U ajwaa -d ajwaa_db < db/migrate_add_mufaala_status.sql
```

---

## 2026-05-03 — فلتر المنسق في التذاكر + إصلاح تنسيق التاريخ

### 1. فلتر المنسق في صفحة التذاكر

- **Backend — `GET /api/tickets`:** أُضيف query param `coordinator` للفلترة بـ `s.coordinator_id`
  - يُطبَّق فقط إذا `req.user.role !== 'coordinator'` (المنسق مقيّد بخدماته تلقائياً)
- **Frontend — TicketsPage.jsx:**
  - أُضيف `filterCoordinator` state
  - المنسقون يُستخرجون من قائمة الخدمات المجلوبة (`coordinator_id` + `coordinator_name`) بدون API إضافي
  - الـ dropdown يظهر للمشرف والمدير فقط (`isAdmin || isManager`)
  - يُدرج في `useEffect` deps، `resetFilters`، `hasActiveFilters`، وزر التصدير

### 2. إصلاح تنسيق التاريخ في عمود التذاكر

- **المشكلة:** `ar-SA-u-nu-latn` كان يعرض التاريخ بترتيب `YYYY/MM/DD` على بعض المتصفحات مما يبدو مقلوباً
- **الحل:** استبدال `toLocaleDateString` بتنسيق يدوي صريح يضمن دائماً `DD/MM/YYYY` بأرقام لاتينية

### الملفات المعدّلة
- `backend/src/routes/tickets.js` — إضافة coordinator filter
- `frontend/src/pages/TicketsPage.jsx` — فلتر المنسق + إصلاح تنسيق التاريخ

---

## 2026-04-26 — تحسينات الواجهة + حذف التذاكر والتعليقات والمرفقات + استعادة المستخدمين

### 1. تحسين صفحة التذاكر (TicketsPage)
- **عمود المنشئ:** أُضيف عمود "المنشئ" للمشرف والمدير فقط — يعرض `ticket.created_by_name`
- **عمود التاريخ:** أُضيف عمود "التاريخ" يعرض `ticket.updated_at` (آخر تحديث)
- **إجمالي التذاكر:** شارة `.totalBadge` تعرض عدد النتائج الإجمالي
- **زر مسح الفلاتر:** `.resetBtn` يظهر فقط عند تفعيل أي فلتر مع ملاحظة نصية للنتائج
- **حد الصفحة:** ثُبّت `itemsPerPage = 15` (كان قابلاً للتغيير)
- **تنسيق التاريخ:** `ar-SA-u-nu-latn` — أرقام لاتينية مع نص عربي (راجع البند 3)

### 2. تحسين لوحة التحكم (DashboardPage)
- **أشرطة البيانات:** `BarRow` component — أشرطة نسبية لتوزيع الحالات والأولويات
- **نسبة الإغلاق:** شريط gradient يعرض نسبة التذاكر المغلقة
- **دائرة المسؤولية:** `conic-gradient` CSS — توزيع بين "الهيئة" و"شركة علم" (بدون مكتبة خارجية)
- **آخر التذاكر:** جدول يعرض آخر 8 تذاكر — ينتقل للتفاصيل عند النقر (`<tr onClick>`)
- **جلب متوازٍ:** `dashboardAPI.stats()` و `ticketAPI.list({ limit: 8 })` في `Promise.all`
- **إصلاح:** `<Link>` داخل `<tbody>` كان HTML غير صالح — استُبدل بـ `<tr onClick={() => navigate(...)}`

### 3. إصلاح الأرقام العربية/الهندية في التواريخ
- **المشكلة:** `ar-SA` locale يستخدم الأرقام الهندية الشرقية (٢١‏/٤‏/٢٠٢٦)
- **الحل:** استبدال `'ar-SA'` بـ `'ar-SA-u-nu-latn'` في جميع استدعاءات `toLocaleDateString`
- **الملفات المعدّلة (4 ملفات، replace_all):**
  - `frontend/src/pages/TicketsPage.jsx`
  - `frontend/src/pages/DashboardPage.jsx`
  - `frontend/src/pages/LogsPage.jsx`
  - `frontend/src/pages/TicketDetailPage.jsx`

### 4. حذف التذاكر
- **Backend — `DELETE /api/tickets/:id`:**
  - المشرف: يحذف أي تذكرة
  - المنسق: يحذف تذاكره فقط إذا كانت بحالة "جديدة" (`coordinator_id = req.user.id`)
  - حذف متسلسل: attachments → comments → audit_log → ticket
- **Frontend — TicketDetailPage.jsx:**
  - `canDelete` logic: مشرف دائماً، منسق فقط إذا حالة = "جديدة" + يملك التذكرة
  - زر "حذف التذكرة" يعيد التوجيه لـ `/tickets` بعد الحذف
- **api.js:** أُضيف `ticketAPI.delete: (id) => api.delete('/tickets/${id}')`

### 5. حذف التعليقات
- **Backend — `DELETE /api/tickets/:ticketId/comments/:commentId`:**
  - المالك (صاحب التعليق) أو المشرف فقط يستطيع الحذف
- **Frontend — TicketDetailPage.jsx:**
  - زر حذف صغير `.deleteCommentBtn` على كل تعليق — يظهر للمالك أو المشرف
  - `handleDeleteComment(commentId)` تحدّث state محلياً بعد الحذف

### 6. حذف المرفقات
- **Backend — `DELETE /api/attachments/:id`:**
  - إُصلح للتحقق من الملكية: `req.user.role !== 'admin' && attachment.user_id !== req.user.id` → 403
- **Frontend — TicketDetailPage.jsx:**
  - عرض المرفق تغيّر من زر واحد إلى `.attachmentRow`: تحميل + حذف منفصلَين
  - `handleDeleteAttachment(id, fileName)` مع تأكيد + تحديث state محلي
- **api.js:** أُضيف `attachmentAPI = { delete: (id) => api.delete('/attachments/${id}') }`

### 7. استعادة المستخدمين المحذوفين (Soft Restore)
- **Backend — `PUT /api/users/:id/restore`:**
  - `UPDATE users SET is_active = true WHERE id = $1`
  - admin فقط
- **Frontend — SettingsPage.jsx:**
  - المستخدمون المعطّلون يظهرون بـ `.inactiveRow` (opacity 0.6)
  - بدلاً من أزرار التعديل/الحذف → زر "استعادة" واحد `.restoreButton` (أخضر)
  - عنوان الجدول يعرض: "X نشط · Y معطل"
- **api.js:** أُضيف `userAPI.restore: (id) => api.put('/users/${id}/restore')`

### 8. إصلاح healthcheck في docker-compose.prod.yml
- **المشكلة:** `curl -f` كان يفشل في `node:20-alpine` (curl غير مثبّت افتراضياً)
- **الحل:** استبدل بـ `wget --spider -q` (wget متوفر في Alpine)
- **ملاحظة:** frontend Dockerfile يبقى يستخدم `curl` لأن `nginx:alpine` لا يحتوي `wget`

### الملفات المعدّلة
- `frontend/src/pages/TicketsPage.jsx` — إعادة كتابة كاملة
- `frontend/src/pages/TicketsPage.module.css` — إعادة كتابة كاملة
- `frontend/src/pages/DashboardPage.jsx` — إعادة كتابة كاملة
- `frontend/src/pages/DashboardPage.module.css` — إعادة كتابة كاملة
- `frontend/src/pages/TicketDetailPage.jsx` — إضافة حذف تذكرة/تعليق/مرفق
- `frontend/src/pages/TicketDetailPage.module.css` — styles الحذف
- `frontend/src/pages/LogsPage.jsx` — إصلاح تنسيق التاريخ
- `frontend/src/pages/SettingsPage.jsx` — استعادة المستخدمين
- `frontend/src/pages/SettingsPage.module.css` — styles الاستعادة
- `frontend/src/services/api.js` — ticketAPI.delete + attachmentAPI + userAPI.restore
- `backend/src/routes/tickets.js` — DELETE ticket + DELETE comment
- `backend/src/routes/attachments.js` — إصلاح فحص الملكية عند الحذف
- `backend/src/routes/users.js` — PUT /:id/restore
- `docker-compose.prod.yml` — curl → wget في healthcheck

---

## 2026-04-21 — إصلاح إنشاء التذاكر وعرض البيانات

### المشاكل المكتشفة والمصلحة

#### 1. فشل إنشاء التذكرة — سببان جذريان
- **الحقل الخاطئ:** Frontend كان يرسل `environmentStatus` لكن Backend يتوقع `environment`
- **قيم الأولوية الخاطئة:** Frontend كان يرسل `critical/high/medium/low` لكن قاعدة البيانات ENUM تقبل فقط `حرجة/عالية/متوسطة/منخفضة`

#### 2. TicketsPage — عرض بيانات مكسور
- `ticket.ticketNumber` → `ticket.ticket_number` (snake_case من DB)
- `ticket.service?.name` → `ticket.service_name` (join field مسطح)
- `PRIORITY_COLORS / STATUS_LABELS / PRIORITY_LABELS` كانت بمفاتيح إنجليزية — غُيّرت لعربية لتطابق قيم DB
- فلتر الحالة كان يرسل `new/in-progress/closed` → صُحح للعربية

#### 3. TicketDetailPage — عرض وتفاعل مكسور
- `setTicket(response.data)` كان يضع كل الـ response في متغير واحد — لكن API يرجع `{ ticket, comments, auditLog, attachments }` → فُصلت لـ states منفصلة
- `{ text: newComment }` → `{ commentText: newComment }` (اسم الحقل المتوقع في Backend)
- `comment.user?.name` → `comment.created_by_name`
- `comment.createdAt` → `comment.created_at`
- `ticket.ticketNumber` → `ticket.ticket_number`
- `ticket.service?.name` → `ticket.service_name`
- `ticket.createdAt/resolvedAt` → `ticket.observed_date / ticket.closed_date`
- مرفقات: `ticket.attachments` → `attachments` state، `attachment.url/filename` → `/api/attachments/download/:id` + `attachment.file_name`

#### 4. DashboardPage — إحصائيات لا تظهر
- كان يحاول الوصول لـ `stats.totalTickets` لكن API يرجع `stats.total`
- `stats.byStatus/byPriority` تأتي كـ arrays من DB — تحوّل الآن لـ objects قبل الحفظ في state
- `stats.criticalOpen` غير موجود — استُبدل بـ `byPriority['حرجة']`

#### 5. api.js — HTTP methods خاطئة
- جميع `api.patch()` للتعديل → `api.put()` (Backend يستخدم `router.put` بالكامل)
- أُضيف `update/delete` لـ `departmentAPI` و `phaseAPI`

### الملفات المعدّلة
- `frontend/src/pages/NewTicketPage.jsx` — environment + قيم الأولوية العربية
- `frontend/src/pages/TicketsPage.jsx` — snake_case fields + قيم عربية للفلاتر والـ labels
- `frontend/src/pages/TicketDetailPage.jsx` — فصل states + تصحيح جميع أسماء الحقول
- `frontend/src/pages/DashboardPage.jsx` — معالجة arrays من API + تصحيح أسماء الحقول
- `frontend/src/services/api.js` — patch → put + إضافة department/phase update/delete

---

## 2026-04-14 — تصدير XLSX حقيقي + سجل أخطاء + إصلاح داشبورد + Production

### 1. تصدير Excel حقيقي (XLSX)
- **استبدل** `export.js` — من CSV بسيط إلى XLSX حقيقي بمكتبة `exceljs`
- **التنسيق:** رأس داكن بلون GACA + صفوف متبادلة + خلايا حالة/أولوية ملوّنة + RTL + فلتر تلقائي + تجميد الرأس + صف ملخص
- **إصلاح:** `detection_date` → `observed_date` (كان خطأ منذ البداية)
- **الصلاحية:** admin + manager فقط (حُذف coordinator)
- **Frontend:** زر "تصدير Excel" في TicketsPage يرسل الفلاتر المطبقة حالياً
- **dependency جديدة:** `exceljs ^4.4.0` في backend/package.json

### 2. نظام سجل الأخطاء (Error Logging)
- **جدول جديد:** `error_log` في PostgreSQL — يحفظ: method, path, status_code, message, stack, user_id, IP
- **middleware جديد:** `errorLogger.js` — `logError()` تُستدعى من كل catch في كل route
- **route جديد:** `GET /api/logs` + `GET /api/logs/:id` + `DELETE /api/logs` (admin فقط)
- **صفحة جديدة:** `LogsPage.jsx` — جدول مع فلتر بالكود + expand لرسالة الخطأ + زر مسح
- **Sidebar:** رابط "سجل الأخطاء" للمشرف فقط
- **Migration:** `db/migrate_add_error_log.sql` للتثبيتات الموجودة

### 3. إصلاح كرت الخدمات في الداشبورد
- **المشكلة:** `totalServices` كان غير موجود في الـ response → يعرض 0
- **الحل:** أُضيف query منفصل في `GET /tickets/stats/dashboard` يحسب عدد الخدمات
- المنسق يحصل على عدد خدماته فقط

### 4. ملفات Production (RHEL/Rocky)
- **install-rhel.sh:** سكريبت تثبيت كامل لـ RHEL 8/9 / Rocky / AlmaLinux
- **docker-compose.prod.yml:** إعدادات production (healthchecks، resource limits، logging)
- **.env.example:** template لمتغيرات البيئة — يُنسخ لـ `.env` ويُعدَّل

### الملفات المعدّلة/المضافة
- `backend/src/routes/export.js` — إعادة كتابة كاملة
- `backend/src/middleware/errorLogger.js` — جديد
- `backend/src/routes/logs.js` — جديد
- `backend/src/routes/tickets.js` — إضافة totalServices في stats
- `backend/src/app.js` — تسجيل logs route + errorHandlerMiddleware
- `backend/package.json` — إضافة exceljs
- `frontend/src/pages/TicketsPage.jsx` — زر تصدير
- `frontend/src/pages/LogsPage.jsx` — جديد
- `frontend/src/pages/LogsPage.module.css` — جديد
- `frontend/src/components/Layout.jsx` — رابط سجل الأخطاء
- `frontend/src/App.jsx` — route /logs
- `frontend/src/services/api.js` — logsAPI
- `db/init.sql` — إضافة جدول error_log
- `db/migrate_add_error_log.sql` — جديد
- `install-rhel.sh` — جديد
- `docker-compose.prod.yml` — جديد
- `.env.example` — جديد

---

## 2026-04-13 — فلترة الخدمات والتذاكر + إصلاح اسم المستخدم + تسمية التطبيق

### 1. تغيير اسم التطبيق
- **من:** متتبع ملاحظات أجواء
- **إلى:** متابعة ملاحظات منصة أجواء
- **الملفات:** `Layout.jsx` (navbar)، `LoginPage.jsx` (صفحة الدخول)، `frontend/index.html` (تاب المتصفح)

### 2. إصلاح اسم المستخدم في Navbar
- **المشكلة:** `user?.name` كان يُرجع `undefined` — الـ API يُرجع `fullName` وليس `name`
- **الحل:** `user?.fullName || user?.username` في Layout.jsx
- **السبب:** `auth.js` في Backend يُرجع `{ id, username, fullName, role }` بـ camelCase

### 3. فلترة الخدمات (للمشرف والمدير)
- **الفلاتر المضافة:** قطاع، إدارة (تتفلتر بناءً على القطاع تلقائياً)، منسق، حالة
- **زر "مسح الفلاتر"** يظهر فقط عند تفعيل أي فلتر
- **Backend services.js:** أُضيف query param `department` للفلترة بالإدارة
- **Frontend ServicesPage.jsx:** فلاتر تُرسل مع `serviceAPI.list(params)` وتُعيد الجلب تلقائياً عند التغيير

### 4. فلترة التذاكر — فلاتر إضافية
- **الفلاتر المضافة:** تصنيف (تشغيلي/تحليلي/نقل البيانات)، أثر، مسؤولية (الهيئة/شركة علم)
- Backend كان يدعمها بالفعل — التغيير في Frontend فقط

### 5. إصلاح صلاحية ServicesPage للمنسق
- **المشكلة الجذرية:** `fetchDropdownData` كانت تستدعي `GET /api/users` المحمي بـ admin — يرمي 403 للمنسق مما يؤثر على تحميل الصفحة
- **الحل:** `fetchDropdownData` تُستدعى فقط إذا `user.role === 'admin' || user.role === 'manager'`

### الملفات المعدّلة
- `frontend/src/components/Layout.jsx` — اسم التطبيق + إصلاح fullName
- `frontend/src/pages/LoginPage.jsx` — اسم التطبيق
- `frontend/index.html` — عنوان تاب المتصفح
- `frontend/src/pages/ServicesPage.jsx` — فلاتر متقدمة + إصلاح fetchDropdownData
- `frontend/src/pages/ServicesPage.module.css` — styles للفلاتر الجديدة
- `frontend/src/pages/TicketsPage.jsx` — فلاتر تصنيف/أثر/مسؤولية
- `backend/src/routes/services.js` — دعم query param `department`

---

## 2026-04-13 — إصلاح صلاحية تعديل حالة الخدمة للمنسق

### المشكلة
- المنسق يرى زر "تعديل الحالة" في الواجهة لكن الطلب يُرفض بـ 403
- السبب: `PUT /services/:id` كان محمياً بـ `roleCheck('admin')` بشكل كامل

### الحل — backend/src/routes/services.js
- **إزالة** `roleCheck('admin')` من الـ middleware العام لمسار `PUT /:id`
- **داخل المعالج:** تفرقة بين الأدوار:
  - **المنسق:** يُتحقق أن الخدمة تبعه (`coordinator_id = req.user.id`) ثم يُسمح له بتعديل `status` فقط — أي حقل آخر يُرفض
  - **المشرف:** تعديل كامل كما كان
  - **غير ذلك:** 403 مباشرة
- **الواجهة (ServicesPage.jsx):** لم تحتج تعديلاً — `handleStatusSave` كان يرسل `{ status }` فقط بشكل صحيح

### الملفات المعدّلة
- `backend/src/routes/services.js` — تعديل منطق التحقق في `PUT /:id`

---

## 2026-04-13 — GACA Branding + تحكم وصول المنسقين + جلسة دائمة

### 1. هوية GACA الرسمية (Brand Guidelines Jan 2025)
- **الخطوط:** استُبدل Noto Sans Arabic بـ Co Headline + Co Text (ملفات .otf محلية)
  - `frontend/public/fonts/`: CoHeadline.otf, CoHeadlineBold.otf, CoHeadlineLight.otf, CoText.otf, CoTextBold.otf, CoTextLight.otf
  - `@font-face` في `index.css`
- **الألوان الرسمية (CSS Variables):**
  - `--primary`: `#140046` — Brand Dark Blue
  - `--primary-mid`: `#313B71` — Brand Blue
  - `--accent-start`: `#23EBA5` — Brand Bright Green
  - `--accent-end`: `#2332E6` — Brand Bright Blue
- **Layout.module.css:** إعادة كتابة كاملة — Navbar `#140046` + خط أخضر `#23EBA5`، Sidebar gradient داكن
- **LoginPage.module.css:** إعادة كتابة كاملة — خلفية gradient داكنة + بطاقة بيضاء + خط علوي `#23EBA5 → #2332E6`

### 2. تحكم وصول المنسقين
- **Backend services.js:** المنسق يرى خدماته فقط (`WHERE coordinator_id = req.user.id`)
- **Backend tickets.js:** إحصائيات الداشبورد مفلترة بخدمات المنسق
- **Frontend ServicesPage.jsx:** المنسق يرى زر "تعديل الحالة" فقط (بدون تعديل بقية الحقول)، المشرف يرى تعديل كامل + حذف

### 3. تصحيح المنسقين المكررين
- **المشكلة:** كان في قاعدة البيانات 8 منسقين — 4 قديمة (ID 2-5، أسماء عربية بشرطة سفلية) + 4 جديدة (ID 18-21، أسماء إنجليزية)
- **الحل:** حُذفت الحسابات القديمة، بقيت: `mhejazi`, `amsabhani`, `aaamalki`, `alghamdimk`
- **seed_data.sql:** أُضيف `DELETE FROM users WHERE username IN ('anas.subhani', ...) AND role='coordinator'` لتجنب التكرار مستقبلاً

### 4. تصحيح seed_data.sql — ربط الخدمات بالمنسقين
- **المشكلة:** بعد حذف المنسقين القدامى، أصبحت جميع الخدمات بدون منسق (`coordinator_id = NULL`)
- **الحل:** أُضيف block من UPDATE statements في seed_data.sql يربط كل خدمة بمنسقها الصحيح بناءً على ملف الإكسل الأصلي
- التوزيع النهائي (62 خدمة):
  - `mhejazi` (ماجد حجازي): 15 خدمة — صيانة وتسجيل الطيران
  - `amsabhani` (أنس سبهاني): 16 خدمة — الملاحة الجوية وسلامة العمليات
  - `alghamdimk` (محمد خلف الغامدي): 17 خدمة — الترخيص الاقتصادي + تصاريح أمن الطيران
  - `aaamalki` (عبدالله المالكي): 14 خدمة — التراخيص والنقل والحج
- التحقق النهائي: `خدمات_بدون_منسق = 0`

### 5. جلسة دائمة (localStorage)
- **التغيير:** JWT token + بيانات المستخدم تُخزَّن الآن في `localStorage` بدلاً من state فقط
- عند إعادة تحميل الصفحة يبقى المستخدم مسجلاً
- تنتهي الجلسة تلقائياً بعد **24 ساعة** (انتهاء صلاحية JWT في Backend)
- عند استقبال خطأ 401: يُمسح localStorage + يُحوَّل لصفحة الدخول
- **AuthContext.jsx:** استخدام `localStorage.getItem` في initial state
- **api.js:** إضافة `localStorage.removeItem` في interceptor عند 401

### الملفات المعدّلة
- `frontend/src/index.css` — خطوط GACA + ألوان جديدة
- `frontend/src/components/Layout.module.css` — إعادة كتابة GACA
- `frontend/src/pages/LoginPage.module.css` — إعادة كتابة GACA
- `frontend/src/context/AuthContext.jsx` — localStorage بدل state
- `frontend/src/services/api.js` — مسح localStorage عند 401
- `frontend/src/pages/ServicesPage.jsx` — تقييد تعديل المنسق (حالة فقط)
- `backend/src/routes/services.js` — فلتر المنسق
- `backend/src/routes/tickets.js` — فلتر إحصائيات المنسق
- `seed_data.sql` — DELETE مكررين + UPDATE ربط الخدمات
- `frontend/public/fonts/` — 6 ملفات .otf (Co Headline + Co Text)

---

## 2026-04-13 — تحسينات الواجهة + GitHub + استيراد البيانات

### ميزات جديدة في الواجهة

#### 1. فورم التذكرة الجديدة (NewTicketPage)
- أُضيف قسم **المرفقات** — يقبل صور ومستندات حتى 10MB لكل ملف
- رفع المرفقات يتم تلقائياً بعد إنشاء التذكرة
- عرض قائمة المرفقات المختارة مع إمكانية الحذف قبل الإرسال

#### 2. صفحة الإعدادات (SettingsPage)
- **المستخدمون:** أُضيف زر تعديل (اسم، دور، حالة) + زر حذف + زر تغيير كلمة المرور لكل مستخدم
- **القطاعات:** أُضيف زر تعديل وحذف لكل قطاع
- **الإدارات:** أُضيف زر تعديل (اسم + القطاع) وحذف + اختيار القطاع من قائمة عند الإضافة
- **المراحل:** أُضيف زر تعديل وحذف لكل مرحلة
- جميع العمليات تستخدم مودال منفصل

#### 3. صفحة الخدمات (ServicesPage)
- القطاع والإدارة والمنسق أصبحت **قوائم منسدلة** تجلب البيانات من DB
- الإدارة تتفلتر تلقائياً عند اختيار القطاع
- أُضيف حقل "مالك الخدمة" نصي
- أُضيف زر **تعديل** لكل خدمة (مودال كامل) + زر **حذف**

#### 4. Backend — إضافات sectors.js
- `PUT /sectors/departments/:id` — تعديل إدارة
- `DELETE /sectors/departments/:id` — حذف إدارة
- `PUT /sectors/phases/:id` — تعديل مرحلة
- `DELETE /sectors/phases/:id` — حذف مرحلة

#### 5. تصحيح مسارات API (api.js)
- `departmentAPI.list()` → `/sectors/departments/list`
- `phaseAPI.list()` → `/sectors/phases/list`
- `departmentAPI.create()` → `/sectors/departments`

#### 6. Frontend Dockerfile
- تغيير healthcheck من `wget` إلى `curl` (nginx:alpine لا يحتوي wget)

### استيراد البيانات (seed_data.sql)
- 4 منسقين: anas.subhani, abdullah.almalki, majed.hijazi, mohammed.alghamdi
- 4 قطاعات، 12 إدارة، 62 خدمة من ملف الإكسل الأصلي
- كلمة المرور الافتراضية لكل منسق: `admin123`

### GitHub
- رُفع المشروع كاملاً على: https://github.com/baljadrawy/ajwaa-tracker
- أمر التحديث على الرازبري: `git pull origin main && docker compose build --no-cache && docker compose up -d`

### الملفات المعدّلة
- `frontend/src/pages/NewTicketPage.jsx` + `.module.css`
- `frontend/src/pages/SettingsPage.jsx` + `.module.css`
- `frontend/src/pages/ServicesPage.jsx` + `.module.css`
- `frontend/src/services/api.js`
- `frontend/Dockerfile`
- `backend/src/routes/sectors.js`
- `backend/src/routes/services.js`
- `seed_data.sql` (جديد)

---

## 2026-04-13 — مراجعة شاملة وإصلاح أخطاء Backend

### المشاكل المكتشفة والمصلحة

#### 1. أسماء أعمدة خاطئة في tickets.js
| الخاطئ | الصحيح في قاعدة البيانات |
|--------|--------------------------|
| `detection_date` | `observed_date` |
| `closure_date` | `closed_date` |
| `audit_logs` | `audit_log` (اسم الجدول) |
| `changed_by` | `user_id` (في audit_log) |
| `comment_text` | `content` (في comments) |
| `created_by` | `user_id` (في comments) |
| `uploaded_by` | `user_id` (في attachments) |
| `uploaded_at` | `created_at` (في attachments) |

#### 2. ترتيب المسارات في tickets.js
- `/stats/dashboard` كان بعد `/:id` فيُعالَج كـ id — نُقل للأعلى

#### 3. sectors.js — أخطاء departments و phases
- `/departments/list` كان يستعلم `department` من `services` — صُحح للاستعلام من جدول `departments` مباشرة
- `/phases/list` نفس المشكلة — صُحح للاستعلام من جدول `phases`
- أُضيفت endpoints لإنشاء departments و phases

#### 4. attachments.js
- أعمدة مصلحة: `user_id`, `file_size`, `mime_type`

#### 5. export.js
- أسماء أعمدة مصلحة: `observed_date`, `closed_date`

#### 6. init.sql
- هاش كلمة المرور الافتراضية كان وهمياً — استُبدل بهاش bcrypt حقيقي لـ `admin123`

### الملفات المعدّلة
- `backend/src/routes/tickets.js` — إعادة كتابة كاملة
- `backend/src/routes/sectors.js` — إعادة كتابة كاملة
- `backend/src/routes/attachments.js` — تصحيح أسماء الأعمدة
- `backend/src/routes/export.js` — تصحيح أسماء الأعمدة
- `db/init.sql` — هاش bcrypt صحيح
- `frontend/src/services/api.js` — تصحيح مسار stats + إزالة localStorage

---

## 2026-04-13 — تجهيز التثبيت على Raspberry Pi

### التعديلات
- **تصحيح CORS** في `backend/src/app.js`: تغيير من origin ثابت إلى regex يقبل أي IP محلي (192.168.x.x, 10.x.x.x, 172.16-31.x.x) — ضروري لأن الرازبري باي يظهر بـ IP شبكة لا localhost
- **إضافة سكريبت التثبيت** `install-rpi.sh`: يتحقق من Docker، المنافذ، ينشئ المجلدات، يبني الحاويات، ويطبع رابط الوصول مع الـ IP تلقائياً

### ملاحظة التوافق مع ARM
- جميع صور Docker (postgres:16-alpine, node:20-alpine, nginx:alpine) تدعم ARM64 بشكل كامل — لا تعديل مطلوب

---

## 2026-04-13 — بناء هيكل المشروع الكامل + دليل التثبيت

### ما تم إنجازه

#### قاعدة البيانات (`db/init.sql`)
- 9 جداول: users, sectors, departments, phases, services, tickets, comments, audit_log, attachments
- أنواع ENUM عربية لجميع الحقول (التصنيف، الأثر، الأولوية، الحالة، المسؤولية)
- Trigger تلقائي لتوليد رقم التذكرة (T-0001, T-0002, ...)
- Trigger لتحديث updated_at تلقائياً
- فهارس على: tickets(status), tickets(service_id), tickets(priority), services(coordinator_id)
- مستخدم افتراضي: admin / admin123 (مشرف)

#### Backend (`backend/`)
- Express 4 + Node.js 20 Al