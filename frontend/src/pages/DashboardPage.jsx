import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import { dashboardAPI, ticketAPI } from '../services/api'
import { BarChart3, TrendingUp, AlertCircle, CheckCircle, Layers, Clock, ChevronLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import styles from './DashboardPage.module.css'

const PRIORITY_COLORS = {
  'حرجة': '#ef4444',
  'عالية': '#f59e0b',
  'متوسطة': '#3b82f6',
  'منخفضة': '#10b981',
}

const STATUS_COLORS = {
  'جديدة':       { bg: '#eff6ff', color: '#1d4ed8' },
  'تحت الإجراء': { bg: '#fff7ed', color: '#c2410c' },
  'مغلقة':       { bg: '#f0fdf4', color: '#15803d' },
}

function BarRow({ label, value, max, color }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div className={styles.barRow}>
      <span className={styles.barLabel}>{label}</span>
      <div className={styles.barTrack}>
        <div className={styles.barFill} style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className={styles.barValue}>{value}</span>
    </div>
  )
}

export function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [recentTickets, setRecentTickets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [statsRes, ticketsRes] = await Promise.all([
        dashboardAPI.stats(),
        ticketAPI.list({ limit: 8, offset: 0 }),
      ])

      const data = statsRes.data

      const statusMap = {}
      ;(data.byStatus || []).forEach(row => { statusMap[row.status] = parseInt(row.count) })

      const priorityMap = {}
      ;(data.byPriority || []).forEach(row => { priorityMap[row.priority] = parseInt(row.count) })

      const responsibilityMap = {}
      ;(data.byResponsibility || []).forEach(row => { responsibilityMap[row.responsibility] = parseInt(row.count) })

      setStats({
        totalTickets: data.total || 0,
        openTickets: (statusMap['جديدة'] || 0) + (statusMap['تحت الإجراء'] || 0),
        closedTickets: statusMap['مغلقة'] || 0,
        totalServices: data.totalServices || 0,
        byStatus: statusMap,
        byPriority: priorityMap,
        byResponsibility: responsibilityMap,
      })

      setRecentTickets((ticketsRes.data || []).slice(0, 8))
    } catch (error) {
      toast.error('فشل تحميل الإحصائيات')
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const navigate = useNavigate()

  const fmt = (d) => d ? new Date(d).toLocaleDateString('ar-SA-u-nu-latn', {
    year: 'numeric', month: '2-digit', day: '2-digit'
  }) : '-'

  const maxPriority = stats ? Math.max(...Object.values(stats.byPriority), 1) : 1
  const maxStatus   = stats ? Math.max(...Object.values(stats.byStatus), 1) : 1

  return (
    <Layout>
      <div className={styles.container}>
        {/* الرأس */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>لوحة التحكم</h1>
            <p className={styles.subtitle}>نظرة عامة على نظام تتبع الملاحظات</p>
          </div>
          <button onClick={fetchData} className={styles.refreshBtn}>
            تحديث
          </button>
        </div>

        {loading ? (
          <div className={styles.loadingWrap}>
            <div className={styles.spinner} />
            <p>جاري التحميل...</p>
          </div>
        ) : (
          <>
            {/* بطاقات الإحصاء */}
            <div className={styles.statsGrid}>
              <div className={`${styles.statCard} ${styles.cardBlue}`}>
                <div className={styles.statIcon}><TrendingUp size={26} /></div>
                <div>
                  <p className={styles.statNum}>{stats?.totalTickets ?? 0}</p>
                  <p className={styles.statLabel}>إجمالي التذاكر</p>
                </div>
              </div>
              <div className={`${styles.statCard} ${styles.cardOrange}`}>
                <div className={styles.statIcon}><AlertCircle size={26} /></div>
                <div>
                  <p className={styles.statNum}>{stats?.openTickets ?? 0}</p>
                  <p className={styles.statLabel}>تذاكر مفتوحة</p>
                </div>
              </div>
              <div className={`${styles.statCard} ${styles.cardGreen}`}>
                <div className={styles.statIcon}><CheckCircle size={26} /></div>
                <div>
                  <p className={styles.statNum}>{stats?.closedTickets ?? 0}</p>
                  <p className={styles.statLabel}>تذاكر مغلقة</p>
                </div>
              </div>
              <div className={`${styles.statCard} ${styles.cardPurple}`}>
                <div className={styles.statIcon}><Layers size={26} /></div>
                <div>
                  <p className={styles.statNum}>{stats?.totalServices ?? 0}</p>
                  <p className={styles.statLabel}>الخدمات</p>
                </div>
              </div>
            </div>

            {/* الصف الرئيسي */}
            <div className={styles.mainRow}>

              {/* توزيع الحالات */}
              <div className={styles.card}>
                <h2 className={styles.cardTitle}>توزيع الحالات</h2>
                <BarRow label="جديدة"       value={stats?.byStatus?.['جديدة'] || 0}       max={maxStatus} color="#3b82f6" />
                <BarRow label="تحت الإجراء" value={stats?.byStatus?.['تحت الإجراء'] || 0} max={maxStatus} color="#f59e0b" />
                <BarRow label="مغلقة"        value={stats?.byStatus?.['مغلقة'] || 0}        max={maxStatus} color="#10b981" />

                {/* نسبة الإغلاق */}
                {stats?.totalTickets > 0 && (
                  <div className={styles.closureRate}>
                    <span>نسبة الإغلاق</span>
                    <div className={styles.rateBar}>
                      <div
                        className={styles.rateFill}
                        style={{ width: `${Math.round((stats.closedTickets / stats.totalTickets) * 100)}%` }}
                      />
                    </div>
                    <span className={styles.rateNum}>
                      {Math.round((stats.closedTickets / stats.totalTickets) * 100)}%
                    </span>
                  </div>
                )}
              </div>

              {/* توزيع الأولويات */}
              <div className={styles.card}>
                <h2 className={styles.cardTitle}>توزيع الأولويات</h2>
                <BarRow label="حرجة"    value={stats?.byPriority?.['حرجة'] || 0}    max={maxPriority} color={PRIORITY_COLORS['حرجة']} />
                <BarRow label="عالية"   value={stats?.byPriority?.['عالية'] || 0}   max={maxPriority} color={PRIORITY_COLORS['عالية']} />
                <BarRow label="متوسطة" value={stats?.byPriority?.['متوسطة'] || 0} max={maxPriority} color={PRIORITY_COLORS['متوسطة']} />
                <BarRow label="منخفضة" value={stats?.byPriority?.['منخفضة'] || 0} max={maxPriority} color={PRIORITY_COLORS['منخفضة']} />
              </div>

              {/* توزيع المسؤولية */}
              <div className={styles.card}>
                <h2 className={styles.cardTitle}>المسؤولية</h2>
                {(() => {
                  const heir = stats?.byResponsibility?.['الهيئة'] || 0
                  const ilm  = stats?.byResponsibility?.['شركة علم'] || 0
                  const tot  = heir + ilm || 1
                  return (
                    <>
                      <div className={styles.respItem}>
                        <span className={styles.respLabel}>الهيئة</span>
                        <div className={styles.respBar}>
                          <div className={styles.respFillBlue} style={{ width: `${Math.round(heir/tot*100)}%` }} />
                        </div>
                        <span className={styles.respCount}>{heir}</span>
                      </div>
                      <div className={styles.respItem}>
                        <span className={styles.respLabel}>شركة علم</span>
                        <div className={styles.respBar}>
                          <div className={styles.respFillGreen} style={{ width: `${Math.round(ilm/tot*100)}%` }} />
                        </div>
                        <span className={styles.respCount}>{ilm}</span>
                      </div>

                      {/* دائرة نسبة */}
                      <div className={styles.pieWrap}>
                        <div className={styles.pieChart} style={{
                          background: `conic-gradient(#3b82f6 0% ${Math.round(heir/tot*100)}%, #10b981 ${Math.round(heir/tot*100)}% 100%)`
                        }} />
                        <div className={styles.pieLegend}>
                          <span><span className={styles.dotBlue}/> الهيئة {Math.round(heir/tot*100)}%</span>
                          <span><span className={styles.dotGreen}/> شركة علم {Math.round(ilm/tot*100)}%</span>
                        </div>
                      </div>
                    </>
                  )
                })()}
              </div>
            </div>

            {/* آخر التذاكر */}
            {recentTickets.length > 0 && (
              <div className={styles.recentCard}>
                <div className={styles.recentHeader}>
                  <h2 className={styles.cardTitle} style={{margin:0}}>
                    <Clock size={16} style={{verticalAlign:'middle', marginLeft:6}} />
                    آخر التذاكر
                  </h2>
                  <Link to="/tickets" className={styles.viewAll}>
                    عرض الكل <ChevronLeft size={14} />
                  </Link>
                </div>
                <div className={styles.recentTable}>
                  <table>
                    <thead>
                      <tr>
                        <th>رقم التذكرة</th>
                        <th>الخدمة</th>
                        <th>الحالة</th>
                        <th>الأولوية</th>
                        {(user?.role === 'admin' || user?.role === 'manager') && <th>المنشئ</th>}
                        <th>التاريخ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentTickets.map(ticket => (
                        <tr
                          key={ticket.id}
                          className={styles.recentRow}
                          onClick={() => navigate(`/tickets/${ticket.id}`)}
                        >
                          <td className={styles.recentNum}>{ticket.ticket_number}</td>
                          <td className={styles.recentService}>{ticket.service_name || '-'}</td>
                          <td>
                            <span className={styles.statusPill} style={{
                              background: STATUS_COLORS[ticket.status]?.bg || '#f3f4f6',
                              color: STATUS_COLORS[ticket.status]?.color || '#374151',
                            }}>
                              {ticket.status}
                            </span>
                          </td>
                          <td>
                            <span className={styles.priorityDot}
                              style={{ background: PRIORITY_COLORS[ticket.priority] || '#6b7280' }}>
                              {ticket.priority}
                            </span>
                          </td>
                          {(user?.role === 'admin' || user?.role === 'manager') && (
                            <td className={styles.recentCreator}>{ticket.created_by_name || '-'}</td>
                          )}
                          <td className={styles.recentDate}>{fmt(ticket.updated_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  )
}
