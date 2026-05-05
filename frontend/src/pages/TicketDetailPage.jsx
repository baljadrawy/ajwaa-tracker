import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import { ticketAPI, attachmentAPI, serviceAPI } from '../services/api'
import api from '../services/api'
import { ArrowRight, Send, FileText, MessageSquare, Download, Edit2, X, Check, Trash2, Paperclip, Loader } from 'lucide-react'
import toast from 'react-hot-toast'
import styles from './TicketDetailPage.module.css'

const PRIORITY_COLORS = {
  'حرجة': '#ef4444',
  'عالية': '#f59e0b',
  'متوسطة': '#3b82f6',
  'منخفضة': '#10b981',
}

const STATUS_COLORS = {
  'جديدة': '#6366f1',
  'تحت الإجراء': '#f59e0b',
  'مغلقة': '#10b981',
}

export function TicketDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [ticket, setTicket] = useState(null)
  const [comments, setComments] = useState([])
  const [auditLog, setAuditLog] = useState([])
  const [attachments, setAttachments] = useState([])
  const [loading, setLoading] = useState(true)
  const [commenting, setCommenting] = useState(false)
  const [newComment, setNewComment] = useState('')

  // تحديث الحالة
  const [statusModal, setStatusModal] = useState(false)
  const [newStatus, setNewStatus] = useState('')
  const [updatingStatus, setUpdatingStatus] = useState(false)

  // تعديل التذكرة
  const [editModal, setEditModal] = useState(false)
  const [editForm, setEditForm] = useState({})
  const [editLoading, setEditLoading] = useState(false)
  const [services, setServices] = useState([])
  // رفع مرفقات جديدة
  const [newAttachments, setNewAttachments] = useState([])

  useEffect(() => {
    fetchTicket()
    fetchServices()
  }, [id])

  const fetchServices = async () => {
    try {
      const res = await serviceAPI.list()
      setServices(res.data || [])
    } catch {}
  }

  const openEditModal = () => {
    setEditForm({
      serviceId: ticket.service_id || '',
      environment: ticket.environment || '',
      description: ticket.description || '',
      classification: ticket.classification || '',
      impact: ticket.impact || '',
      priority: ticket.priority || '',
      responsibility: ticket.responsibility || '',
      expectedResolutionDate: ticket.expected_resolution_date
        ? ticket.expected_resolution_date.slice(0, 10) : '',
      supportRequired: ticket.support_required || '',
    })
    setNewAttachments([])
    setEditModal(true)
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    try {
      setEditLoading(true)
      await ticketAPI.update(id, {
        ...editForm,
        serviceId: editForm.serviceId || null,
      })
      // رفع مرفقات جديدة إذا وجدت
      if (newAttachments.length > 0) {
        for (const file of newAttachments) {
          try { await ticketAPI.addAttachment(id, file) } catch {}
        }
      }
      toast.success('تم تحديث التذكرة بنجاح')
      setEditModal(false)
      fetchTicket()
    } catch (error) {
      toast.error(error.response?.data?.error || 'فشل تحديث التذكرة')
    } finally {
      setEditLoading(false)
    }
  }

  const fetchTicket = async () => {
    try {
      setLoading(true)
      const response = await ticketAPI.get(id)
      const data = response.data
      setTicket(data.ticket || data)
      setComments(data.comments || [])
      setAuditLog(data.auditLog || [])
      setAttachments(data.attachments || [])
    } catch (error) {
      toast.error('فشل تحميل التذكرة')
      navigate('/tickets')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (attachmentId, fileName) => {
    try {
      const response = await api.get(`/attachments/download/${attachmentId}`, {
        responseType: 'blob',
      })
      const blob = new Blob([response.data])
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      link.remove()
      setTimeout(() => window.URL.revokeObjectURL(url), 1000)
    } catch (error) {
      toast.error('فشل تحميل الملف')
    }
  }

  const openStatusModal = () => {
    setNewStatus(ticket.status)
    setStatusModal(true)
  }

  const handleStatusUpdate = async () => {
    if (!newStatus || newStatus === ticket.status) {
      setStatusModal(false)
      return
    }
    try {
      setUpdatingStatus(true)
      await ticketAPI.update(id, { status: newStatus })
      toast.success('تم تحديث الحالة بنجاح')
      setStatusModal(false)
      fetchTicket()
    } catch (error) {
      toast.error('فشل تحديث الحالة')
    } finally {
      setUpdatingStatus(false)
    }
  }

  const handleAddComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return
    try {
      setCommenting(true)
      await ticketAPI.addComment(id, { commentText: newComment })
      setNewComment('')
      fetchTicket()
      toast.success('تم إضافة التعليق')
    } catch (error) {
      toast.error('فشل إضافة التعليق')
    } finally {
      setCommenting(false)
    }
  }

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا التعليق؟')) return
    try {
      await api.delete(`/tickets/${id}/comments/${commentId}`)
      toast.success('تم حذف التعليق')
      fetchTicket()
    } catch (error) {
      toast.error(error.response?.data?.error || 'فشل حذف التعليق')
    }
  }

  const handleDeleteAttachment = async (attachmentId, fileName) => {
    if (!window.confirm(`هل أنت متأكد من حذف الملف "${fileName}"؟`)) return
    try {
      await attachmentAPI.delete(attachmentId)
      toast.success('تم حذف الملف')
      fetchTicket()
    } catch (error) {
      toast.error(error.response?.data?.error || 'فشل حذف الملف')
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>جاري تحميل التفاصيل...</p>
        </div>
      </Layout>
    )
  }

  if (!ticket) {
    return (
      <Layout>
        <div className={styles.errorContainer}><p>لم يتم العثور على التذكرة</p></div>
      </Layout>
    )
  }

  const canEdit = user?.role === 'admin' || user?.role === 'coordinator'
  // المنسق يعدّل تذاكره فقط (التي أنشأها)
  const canEditTicket = user?.role === 'admin' ||
    (user?.role === 'coordinator' && ticket?.created_by === user?.id)

  // المشرف يحذف أي تذكرة — المنسق يحذف فقط تذاكره بحالة "جديدة"
  const canDelete = user?.role === 'admin' ||
    (user?.role === 'coordinator' && ticket?.status === 'جديدة')

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `هل أنت متأكد من حذف التذكرة ${ticket.ticket_number}؟\nلا يمكن التراجع عن هذا الإجراء.`
    )
    if (!confirmed) return
    try {
      await ticketAPI.delete(id)
      toast.success('تم حذف التذكرة')
      navigate('/tickets')
    } catch (error) {
      const msg = error.response?.data?.error || 'فشل حذف التذكرة'
      toast.error(msg)
    }
  }

  return (
    <Layout>
      <div className={styles.container}>

        {/* رأس الصفحة */}
        <div className={styles.pageHeader}>
          <button onClick={() => navigate('/tickets')} className={styles.backButton}>
            <ArrowRight size={18} />
            العودة
          </button>
          <div className={styles.pageHeaderActions}>
            {canEditTicket && ticket.status !== 'مغلقة' && (
              <button onClick={openEditModal} className={styles.editTicketBtn}>
                <Edit2 size={16} />
                تعديل التذكرة
              </button>
            )}
            {canEdit && ticket.status !== 'مغلقة' && (
              <button onClick={openStatusModal} className={styles.updateStatusBtn}>
                <Check size={16} />
                تحديث الحالة
              </button>
            )}
            {canDelete && (
              <button onClick={handleDelete} className={styles.deleteBtn}>
                <Trash2 size={16} />
                حذف التذكرة
              </button>
            )}
          </div>
        </div>

        {/* عنوان التذكرة */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>{ticket.ticket_number}</h1>
            <p className={styles.subtitle}>{ticket.service_name || '-'}</p>
          </div>
          <div className={styles.badges}>
            <span className={styles.statusBadge} style={{ backgroundColor: STATUS_COLORS[ticket.status] }}>
              {ticket.status}
            </span>
            <span className={styles.priorityBadge} style={{ backgroundColor: PRIORITY_COLORS[ticket.priority] }}>
              {ticket.priority}
            </span>
          </div>
        </div>

        <div className={styles.content}>
          {/* العمود الرئيسي */}
          <div className={styles.mainPanel}>

            {/* الوصف */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>الوصف</h2>
              <p className={styles.description}>{ticket.description}</p>
            </div>

            {/* التفاصيل */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>التفاصيل</h2>
              <div className={styles.detailsGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>التصنيف</span>
                  <span className={styles.detailValue}>{ticket.classification}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>الأثر</span>
                  <span className={styles.detailValue}>{ticket.impact}</span>
                </div>
                {ticket.support_required && (
                  <div className={styles.detailItem} style={{gridColumn: '1 / -1'}}>
                    <span className={styles.detailLabel}>الدعم المطلوب</span>
                    <span className={styles.detailValue}>{ticket.support_required}</span>
                  </div>
                )}
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>المسؤولية</span>
                  <span className={styles.detailValue}>{ticket.responsibility}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>حالة البيئة</span>
                  <span className={styles.detailValue}>{ticket.environment}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>تاريخ الرصد</span>
                  <span className={styles.detailValue}>
                    {ticket.observed_date ? new Date(ticket.observed_date).toLocaleDateString('ar-SA-u-nu-latn') : '-'}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>أنشأه</span>
                  <span className={styles.detailValue}>{ticket.created_by_name || '-'}</span>
                </div>
                {ticket.expected_resolution_date && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>الموعد المتوقع</span>
                    <span className={styles.detailValue}>
                      {new Date(ticket.expected_resolution_date).toLocaleDateString('ar-SA-u-nu-latn')}
                    </span>
                  </div>
                )}
                {ticket.closed_date && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>تاريخ الإغلاق</span>
                    <span className={styles.detailValue}>
                      {new Date(ticket.closed_date).toLocaleDateString('ar-SA-u-nu-latn')}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* سجل تغيير الحالة */}
            {auditLog && auditLog.length > 0 && (
              <div className={styles.card}>
                <h2 className={styles.cardTitle}>سجل تغيير الحالة</h2>
                <div className={styles.auditList}>
                  {auditLog.map((entry) => (
                    <div key={entry.id} className={styles.auditItem}>
                      <span className={styles.auditStatus}>{entry.old_status}</span>
                      <span className={styles.auditArrow}>←</span>
                      <span className={styles.auditStatus}>{entry.new_status}</span>
                      <span className={styles.auditMeta}>
                        {entry.changed_by_name} — {new Date(entry.changed_at).toLocaleDateString('ar-SA-u-nu-latn')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* التعليقات */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>
                <MessageSquare size={18} />
                التعليقات {comments.length > 0 && <span className={styles.count}>{comments.length}</span>}
              </h2>

              {comments.length > 0 ? (
                <div className={styles.commentsList}>
                  {comments.map((comment) => (
                    <div key={comment.id} className={styles.comment}>
                      <div className={styles.commentHeader}>
                        <span className={styles.commentAuthor}>{comment.created_by_name || 'مستخدم'}</span>
                        <span className={styles.commentDate}>
                          {new Date(comment.created_at).toLocaleDateString('ar-SA-u-nu-latn')}
                        </span>
                        {(user?.role === 'admin' || comment.created_by === user?.id) && (
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className={styles.deleteCommentBtn}
                            title="حذف التعليق"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                      <p className={styles.commentText}>{comment.comment_text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={styles.noComments}>لا توجد تعليقات بعد</p>
              )}

              {user?.role !== 'manager' && (
                <form onSubmit={handleAddComment} className={styles.commentForm}>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="أضف تعليقاً..."
                    rows={3}
                    className={styles.textarea}
                  />
                  <button type="submit" disabled={commenting || !newComment.trim()} className={styles.submitButton}>
                    <Send size={16} />
                    {commenting ? 'جاري الإرسال...' : 'إضافة تعليق'}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* العمود الجانبي */}
          <div className={styles.sidePanel}>

            {/* المرفقات */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>
                <FileText size={16} />
                المرفقات {attachments.length > 0 && <span className={styles.count}>{attachments.length}</span>}
              </h3>
              {attachments.length > 0 ? (
                <div className={styles.attachmentsList}>
                  {attachments.map((att) => (
                    <div key={att.id} className={styles.attachmentRow}>
                      <button
                        onClick={() => handleDownload(att.id, att.file_name)}
                        className={styles.attachmentLink}
                        type="button"
                      >
                        <Download size={13} />
                        <span className={styles.attachmentName}>{att.file_name}</span>
                      </button>
                      {(user?.role === 'admin' || att.uploaded_by === user?.id) && (
                        <button
                          onClick={() => handleDeleteAttachment(att.id, att.file_name)}
                          className={styles.deleteAttachmentBtn}
                          title="حذف الملف"
                          type="button"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className={styles.noAttachments}>لا توجد مرفقات</p>
              )}
            </div>

          </div>
        </div>

        {/* مودال تعديل التذكرة */}
        {editModal && (
          <div className={styles.modalOverlay} onClick={() => setEditModal(false)}>
            <div className={styles.modal} style={{maxWidth: 680}} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h3>تعديل التذكرة — {ticket.ticket_number}</h3>
                <button onClick={() => setEditModal(false)} className={styles.modalClose}><X size={20} /></button>
              </div>
              <form onSubmit={handleEditSubmit}>
                <div className={styles.modalBody}>
                  <div className={styles.editGrid}>
                    {user?.role === 'admin' && (
                      <div className={styles.editGroup}>
                        <label>الخدمة</label>
                        <select value={editForm.serviceId} onChange={e => setEditForm(p => ({...p, serviceId: e.target.value}))} className={styles.editSelect}>
                          <option value="">— عام —</option>
                          {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                      </div>
                    )}
                    <div className={styles.editGroup}>
                      <label>حالة البيئة *</label>
                      <select value={editForm.environment} onChange={e => setEditForm(p => ({...p, environment: e.target.value}))} required className={styles.editSelect}>
                        <option value="Operation Support">Operation Support</option>
                        <option value="BA">BA</option>
                      </select>
                    </div>
                    <div className={styles.editGroup}>
                      <label>التصنيف *</label>
                      <select value={editForm.classification} onChange={e => setEditForm(p => ({...p, classification: e.target.value}))} required className={styles.editSelect}>
                        <option value="تشغيلي">تشغيلي</option>
                        <option value="تحليلي">تحليلي</option>
                        <option value="نقل البيانات">نقل البيانات</option>
                      </select>
                    </div>
                    <div className={styles.editGroup}>
                      <label>الأثر *</label>
                      <select value={editForm.impact} onChange={e => setEditForm(p => ({...p, impact: e.target.value}))} required className={styles.editSelect}>
                        <option value="عائق تشغيل">عائق تشغيل</option>
                        <option value="عائق غير تشغيلي">عائق غير تشغيلي</option>
                        <option value="غير عائق">غير عائق</option>
                        <option value="تحسيني">تحسيني</option>
                      </select>
                    </div>
                    <div className={styles.editGroup}>
                      <label>الأولوية *</label>
                      <select value={editForm.priority} onChange={e => setEditForm(p => ({...p, priority: e.target.value}))} required className={styles.editSelect}>
                        <option value="حرجة">حرجة</option>
                        <option value="عالية">عالية</option>
                        <option value="متوسطة">متوسطة</option>
                        <option value="منخفضة">منخفضة</option>
                      </select>
                    </div>
                    <div className={styles.editGroup}>
                      <label>المسؤولية *</label>
                      <select value={editForm.responsibility} onChange={e => setEditForm(p => ({...p, responsibility: e.target.value}))} required className={styles.editSelect}>
                        <option value="الهيئة">الهيئة</option>
                        <option value="شركة علم">شركة علم</option>
                      </select>
                    </div>
                    <div className={styles.editGroup}>
                      <label>الموعد المتوقع للحل</label>
                      <input type="date" value={editForm.expectedResolutionDate} onChange={e => setEditForm(p => ({...p, expectedResolutionDate: e.target.value}))} className={styles.editInput} />
                    </div>
                  </div>
                  <div className={styles.editGroup} style={{marginTop: 12}}>
                    <label>وصف الملاحظة *</label>
                    <textarea value={editForm.description} onChange={e => setEditForm(p => ({...p, description: e.target.value}))} required rows={5} className={styles.editTextarea} />
                  </div>
                  <div className={styles.editGroup} style={{marginTop: 12}}>
                    <label>الدعم المطلوب <span style={{fontSize:'0.75rem', color:'#888'}}>(اختياري)</span></label>
                    <textarea value={editForm.supportRequired} onChange={e => setEditForm(p => ({...p, supportRequired: e.target.value}))} rows={3} placeholder="ما الذي تحتاجه لإغلاق هذه التذكرة؟" className={styles.editTextarea} />
                  </div>
                  {/* رفع مرفقات إضافية */}
                  <div className={styles.editGroup} style={{marginTop: 12}}>
                    <label>إضافة مرفقات</label>
                    <label className={styles.attachUploadLabel}>
                      <Paperclip size={15} /> اختر ملفات (الحد الأقصى 10MB لكل ملف)
                      <input type="file" multiple accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                        onChange={e => {
                          const valid = Array.from(e.target.files).filter(f => f.size <= 10*1024*1024)
                          setNewAttachments(p => [...p, ...valid])
                          e.target.value = ''
                        }}
                        style={{display:'none'}}
                      />
                    </label>
                    {newAttachments.length > 0 && (
                      <div className={styles.editAttachList}>
                        {newAttachments.map((f, i) => (
                          <div key={i} className={styles.editAttachItem}>
                            <Paperclip size={12} />
                            <span>{f.name}</span>
                            <button type="button" onClick={() => setNewAttachments(p => p.filter((_,j)=>j!==i))} className={styles.removeAttachBtn}><X size={12} /></button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className={styles.modalFooter}>
                  <button type="button" onClick={() => setEditModal(false)} className={styles.cancelBtn}>إلغاء</button>
                  <button type="submit" disabled={editLoading} className={styles.confirmBtn}>
                    {editLoading ? <><Loader size={14} /> جاري الحفظ...</> : 'حفظ التعديلات'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* مودال تحديث الحالة */}
        {statusModal && (
          <div className={styles.modalOverlay} onClick={() => setStatusModal(false)}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h3>تحديث حالة التذكرة</h3>
                <button onClick={() => setStatusModal(false)} className={styles.modalClose}>
                  <X size={20} />
                </button>
              </div>
              <div className={styles.modalBody}>
                <p className={styles.modalTicketNum}>{ticket.ticket_number}</p>
                <label className={styles.modalLabel}>الحالة الجديدة</label>
                <div className={styles.statusOptions}>
                  {['جديدة', 'تحت الإجراء', 'مغلقة'].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setNewStatus(s)}
                      className={`${styles.statusOption} ${newStatus === s ? styles.statusOptionActive : ''}`}
                      style={newStatus === s ? { borderColor: STATUS_COLORS[s], backgroundColor: `${STATUS_COLORS[s]}15` } : {}}
                    >
                      <span className={styles.statusDot} style={{ backgroundColor: STATUS_COLORS[s] }}></span>
                      {s}
                      {newStatus === s && <Check size={14} />}
                    </button>
                  ))}
                </div>
              </div>
              <div className={styles.modalFooter}>
                <button onClick={() => setStatusModal(false)} className={styles.cancelBtn}>إلغاء</button>
                <button
                  onClick={handleStatusUpdate}
                  disabled={updatingStatus || newStatus === ticket.status}
                  className={styles.confirmBtn}
                >
                  {updatingStatus ? 'جاري الحفظ...' : 'حفظ'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </Layout>
  )
}
