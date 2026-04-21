# Ajwaa Tracker Frontend

متتبع ملاحظات أجواء - نظام ويب عربي RTL كامل لتتبع ملاحظات وتحسين خدمات منصة أجواء.

## التقنيات المستخدمة

- **React 18** - مكتبة واجهات المستخدم
- **Vite** - أداة بناء سريعة
- **React Router v6** - إدارة المسارات
- **Axios** - عميل HTTP
- **Lucide React** - أيقونات
- **React Hot Toast** - إشعارات
- **Date-fns** - معالجة التواريخ

## البنية

```
frontend/
├── public/              # الملفات الثابتة (logo.png, icon.png)
├── src/
│   ├── components/      # مكونات معاد استخدامها
│   │   ├── Layout.jsx    # التخطيط الرئيسي (navbar + sidebar)
│   │   └── ProtectedRoute.jsx # حماية المسارات
│   ├── context/         # Context API للحالة العامة
│   │   └── AuthContext.jsx
│   ├── pages/          # صفحات التطبيق
│   │   ├── LoginPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── TicketsPage.jsx
│   │   ├── NewTicketPage.jsx
│   │   ├── TicketDetailPage.jsx
│   │   ├── ServicesPage.jsx
│   │   └── SettingsPage.jsx
│   ├── services/       # الخدمات والـ APIs
│   │   └── api.js
│   ├── App.jsx         # مكون التطبيق الرئيسي
│   ├── main.jsx        # نقطة الدخول
│   └── index.css       # الأنماط العامة
├── index.html          # صفحة HTML الرئيسية
├── vite.config.js      # إعدادات Vite
├── nginx.conf          # إعدادات Nginx للـ production
├── Dockerfile          # ملف Docker
├── package.json
└── README.md
```

## التصميم والعلامات التجارية

- **اللون الأساسي:** `#323c73` (أزرق داكن من شعار GACA)
- **التدرج اللوني:** من `#23d2ae` (أخضر/فيروزي) إلى `#2385c9` (أزرق)
- **الخط:** Noto Sans Arabic - دعم عربي كامل
- **الاتجاه:** RTL (right-to-left) - عربي كامل

## الميزات

### المصادقة
- تسجيل دخول بـ username و password
- إدارة الجلسات عبر JWT
- حماية المسارات حسب الأدوار

### لوحة التحكم
- إحصائيات عامة (التذاكر، الخدمات)
- توزيع التذاكر حسب الحالة والأولوية
- تتبع التذاكر الحرجة

### إدارة التذاكر
- عرض قائمة التذاكر مع تصفية متقدمة
- البحث عن التذاكر
- ترقيم التذاكر التلقائي (T-XXXX)
- جميع الحقول إلزامية عند الإنشاء
- عرض تفاصيل التذكرة الكاملة
- نظام التعليقات والملاحظات
- المرفقات
- سجل الحالات

### إدارة الخدمات
- عرض الخدمات المتاحة
- إضافة خدمات جديدة (مشرف فقط)
- ربط الخدمات بالقطاعات

### لوحة الإعدادات (مشرف فقط)
- إدارة المستخدمين (إضافة، حذف)
- إدارة الأدوار والصلاحيات
- إدارة القطاعات
- إدارة الإدارات
- إدارة مراحل الإطلاق

## الأدوار والصلاحيات

| الدور | الصلاحيات |
|------|----------|
| **مشرف** | كل شيء: إدارة تذاكر/خدمات/مستخدمين/إعدادات |
| **منسق** | إضافة/تعديل التذاكر والخدمات والتعليقات |
| **مدير** | قراءة فقط: لوحة تحكم وتقارير وتصدير |

## الإعداد والتشغيل

### التطوير المحلي

```bash
# تثبيت الاعتماديات
npm install

# تشغيل خادم التطوير
npm run dev

# الوصول من: http://localhost:5173
```

### البناء للإنتاج

```bash
# بناء الملفات الثابتة
npm run build

# معاينة البناء
npm run preview
```

### Docker

```bash
# بناء الصورة
docker build -t ajwaa-tracker-frontend .

# تشغيل الحاوية
docker run -p 80:80 ajwaa-tracker-frontend
```

## المتغيرات البيئية

- `VITE_API_URL` - URL خادم API (افتراضي: `/api`)

```bash
# .env.local
VITE_API_URL=http://localhost:4000/api
```

## معايير الترميز

- **RTL-First:** جميع التخطيطات موجهة نحو RTL
- **Arabic Labels:** جميع النصوص والتسميات بالعربية
- **CSS Modules:** استخدام CSS Modules لعزل الأنماط
- **Responsive Design:** دعم كامل للأجهزة المحمولة
- **Accessibility:** دعم التنقل بلوحة المفاتيح

## الألوان والمتغيرات

```css
--primary: #323c73
--primary-light: #404b8a
--accent-start: #23d2ae
--accent-end: #2385c9
--bg: #f5f7fa
--card-bg: #ffffff
--border-color: #e0e6f2
--text-primary: #323c73
--text-secondary: #666666
--success: #10b981
--danger: #ef4444
--warning: #f59e0b
--info: #3b82f6
```

## ملاحظات التطوير

- جميع المكونات تدعم RTL بالكامل
- استخدام Lucide React للأيقونات
- جميع الاتصالات الـ API تمر عبر axios مع تعامل تلقائي للأخطاء
- إدارة الحالة عبر React Context
- رسائل الخطأ والنجاح عبر react-hot-toast

## الملفات الرئيسية

- `src/App.jsx` - توجيه التطبيق والمسارات
- `src/main.jsx` - نقطة الدخول الرئيسية
- `src/context/AuthContext.jsx` - إدارة المصادقة والمستخدمين
- `src/services/api.js` - جميع طلبات API
- `src/components/Layout.jsx` - التخطيط الرئيسي للتطبيق
- `src/index.css` - الأنماط العامة والمتغيرات

## الدعم والمساعدة

للمزيد من المعلومات، راجع:
- CLAUDE.md - معايير المشروع
- DEV_LOG.md - سجل التطوير
