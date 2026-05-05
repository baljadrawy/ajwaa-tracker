import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { ticketAPI, serviceAPI } from '../services/api'
import { ArrowRight, Loader, Paperclip, X } from 'lucide-react'
import toast from 'react-hot-toast'
import styles from './NewTicketPage.module.css'

export function NewTicketPage() {
  const navigate = useNavigate()
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(false)
  const [attachments, setAttachments] = useState([])
  const [formData, setFormData] = useState({
    serviceId: '',
    environment: '',
    description: '',
    classification: '',
    impact: '',
    priority: '',
    responsibility: '',
    supportRequired: '',
  })

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await serviceAPI.list()
      setServices(response.data || [])
    } catch (error) {
      toast.error('فشل تحميل الخدمات')
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    const valid = files.filter(f => f.size <= 10 * 1024 * 1024)
    const invalid = files.filter(f => f.size > 10 * 1024 * 1024)
    if (invalid.length > 0) toast.error('بعض الملفات تتجاوز الحد الأقصى 10MB')
    setAttachments(prev => [...prev, ...valid])
    e.target.value = ''
  }

  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.environment || !formData.description ||
        !formData.classification || !formData.impact || !formData.priority || !formData.responsibility) {
      toast.error('يرجى ملء جميع الحقول المطلوبة')
      return
    }

    try {
      setLoading(true)
      const response = await ticketAPI.create(formData)
      const ticketId = response.data?.id

      if (ticketId && attachments.length > 0) {
        for (const file of attachments) {
          try {
            await ticketAPI.addAttachment(ticketId, file)
          } catch (err) {
            console.error('فشل رفع مرفق:', file.name, err)
          }
        }
      }

      toast.success('تم إنشاء التذكرة بنجاح')
      navigate('/tickets')
    } catch (error) {
      const message = error.response?.data?.message || error.response?.data?.error || 'فشل إنشاء التذكرة'
      toast.error(message)
      console.error('Failed to create ticket:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className={styles.container}>
        <button onClick={() => navigate('/tickets')} className={styles.backButton}>
          <ArrowRight size={20} />
          العودة للتذاكر
        </button>

        <div className={styles.header}>
          <h1 className={styles.title}>تذكرة جديدة</h1>
          <p className={styles.subtitle}>إنشاء ملاحظة جديدة في النظام</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="serviceId">الخدمة <span className={styles.optionalHint}>(اختياري — اتركه فارغاً للتذاكر العامة)</span></label>
              <select id="serviceId" name="serviceId" value={formData.serviceId} onChange={handleChange} className={styles.select}>
                <option value="">— عام (غير مرتبط بخدمة) —</option>
                {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="environment">حالة البيئة *</label>
              <select id="environment" name="environment" value={formData.environment} onChange={handleChange} required className={styles.select}>
                <option value="">اختر الحالة</option>
                <option value="Operation Support">Operation Support</option>
                <option value="BA">BA</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="classification">التصنيف *</label>
              <select id="classification" name="classification" value={formData.classification} onChange={handleChange} required className={styles.select}>
                <option value="">اختر التصنيف</option>
                <option value="تشغيلي">تشغيلي</option>
                <option value="تحليلي">تحليلي</option>
                <option value="نقل البيانات">نقل البيانات</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="impact">الأثر *</label>
              <select id="impact" name="impact" value={formData.impact} onChange={handleChange} required className={styles.select}>
                <option value="">اختر الأثر</option>
                <option value="عائق تشغيل">عائق تشغيل</option>
                <option value="عائق غير تشغيلي">عائق غير تشغيلي</option>
                <option value="غير عائق">غير عائق</option>
                <option value="تحسيني">تحسيني</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="priority">الأولوية *</label>
              <select id="priority" name="priority" value={formData.priority} onChange={handleChange} required className={styles.select}>
                <option value="">اختر الأولوية</option>
                <option value="حرجة">حرجة</option>
                <option value="عالية">عالية</option>
                <option value="متوسطة">متوسطة</option>
                <option value="منخفضة">منخفضة</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="responsibility">المسؤولية *</label>
              <select id="responsibility" name="responsibility" value={formData.responsibility} onChange={handleChange} required className={styles.select}>
                <option value="">اختر المسؤول</option>
                <option value="الهيئة">الهيئة</option>
                <option value="شركة علم">شركة علم</option>
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">وصف الملاحظة *</label>
            <textarea
              id="description" name="description" value={formData.description}
              onChange={handleChange} required rows={6}
              placeholder="أدخل وصفاً تفصيلياً للملاحظة..."
              className={styles.textarea}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="supportRequired">الدعم المطلوب <span className={styles.optionalHint}>(اختياري)</span></label>
            <textarea
              id="supportRequired" name="supportRequired" value={formData.supportRequired}
              onChange={handleChange} rows={3}
              placeholder="ما الذي تحتاجه لإغلاق هذه التذكرة؟ (جهة الدعم، نوع التدخل المطلوب...)"
              className={styles.textarea}
            />
          </div>

          {/* قسم المرفقات */}
          <div className={styles.formGroup}>
            <label>المرفقات (اختياري)</label>
            <div className={styles.attachmentArea}>
              <label htmlFor="attachmentInput" className={styles.attachmentLabel}>
                <Paperclip size={18} />
                إضافة مرفق (صور، مستندات — الحد الأقصى 10MB لكل ملف)
              </label>
              <input
                id="attachmentInput"
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                onChange={handleFileChange}
                className={styles.fileInput}
              />
            </div>

            {attachments.length > 0 && (
              <div className={styles.attachmentList}>
                {attachments.map((file, index) => (
                  <div key={index} className={styles.attachmentItem}>
                    <Paperclip size={14} />
                    <span className={styles.attachmentName}>{file.name}</span>
                    <span className={styles.attachmentSize}>({(file.size / 1024).toFixed(0)} KB)</span>
                    <button type="button" onClick={() => removeAttachment(index)} className={styles.removeAttachment}>
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={styles.formActions}>
            <button type="submit" disabled={loading} className={styles.submitButton}>
              {loading ? <><Loader size={18} className={styles.spinner} /> جاري الإنشاء...</> : 'إنشاء التذكرة'}
            </button>
            <button type="button" onClick={() => navigate('/tickets')} className={styles.cancelButton}>
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
}
