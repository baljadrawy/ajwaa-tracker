import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import { ticketAPI } from '../services/api'
import api from '../services/api'
import { ArrowRight, Send, FileText, MessageSquare, Download, Edit2, X, Check, Trash2 } from 'lucide-react'
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

  useEffect(() => {
    fetchTicket()
  }, [id])

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
            {canEdit && ticket.status !== 'مغلقة' && (
              <button onClick={openStatusModal} className={styles.updateStatusBtn}>
                <Edit2 size={16} />
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
                    <button
                      key={att.id}
                      onClick={() => handleDownload(att.id, att.file_name)}
                      className={styles.attachmentLink}
                      type="button"
                    >
                      <Download size={13} />
                      <span className={styles.attachmentName}>{att.file_name}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className={styles.noAttachments}>لا توجد مرفقات</p>
              )}
            </div>

          </div>
        </div>

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
