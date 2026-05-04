import React, { useEffect, useState } from 'react'
import { Layout } from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import { insightsAPI } from '../services/api'
import { useNavigate } from 'react-router-dom'
import { BarChart2, Users, CheckCircle, AlertCircle, Clock, TrendingUp } from 'lucide-react'
import toast from 'react-hot-toast'
import styles from './InsightsPage.module.css'

const PRIORITY_COLORS = {
  critical: '#ef4444',
  high:     '#f59e0b',
  medium:   '#3b82f6',
  low:      '#10b981',
}

const COORDINATOR_COLORS = ['#140046', '#313B71', '#23EBA5', '#2332E6']

export function InsightsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.role !== 'admin' && user?.role !== 'manager') {
      navigate('/')
      return
    }
    insightsAPI.coordinators()
      .then(res => setData(res.data))
      .catch(() => toast.error('فشل تحميل البيانات'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <Layout>
      <div className={styles.loadingWrap}>
        <div className={styles.spinner}></div>
        <p>جاري تحميل المؤشرات...</p>
      </div>
    </Layout>
  )

  const coordinators = data?.coordinators || []
  const maxTotal = Math.max(...coordinators.map(c => c.total), 1)

  return (
    <Layout>
      <div className={styles.container}>

        {/* الرأس */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>مؤشرات أداء المنسقين</h1>
            <p className={styles.subtitle}>تحليل شامل لأداء كل منسق — {coordinators.reduce((s,c)=>s+c.total,0)} تذكرة إجمالاً</p>
          </div>
          <div className={styles.headerIcon}><BarChart2 size={32} /></div>
        </div>

        {/* بطاقات الملخص */}
        <div className={styles.summaryGrid}>
          {coordinators.map((c, i) => (
            <div key={c.coordinator_id} className={styles.summaryCard} style={{ borderColor: COORDINATOR_COLORS[i % 4] }}>
              <div className={styles.summaryTop}>
                <div className={styles.avatar} style={{ background: COORDINATOR_COLORS[i % 4] }}>
                  {c.coordinator_name.charAt(0)}
                </div>
                <div>
                  <div className={styles.coordName}>{c.coordinator_name}</div>
                  <div className={styles.coordTotal}>{c.total} تذكرة</div>
                </div>
                <div className={styles.closureCircle} style={{ '--rate': c.closure_rate }}>
                  <svg viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                    <circle
                      cx="18" cy="18" r="15.9"
                      fill="none"
                      stroke={COORDINATOR_COLORS[i % 4]}
                      strokeWidth="3"
                      strokeDasharray={`${c.closure_rate} ${100 - c.closure_rate}`}
                      strokeDashoffset="25"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span>{c.closure_rate}%</span>
                </div>
              </div>

              {/* شريط التقدم العام */}
              <div className={styles.progressWrap}>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: `${(c.total / maxTotal) * 100}%`, background: COORDINATOR_COLORS[i % 4] }} />
                </div>
              </div>

              {/* توزيع الحالات */}
              <div className={styles.statusRow}>
                <div className={styles.statusItem}>
                  <Clock size={13} color="#1d4ed8" />
                  <span className={styles.statusLabel}>جديدة</span>
                  <span className={styles.statusCount} style={{ color: '#1d4ed8' }}>{c.new_count}</span>
                </div>
                <div className={styles.statusItem}>
                  <AlertCircle size={13} color="#c2410c" />
                  <span className={styles.statusLabel}>تحت الإجراء</span>
                  <span className={styles.statusCount} style={{ color: '#c2410c' }}>{c.in_progress}</span>
                </div>
                <div className={styles.statusItem}>
                  <CheckCircle size={13} color="#15803d" />
                  <span className={styles.statusLabel}>مغلقة</span>
                  <span className={styles.statusCount} style={{ color: '#15803d' }}>{c.closed}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* جدول المقارنة التفصيلي */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}><TrendingUp size={18} /> مقارنة الأداء</h2>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>المنسق</th>
                  <th>الإجمالي</th>
                  <th>معدل الإغلاق</th>
                  <th>جديدة</th>
                  <th>تحت الإجراء</th>
                  <th>مغلقة</th>
                  <th>حرجة</th>
                  <th>عالية</th>
                  <th>عائق تشغيل</th>
                  <th>غير عائق</th>
                  <th>تحسيني</th>
                </tr>
              </thead>
              <tbody>
                {coordinators.map((c, i) => (
                  <tr key={c.coordinator_id} className={styles.tableRow}>
                    <td>
                      <div className={styles.coordCell}>
                        <span className={styles.dot} style={{ background: COORDINATOR_COLORS[i % 4] }} />
                        {c.coordinator_name}
                      </div>
                    </td>
                    <td className={styles.totalCell}>{c.total}</td>
                    <td>
                      <div className={styles.rateWrap}>
                        <div className={styles.rateBar}>
                          <div className={styles.rateFill} style={{ width: `${c.closure_rate}%`, background: COORDINATOR_COLORS[i % 4] }} />
                        </div>
                        <span className={styles.rateNum}>{c.closure_rate}%</span>
                      </div>
                    </td>
                    <td><span className={styles.badge} style={{ background: '#eff6ff', color: '#1d4ed8' }}>{c.new_count}</span></td>
                    <td><span className={styles.badge} style={{ background: '#fff7ed', color: '#c2410c' }}>{c.in_progress}</span></td>
                    <td><span className={styles.badge} style={{ background: '#f0fdf4', color: '#15803d' }}>{c.closed}</span></td>
                    <td><span className={styles.badge} style={{ background: '#fef2f2', color: '#ef4444' }}>{c.priority.critical}</span></td>
                    <td><span className={styles.badge} style={{ background: '#fffbeb', color: '#f59e0b' }}>{c.priority.high}</span></td>
                    <td><span className={styles.badge} style={{ background: '#fef2f2', color: '#dc2626' }}>{c.impact.blocker}</span></td>
                    <td><span className={styles.badge} style={{ background: '#f0fdf4', color: '#16a34a' }}>{c.impact.non_blocker}</span></td>
                    <td><span className={styles.badge} style={{ background: '#eff6ff', color: '#2563eb' }}>{c.impact.enhancement}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* مقارنة بصرية بالأشرطة */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}><Users size={18} /> توزيع التذاكر لكل منسق</h2>
          <div className={styles.barsSection}>
            {coordinators.map((c, i) => (
              <div key={c.coordinator_id} className={styles.coordBar}>
                <div className={styles.coordBarLabel}>{c.coordinator_name}</div>
                <div className={styles.coordBarTrack}>
                  <div className={styles.coordBarNew}     style={{ width: `${(c.new_count / maxTotal) * 100}%`, background: '#93c5fd' }} title={`جديدة: ${c.new_count}`} />
                  <div className={styles.coordBarProgress} style={{ width: `${(c.in_progress / maxTotal) * 100}%`, background: '#fdba74' }} title={`تحت الإجراء: ${c.in_progress}`} />
                  <div className={styles.coordBarClosed}  style={{ width: `${(c.closed / maxTotal) * 100}%`, background: '#86efac' }} title={`مغلقة: ${c.closed}`} />
                </div>
                <div className={styles.coordBarTotal}>{c.total}</div>
              </div>
            ))}
            <div className={styles.legend}>
              <span><span className={styles.legendDot} style={{ background: '#93c5fd' }} />جديدة</span>
              <span><span className={styles.legendDot} style={{ background: '#fdba74' }} />تحت الإجراء</span>
              <span><span className={styles.legendDot} style={{ background: '#86efac' }} />مغلقة</span>
            </div>
          </div>
        </div>

      </div>
    </Layout>
  )
}
