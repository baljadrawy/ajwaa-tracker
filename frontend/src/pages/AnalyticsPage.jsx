import React, { useEffect, useState } from 'react'
import { Layout } from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import { analyticsAPI } from '../services/api'
import { useNavigate } from 'react-router-dom'
import { TrendingUp, AlertTriangle, CheckCircle, Clock, BarChart2, Activity, Layers } from 'lucide-react'
import toast from 'react-hot-toast'
import styles from './AnalyticsPage.module.css'

const MONTH_NAMES = {
  '01': 'يناير', '02': 'فبراير', '03': 'مارس', '04': 'أبريل',
  '05': 'مايو',  '06': 'يونيو',  '07': 'يوليو', '08': 'أغسطس',
  '09': 'سبتمبر','10': 'أكتوبر','11': 'نوفمبر','12': 'ديسمبر',
}

function fmtMonth(ym) {
  const [year, month] = ym.split('-')
  return `${MONTH_NAMES[month]} ${year}`
}

export function AnalyticsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.role !== 'admin' && user?.role !== 'manager') {
      navigate('/')
      return
    }
    analyticsAPI.stats()
      .then(res => setData(res.data))
      .catch(() => toast.error('فشل تحميل التحليلات'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <Layout>
      <div className={styles.loadingWrap}>
        <div className={styles.spinner}></div>
        <p>جاري تحميل التحليلات...</p>
      </div>
    </Layout>
  )

  const { summary, trend, topServices, closureRates } = data || {}
  const maxTrend = Math.max(...(trend || []).map(t => t.total), 1)
  const maxOpen  = Math.max(...(topServices || []).map(s => s.open), 1)

  return (
    <Layout>
      <div className={styles.container}>

        {/* الرأس */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>تحليلات التذاكر والخدمات</h1>
            <p className={styles.subtitle}>نظرة شاملة على الأداء والاتجاهات</p>
          </div>
          <Activity size={32} className={styles.headerIcon} />
        </div>

        {/* بطاقات الملخص */}
        <div className={styles.kpiGrid}>
          <div className={styles.kpiCard} style={{ borderColor: '#140046' }}>
            <div className={styles.kpiIcon} style={{ background: '#ede9fe' }}><Layers size={20} color="#140046" /></div>
            <div className={styles.kpiValue}>{summary?.total ?? 0}</div>
            <div className={styles.kpiLabel}>إجمالي التذاكر</div>
          </div>
          <div className={styles.kpiCard} style={{ borderColor: '#1d4ed8' }}>
            <div className={styles.kpiIcon} style={{ background: '#eff6ff' }}><Clock size={20} color="#1d4ed8" /></div>
            <div className={styles.kpiValue} style={{ color: '#1d4ed8' }}>{summary?.new_count ?? 0}</div>
            <div className={styles.kpiLabel}>جديدة</div>
          </div>
          <div className={styles.kpiCard} style={{ borderColor: '#c2410c' }}>
            <div className={styles.kpiIcon} style={{ background: '#fff7ed' }}><AlertTriangle size={20} color="#c2410c" /></div>
            <div className={styles.kpiValue} style={{ color: '#c2410c' }}>{summary?.in_progress ?? 0}</div>
            <div className={styles.kpiLabel}>تحت الإجراء</div>
          </div>
          <div className={styles.kpiCard} style={{ borderColor: '#15803d' }}>
            <div className={styles.kpiIcon} style={{ background: '#f0fdf4' }}><CheckCircle size={20} color="#15803d" /></div>
            <div className={styles.kpiValue} style={{ color: '#15803d' }}>{summary?.closed ?? 0}</div>
            <div className={styles.kpiLabel}>مغلقة</div>
          </div>
          <div className={styles.kpiCard} style={{ borderColor: '#ef4444' }}>
            <div className={styles.kpiIcon} style={{ background: '#fef2f2' }}><AlertTriangle size={20} color="#ef4444" /></div>
            <div className={styles.kpiValue} style={{ color: '#ef4444' }}>{summary?.critical ?? 0}</div>
            <div className={styles.kpiLabel}>حرجة</div>
          </div>
          <div className={styles.kpiCard} style={{ borderColor: '#23EBA5' }}>
            <div className={styles.kpiIcon} style={{ background: '#ecfdf5' }}><TrendingUp size={20} color="#059669" /></div>
            <div className={styles.kpiValue} style={{ color: '#059669' }}>{summary?.closure_rate ?? 0}%</div>
            <div className={styles.kpiLabel}>معدل الإغلاق</div>
          </div>
        </div>

        {/* الاتجاه الزمني */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}><TrendingUp size={18} /> الاتجاه الزمني — آخر 6 أشهر</h2>
          {trend && trend.length > 0 ? (
            <div className={styles.trendChart}>
              {trend.map((t, i) => (
                <div key={i} className={styles.trendCol}>
                  <div className={styles.trendBars}>
                    <div
                      className={styles.trendBarTotal}
                      style={{ height: `${(t.total / maxTrend) * 180}px` }}
                      title={`إجمالي: ${t.total}`}
                    />
                    <div
                      className={styles.trendBarClosed}
                      style={{ height: `${(t.closed / maxTrend) * 180}px` }}
                      title={`مغلقة: ${t.closed}`}
                    />
                  </div>
                  <div className={styles.trendValues}>
                    <span className={styles.trendTotal}>{t.total}</span>
                    <span className={styles.trendClosed}>{t.closed}</span>
                  </div>
                  <div className={styles.trendLabel}>{fmtMonth(t.month)}</div>
                </div>
              ))}
              <div className={styles.trendLegend}>
                <span><span className={styles.dot} style={{ background: '#c7d2fe' }} />إجمالي</span>
                <span><span className={styles.dot} style={{ background: '#86efac' }} />مغلقة</span>
              </div>
            </div>
          ) : (
            <p className={styles.noData}>لا توجد بيانات كافية للاتجاه الزمني</p>
          )}
        </div>

        <div className={styles.twoCol}>
          {/* أكثر الخدمات تذاكر مفتوحة */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}><BarChart2 size={18} /> أكثر الخدمات تذاكر مفتوحة</h2>
            <div className={styles.servicesList}>
              {(topServices || []).map((s, i) => (
                <div key={i} className={styles.serviceRow}>
                  <div className={styles.serviceRank}>{i + 1}</div>
                  <div className={styles.serviceInfo}>
                    <div className={styles.serviceName} title={s.service_name}>
                      {s.service_name.length > 30 ? s.service_name.substring(0, 30) + '…' : s.service_name}
                    </div>
                    <div className={styles.serviceBarWrap}>
                      <div className={styles.serviceBarTrack}>
                        <div
                          className={styles.serviceBarFill}
                          style={{ width: `${(s.open / maxOpen) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className={styles.serviceStats}>
                      <span className={styles.sBadge} style={{ background: '#eff6ff', color: '#1d4ed8' }}>{s.new_count} جديدة</span>
                      <span className={styles.sBadge} style={{ background: '#fff7ed', color: '#c2410c' }}>{s.in_progress} إجراء</span>
                      <span className={styles.sBadge} style={{ background: '#f0fdf4', color: '#15803d' }}>{s.closed} مغلقة</span>
                    </div>
                  </div>
                  <div className={styles.serviceOpen}>{s.open}</div>
                </div>
              ))}
            </div>
          </div>

          {/* معدل الإغلاق لكل خدمة */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}><CheckCircle size={18} /> معدل الإغلاق لكل خدمة</h2>
            <div className={styles.servicesList}>
              {(closureRates || []).map((s, i) => (
                <div key={i} className={styles.closureRow}>
                  <div className={styles.closureName} title={s.service_name}>
                    {s.service_name.length > 28 ? s.service_name.substring(0, 28) + '…' : s.service_name}
                  </div>
                  <div className={styles.closureBarWrap}>
                    <div className={styles.closureBarTrack}>
                      <div
                        className={styles.closureBarFill}
                        style={{
                          width: `${s.closure_rate}%`,
                          background: s.closure_rate >= 75 ? '#22c55e'
                            : s.closure_rate >= 50 ? '#f59e0b'
                            : '#ef4444',
                        }}
                      />
                    </div>
                    <span className={styles.closureRate}>{s.closure_rate}%</span>
                  </div>
                  <div className={styles.closureTotal}>{s.closed}/{s.total}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </Layout>
  )
}
