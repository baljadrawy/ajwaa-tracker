-- ===== استعادة التذاكر من ملف Excel =====
BEGIN;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0002', (SELECT id FROM services WHERE name = $$خدمة شهادة طراز طائرة$$ LIMIT 1), $$BA$$, $$القائمة المنسدلة لموديل و سلسلة الطائرة مفتوحة و غير محدده بصانع الطائرة$$, $$تشغيلي$$, $$عائق تشغيل$$, $$عالية$$, $$جديدة$$, $$شركة علم$$, '2026-04-22', NULL, NULL, (SELECT id FROM users WHERE full_name = $$ماجد حجازي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0003', (SELECT id FROM services WHERE name = $$خدمة الموافقة على محطة الإصلاح لمرة واحدة$$ LIMIT 1), $$BA$$, $$لا تظهر الا للشركات بنوع الجهة Air operator & Government
مع العلم ان تصنيف Air operator تم إعادة تقسيمه وان كل الشركات تحت نوع الجهة Government لا يوجد لها سجل تجاري ولم نتمكن من تجربة الخدمة بها
وحسب BRS المفترض ان تطهر الخدمة لأي ممثل لكيان سعودي أو وكيل نيابة عن شركة أجنبية$$, $$تشغيلي$$, $$عائق تشغيل$$, $$عالية$$, $$جديدة$$, $$شركة علم$$, '2026-04-22', NULL, NULL, (SELECT id FROM users WHERE full_name = $$ماجد حجازي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0004', (SELECT id FROM services WHERE name = $$خدمة رخصة مهندس اصلاح طائرات$$ LIMIT 1), $$BA$$, $$قائمة الاختبارات واسم الخدمة مختلف بحاجة الي توحيد الاسم بشكل صحيح.
قائمة الاختبارات تظهر جميعها ويمكن اختيار اي منها من قبل مقدم الطلب وهذا يتعارض مع متطلبات الحصول على الرخصة كم تم ذكره سابقا خلال الاختبارات التجريبية للخدمة.
تم تحديد اختبار مادة محركات قبل ان يتم اختبار المادة العامة (General )
النظام يسمح لمقدم الطلب بحجز وجدولة مادة و جميع المواد ايضا دون وجود الية لحوكمة ترتيب الاختبارات.
وفقا للنقطة الرابعة قام النظام بإصدار فواتير وارسالها لمقدم الطلب للدفع وكانت (اسم الخدمة اعادة الاختبار بينما في الاصل هي اختبار جديد) حيث ان رسوم بعض الخدمات تختلف بين جديد وإعادة الاختبار.
ظهور اختيار (بناءََ على الطلب ) ( مشغل أجنبي للأشغال الجوية Part 133 Subpart Q  ضمن صفحة قائمة الاختبارات !!  مع إمكانية التقديم عليها !!!  لا اعرف ما هو السبب لظهورها ضمن هذه الصفحة$$, $$تشغيلي$$, $$عائق تشغيل$$, $$عالية$$, $$جديدة$$, $$شركة علم$$, '2026-04-22', NULL, NULL, (SELECT id FROM users WHERE full_name = $$ماجد حجازي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0005', (SELECT id FROM services WHERE name = $$خدمة شهادة مصادقة على رخصة فني صيانة طائرات أجنبية$$ LIMIT 1), $$BA$$, $$النظام لا يسمح بإدخال حقل (رقم الوحدة) مع العلم انه لا يمكن تعديل رقم الوحدة من اعدادات المستخدم أيضا$$, $$تشغيلي$$, $$عائق تشغيل$$, $$عالية$$, $$جديدة$$, $$شركة علم$$, '2026-04-22', NULL, NULL, (SELECT id FROM users WHERE full_name = $$ماجد حجازي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0006', (SELECT id FROM services WHERE name = $$خدمة شهادة طراز طائرة$$ LIMIT 1), $$BA$$, $$تغيير مسمى حقل type certificate acceptance number to type of certification في نموذج تقديم الطلب$$, $$تشغيلي$$, $$عائق تشغيل$$, $$عالية$$, $$جديدة$$, $$شركة علم$$, '2026-04-22', NULL, NULL, (SELECT id FROM users WHERE full_name = $$ماجد حجازي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0007', (SELECT id FROM services WHERE name = $$خدمة شهادة طراز طائرة$$ LIMIT 1), $$BA$$, $$بحال رفع مقدم الطلب لموديل تم اصدار شهادة طراز له مسبقا يجب على النظام اظهار رسالة خطأ$$, $$تشغيلي$$, $$عائق تشغيل$$, $$عالية$$, $$جديدة$$, $$شركة علم$$, '2026-04-22', NULL, NULL, (SELECT id FROM users WHERE full_name = $$ماجد حجازي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0008', (SELECT id FROM services WHERE name = $$خدمة شهادة تسجيل طائرة$$ LIMIT 1), $$BA$$, $$update air operator use case$$, $$تشغيلي$$, $$عائق تشغيل$$, $$عالية$$, $$جديدة$$, $$شركة علم$$, '2026-04-22', NULL, NULL, (SELECT id FROM users WHERE full_name = $$ماجد حجازي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0009', (SELECT id FROM services WHERE name = $$خدمة رخصة مرحل جوي$$ LIMIT 1), $$Operation Support$$, $$اذا  قام مقدم الطلب بتحديث الطلب باعاده ارفاق التوقيع او الصورة فان ذلك لا ينعكس علي الرخصه 
حيث انه اثناء طباعه الرخصه تظهر الصورة او التوقيع قبل التحديث$$, $$تشغيلي$$, $$عائق تشغيل$$, $$حرجة$$, $$جديدة$$, $$شركة علم$$, '2026-04-23', NULL, NULL, (SELECT id FROM users WHERE full_name = $$أنس سبهاني$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0010', (SELECT id FROM services WHERE name = $$خدمة رخصة مرحل جوي$$ LIMIT 1), $$Operation Support$$, $$العنوان يظهر باللغه العربيه عند طباعة الرخصه$$, $$تشغيلي$$, $$عائق تشغيل$$, $$حرجة$$, $$جديدة$$, $$شركة علم$$, '2026-04-23', NULL, NULL, (SELECT id FROM users WHERE full_name = $$أنس سبهاني$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0011', (SELECT id FROM services WHERE name = $$خدمة رخصة مرحل جوي$$ LIMIT 1), $$Operation Support$$, $$لا تظهر درجات  اختبار الشفوي و العملي في الطلب$$, $$تشغيلي$$, $$عائق تشغيل$$, $$عالية$$, $$جديدة$$, $$شركة علم$$, '2026-04-23', NULL, NULL, (SELECT id FROM users WHERE full_name = $$أنس سبهاني$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0012', (SELECT id FROM services WHERE name = $$خدمة شهادة تفويض فاحص طاقم مقصورة الركاب$$ LIMIT 1), $$Operation Support$$, $$ظهور مشكله " الرخصه غير فعاله " اثناء تقديم الطلب$$, $$تشغيلي$$, $$عائق تشغيل$$, $$حرجة$$, $$مغلقة$$, $$شركة علم$$, '2026-04-23', NULL, NULL, (SELECT id FROM users WHERE full_name = $$أنس سبهاني$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0013', (SELECT id FROM services WHERE name = $$خدمة تصريح فعالية طيران$$ LIMIT 1), $$Operation Support$$, $$تم انشاء طلب AEA26000001 و لكنه لا يظهر في مهام موظف قسم الطيران الخفيف والرياضات والفعاليات حتى يتم استكمال الاجراء$$, $$تشغيلي$$, $$عائق تشغيل$$, $$عالية$$, $$جديدة$$, $$شركة علم$$, '2026-04-23', NULL, NULL, (SELECT id FROM users WHERE full_name = $$أنس سبهاني$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0014', (SELECT id FROM services WHERE name = $$خدمة شهادة جهاز تدريب محاكاة الطيران$$ LIMIT 1), $$Operation Support$$, $$بانتظار نقل بيانات الاجهزة الي منصه أجواء$$, $$نقل البيانات$$, $$عائق تشغيل$$, $$عالية$$, $$جديدة$$, $$شركة علم$$, '2026-04-23', NULL, NULL, (SELECT id FROM users WHERE full_name = $$أنس سبهاني$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0015', (SELECT id FROM services WHERE name = $$خدمة شهادة تفويض فاحص المرحل الجوي$$ LIMIT 1), $$Operation Support$$, $$لا يمكن للمستفيد من اصدار فاتورة نظرا لعدم وجود الخدمة في قائمه خدمات انشاء فاتورة$$, $$تحليلي$$, $$عائق تشغيل$$, $$عالية$$, $$جديدة$$, $$شركة علم$$, '2026-04-23', NULL, NULL, (SELECT id FROM users WHERE full_name = $$أنس سبهاني$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0016', (SELECT id FROM services WHERE name = $$خدمة رخصة مراقب جوي$$ LIMIT 1), $$Operation Support$$, $$تحت قسم Application details  إدراج جميع خيارات المطارات التي تبدأ بـ (OE) تحت خيار Air traffic service unit مع$$, $$تحليلي$$, $$عائق تشغيل$$, $$عالية$$, $$جديدة$$, $$شركة علم$$, '2026-04-23', NULL, NULL, (SELECT id FROM users WHERE full_name = $$أنس سبهاني$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0017', (SELECT id FROM services WHERE name = $$خدمة رخصة مراقب جوي$$ LIMIT 1), $$Operation Support$$, $$لم يتم إضافة مطار البحر الأحمر بالإضافة الى أنه تم فقط إضافة 8 مطارات.$$, $$تشغيلي$$, $$عائق تشغيل$$, $$عالية$$, $$جديدة$$, $$شركة علم$$, '2026-04-23', NULL, NULL, (SELECT id FROM users WHERE full_name = $$أنس سبهاني$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0018', (SELECT id FROM services WHERE name = $$خدمة رخصة مرحل جوي$$ LIMIT 1), $$Operation Support$$, $$لم يتم إضافة دور رئيس قسم خدمات الحركة الجوية وتكون حالة الطلب بعد الاعتماد Validated by section head$$, $$تشغيلي$$, $$عائق تشغيل$$, $$عالية$$, $$جديدة$$, $$الهيئة$$, '2026-04-23', NULL, NULL, (SELECT id FROM users WHERE full_name = $$أنس سبهاني$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0019', (SELECT id FROM services WHERE name = $$خدمة رخصة مراقب جوي$$ LIMIT 1), $$Operation Support$$, $$لم يتم إضافة دور مدير إدارة الحركة الجوية للاعتماد النهائي واحالة الطلب الى شركة خدمات الملاحة الجوية السعودية$$, $$تشغيلي$$, $$عائق تشغيل$$, $$عالية$$, $$جديدة$$, $$شركة علم$$, '2026-04-23', NULL, NULL, (SELECT id FROM users WHERE full_name = $$أنس سبهاني$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0020', (SELECT id FROM services WHERE name = $$خدمة رخصة مراقب جوي$$ LIMIT 1), $$BA$$, $$في طلبات ترخيص المراقبين الجويين، نرجو إضافة خيار تحديد المقيم (Assessor) الذي قام بإجراء التقييم للمراقب الجوي، وقاعدة بيانات المقيمين تكون مرتبطة بالمنصة.$$, $$تشغيلي$$, $$عائق تشغيل$$, $$عالية$$, $$جديدة$$, $$شركة علم$$, '2026-04-23', NULL, NULL, (SELECT id FROM users WHERE full_name = $$أنس سبهاني$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0021', (SELECT id FROM services WHERE name = $$خدمة رخصة مراقب جوي$$ LIMIT 1), $$Operation Support$$, $$النسخة العربية من المنصة يجب أن تراجع حسب الوثيقة المتفق عليها (مرفق). حيث لوحظ وجود اختلافات في المصطلحات المستخدمة عن الوثيقة المشار إليها مثل: كلمة (الأهلية : Rating) والمستخدم حاليا في المنصة كلمة تصنيف.$$, $$تشغيلي$$, $$عائق تشغيل$$, $$عالية$$, $$جديدة$$, $$شركة علم$$, '2026-04-23', NULL, NULL, (SELECT id FROM users WHERE full_name = $$أنس سبهاني$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0022', (SELECT id FROM services WHERE name = $$خدمة رخصة مراقب جوي$$ LIMIT 1), $$Operation Support$$, $$مطارات الكويت والمنامة والدوحة لا ضرورة منهم، في قائمة المطارات، حيث لا يتم إصدار رخص مراقبين جويين يعملون في هذه المطارات$$, $$تشغيلي$$, $$تحسيني$$, $$منخفضة$$, $$جديدة$$, $$شركة علم$$, '2026-04-23', NULL, NULL, (SELECT id FROM users WHERE full_name = $$أنس سبهاني$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0023', (SELECT id FROM services WHERE name = $$خدمة تصريح طيار مؤقت$$ LIMIT 1), $$BA$$, $$نفس الطيار في حالة رفع طلب تجديد المرة الثالثة تكون الصلاحية بالموافقة عند نائب الرئيس$$, $$تحليلي$$, $$عائق تشغيل$$, $$عالية$$, $$جديدة$$, $$شركة علم$$, '2026-04-23', NULL, NULL, (SELECT id FROM users WHERE full_name = $$أنس سبهاني$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0024', (SELECT id FROM services WHERE name = $$خدمة رخصة مراقب جوي$$ LIMIT 1), $$Operation Support$$, $$تحديثات على نوع طلب add rating / endorcement$$, $$تشغيلي$$, $$غير عائق$$, $$متوسطة$$, $$جديدة$$, $$شركة علم$$, '2026-04-23', NULL, NULL, (SELECT id FROM users WHERE full_name = $$أنس سبهاني$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0025', (SELECT id FROM services WHERE name = $$خدمة شهادة تفويض فاحص المرحل الجوي$$ LIMIT 1), $$Operation Support$$, $$اشكاليه في الصلاحيات حيث يمكن لقسم الترحيل الجوي صلاحيات الموافقة على الطلب نيابة عن مدير إدارة التدريب و مدير إدارة سلامه الطيران و نائب رئيس القطاع$$, $$تشغيلي$$, $$عائق تشغيل$$, $$عالية$$, $$مغلقة$$, $$شركة علم$$, '2026-04-23', NULL, NULL, (SELECT id FROM users WHERE full_name = $$أنس سبهاني$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0026', (SELECT id FROM services WHERE name = $$شهادة تفويض مراقبة جوية في مركز تدريب معتمد$$ LIMIT 1), $$Operation Support$$, $$"تعديل متطلب رفع شهادة دورة التدريب الافتراضي من إلزامي إلى اختياري.
- تغيير المسمى بتفاصيل طلب التفويض إلى التالي:
شهادة مدرب المراقبة الجوية.
شهادة مقيم المراقبة الجوية.
شهادة مدرب على المعامل التشبيهية.
 "$$, $$تشغيلي$$, $$عائق تشغيل$$, $$عالية$$, $$جديدة$$, $$شركة علم$$, '2026-04-23', NULL, NULL, (SELECT id FROM users WHERE full_name = $$أنس سبهاني$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0027', (SELECT id FROM services WHERE name = $$خدمة الموافقة على تصميم إجراءات الطيران الآلي$$ LIMIT 1), $$Operation Support$$, $$زيادة في حجم الملف الذي سيتم تحميله ليكون 20 MB في هذه الخدمات  وخاصة ملف XML
الحجم الحالي المسموح به هو 5 MB$$, $$تشغيلي$$, $$غير عائق$$, $$عالية$$, $$جديدة$$, $$شركة علم$$, '2026-04-23', NULL, NULL, (SELECT id FROM users WHERE full_name = $$أنس سبهاني$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0028', (SELECT id FROM services WHERE name = $$خدمة الموافقة على تصميم إجراءات الطيران الآلي$$ LIMIT 1), $$Operation Support$$, $$رئيس قسم إجراءات الطيران لا يستلم الطلبات$$, $$تشغيلي$$, $$غير عائق$$, $$عالية$$, $$جديدة$$, $$شركة علم$$, '2026-04-23', NULL, NULL, (SELECT id FROM users WHERE full_name = $$أنس سبهاني$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0029', (SELECT id FROM services WHERE name = $$خدمه الموافقة على تعديل منتجات معلومات الطيران$$ LIMIT 1), $$Operation Support$$, $$لا توجد خيارات بخانة "اسم الخدمة" وهي خانة اجبارية لتقديم الطلب

وعليه لا يمكن القيام بالاختبار$$, $$تشغيلي$$, $$غير عائق$$, $$عالية$$, $$جديدة$$, $$شركة علم$$, '2026-04-23', NULL, NULL, (SELECT id FROM users WHERE full_name = $$أنس سبهاني$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0030', (SELECT id FROM services WHERE name = $$خدمة قبول تقديم المساح الجوي$$ LIMIT 1), $$Operation Support$$, $$لم يتم رفع من حجم الملف المسموح به الى 10 ميغابايت$$, $$تشغيلي$$, $$غير عائق$$, $$عالية$$, $$جديدة$$, $$شركة علم$$, '2026-04-23', NULL, NULL, (SELECT id FROM users WHERE full_name = $$أنس سبهاني$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0031', (SELECT id FROM services WHERE name = $$خدمة قبول تقديم المساح الجوي$$ LIMIT 1), $$Operation Support$$, $$لا يمكن رفع ملف PDF  في خانة "منهجية المسح" وفي خانة "قائمة المعدات" وفي خانة "نظام جودة التحكم" وفي خانة" موافقة شهادة الهيئة العامة للمساحة والمعلومات الجيومكانية" وفي خانة "عقد المشروع" وفي خانة "موافقات الأنشطة المتعاقد عليها" وفي خانة "مرفقات إضافية"$$, $$تشغيلي$$, $$غير عائق$$, $$عالية$$, $$جديدة$$, $$شركة علم$$, '2026-04-23', NULL, NULL, (SELECT id FROM users WHERE full_name = $$أنس سبهاني$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0032', (SELECT id FROM services WHERE name = $$خدمة قبول تقديم المساح الجوي$$ LIMIT 1), $$Operation Support$$, $$لم نتمكن من ارسال الطلب لوجود طلب لنفس الخدمة تحت الاجراء$$, $$تشغيلي$$, $$غير عائق$$, $$عالية$$, $$جديدة$$, $$شركة علم$$, '2026-04-23', NULL, NULL, (SELECT id FROM users WHERE full_name = $$أنس سبهاني$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0033', (SELECT id FROM services WHERE name = $$خدمة قبول تقديم المساح الجوي$$ LIMIT 1), $$Operation Support$$, $$رئيس قسم العوائق لم يستلم الطلبات$$, $$تشغيلي$$, $$غير عائق$$, $$عالية$$, $$جديدة$$, $$شركة علم$$, '2026-04-23', NULL, NULL, (SELECT id FROM users WHERE full_name = $$أنس سبهاني$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0034', (SELECT id FROM services WHERE name = $$خدمة الموافقة على التغييرات في البيانات والأنظمة الرئيسية لمقدمي خدمات الملاحة الجوية$$ LIMIT 1), $$Operation Support$$, $$رئيس القسم لا يستلم الطلبات$$, $$تشغيلي$$, $$غير عائق$$, $$عالية$$, $$جديدة$$, $$شركة علم$$, '2026-04-23', NULL, NULL, (SELECT id FROM users WHERE full_name = $$أنس سبهاني$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0035', (SELECT id FROM services WHERE name = $$خدمة الموافقة على تغييرالمجال الجوي$$ LIMIT 1), $$Operation Support$$, $$نوع الطلب: "طلب تعيين جزء من المجال الجوي" و"تعديل المجال الجوي الخاص بمطار منشور بدليل الطيران السعودي"  و "استحداث مجال جوي خاص بمطار جديد"  و " تعديل المجال الجوي لقطاع منشور بدليل الطيران السعودي" و " انشاء المجال الجوي للقطاع الجديد"$$, $$تشغيلي$$, $$غير عائق$$, $$عالية$$, $$جديدة$$, $$شركة علم$$, '2026-04-23', NULL, NULL, (SELECT id FROM users WHERE full_name = $$أنس سبهاني$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0036', (SELECT id FROM services WHERE name = $$خدمة الموافقة على تغييرالمجال الجوي$$ LIMIT 1), $$Operation Support$$, $$عند اختيار الحدود الجانبية "دائرة" فمركزها يكون احداثي واحد فقط بحيث خط العرض وخط الطول يكون واحدا ولا يجب إضافة آخر$$, $$تشغيلي$$, $$غير عائق$$, $$عالية$$, $$جديدة$$, $$شركة علم$$, '2026-04-23', NULL, NULL, (SELECT id FROM users WHERE full_name = $$أنس سبهاني$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0037', (SELECT id FROM services WHERE name = $$خدمة الموافقة على تغييرالمجال الجوي$$ LIMIT 1), $$Operation Support$$, $$عند اختيار احداثيات جغرافية في الحدود الجانبية فيجب عدم طلب " دائرة بنصف قطر (الميل البحري)"$$, $$تشغيلي$$, $$غير عائق$$, $$عالية$$, $$جديدة$$, $$شركة علم$$, '2026-04-23', NULL, NULL, (SELECT id FROM users WHERE full_name = $$أنس سبهاني$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0038', (SELECT id FROM services WHERE name = $$خدمة الموافقة على تغييرالمجال الجوي$$ LIMIT 1), $$Operation Support$$, $$رئيس قسم سياسة الأجواء لا يستلم الطلبات$$, $$تشغيلي$$, $$غير عائق$$, $$عالية$$, $$جديدة$$, $$شركة علم$$, '2026-04-23', NULL, NULL, (SELECT id FROM users WHERE full_name = $$أنس سبهاني$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0039', (SELECT id FROM services WHERE name = $$تسجيل الجهات$$ LIMIT 1), $$Operation Support$$, $$عدم القدرة على تسجيل الجهات التي يحتوي أسمها على علامات كالنقطة مثلا$$, $$تشغيلي$$, $$عائق تشغيل$$, $$متوسطة$$, $$مغلقة$$, $$شركة علم$$, '2026-04-25', NULL, NULL, (SELECT id FROM users WHERE full_name = $$عبدالله المالكي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0040', (SELECT id FROM services WHERE name = $$تسجيل الجهات$$ LIMIT 1), $$Operation Support$$, $$عدم القدرة على تسجيل الجهات التي يملكها مستثمر محلي داخل السعودية$$, $$تشغيلي$$, $$عائق تشغيل$$, $$متوسطة$$, $$تحت الإجراء$$, $$شركة علم$$, '2026-04-25', NULL, NULL, (SELECT id FROM users WHERE full_name = $$عبدالله المالكي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0041', (SELECT id FROM services WHERE name = $$تسجيل الجهات$$ LIMIT 1), $$Operation Support$$, $$المشاكل في تسجيل الجهات ادت إلى عدم ظهور الفواتير لبعض الجهات أو تكرر لدى بعض الجهات$$, $$تشغيلي$$, $$عائق تشغيل$$, $$متوسطة$$, $$تحت الإجراء$$, $$شركة علم$$, '2026-04-25', NULL, NULL, (SELECT id FROM users WHERE full_name = $$عبدالله المالكي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0042', (SELECT id FROM services WHERE name = $$تسجيل الجهات$$ LIMIT 1), $$BA$$, $$تسجيل الجهات الاجنبية التي لايوجد لها تمثيل داخل السعودية حيث يتم تسجيلها بدون وجود آلية واضحه في المنصة$$, $$تحليلي$$, $$تحسيني$$, $$متوسطة$$, $$تحت الإجراء$$, $$شركة علم$$, '2026-04-25', NULL, NULL, (SELECT id FROM users WHERE full_name = $$عبدالله المالكي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0043', (SELECT id FROM services WHERE name = $$تسجيل الجهات$$ LIMIT 1), $$Operation Support$$, $$بعض أنواع الجهات لاتظهر لديها خدمات من المفترض أن تظهر لها ولانعلم لماذا يتم ذلك في المنصة هل هناك اتفاق وتصنيف مسبق مع ملاك الخدمات وملاك الخدمات يفيدون بعدم التخصيص$$, $$تشغيلي$$, $$عائق تشغيل$$, $$متوسطة$$, $$تحت الإجراء$$, $$شركة علم$$, '2026-04-25', NULL, NULL, (SELECT id FROM users WHERE full_name = $$عبدالله المالكي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0044', (SELECT id FROM services WHERE name = $$تسجيل الجهات$$ LIMIT 1), $$BA$$, $$تكرر أسماء الجهات وبياناتها ولا نعلم أي جهة هي الصحيحة$$, $$تحليلي$$, $$غير عائق$$, $$متوسطة$$, $$تحت الإجراء$$, $$شركة علم$$, '2026-04-25', NULL, NULL, (SELECT id FROM users WHERE full_name = $$عبدالله المالكي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0045', (SELECT id FROM services WHERE name = $$تسجيل الجهات$$ LIMIT 1), $$BA$$, $$لايوجد دليل واضح لآلية تسجيل الجهات في المنصة بحسب الانواع بالرغم من تحديث الاجراء لآكثر من مره$$, $$تحليلي$$, $$تحسيني$$, $$متوسطة$$, $$تحت الإجراء$$, $$شركة علم$$, '2026-04-25', NULL, NULL, (SELECT id FROM users WHERE full_name = $$عبدالله المالكي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0046', (SELECT id FROM services WHERE name = $$تسجيل الجهات$$ LIMIT 1), $$Operation Support$$, $$لايوجد حلول للشركات التي تسجل على المنصه بطريقة خاطئة والاجراء يستغرق وقت طويل مثل الشركة التي تختار عند التسجيل مسمى الجهة الخاصة ولايوجد 
أي خدمات تظهر للشركة ضمن هذا التصنيف$$, $$تشغيلي$$, $$تحسيني$$, $$متوسطة$$, $$تحت الإجراء$$, $$شركة علم$$, '2026-04-25', NULL, NULL, (SELECT id FROM users WHERE full_name = $$عبدالله المالكي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0047', (SELECT id FROM services WHERE name = $$تسجيل الجهات$$ LIMIT 1), $$BA$$, $$إعادة تصميم طريقة تسجيل الشركات
في الأدلة من داخل حساب الافراد كانت هناك أيقونة وحاليا اختفت الايقونة واصبح التسجيل يتم من خلال طريقة أخرى بعكس ماكان يشرح للعملاء ضمن الأدلة القديمة$$, $$تحليلي$$, $$تحسيني$$, $$متوسطة$$, $$تحت الإجراء$$, $$شركة علم$$, '2026-04-25', NULL, NULL, (SELECT id FROM users WHERE full_name = $$عبدالله المالكي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0048', (SELECT id FROM services WHERE name = $$خدمة الاختبارات$$ LIMIT 1), $$Operation Support$$, $$بسبب عدم فعالية خاصية الإلغاء التلقائي للحجوزات غير المدفوعة بعد مرور المدة المحددة (أكثر من 3 ساعات، كما في المرفق)، مما أدى إلى حضور المتقدمين للمقر وإرباك سير العمل 
وتعطيل الموظفين من القيام بمهامهم. فنأمل معالجة هذه المشكلة في أسرع وقت ممكن$$, $$تشغيلي$$, $$غير عائق$$, $$عالية$$, $$تحت الإجراء$$, $$شركة علم$$, '2026-04-25', NULL, NULL, (SELECT id FROM users WHERE full_name = $$عبدالله المالكي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0049', (SELECT id FROM services WHERE name = $$خدمة الاختبارات$$ LIMIT 1), $$Operation Support$$, $$تعديل الايقونات في شاشة قائمة الاختبارات خيار قيد الجدولة لافائدة منه واضافة خيار يوضح في حال كان بانتظار الدفع واضافة خيار يوضح في حال تم الرسوب$$, $$تشغيلي$$, $$غير عائق$$, $$متوسطة$$, $$تحت الإجراء$$, $$شركة علم$$, '2026-04-25', NULL, NULL, (SELECT id FROM users WHERE full_name = $$عبدالله المالكي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0050', (SELECT id FROM services WHERE name = $$خدمة الاختبارات$$ LIMIT 1), $$Operation Support$$, $$اعادة الجدولة تتم مرة واحدة فقط$$, $$تشغيلي$$, $$غير عائق$$, $$متوسطة$$, $$تحت الإجراء$$, $$شركة علم$$, '2026-04-25', NULL, NULL, (SELECT id FROM users WHERE full_name = $$عبدالله المالكي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0051', (SELECT id FROM services WHERE name = $$خدمة الاختبارات$$ LIMIT 1), $$Operation Support$$, $$لايتم اغلاق المركز لفترة الاجازة دفعه واحدة بل يتم اغلاق كل يوم بشكل منفرد  كما أن القاعات تقبل أكثر من العدد المحدد$$, $$تشغيلي$$, $$غير عائق$$, $$متوسطة$$, $$تحت الإجراء$$, $$شركة علم$$, '2026-04-25', NULL, NULL, (SELECT id FROM users WHERE full_name = $$عبدالله المالكي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0052', (SELECT id FROM services WHERE name = $$خدمة الاختبارات$$ LIMIT 1), $$Operation Support$$, $$منح موظفي مركز الاختبار الابلاغ عن التغيب في أي وقت يوم الاختبار والمنصة حاليا تقيد الابلاغ إلى مابعد 12 مساء$$, $$تشغيلي$$, $$تحسيني$$, $$منخفضة$$, $$جديدة$$, $$شركة علم$$, '2026-04-25', NULL, NULL, (SELECT id FROM users WHERE full_name = $$عبدالله المالكي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0053', (SELECT id FROM services WHERE name = $$خدمة الاختبارات$$ LIMIT 1), $$Operation Support$$, $$في حال تغيب العميل عن الاختبار لايتم اصدار فاتوره مرة أخرى ويستطيع الجدولة بدون فاتورة مهما كان العذر (في حال كان لديه عذر طبي يحجز مباشرة وفي حال تغيبه بدون عذر  يتم منعه
 من الحجز 5 أيام أو 2 بحسب مايقرر مركز الاختبار ويوجد رأي قانوني يمنع أخذ مقابل مادي من العميل لأي سبب$$, $$تشغيلي$$, $$عائق تشغيل$$, $$حرجة$$, $$تحت الإجراء$$, $$شركة علم$$, '2026-04-25', NULL, NULL, (SELECT id FROM users WHERE full_name = $$عبدالله المالكي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0054', (SELECT id FROM services WHERE name = $$تسجيل الجهات$$ LIMIT 1), $$Operation Support$$, $$لايوجد لدينا أدلة كافيه للعملاء لمشاركتهم عند فتح الحسابات للخدمات تقدم إلى الجهات وهذه الملاحظة مطلوبة من الجودة وتجربة المسافر ومن الحكومة الرقمية حيث تردنا طلبات عدة بضرورة توفير دليل باللغة العربية والانجلزية لكل خدمة وكل عملية$$, $$تشغيلي$$, $$تحسيني$$, $$حرجة$$, $$تحت الإجراء$$, $$شركة علم$$, '2026-04-25', NULL, NULL, (SELECT id FROM users WHERE full_name = $$عبدالله المالكي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0055', (SELECT id FROM services WHERE name = $$الاتفاقيات الثنائية$$ LIMIT 1), $$Operation Support$$, $$نقل جميع الاتفاقيات الثنائية من الشير بوينت إلى المنصة وافاد الزميل عبدالعزيز بردي أنه قام بطلب ذلك الاجراء من فريق علم$$, $$تشغيلي$$, $$عائق تشغيل$$, $$عالية$$, $$تحت الإجراء$$, $$شركة علم$$, '2026-04-25', NULL, NULL, (SELECT id FROM users WHERE full_name = $$عبدالله المالكي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0056', (SELECT id FROM services WHERE name = $$بطاقة عضو طاقم$$ LIMIT 1), $$Operation Support$$, $$مشكلة في اختفاء خطاب التفويض عند استعراض الطلب من مالك الخدمة ( جانب الموظفين ) بالرغم من تأكيد مقدم الطلب أنه قام بارفاقه ( غالبا تظهر المشكلة مع الخطوط )$$, $$تشغيلي$$, $$غير عائق$$, $$متوسطة$$, $$مغلقة$$, $$شركة علم$$, '2026-04-25', NULL, NULL, (SELECT id FROM users WHERE full_name = $$عبدالله المالكي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0057', (SELECT id FROM services WHERE name = $$بطاقة عضو طاقم$$ LIMIT 1), $$Operation Support$$, $$"هناك تنظيمات جديدة تم نشرها على موقع الهيئة توضح أنه يمكن للعملاء تجديد بطاقة عضو الطاقم حتى قبل انتهاء الرخصة المرتبطه بها ولو بيوم واحد وهذا الاجراء يحل تحديات كثيره 
تمنع العملاء حاليا من تجديد الرخصة "


طلبنا مالك الخدمة بتزويدنا بجميع الاجراءات المطلوبة تعديلها وفقا للتنظيمات الجديدة ولم يتم تزويدنا بها$$, $$تشغيلي$$, $$عائق تشغيل$$, $$عالية$$, $$جديدة$$, $$الهيئة$$, '2026-04-25', NULL, NULL, (SELECT id FROM users WHERE full_name = $$عبدالله المالكي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0058', (SELECT id FROM services WHERE name = $$الخدمات الداعمة للرخص$$ LIMIT 1), $$Operation Support$$, $$اضافة باركود على خطاب التحقق من الرخصة السعودية يمكن الجهة المستقبلة لهذا الخطاب من مسحه للتحقق من صحته بشكل الكتروني عبر مسح الباركود والانتقال للبوابة واستعراض الشهادة$$, $$تشغيلي$$, $$غير عائق$$, $$عالية$$, $$تحت الإجراء$$, $$شركة علم$$, '2026-04-25', NULL, NULL, (SELECT id FROM users WHERE full_name = $$عبدالله المالكي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0059', (SELECT id FROM services WHERE name = $$الاتفاقيات الثنائية$$ LIMIT 1), $$BA$$, $$تم تحديث BRS  والتوقيع عليه والمطلوب عكس الملاحظات للبدء باستخدام الخدمة المطلقة منذ ستة شهور$$, $$تشغيلي$$, $$عائق تشغيل$$, $$حرجة$$, $$تحت الإجراء$$, $$شركة علم$$, '2026-04-25', NULL, NULL, (SELECT id FROM users WHERE full_name = $$عبدالله المالكي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0060', (SELECT id FROM services WHERE name = $$خدمة امر المهام الجوية العسكرية$$ LIMIT 1), $$Operation Support$$, $$مالك الخدمة لم يقوم بافادتنا بالملاحظات حيث أنها خدمة لاتستخدم كثيرا وبدا باختبار الخدمات الاخرى$$, $$تشغيلي$$, $$غير عائق$$, $$متوسطة$$, $$تحت الإجراء$$, $$الهيئة$$, '2026-04-25', NULL, NULL, (SELECT id FROM users WHERE full_name = $$عبدالله المالكي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0061', (SELECT id FROM services WHERE name = $$خدمة المسح الأمني$$ LIMIT 1), $$Operation Support$$, $$أن يتاح لمالك الخدمة رفع نتيجة عميل واحد فقط في حال الحاجة بدون الحاجة لتسجيل البيانات في ملف Excel$$, $$تشغيلي$$, $$غير عائق$$, $$منخفضة$$, $$تحت الإجراء$$, $$شركة علم$$, '2026-04-25', NULL, NULL, (SELECT id FROM users WHERE full_name = $$عبدالله المالكي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0062', (SELECT id FROM services WHERE name = $$خدمة المسح الأمني$$ LIMIT 1), $$Operation Support$$, $$تعديل النموذج الخاص بنتائج المسح الأمني ( موقع رقم الهوية ينقل إلى موقع الاسم والعكس )$$, $$تشغيلي$$, $$غير عائق$$, $$متوسطة$$, $$مغلقة$$, $$شركة علم$$, '2026-04-25', NULL, NULL, (SELECT id FROM users WHERE full_name = $$عبدالله المالكي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0063', (SELECT id FROM services WHERE name = $$خدمة المسح الأمني$$ LIMIT 1), $$Operation Support$$, $$داخل أيقونة المسح الأمني يتم فصل أنواع طلبات المسح الأمني بحيث تكون بحسب أنواع الخدمات مثل الدرون
 ورخصة طيار وغيرها 
ويتم سحب ورفع الطلب من داخل أيقونة الخدمة ، لأن الوضع الحالي قد يتم حدوث أخطاء فيه بحيث يتم الموافقة 
على طلبين لخدمتين منفصلة بطلب مسح أمني واحد 
وهذا مخالف للأنظمة"$$, $$تشغيلي$$, $$عائق تشغيل$$, $$عالية$$, $$مغلقة$$, $$شركة علم$$, '2026-04-25', NULL, NULL, (SELECT id FROM users WHERE full_name = $$عبدالله المالكي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0064', (SELECT id FROM services WHERE name = $$رخصة مضيف جوي$$ LIMIT 1), $$Operation Support$$, $$عند تجديد الرخصة ومتبقي من الرخصة السابقه على سبيل المثال شهرين فإنه لايتم احتسابها$$, $$تشغيلي$$, $$عائق تشغيل$$, $$عالية$$, $$تحت الإجراء$$, $$شركة علم$$, '2026-04-25', NULL, NULL, (SELECT id FROM users WHERE full_name = $$عبدالله المالكي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0065', (SELECT id FROM services WHERE name = $$رخصة مضيف جوي$$ LIMIT 1), $$Operation Support$$, $$في طلبات تجديد الرخصة تحدث مشكلة تقنية في بعض الرخص تاريخ اليوم ينتقل إلى مكان الشهر والعكس$$, $$تشغيلي$$, $$غير عائق$$, $$متوسطة$$, $$تحت الإجراء$$, $$شركة علم$$, '2026-04-25', NULL, NULL, (SELECT id FROM users WHERE full_name = $$عبدالله المالكي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0066', (SELECT id FROM services WHERE name = $$رخصة مضيف جوي$$ LIMIT 1), $$Operation Support$$, $$شعار الهيئة الجديد لم يتم تحديثه على الرخص$$, $$تشغيلي$$, $$غير عائق$$, $$عالية$$, $$تحت الإجراء$$, $$شركة علم$$, '2026-04-25', NULL, NULL, (SELECT id FROM users WHERE full_name = $$عبدالله المالكي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0067', (SELECT id FROM services WHERE name = $$بطاقة عضو طاقم$$ LIMIT 1), $$Operation Support$$, $$عكس شعار الهيئة الجديد على الرخص$$, $$تشغيلي$$, $$غير عائق$$, $$عالية$$, $$تحت الإجراء$$, $$شركة علم$$, '2026-04-25', NULL, NULL, (SELECT id FROM users WHERE full_name = $$عبدالله المالكي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0068', (SELECT id FROM services WHERE name = $$خدمة ترخيص اقتصادي لوكيل تجاري لمقدم خدمات الطيران$$ LIMIT 1), $$Operation Support$$, $$عدم مقدرة الشركات المرخصة والحاصلة على الترخيص الاقتصادي لوكيل تجاري لمقدم خدمات الطيران من التقديم على الترخيص الاقتصادي لمزود خدمات عدم الطيران العام$$, $$تشغيلي$$, $$عائق تشغيل$$, $$عالية$$, $$مغلقة$$, $$شركة علم$$, '2026-04-26', NULL, NULL, (SELECT id FROM users WHERE full_name = $$محمد خلف الغامدي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0069', (SELECT id FROM services WHERE name = $$خدمة ترخيص اقتصادي لوكيل تجاري لمقدم خدمات الطيران$$ LIMIT 1), $$Operation Support$$, $$لم يتم تطبيق التسلسل الإداري حسب الصلاحيات في مسار المعاملات ( موظف التراخيص - رئيس القسم -- مدير الإدارة - المدير العام)$$, $$تشغيلي$$, $$عائق تشغيل$$, $$عالية$$, $$جديدة$$, $$شركة علم$$, '2026-04-26', NULL, NULL, (SELECT id FROM users WHERE full_name = $$محمد خلف الغامدي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0070', (SELECT id FROM services WHERE name = $$خدمة ترخيص اقتصادي لوكيل تجاري لمقدم خدمات الطيران$$ LIMIT 1), $$Operation Support$$, $$تاريخ انتهاء التصريح لا يكون بنفس تاريخ الاصدار


انتهاء تاريخ التصريح يكون قبل يوم من تاريخ الاصدار ماقبل 5 سنوات , مثال : بداية التصريح 7 / 8 / 1447 , الانتهاء : 6 / 8 / 1452$$, $$تشغيلي$$, $$عائق تشغيل$$, $$عالية$$, $$جديدة$$, $$شركة علم$$, '2026-04-26', NULL, NULL, (SELECT id FROM users WHERE full_name = $$محمد خلف الغامدي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0071', (SELECT id FROM services WHERE name = $$خدمة ترخيص اقتصادي لوكيل تجاري لمقدم خدمات الطيران$$ LIMIT 1), $$Operation Support$$, $$التاريخ يكون 5 سنوات هجرية بالضبط$$, $$تشغيلي$$, $$عائق تشغيل$$, $$عالية$$, $$جديدة$$, $$شركة علم$$, '2026-04-26', NULL, NULL, (SELECT id FROM users WHERE full_name = $$محمد خلف الغامدي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0072', (SELECT id FROM services WHERE name = $$خدمة ترخيص اقتصادي لخدمات المناولة الأرضية$$ LIMIT 1), $$Operation Support$$, $$عند تقديم الطلب للترخيص الأساسي يظهر للمستفيد خيار الرخص للترخيص المؤقت وبناءً على الرخصة المؤقتة الممنوحة للشركة تعكس فئات الخدمات والمطارات ولا يمكن للمستفيد تحديد فئات الخدمات والمطارات بمعنى انه يوجد خانات الزامية تظهر للمستفيد كالمطارات وعددها 3 مطارات بينما يحتاج المستفيد الى وضع خانه واحده فقط وجعل البقية اختياريه ( اضافه ) حيث ان الوضع الحالي يتطلب اضافة 3 مطارات الزامية$$, $$تشغيلي$$, $$عائق تشغيل$$, $$عالية$$, $$جديدة$$, $$شركة علم$$, '2026-04-26', NULL, NULL, (SELECT id FROM users WHERE full_name = $$محمد خلف الغامدي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0073', (SELECT id FROM services WHERE name = $$خدمة ترخيص اقتصادي لخدمات المناولة الأرضية$$ LIMIT 1), $$Operation Support$$, $$"عند تقديم طلب ترخيص مقدمي خدمات شحن الجوي يظهر للمستفيد من خيار فئات الخدمات (خدمات الشاحن المعتمد والشاحن المعتمد الذاتي)
كما يظهر للمستفيد خيار يتضمن (خدمات الشحن الجوي-خدمات وسيط الشحن-خدمات الشحن السريع) بشكل مجمع"$$, $$تشغيلي$$, $$عائق تشغيل$$, $$عالية$$, $$جديدة$$, $$شركة علم$$, '2026-04-26', NULL, NULL, (SELECT id FROM users WHERE full_name = $$محمد خلف الغامدي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0074', (SELECT id FROM services WHERE name = $$خدمة ترخيص اقتصادي لخدمات المناولة الأرضية$$ LIMIT 1), $$Operation Support$$, $$عند تقديم طلب إيقاف الرخصة من قبل المستفيد، تظهر قائمة تتضمن بعض الخيارات لتحديد سبب تعليق الرخصة.$$, $$تشغيلي$$, $$عائق تشغيل$$, $$عالية$$, $$جديدة$$, $$شركة علم$$, '2026-04-26', NULL, NULL, (SELECT id FROM users WHERE full_name = $$محمد خلف الغامدي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0075', (SELECT id FROM services WHERE name = $$خدمة ترخيص اقتصادي لخدمات المناولة الأرضية$$ LIMIT 1), $$Operation Support$$, $$تظهر خانة مطارات الزامية عند التقديم على الرخصة$$, $$تشغيلي$$, $$عائق تشغيل$$, $$عالية$$, $$مغلقة$$, $$شركة علم$$, '2026-04-26', NULL, NULL, (SELECT id FROM users WHERE full_name = $$محمد خلف الغامدي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0076', (SELECT id FROM services WHERE name = $$خدمة ترخيص اقتصادي لوكيل تجاري لمقدم خدمات الطيران$$ LIMIT 1), $$Operation Support$$, $$مشكلة في قالب الترخيص في وضع الصفحة بالطول


يتطلب تغيير القالب الى ان يكون بالعرض وليس بالطول$$, $$تشغيلي$$, $$عائق تشغيل$$, $$عالية$$, $$جديدة$$, $$شركة علم$$, '2026-04-26', NULL, NULL, (SELECT id FROM users WHERE full_name = $$محمد خلف الغامدي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0077', (SELECT id FROM services WHERE name = $$خدمة ترخيص اقتصادي لوكيل تجاري لمقدم خدمات الطيران$$ LIMIT 1), $$Operation Support$$, $$مشكلة في القالب اللغه العربية والانجليزي


يتطلب التعديل بحيث يكون العربي في الجهة اليمنى والانجليزي في الجهة اليسرى$$, $$تشغيلي$$, $$عائق تشغيل$$, $$عالية$$, $$جديدة$$, $$شركة علم$$, '2026-04-26', NULL, NULL, (SELECT id FROM users WHERE full_name = $$محمد خلف الغامدي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0078', (SELECT id FROM services WHERE name = $$خدمة ترخيص اقتصادي لوكيل تجاري لمقدم خدمات الطيران$$ LIMIT 1), $$Operation Support$$, $$قالب السجل التجاري يحتاج الى تعديل 


قالب السجل التجاري يكون مرتبط بعنوان السجل حيث انه اسفل القالب يوحد خدمة أخرى لا تنطبق مع عنوان السجل$$, $$تشغيلي$$, $$عائق تشغيل$$, $$عالية$$, $$جديدة$$, $$شركة علم$$, '2026-04-26', NULL, NULL, (SELECT id FROM users WHERE full_name = $$محمد خلف الغامدي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0079', (SELECT id FROM services WHERE name = $$خدمة ترخيص اقتصادي لوكيل تجاري لمقدم خدمات الطيران$$ LIMIT 1), $$Operation Support$$, $$مشكلة في ربط السجل التجاري بالخدمات


 الخدمات الموجوده في المنصة لابد ان تظهر لطالب الخدمة مثل التي معطاه في السجل التجاري , مثال : شركه حصلت على موافقة تقديم خدمتين في مطار واحد , لابد ان تظهر الخدمتين فقط واختيار المطار المراد او اماكنية تحديد خانة اختيار الخدمات من مجموعة الخدمات , الحالي يعطى اجباري جميع الخدمات$$, $$تشغيلي$$, $$عائق تشغيل$$, $$عالية$$, $$جديدة$$, $$شركة علم$$, '2026-04-26', NULL, NULL, (SELECT id FROM users WHERE full_name = $$محمد خلف الغامدي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0080', (SELECT id FROM services WHERE name = $$خدمة ترخيص اقتصادي لوكيل تجاري لمقدم خدمات الطيران$$ LIMIT 1), $$Operation Support$$, $$التواريخ الموجوده في الترخيص تصدر بالميلادي بينما المطلوب يكون التاريخ بالعربي


تعديل التواريخ الى ان تكون بالعربي وليس بالميلادي والتنويه بانه يوجد فرق شهرين بالعربي عن التاريخ الانجليزي$$, $$تشغيلي$$, $$عائق تشغيل$$, $$عالية$$, $$جديدة$$, $$شركة علم$$, '2026-04-26', NULL, NULL, (SELECT id FROM users WHERE full_name = $$محمد خلف الغامدي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0081', (SELECT id FROM services WHERE name = $$خدمة ترخيص اقتصادي لخدمات المناولة الأرضية$$ LIMIT 1), $$Operation Support$$, $$لم يتم تحديث قوالب التراخيص الاقتصادية لمقدمي خدمات المناولة الأرضية والشحن الجوي.


يتم تحديث قوالب التراخيص الاقتصادية لكل من:
•	ترخيص اقتصادي لمقدمي خدمات المناولة الأرضية (طيران تجاري).
•	ترخيص اقتصادي لمقدمي خدمات المناولة الأرضية (طيران عام).
•	ترخيص مؤقت لمقدمي خدمات المناولة الأرضية (طيران تجاري).
•	ترخيص مؤقت لمقدمي خدمات المناولة الأرضية (طيران عام).
•	ترخيص اقتصادي لمقدمي خدمات الشحن الجوي.
•	ترخيص مؤقت لمقدمي خدمات$$, $$تشغيلي$$, $$عائق تشغيل$$, $$عالية$$, $$جديدة$$, $$شركة علم$$, '2026-04-26', NULL, NULL, (SELECT id FROM users WHERE full_name = $$محمد خلف الغامدي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0082', (SELECT id FROM services WHERE name = $$خدمة ترخيص اقتصادي لمزود خدمات دعم الطيران العام$$ LIMIT 1), $$Operation Support$$, $$في حال تحديد نوع الشركة أثناء التسجيل في المنصة (خدمات أرضية أو وكيل تجاري أو مزود خدمة) لا يمكنهم تقديم الطلب إلا على الأنشطة ذات العلاقة بالنوع الذي تم تحديده، ولا تظهر لهم الأنشطة الاقتصادية الأخرى للتقديم عليها. الأمر الذي تسبب بحصول إشكالية لدى احدى الشركات الراغبة في الحصول على نشاط مزود خدمات دعم الطيران العام (شركة برايم) حيث لم يظهر لهم نشاط مزود خدمات دعم الطيران العام بسبب تم تحديد نوع الشركة كمقدم خدمات أرضية.$$, $$تشغيلي$$, $$عائق تشغيل$$, $$عالية$$, $$جديدة$$, $$شركة علم$$, '2026-04-26', NULL, NULL, (SELECT id FROM users WHERE full_name = $$محمد خلف الغامدي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0083', (SELECT id FROM services WHERE name = $$خدمة ترخيص اقتصادي لمزود خدمات دعم الطيران العام$$ LIMIT 1), $$Operation Support$$, $$عدم إمكانية ارجاع المعاملة للموظف عند وصولها الى المدير العام$$, $$تشغيلي$$, $$عائق تشغيل$$, $$عالية$$, $$جديدة$$, $$شركة علم$$, '2026-04-26', NULL, NULL, (SELECT id FROM users WHERE full_name = $$محمد خلف الغامدي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0084', (SELECT id FROM services WHERE name = $$خدمة ترخيص اقتصادي لمزود خدمات دعم الطيران العام$$ LIMIT 1), $$Operation Support$$, $$يوجد في النظام خاصية (إصدار فاتورة) حيث يمكن للمستخدم إصدار فاتورة لأي نشاط اقتصادي دون المرور بمراحل الطلب ، حيث يتم إصدار الفاتورة كعرض سعر ويقوم المستخدم بالسداد دون تقديم طلب الحصول على الترخيص، الأمر الذي تسبب بحصول إشكالية لدى احدى الشركات (شركة طيارتكم)$$, $$تشغيلي$$, $$عائق تشغيل$$, $$عالية$$, $$جديدة$$, $$شركة علم$$, '2026-04-26', NULL, NULL, (SELECT id FROM users WHERE full_name = $$محمد خلف الغامدي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0085', (SELECT id FROM services WHERE name = $$خدمه الموافقة على تعديل منتجات معلومات الطيران$$ LIMIT 1), $$Operation Support$$, $$عند اختيار تغيير معلومات في بعض الحقول مثل "airspace change" لا يتم قبول الطلب لأنه يستوجب موافقة سابقة ولكن هذا الشرط من المفروض يكون على موظف الهيئة قبل قبول الطلب وليس على مستوى مقدم الطلب.$$, $$تشغيلي$$, $$غير عائق$$, $$عالية$$, $$جديدة$$, $$شركة علم$$, '2026-04-26', NULL, NULL, (SELECT id FROM users WHERE full_name = $$أنس سبهاني$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0086', (SELECT id FROM services WHERE name = $$خدمه الموافقة على تعديل منتجات معلومات الطيران$$ LIMIT 1), $$Operation Support$$, $$إضافة إمكانية ارفاق صيغة الملفات التالية زيادة الى  Excel, zip , PDF , Word, Pdf$$, $$تشغيلي$$, $$غير عائق$$, $$عالية$$, $$جديدة$$, $$شركة علم$$, '2026-04-26', NULL, NULL, (SELECT id FROM users WHERE full_name = $$أنس سبهاني$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0087', (SELECT id FROM services WHERE name = $$خدمة الموافقة على تصميم إجراءات الطيران الآلي$$ LIMIT 1), $$Operation Support$$, $$Airports List should be ICAO List (Attached in BRS Ver0.5)
لا يمكن انشاء الطلب تظهر رساله " ان مقدم خدمه تصميم إجراءات الطيران غير مرخص من الهيئه " علما ان المستفيد مضاف الي شركة الملاحه الجويه$$, $$تشغيلي$$, $$عائق تشغيل$$, $$عالية$$, $$مغلقة$$, $$شركة علم$$, '2026-04-26', NULL, NULL, (SELECT id FROM users WHERE full_name = $$أنس سبهاني$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0088', (SELECT id FROM services WHERE name = $$خدمة الموافقة على تصميم إجراءات الطيران الآلي$$ LIMIT 1), $$Operation Support$$, $$"لا يمكن رفع طلب
الخطأ أن الشركة غير مرخصة
يجب إضافة شركة ""سمانا SAMANA SM"" كمقدم خدمة تقييم إجراءات الطيران مرخصة من الهيئة ورقم الشهادة ANSC-003 (مرفق نسخة)
"$$, $$تشغيلي$$, $$عائق تشغيل$$, $$عالية$$, $$مغلقة$$, $$شركة علم$$, '2026-04-26', NULL, NULL, (SELECT id FROM users WHERE full_name = $$أنس سبهاني$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0089', (SELECT id FROM services WHERE name = $$خدمة الموافقة على تصميم إجراءات الطيران الآلي$$ LIMIT 1), $$Operation Support$$, $$إضافة إمكانية ارفاق صيغة الملفات التالية زيادة الى doc.docx.pdf.csv.xls.xlsx.ppt. pptx..bmp.jpg.png.tif.zip.rar$$, $$تشغيلي$$, $$عائق تشغيل$$, $$عالية$$, $$مغلقة$$, $$شركة علم$$, '2026-04-26', NULL, NULL, (SELECT id FROM users WHERE full_name = $$أنس سبهاني$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0090', (SELECT id FROM services WHERE name = $$خدمة الموافقة على تغييرالمجال الجوي$$ LIMIT 1), $$Operation Support$$, $$الملاحظات حول "طلب تفعيل منطقة PRD المنشورة" (التفاصيل تم مشاركتها ملف الورد )$$, $$تشغيلي$$, $$عائق تشغيل$$, $$عالية$$, $$مغلقة$$, $$شركة علم$$, '2026-04-26', NULL, NULL, (SELECT id FROM users WHERE full_name = $$أنس سبهاني$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0091', (SELECT id FROM services WHERE name = $$خدمة الموافقة على تغييرالمجال الجوي$$ LIMIT 1), $$Operation Support$$, $$ملاحظات حول "استحداث او تعديل مجال جوي حسب اللوائح التنفيذية"  (التفاصيل تم مشاركتها ملف الورد )$$, $$تشغيلي$$, $$عائق تشغيل$$, $$عالية$$, $$مغلقة$$, $$شركة علم$$, '2026-04-26', NULL, NULL, (SELECT id FROM users WHERE full_name = $$أنس سبهاني$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0092', (SELECT id FROM services WHERE name = $$خدمة قبول تقديم المساح الجوي$$ LIMIT 1), $$Operation Support$$, $$"صيغة ملف منهجية المسح يجب ان تكون :
.doc.docx.pdf.csv.xls.xlsx.ppt. pptx..bmp.jpg.png.tif.zip.rar
صيغة ملف قائمة المعدات يجب ان تكون :
.doc.docx.pdf.csv.xls.xlsx.ppt. pptx..bmp.jpg.png.tif.zip.rar
صيغة ملف جودة التحكم يجب ان تكون :
.doc.docx.pdf.csv.xls.xlsx.ppt. pptx..bmp.jpg.png.tif.zip.rar
صيغة ملف الشهادة يجب ان تكون : 
.doc.docx.pdf.csv.xls.xlsx.ppt. pptx..bmp.jpg.png.tif.zip.rar
صيغة ملف جميع المرفقات يجب ان تكون :
.doc.docx.pdf.csv.xls.xlsx.ppt. pptx..bmp.jpg.png.tif.zip.rar
"$$, $$تشغيلي$$, $$غير عائق$$, $$عالية$$, $$جديدة$$, $$شركة علم$$, '2026-04-26', NULL, NULL, (SELECT id FROM users WHERE full_name = $$أنس سبهاني$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0093', (SELECT id FROM services WHERE name = $$خدمة قبول تقديم المساح الجوي$$ LIMIT 1), $$Operation Support$$, $$"أسماء المطارات يجب ان تكون 4 أحرف حسب تصنيف الايكاو مثلا
OEAB - ABHA
OEDF - DAMMAM 
OEJN – JEDDAH
"$$, $$تشغيلي$$, $$عائق تشغيل$$, $$عالية$$, $$مغلقة$$, $$شركة علم$$, '2026-04-26', NULL, NULL, (SELECT id FROM users WHERE full_name = $$أنس سبهاني$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0094', (SELECT id FROM services WHERE name = $$خدمه مهندس جوي$$ LIMIT 1), $$Operation Support$$, $$لم يتم نقل البيانات بشكل صحيح$$, $$نقل البيانات$$, $$عائق تشغيل$$, $$عالية$$, $$جديدة$$, $$شركة علم$$, '2026-04-26', NULL, NULL, (SELECT id FROM users WHERE full_name = $$أنس سبهاني$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0096', (SELECT id FROM services WHERE name = $$خدمة ترخيص اقتصادي لناقل جوي وطني$$ LIMIT 1), $$Operation Support$$, $$خانات empty  موجودة في النظام ( حذفها )$$, $$تشغيلي$$, $$عائق تشغيل$$, $$منخفضة$$, $$جديدة$$, $$شركة علم$$, '2026-04-26', NULL, NULL, (SELECT id FROM users WHERE full_name = $$محمد خلف الغامدي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0097', (SELECT id FROM services WHERE name = $$خدمة ترخيص اقتصادي لناقل جوي وطني$$ LIMIT 1), $$Operation Support$$, $$لا يوجد نوع النشاط مما يصعب اكمال التسجيل$$, $$تشغيلي$$, $$عائق تشغيل$$, $$حرجة$$, $$جديدة$$, $$شركة علم$$, '2026-04-26', NULL, NULL, (SELECT id FROM users WHERE full_name = $$محمد خلف الغامدي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0098', (SELECT id FROM services WHERE name = $$خدمة ترخيص اقتصادي لخدمات المناولة الأرضية$$ LIMIT 1), $$Operation Support$$, $$لا يوجد نوع النشاط وفئات الخدمات مما يصعب اكمال الطلب$$, $$تشغيلي$$, $$عائق تشغيل$$, $$حرجة$$, $$جديدة$$, $$شركة علم$$, '2026-04-26', NULL, NULL, (SELECT id FROM users WHERE full_name = $$محمد خلف الغامدي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0099', (SELECT id FROM services WHERE name = $$خدمة ترخيص اقتصادي لوكيل تجاري لمقدم خدمات الطيران$$ LIMIT 1), $$Operation Support$$, $$خانة رقم المبنى يظهر فيها خطا يفضل عملها يدويا مما يعيق تقديم الطلب$$, $$تشغيلي$$, $$عائق تشغيل$$, $$حرجة$$, $$جديدة$$, $$شركة علم$$, '2026-04-26', NULL, NULL, (SELECT id FROM users WHERE full_name = $$محمد خلف الغامدي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0100', (SELECT id FROM services WHERE name = $$خدمة ترخيص اقتصادي لمزود خدمات دعم الطيران العام$$ LIMIT 1), $$Operation Support$$, $$خانة رقم المبنى يظهر فيها خطا يفضل عملها يدويا مما يعيق تقديم الطلب$$, $$تشغيلي$$, $$عائق تشغيل$$, $$حرجة$$, $$جديدة$$, $$شركة علم$$, '2026-04-26', NULL, NULL, (SELECT id FROM users WHERE full_name = $$محمد خلف الغامدي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0101', (SELECT id FROM services WHERE name = $$خدمة ترخيص اقتصادي لخدمات المناولة الأرضية$$ LIMIT 1), $$Operation Support$$, $$بيانات العنوان الوطني لايمكن كتابة اي مدخل$$, $$تشغيلي$$, $$عائق تشغيل$$, $$حرجة$$, $$جديدة$$, $$شركة علم$$, '2026-04-26', NULL, NULL, (SELECT id FROM users WHERE full_name = $$محمد خلف الغامدي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0102', (SELECT id FROM services WHERE name = $$رخصة طيار$$ LIMIT 1), $$Operation Support$$, $$يجب نقل بيانات جميع أنواع الرخص بشكل دوري من برنامج ال ALS$$, $$نقل البيانات$$, $$تحسيني$$, $$عالية$$, $$تحت الإجراء$$, $$شركة علم$$, '2026-04-26', NULL, NULL, (SELECT id FROM users WHERE full_name = $$عبدالله المالكي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0103', (SELECT id FROM services WHERE name = $$رخصة طيار$$ LIMIT 1), $$Operation Support$$, $$طلبات الشركات المعفية من المفترض أن لايتم طلب مسح أمني لها مثل باقي الطلبات بحيث يتم إيجاد حل لمشكلة خدمة المسح الأمني مثال تكون للإدارة المسؤولة صلاحيّة تجاوز الطلب بدون الحاجة إلى قبول الطلب$$, $$تشغيلي$$, $$غير عائق$$, $$عالية$$, $$تحت الإجراء$$, $$شركة علم$$, '2026-04-26', NULL, NULL, (SELECT id FROM users WHERE full_name = $$عبدالله المالكي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0104', (SELECT id FROM services WHERE name = $$بطاقة عضو طاقم$$ LIMIT 1), $$Operation Support$$, $$طلبات الشركات المعفية من المفترض أن لايتم طلب مسح أمني لها مثل باقي الطلبات بحيث يتم إيجاد حل لمشكلة خدمة المسح الأمني مثال تكون للإدارة المسؤولة صلاحيّة تجاوز الطلب بدون الحاجة إلى قبول الطلب لازالت المشكلة قائمة في طلبات بطاقة عضو طاقم 
مع ملاحظة أن الاجراء يقتصر على الملاحين فقط بحسب قرار الاستثناء وليس لجميع أنواع الطلبات$$, $$تشغيلي$$, $$غير عائق$$, $$عالية$$, $$تحت الإجراء$$, $$شركة علم$$, '2026-04-26', NULL, NULL, (SELECT id FROM users WHERE full_name = $$عبدالله المالكي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0105', (SELECT id FROM services WHERE name = $$رخصة طيار$$ LIMIT 1), $$Operation Support$$, $$"في خدمة التحقق من الرخصة الأجنبية:
• عند إدخال البريد الإلكتروني، يجب أن يتم الإرسال مباشرة إلى الدولة المختارة.
• لا يتم الاعتماد على البريد الإلكتروني المُدخل في الطلب.
• يتم الاعتماد على حقل الدولة (Country)
• يمكن الإرسال لأكثر من بريد الكتروني في حال كانت جميعها مرتبطة بنفس الدولة"$$, $$تشغيلي$$, $$عائق تشغيل$$, $$عالية$$, $$تحت الإجراء$$, $$شركة علم$$, '2026-04-26', NULL, NULL, (SELECT id FROM users WHERE full_name = $$عبدالله المالكي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0106', (SELECT id FROM services WHERE name = $$رخصة طيار$$ LIMIT 1), $$Operation Support$$, $$في نموذج تقديم طلب رخصة الطيار مرفق اختبار المعرفة يكون في قسم مستقل، وليس مدمجًا مع قسم اللغة الإنجليزية ELP$$, $$تشغيلي$$, $$غير عائق$$, $$عالية$$, $$مغلقة$$, $$شركة علم$$, '2026-04-26', NULL, NULL, (SELECT id FROM users WHERE full_name = $$عبدالله المالكي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0107', (SELECT id FROM services WHERE name = $$رخصة طيار$$ LIMIT 1), $$Operation Support$$, $$"في Certificate Management:
• يجب إظهار جميع الرخص والإصدارات وليس فقط آخر إصدار.
• يشمل ذلك الرخص لكافة أنواع الطلبات."$$, $$تشغيلي$$, $$غير عائق$$, $$عالية$$, $$تحت الإجراء$$, $$شركة علم$$, '2026-04-26', NULL, NULL, (SELECT id FROM users WHERE full_name = $$عبدالله المالكي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0108', (SELECT id FROM services WHERE name = $$رخصة طيار$$ LIMIT 1), $$Operation Support$$, $$يتمكن الموظف من الدخول إلى Certificate Management:
• اضافة خيار تمت الطباعة.
• يقوم الموظف بالنقر عليه
• ويظهر هذا التحديث داخليا لموظفين ادارة الرخص فقط.$$, $$تشغيلي$$, $$غير عائق$$, $$عالية$$, $$تحت الإجراء$$, $$شركة علم$$, '2026-04-26', NULL, NULL, (SELECT id FROM users WHERE full_name = $$عبدالله المالكي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0109', (SELECT id FROM services WHERE name = $$رخصة طيار$$ LIMIT 1), $$Operation Support$$, $$في حال ارجاع الطلب للمتقدم للتعديل لايمكنه التعديل على بعض الحقول المطلوبة للتعديل من قبل المفتش ويبقى الطلب معلق$$, $$تشغيلي$$, $$غير عائق$$, $$عالية$$, $$تحت الإجراء$$, $$شركة علم$$, '2026-04-26', NULL, NULL, (SELECT id FROM users WHERE full_name = $$عبدالله المالكي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0110', (SELECT id FROM services WHERE name = $$رخصة طيار$$ LIMIT 1), $$Operation Support$$, $$تمييز الرخصة التي تم طباعتها لمثثلي الجهات$$, $$تشغيلي$$, $$غير عائق$$, $$متوسطة$$, $$تحت الإجراء$$, $$شركة علم$$, '2026-04-26', NULL, NULL, (SELECT id FROM users WHERE full_name = $$عبدالله المالكي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0111', (SELECT id FROM services WHERE name = $$رخصة طيار$$ LIMIT 1), $$Operation Support$$, $$الاشعارات يجب أن تصل لممثل الشركة الذي قام برفع الطلب وليس للكابتن أو المضيف نفسه سواء للفواتير أو الاختبارات وغيرها$$, $$تشغيلي$$, $$غير عائق$$, $$متوسطة$$, $$تحت الإجراء$$, $$شركة علم$$, '2026-04-26', NULL, NULL, (SELECT id FROM users WHERE full_name = $$عبدالله المالكي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0112', (SELECT id FROM services WHERE name = $$خدمة الاختبارات$$ LIMIT 1), $$Operation Support$$, $$الجدولة حاليا تتم من خلال الكابتن نفسه بينما في السابق كان ممثل الجهة هو من يجدول وهذا انزعاج لدى ممثلي الجهات حيث يجب أن يقوم ممثل الجهة الذي رفع الطلب بالجدولة لترتيب الاجازات وجدولة الاختبارات وفقا لإمكانية الجهة بحسب ماكان سابقا$$, $$تشغيلي$$, $$غير عائق$$, $$عالية$$, $$تحت الإجراء$$, $$شركة علم$$, '2026-04-26', NULL, NULL, (SELECT id FROM users WHERE full_name = $$عبدالله المالكي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0113', (SELECT id FROM services WHERE name = $$رخصة طيار$$ LIMIT 1), $$Operation Support$$, $$مشاكل في الرخص من حيث انعكاس بياناتها خطأ كالاصدار فردي أو عن طريق جهة وكذلك في تواريخ الرخص وغيرها$$, $$تشغيلي$$, $$غير عائق$$, $$عالية$$, $$تحت الإجراء$$, $$شركة علم$$, '2026-04-26', NULL, NULL, (SELECT id FROM users WHERE full_name = $$عبدالله المالكي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0114', (SELECT id FROM services WHERE name = $$رخصة طيار$$ LIMIT 1), $$Operation Support$$, $$بناء على ملاحظة المراجعة الداخلية يجب أن تتم عملية استلام الرخص بطريقة موثقه كاستلام كود SMS  يصل لجوال العميل حين حضوره لاستلام رخصته وفي حال أكد ذلك تتغير حالتها لتم الطباعة والتسليم$$, $$تشغيلي$$, $$غير عائق$$, $$عالية$$, $$جديدة$$, $$شركة علم$$, '2026-04-26', NULL, NULL, (SELECT id FROM users WHERE full_name = $$عبدالله المالكي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0115', (SELECT id FROM services WHERE name = $$خدمة تقييم العوائق$$ LIMIT 1), $$Operation Support$$, $$غير مصرح لمنسوبين شركة الملاحه الجويه استخدام الخدمة$$, $$تشغيلي$$, $$عائق تشغيل$$, $$حرجة$$, $$جديدة$$, $$شركة علم$$, '2026-04-27', NULL, NULL, (SELECT id FROM users WHERE full_name = $$أنس سبهاني$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0116', (SELECT id FROM services WHERE name = $$تصريح طيران تجاري$$ LIMIT 1), $$Operation Support$$, $$السماح لشركة الطيران الغير مسجلة في المملكة و دون وكيل من تقديم طلب تصريح تجاري عبور$$, $$تشغيلي$$, $$غير عائق$$, $$عالية$$, $$تحت الإجراء$$, $$شركة علم$$, '2026-04-27', NULL, NULL, (SELECT id FROM users WHERE full_name = $$عبدالله المالكي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0117', (SELECT id FROM services WHERE name = $$تحديث تصريح طيران مفرد$$ LIMIT 1), $$Operation Support$$, $$تكرار حسابات الشركات (Agent & Air Operator) ، مما يؤثر على جودة البيانات ويعيق الشركات عن رفع الطلبات$$, $$تشغيلي$$, $$غير عائق$$, $$عالية$$, $$تحت الإجراء$$, $$شركة علم$$, '2026-04-27', NULL, NULL, (SELECT id FROM users WHERE full_name = $$عبدالله المالكي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0118', (SELECT id FROM services WHERE name = $$تحديث تصريح طيران مفرد$$ LIMIT 1), $$Operation Support$$, $$عند تحديث الربط بين الوكلاء والشركات الأجنبية، يجب أن ينعكس التحديث في نظام الفوترة عن طريق الربط الالكتروني - المرحلة الاولى$$, $$تشغيلي$$, $$غير عائق$$, $$عالية$$, $$تحت الإجراء$$, $$شركة علم$$, '2026-04-27', NULL, NULL, (SELECT id FROM users WHERE full_name = $$عبدالله المالكي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0119', (SELECT id FROM services WHERE name = $$خدمة تصريح رحلة طيران عام مفردة$$ LIMIT 1), $$Operation Support$$, $$مشاكل في الفواتير هناك شركات تتكرر لديها الفواتير وهناك شركات أخرى لاتظهر لها الفواتير بدون وجود سبب واضح والملاحظة مكررة$$, $$تشغيلي$$, $$غير عائق$$, $$عالية$$, $$تحت الإجراء$$, $$شركة علم$$, '2026-04-27', NULL, NULL, (SELECT id FROM users WHERE full_name = $$عبدالله المالكي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0120', (SELECT id FROM services WHERE name = $$خدمة تصريح رحلة طيران عام مفردة$$ LIMIT 1), $$Operation Support$$, $$إضافة المزيد من معلومات التواصل الخاصة بالعميل (البريد الإلكتروني، أرقام الهواتف ، اسم الشركة ) ويكون في عرض السعر كما هو في الفاتورة$$, $$تشغيلي$$, $$غير عائق$$, $$عالية$$, $$تحت الإجراء$$, $$شركة علم$$, '2026-04-27', NULL, NULL, (SELECT id FROM users WHERE full_name = $$عبدالله المالكي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0121', (SELECT id FROM services WHERE name = $$تحديث تصريح طيران مفرد$$ LIMIT 1), $$Operation Support$$, $$اضافة المطارات في حال عدم وجودها يتاخر كثيرا مما يجبر الشركات للتقديم من النظام القديم وهذا يخالف رغبتنا في اغلاق النظام القديم$$, $$تشغيلي$$, $$عائق تشغيل$$, $$عالية$$, $$تحت الإجراء$$, $$شركة علم$$, '2026-04-27', NULL, NULL, (SELECT id FROM users WHERE full_name = $$عبدالله المالكي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0122', (SELECT id FROM services WHERE name = $$خدمة تصريح رحلة طيران عام مفردة$$ LIMIT 1), $$Operation Support$$, $$عدم توفر بيانات شهادات مشغلي الطائرات المرتبطة بها في النظام، الأمر الذي يعيق المشغلين الوطنيين من الحصول على التصاريح السنوية أو المفردة، علماً بأنه تم تزويد هذه البيانات منذ بداية إطلاق الخدمتين$$, $$تشغيلي$$, $$غير عائق$$, $$عالية$$, $$تحت الإجراء$$, $$شركة علم$$, '2026-04-27', NULL, NULL, (SELECT id FROM users WHERE full_name = $$عبدالله المالكي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0123', (SELECT id FROM services WHERE name = $$خدمة تصريح رحلة طيران عام مفردة$$ LIMIT 1), $$Operation Support$$, $$عدم توفر بيانات شهادات مشغلي الطائرات المرتبطة بها في النظام، الأمر الذي يعيق المشغلين الوطنيين من الحصول على التصاريح السنوية أو المفردة، علماً بأنه تم تزويد هذه البيانات منذ بداية إطلاق الخدمتين$$, $$تشغيلي$$, $$غير عائق$$, $$عالية$$, $$تحت الإجراء$$, $$شركة علم$$, '2026-04-27', NULL, NULL, (SELECT id FROM users WHERE full_name = $$عبدالله المالكي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0124', (SELECT id FROM services WHERE name = $$تحديث تصريح طيران مفرد$$ LIMIT 1), $$Operation Support$$, $$إضافة الطائرات الجديدة في حال عدم وجودها يتاخر كثيرا مما يجبر الشركات للتقديم من النظام القديم وهذا يخالف رغبتنا في اغلاق النظام القديم$$, $$تشغيلي$$, $$غير عائق$$, $$عالية$$, $$تحت الإجراء$$, $$شركة علم$$, '2026-04-27', NULL, NULL, (SELECT id FROM users WHERE full_name = $$عبدالله المالكي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0125', (SELECT id FROM services WHERE name = $$خدمة تصريح رحلات طيران عام سنوي$$ LIMIT 1), $$Operation Support$$, $$عند تحديث الربط بين الوكلاء والشركات الأجنبية، يجب أن ينعكس التحديث في نظام الفوترة عن طريق الربط الالكتروني - المرحلة الثانية$$, $$تشغيلي$$, $$غير عائق$$, $$عالية$$, $$تحت الإجراء$$, $$شركة علم$$, '2026-04-27', NULL, NULL, (SELECT id FROM users WHERE full_name = $$عبدالله المالكي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0126', (SELECT id FROM services WHERE name = $$خدمة تصريح رحلة طيران عام مفردة$$ LIMIT 1), $$Operation Support$$, $$ترتيب المطارات ليس ترتيبا ابجديا مما يسهل على الموظف البحث في عبور$$, $$تشغيلي$$, $$غير عائق$$, $$عالية$$, $$مغلقة$$, $$شركة علم$$, '2026-04-27', NULL, NULL, (SELECT id FROM users WHERE full_name = $$عبدالله المالكي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0127', (SELECT id FROM services WHERE name = $$خدمة تصريح رحلات طيران عام سنوي$$ LIMIT 1), $$Operation Support$$, $$وجود تحديات في اضافة الطائرات والمطارات ومشاكل فواتير ( تكررها أو عدم ظهورها )  وعدم قدرة بعض الشركات على التقديم على الخدمة لعدم ظهور أيقونتها واختفاء التصريح بعد اصداره في بعض الشركات$$, $$تشغيلي$$, $$غير عائق$$, $$عالية$$, $$تحت الإجراء$$, $$شركة علم$$, '2026-04-27', NULL, NULL, (SELECT id FROM users WHERE full_name = $$عبدالله المالكي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0128', (SELECT id FROM services WHERE name = $$خدمة تصريح رحلة طيران عام مفردة$$ LIMIT 1), $$Operation Support$$, $$وجود تحديات في اضافة الطائرات والمطارات ومشاكل فواتير ( تكررها أو عدم ظهورها )  وعدم قدرة بعض الشركات على التقديم على الخدمة لعدم ظهور أيقونتها واختفاء التصريح بعد اصداره في بعض الشركات$$, $$تشغيلي$$, $$غير عائق$$, $$عالية$$, $$تحت الإجراء$$, $$شركة علم$$, '2026-04-27', NULL, NULL, (SELECT id FROM users WHERE full_name = $$عبدالله المالكي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0129', (SELECT id FROM services WHERE name = $$خدمة تصريح رحلة طيران عام مفردة$$ LIMIT 1), $$Operation Support$$, $$التقارير الخاصة بالملاحة مطلوبه$$, $$تشغيلي$$, $$غير عائق$$, $$عالية$$, $$تحت الإجراء$$, $$شركة علم$$, '2026-04-27', NULL, NULL, (SELECT id FROM users WHERE full_name = $$عبدالله المالكي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0130', (SELECT id FROM services WHERE name = $$خدمة رخصة مراقب جوي$$ LIMIT 1), $$Operation Support$$, $$بيانات رخص المراقب الجوي و بيانات رخص مقيم المراقب الجوي لا تظهر أثناء تقديم الطلب من خلال البوابه الخارجيه$$, $$تشغيلي$$, $$عائق تشغيل$$, $$عالية$$, $$جديدة$$, $$شركة علم$$, '2026-04-28', NULL, NULL, (SELECT id FROM users WHERE full_name = $$أنس سبهاني$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0131', NULL, $$Operation Support$$, $$عند استعراض المهام تظهر للموظفين اسماء الزملاء بالادارات الاخرى وهذا الاجراء يشكل إزعاج لهم لعدم القدرة على البحث عن الاسم بشكل مباشر وكذلك التحديث الاخير الغى امكانية اسناد الموظف المهمة لنفسه بشكل مباشر$$, $$تشغيلي$$, $$غير عائق$$, $$عالية$$, $$جديدة$$, $$شركة علم$$, '2026-04-28', NULL, NULL, (SELECT id FROM users WHERE full_name = $$عبدالله المالكي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0132', NULL, $$Operation Support$$, $$عدم وجود أيقونة لاستخدام الخدمات في المنصة تسهل على العملاء معرفة طريقة التقديم على الخدمات حيث أن أكثر مايعيق العملاء في بعض الخدمات عدم معرفة لاجراء الصحيح$$, $$تشغيلي$$, $$غير عائق$$, $$عالية$$, $$جديدة$$, $$شركة علم$$, '2026-04-28', NULL, NULL, (SELECT id FROM users WHERE full_name = $$عبدالله المالكي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0133', NULL, $$Operation Support$$, $$الاسئلة الشائعه غير مفعله وهي أيقونة تفيد العملاء ببعض الاخطاء التي قد تحدث عن رفع الطلب او المتطلبات ويمكن لعلم سحب تقارير عن أكثر التحديات حيث يمكن على سبيل المثال اضافة بريد دعم أجواء كإجابة على استفسار دعم المشاكل التقنية أو حجم الصورة الشخصية وغيرها$$, $$تشغيلي$$, $$غير عائق$$, $$عالية$$, $$جديدة$$, $$شركة علم$$, '2026-04-28', NULL, NULL, (SELECT id FROM users WHERE full_name = $$عبدالله المالكي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0134', NULL, $$Operation Support$$, $$المتطلبات غير واضحه للعملاء عند رفع الطلب ويفضل استبدال علامة التعجب بعبارة توضح المطلبوب من العميل بدقه 
مثلا مقاس الصورة 
بيانات العنوان باللغة الانجليزية 
التوقيع 
حيث أن أغللب العملاء في أكثر من خدمة يقع في خطأ بسبب عدم وضوح الملاحظة 
يجب أن يتم جعل الايقونات المطلوب تعبئتها باللغة الانلجيزية لاتقبل البيانات باللغة العربية كاللعنوان مثلا وأن تكون الملاحظات إلزامية$$, $$تشغيلي$$, $$غير عائق$$, $$عالية$$, $$جديدة$$, $$شركة علم$$, '2026-04-28', NULL, NULL, (SELECT id FROM users WHERE full_name = $$عبدالله المالكي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0135', NULL, $$Operation Support$$, $$يجب منح موظفي دعم أجواء صلاحية سوبر أدمن يستطيع من خلالها التعديل على البيانات بالتنسيق مع ملاك الخدمات حيث من غير الطبيعي إلغاء طلب بسبب خطأ في الاسم أو رقم الجواز وغيرها من الاخطاء كما أن التعديل من جانب علم يستغرق أسابيع لبعض التحديات$$, $$تشغيلي$$, $$غير عائق$$, $$عالية$$, $$جديدة$$, $$شركة علم$$, '2026-04-28', NULL, NULL, (SELECT id FROM users WHERE full_name = $$عبدالله المالكي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0136', (SELECT id FROM services WHERE name = $$خدمة تصريح رحلات طيران عام سنوي$$ LIMIT 1), $$Operation Support$$, $$مشكلة في خدمة التصريح السنوي الطلبات بعد اعتماد قسم تصاريح الرحلات من المفترض أن الطلب يذهب لمدير الإدارة ليعتمده ولكن الطلبات تذهب بالاجراء إلى بانتظار اعتماد جهة خارجية وهذا الاجراء غير موجود في سلسلة الموافقات ويتم حل المشكلة من جانب علم لكل طلب جديد بدون حل جذري للمشكلة$$, $$تشغيلي$$, $$عائق تشغيل$$, $$حرجة$$, $$تحت الإجراء$$, $$شركة علم$$, '2026-04-28', NULL, NULL, (SELECT id FROM users WHERE full_name = $$عبدالله المالكي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0137', (SELECT id FROM services WHERE name = $$تحديث تصريح طيران سنوي$$ LIMIT 1), $$Operation Support$$, $$طلبات تحديث التصريح السنوي بعد اعتماد موظف تصاريح الرحلات تذهب في الاجراء لدى مدير الادارة وهذا الاجراء غير صحيح من المفترض أن يتم الموافقة مباشرة على الطلب$$, $$تشغيلي$$, $$غير عائق$$, $$عالية$$, $$تحت الإجراء$$, $$شركة علم$$, '2026-04-28', NULL, NULL, (SELECT id FROM users WHERE full_name = $$عبدالله المالكي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0138', NULL, $$Operation Support$$, $$أدوار الموظفين وصلاحياتهم غير مفصلة وفقا لسلم الهيئة كما أن بعض المناصب أو الصلاحيات لاتعمل 
نرجو مراجعة الصلاحيات لاغلاق الثغرات الكثيرة الموجودة بها$$, $$تشغيلي$$, $$غير عائق$$, $$عالية$$, $$جديدة$$, $$شركة علم$$, '2026-04-28', NULL, NULL, (SELECT id FROM users WHERE full_name = $$عبدالله المالكي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0139', (SELECT id FROM services WHERE name = $$خدمة موافقة الحج$$ LIMIT 1), $$Operation Support$$, $$مدير المحطة ومدير المنطقة ( أو استبدالهم بنموذج 101) لايمكن الكتابة في أيقونتهم$$, $$تشغيلي$$, $$عائق تشغيل$$, $$عالية$$, $$تحت الإجراء$$, $$شركة علم$$, '2026-04-28', NULL, NULL, (SELECT id FROM users WHERE full_name = $$عبدالله المالكي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0140', (SELECT id FROM services WHERE name = $$خدمة موافقة الحج$$ LIMIT 1), $$Operation Support$$, $$مدة التشغيل يجب أن تكون فترتين فترة قدوم وفترة مغادرة وليس فترة واحدة كما هو الحال الان$$, $$تشغيلي$$, $$عائق تشغيل$$, $$عالية$$, $$مغلقة$$, $$شركة علم$$, '2026-04-28', NULL, NULL, (SELECT id FROM users WHERE full_name = $$عبدالله المالكي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0141', (SELECT id FROM services WHERE name = $$خدمة موافقة الحج$$ LIMIT 1), $$Operation Support$$, $$التعديل على نموذج الموافقة 


1.	عنوان وثيقة الموافقة باللغة الإنجليزية ولم يتم إضافة العنوان باللغة العربية .
2.	عنوان الملاحظات في آخر الوثيقة لم يتم إضافة العنوان باللغة العربية
3.	لم يتم إضافة الملاحظات التي تم تزويدكم بها مسبقاً في نهاية استمارة الموافقة (موضحة أدناه ) .

-	يجب على الناقلات الجوية الالتزام بالاشتراطات اللازمة لتشغيل رحلات الحج: -

•	الالتزام بالأنظمة واللوائح والأدلة والتعاميم الصادرة من الهيئة العامة للطيران المدني السعودي.
•	الالتزام بما ورد في تعليمات نقل الحجاج عن طريق الجو الصادرة من الهيئة العامة للطيران المدني السعودي.
•	الالتزام بتشغيل رحلات الحج ضمن الإطار الزمني المحدد.
•	الالتزام بتقديم جدول تشغيل رحلات الحج وفقاً للحصة المخصصة لمكتب شؤون الحجاج التي تم اعتمادها من قِبل وزارة الحج والعمرة بالمملكة العربية السعودية.
•	الالتزام بتقديم جدول تشغيل رحلات الحج وفقاً للمنافذ الجوية المخصصة لمكتب شؤون الحجاج التي تم اعتمادها من قِبل وزارة الحج والعمرة بالمملكة العربية السعودية.
•	إن عدم الالتزام بما ورد في تعليمات نقل الحجاج عن طريق الجو فسيتم تطبيق العقوبات وفقاً لنظام نقل الحجاج إلى المملكة وإعادتهم إلى بلادهم، ونظام الطيران المدني، وكذلك كافة الأنظمة واللوائح والتعليمات ذات العلاقة في المملكة العربية السعودية.$$, $$تشغيلي$$, $$عائق تشغيل$$, $$عالية$$, $$تحت الإجراء$$, $$شركة علم$$, '2026-04-28', NULL, NULL, (SELECT id FROM users WHERE full_name = $$عبدالله المالكي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0142', (SELECT id FROM services WHERE name = $$خدمة موافقة الحج$$ LIMIT 1), $$Operation Support$$, $$مالك الخدمة لم يعتمد BRS  المحدث حتى الان بالرغم من التذكير$$, $$تشغيلي$$, $$عائق تشغيل$$, $$عالية$$, $$تحت الإجراء$$, $$الهيئة$$, '2026-04-28', NULL, NULL, (SELECT id FROM users WHERE full_name = $$عبدالله المالكي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0143', (SELECT id FROM services WHERE name = $$خدمة تعيين ناقل جوي وطني$$ LIMIT 1), $$Operation Support$$, $$مالك الخدمة الاستاذ بندر عسيري لم يفيدنا حتى الان ببديل الموظف سالم الصوفي على الخدمة لنكمل معه إجراءات خدمتي تعيين ناقل وطني وتعيين ناقل أجنبي حيث أن الموظف افاد بأنه انتقل إلى كندا لتمثيل المملكة والاستاذ بندر عسيري لم يفيدنا بالموظف البديل حتى الان$$, $$تحليلي$$, $$عائق تشغيل$$, $$حرجة$$, $$جديدة$$, $$الهيئة$$, '2026-04-28', NULL, NULL, (SELECT id FROM users WHERE full_name = $$عبدالله المالكي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0144', (SELECT id FROM services WHERE name = $$خدمة المسح الأمني$$ LIMIT 1), $$Operation Support$$, $$أن يتم اعفاء الشركات التي ورد فيها برقية من معالي رئيس أمن الدولة بشكل تلقائي في المنصة بدون الحاجة للاعفاء بشكل يدوي أو التواصل مع فريق علم$$, $$تشغيلي$$, $$غير عائق$$, $$متوسطة$$, $$مغلقة$$, $$شركة علم$$, '2026-04-29', NULL, NULL, (SELECT id FROM users WHERE full_name = $$عبدالله المالكي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0145', (SELECT id FROM services WHERE name = $$الخدمات الداعمة للرخص$$ LIMIT 1), $$Operation Support$$, $$إضافة حالة الرخصة ضمن خطاب التحقق من الرخصة السعودية$$, $$تشغيلي$$, $$غير عائق$$, $$حرجة$$, $$جديدة$$, $$شركة علم$$, '2026-04-29', NULL, NULL, (SELECT id FROM users WHERE full_name = $$عبدالله المالكي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0146', (SELECT id FROM services WHERE name = $$رخصة طيار$$ LIMIT 1), $$Operation Support$$, $$إضافة رقم إصدار لنسخة الرخصة$$, $$تشغيلي$$, $$غير عائق$$, $$عالية$$, $$تحت الإجراء$$, $$شركة علم$$, '2026-04-29', NULL, NULL, (SELECT id FROM users WHERE full_name = $$عبدالله المالكي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0147', (SELECT id FROM services WHERE name = $$رخصة مضيف جوي$$ LIMIT 1), $$Operation Support$$, $$إضافة رقم إصدار لنسخة الرخصة$$, $$تشغيلي$$, $$غير عائق$$, $$عالية$$, $$تحت الإجراء$$, $$شركة علم$$, '2026-04-29', NULL, NULL, (SELECT id FROM users WHERE full_name = $$عبدالله المالكي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0148', (SELECT id FROM services WHERE name = $$رخصة طيار$$ LIMIT 1), $$Operation Support$$, $$تعديل رخصة طيار خطوط مسماها الصحيح
AIRLINE TRANSPORT PILOT
يوجد مشكلة في مسمى الرخصه حيث يتم اصدار الرخص بمسمى مختلف لهذا النوع$$, $$تشغيلي$$, $$عائق تشغيل$$, $$حرجة$$, $$تحت الإجراء$$, $$شركة علم$$, '2026-04-29', NULL, NULL, (SELECT id FROM users WHERE full_name = $$عبدالله المالكي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO tickets (ticket_number, service_id, environment, description, classification, impact, priority, status, responsibility, observed_date, expected_resolution_date, closed_date, created_by, updated_at)
VALUES ('T-0149', (SELECT id FROM services WHERE name = $$خدمة تصريح رحلات طيران عام سنوي$$ LIMIT 1), $$Operation Support$$, $$تحدي  يواجه موظفي الملاحة الجوية 
هل يمكن منحهم صلاحية الاطلاع على تفاصيل التصريح ( مدة التصريح السنوي منذ بدابة التصريح وحتى نهايته ) 

وذلك للفوترة بشكل صحيح 

يوجد فيديو تمت مشاركته مع الاستاذه نجود بتاريخ 03/04/2026$$, $$تشغيلي$$, $$غير عائق$$, $$عالية$$, $$جديدة$$, $$شركة علم$$, '2026-05-02', NULL, NULL, (SELECT id FROM users WHERE full_name = $$عبدالله المالكي$$ LIMIT 1), NOW())
ON CONFLICT (ticket_number) DO NOTHING;

-- تحديث sequence ليكمل من T-0150
SELECT setval('ticket_number_seq', 149);

COMMIT;
-- تم بناء 147 تذكرة