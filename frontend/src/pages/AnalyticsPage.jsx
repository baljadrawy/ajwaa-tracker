import { useState, useEffect, useCallback } from 'react'
import { analyticsAPI } from '../services/api'
import styles from './AnalyticsPage.module.css'

const fmt = (d) => d
  ? new Date(d).toLocaleDateString('ar-SA-u-nu-latn', { year: 'numeric', month: '2-digit', day: '2-digit' })
  : '—'

const delta = (curr, prev) => {
  if (prev === 0) return curr > 0 ? '+100%' : '0%'
  const p = Math.round(((curr - prev) / prev) * 100)
  return (p >= 0 ? '+' : '') + p + '%'
}
const deltaClass = (curr, prev, inverse = false) => {
  const up = curr >= prev
  if (inverse) return up ? styles.deltaDown : styles.deltaUp
  return up ? styles.deltaUp : styles.deltaDown
}

const STATUS_LABEL = { 'جديدة': 'جديدة', 'تحت الإجراء': 'تحت الإجراء', 'مغلقة': 'مغلقة' }
const STATUS_COLOR = { 'جديدة': '#f59e0b', 'تحت الإجراء': '#3b82f6', 'مغلقة': '#23EBA5' }

const IMPACT_COLORS = {
  'عائق تشغيل': '#ef4444',
  'عائق غير تشغيلي': '#f97316',
  'غير عائق': '#3b82f6',
  'تحسيني': '#10b981',
}
const RESP_COLORS = { 'الهيئة': '#140046', 'شركة علم': '#23EBA5' }

export function AnalyticsPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [applied, setApplied] = useState({ startDate: '', endDate: '' })

  const load = useCallback(async (params = {}) => {
    setLoading(true)
    setError(null)
    try {
      const res = await analyticsAPI.stats(params)
      setData(res.data)
    } catch (e) {
      setError('فشل تحميل البيانات')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const applyFilter = () => {
    setApplied({ startDate, endDate })
    const p = {}
    if (startDate) p.startDate = startDate
    if (endDate) p.endDate = endDate
    load(p)
  }

  const clearFilter = () => {
    setStartDate('')
    setEndDate('')
    setApplied({ startDate: '', endDate: '' })
    load()
  }

  const isFiltered = applied.startDate || applied.endDate

  if (loading) return <div className={styles.loadingWrap}><div className={styles.spinner} /><span>جارٍ تحميل البيانات...</span></div>
  if (error)   return <div className={styles.errorWrap}><span className={styles.errorIcon}>⚠</span><span>{error}</span><button className={styles.retryBtn} onClick={() => load()}>إعادة المحاولة</button></div>
  if (!data)   return null

  const { summary, trend, topServices, closureRates, impactDist, responsibilityDist, criticalTickets, monthComparison: mom } = data

  // حساب الـ max لشريط الأثر
  const maxImpact = Math.max(...impactDist.map(i => i.count), 1)
  const maxResp   = Math.max(...responsibilityDist.map(r => r.count), 1)
  const maxSvc    = Math.max(...topServices.map(s => s.total), 1)

  // ألوان الـ trend
  const trendMax = Math.max(...trend.map(t => t.total), 1)

  return (
    <div className={styles.page}>
      {/* ===== فلتر التاريخ ===== */}
      <div className={styles.filterBar}>
        <span className={styles.filterTitle}>🗓 فلترة بالفترة الزمنية</span>
        <div className={styles.filterRow}>
          <div className={styles.filterGroup}>
            <label>من تاريخ</label>
            <input type="date" className={styles.filterInput} value={startDate} onChange={e => setStartDate(e.target.value)} max={endDate || undefined} />
          </div>
          <div className={styles.filterGroup}>
            <label>إلى تاريخ</label>
            <input type="date" className={styles.filterInput} value={endDate} onChange={e => setEndDate(e.target.value)} min={startDate || undefined} />
          </div>
          <button className={styles.applyBtn} onClick={applyFilter}>تطبيق</button>
          {isFiltered && <button className={styles.clearBtn} onClick={clearFilter}>مسح الفلتر</button>}
        </div>
        {isFiltered && (
          <span className={styles.filterBadge}>
            {applied.startDate && `من ${applied.startDate}`}
            {applied.startDate && applied.endDate && ' — '}
            {applied.endDate && `إلى ${applied.endDate}`}
          </span>
        )}
      </div>

      {/* ===== مقارنة الشهر ===== */}
      <div className={styles.sectionTitle}>📊 مقارنة الشهر الحالي بالسابق</div>
      <div className={styles.momGrid}>
        <div className={styles.momCard}>
          <div className={styles.momLabel}>تذاكر جديدة — هذا الشهر</div>
          <div className={styles.momValue}>{mom.new_this}</div>
          <div className={`${styles.momDelta} ${deltaClass(mom.new_this, mom.new_last, true)}`}>
            {delta(mom.new_this, mom.new_last)} مقارنةً بـ {mom.new_last} الشهر الماضي
          </div>
        </div>
        <div className={styles.momCard}>
          <div className={styles.momLabel}>تذاكر مغلقة — هذا الشهر</div>
          <div className={styles.momValue}>{mom.closed_this}</div>
          <div className={`${styles.momDelta} ${deltaClass(mom.closed_this, mom.closed_last)}`}>
            {delta(mom.closed_this, mom.closed_last)} مقارنةً بـ {mom.closed_last} الشهر الماضي
          </div>
        </div>
        <div className={styles.momCard}>
          <div className={styles.momLabel}>معدل الإغلاق الكلي</div>
          <div className={styles.momValue}>{summary.closure_rate}%</div>
          <div className={styles.momSubtitle}>{summary.closed} مغلقة من {summary.total} إجمالي</div>
        </div>
        <div className={styles.momCard}>
          <div className={styles.momLabel}>متوسط وقت الإغلاق</div>
          <div className={styles.momValue}>
            {summary.avg_closure_days != null ? summary.avg_closure_days : '—'}
            {summary.avg_closure_days != null && <span className={styles.momUnit}> يوم</span>}
          </div>
          <div className={styles.momSubtitle}>متوسط أيام إغلاق التذاكر</div>
        </div>
      </div>

      {/* ===== بطاقات KPI ===== */}
      <div className={styles.sectionTitle}>📋 ملخص التذاكر {isFiltered ? '(مفلتر)' : ''}</div>
      <div className={styles.kpiGrid}>
        <div className={`${styles.kpiCard} ${styles.kpiTotal}`}>
          <div className={styles.kpiNum}>{summary.total}</div>
          <div className={styles.kpiLabel}>الإجمالي</div>
        </div>
        <div className={`${styles.kpiCard} ${styles.kpiNew}`}>
          <div className={styles.kpiNum}>{summary.new_count}</div>
          <div className={styles.kpiLabel}>جديدة</div>
        </div>
        <div className={`${styles.kpiCard} ${styles.kpiProgress}`}>
          <div className={styles.kpiNum}>{summary.in_progress}</div>
          <div className={styles.kpiLabel}>تحت الإجراء</div>
        </div>
        <div className={`${styles.kpiCard} ${styles.kpiClosed}`}>
          <div className={styles.kpiNum}>{summary.closed}</div>
          <div className={styles.kpiLabel}>مغلقة</div>
        </div>
        <div className={`${styles.kpiCard} ${styles.kpiCritical}`}>
          <div className={styles.kpiNum}>{summary.critical}</div>
          <div className={styles.kpiLabel}>حرجة</div>
        </div>
        <div className={`${styles.kpiCard} ${styles.kpiBlocker}`}>
          <div className={styles.kpiNum}>{summary.blocker}</div>
          <div className={styles.kpiLabel}>عائق تشغيل</div>
        </div>
        <div className={`${styles.kpiCard} ${styles.kpiRate}`}>
          <div className={styles.kpiNum}>{summary.closure_rate}%</div>
          <div className={styles.kpiLabel}>معدل الإغلاق</div>
        </div>
      </div>

      {/* ===== توزيع الأثر والمسؤولية ===== */}
      <div className={styles.twoCol}>
        {/* الأثر */}
        <div className={styles.distCard}>
          <div className={styles.distTitle}>توزيع الأثر</div>
          <div className={styles.distList}>
            {impactDist.length === 0 && <div className={styles.noData}>لا توجد بيانات</div>}
            {impactDist.map(item => (
              <div key={item.impact} className={styles.distItem}>
                <div className={styles.distMeta}>
                  <span className={styles.distName}>{item.impact}</span>
                  <span className={styles.distCount}>{item.count}</span>
                </div>
                <div className={styles.distBarBg}>
                  <div
                    className={styles.distBarFill}
                    style={{ width: `${(item.count / maxImpact) * 100}%`, backgroundColor: IMPACT_COLORS[item.impact] || '#6366f1' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* المسؤولية */}
        <div className={styles.distCard}>
          <div className={styles.distTitle}>توزيع المسؤولية</div>
          <div className={styles.distList}>
            {responsibilityDist.length === 0 && <div className={styles.noData}>لا توجد بيانات</div>}
            {responsibilityDist.map(item => (
              <div key={item.responsibility} className={styles.distItem}>
                <div className={styles.distMeta}>
                  <span className={styles.distName}>{item.responsibility}</span>
                  <span className={styles.distCount}>{item.count}</span>
                </div>
                <div className={styles.distBarBg}>
                  <div
                    className={styles.distBarFill}
                    style={{ width: `${(item.count / maxResp) * 100}%`, backgroundColor: RESP_COLORS[item.responsibility] || '#6366f1' }}
                  />
                </div>
              </div>
            ))}
          </div>
          {/* دائرة نسب */}
          {responsibilityDist.length > 0 && (
            <div className={styles.pieRow}>
              {responsibilityDist.map(item => (
                <div key={item.responsibility} className={styles.pieChip}
                  style={{ backgroundColor: RESP_COLORS[item.responsibility] || '#6366f1' }}>
                  <span>{item.responsibility}</span>
                  <span className={styles.pieChipPct}>
                    {Math.round((item.count / responsibilityDist.reduce((a,b)=>a+b.count,0)) * 100)}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ===== الاتجاه الزمني ===== */}
      <div className={styles.sectionTitle}>📈 الاتجاه الزمني — آخر 6 أشهر</div>
      <div className={styles.trendCard}>
        {trend.length === 0
          ? <div className={styles.noData}>لا توجد بيانات للأشهر الستة الماضية</div>
          : (
            <div className={styles.trendChart}>
              {trend.map(t => (
                <div key={t.month} className={styles.trendCol}>
                  <div className={styles.trendBars}>
                    <div className={styles.trendBarTotal}
                      style={{ height: `${(t.total / trendMax) * 140}px` }}
                      title={`إجمالي: ${t.total}`} />
                    <div className={styles.trendBarClosed}
                      style={{ height: `${(t.closed / trendMax) * 140}px` }}
                      title={`مغلقة: ${t.closed}`} />
                  </div>
                  <div className={styles.trendNums}>
                    <span className={styles.trendTotal}>{t.total}</span>
                    <span className={styles.trendClosed}>{t.closed}</span>
                  </div>
                  <div className={styles.trendMonth}>{t.month.slice(5)}/{t.month.slice(0,4)}</div>
                </div>
              ))}
            </div>
          )
        }
        <div className={styles.trendLegend}>
          <span className={styles.legendDot} style={{backgroundColor:'#313B71'}} />إجمالي
          <span className={styles.legendDot} style={{backgroundColor:'#23EBA5', marginRight:'16px'}} />مغلقة
        </div>
      </div>

      {/* ===== أكثر الخدمات تذاكر ===== */}
      <div className={styles.sectionTitle}>🔝 أكثر الخدمات تذاكر (حسب المفتوحة)</div>
      <div className={styles.svcCard}>
        {topServices.length === 0
          ? <div className={styles.noData}>لا توجد بيانات</div>
          : topServices.map((s, i) => (
            <div key={s.service_name} className={styles.svcRow}>
              <div className={styles.svcRank}>{i + 1}</div>
              <div className={styles.svcName}>{s.service_name}</div>
              <div className={styles.svcBarWrap}>
                <div className={styles.svcBarSeg} style={{ width:`${(s.new_count/maxSvc)*100}%`, backgroundColor:'#f59e0b' }} title={`جديدة: ${s.new_count}`} />
                <div className={styles.svcBarSeg} style={{ width:`${(s.in_progress/maxSvc)*100}%`, backgroundColor:'#3b82f6' }} title={`تحت الإجراء: ${s.in_progress}`} />
                <div className={styles.svcBarSeg} style={{ width:`${(s.closed/maxSvc)*100}%`, backgroundColor:'#23EBA5' }} title={`مغلقة: ${s.closed}`} />
              </div>
              <div className={styles.svcTotals}>
                <span title="جديدة" style={{color:'#f59e0b'}}>{s.new_count}</span>
                <span title="تحت الإجراء" style={{color:'#3b82f6'}}>{s.in_progress}</span>
                <span title="مغلقة" style={{color:'#23EBA5'}}>{s.closed}</span>
                <span className={styles.svcTotal}>{s.total}</span>
              </div>
            </div>
          ))
        }
        <div className={styles.svcLegend}>
          <span className={styles.legendDot} style={{backgroundColor:'#f59e0b'}} />جديدة
          <span className={styles.legendDot} style={{backgroundColor:'#3b82f6', marginRight:'12px'}} />تحت الإجراء
          <span className={styles.legendDot} style={{backgroundColor:'#23EBA5', marginRight:'12px'}} />مغلقة
        </div>
      </div>

      {/* ===== معدل الإغلاق لكل خدمة ===== */}
      {closureRates.length > 0 && (
        <>
          <div className={styles.sectionTitle}>✅ معدل الإغلاق لكل خدمة</div>
          <div className={styles.svcCard}>
            {closureRates.map(s => (
              <div key={s.service_name} className={styles.crRow}>
                <div className={styles.svcName}>{s.service_name}</div>
                <div className={styles.crBarWrap}>
                  <div className={styles.crBarFill} style={{ width:`${s.closure_rate}%` }} />
                </div>
                <div className={styles.crPct}>{s.closure_rate}%</div>
                <div className={styles.crSub}>({s.closed}/{s.total})</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ===== التذاكر الحرجة المفتوحة ===== */}
      <div className={styles.sectionTitle}>🚨 التذاكر الحرجة المفتوحة</div>
      <div className={styles.critSection}>
        {criticalTickets.length === 0
          ? <div className={styles.noDataGreen}>✅ لا توجد تذاكر حرجة مفتوحة حالياً</div>
          : (
            <div className={styles.critTableWrap}>
              <table className={styles.critTable}>
                <thead>
                  <tr>
                    <th>رقم التذكرة</th>
                    <th>الخدمة</th>
                    <th>الوصف</th>
                    <th>تاريخ الرصد</th>
                    <th>الحالة</th>
                    <th>أيام مفتوحة</th>
                  </tr>
                </thead>
                <tbody>
                  {criticalTickets.map(t => (
                    <tr key={t.ticket_number} className={styles.critRow}>
                      <td className={styles.critNum}>{t.ticket_number}</td>
                      <td>{t.service_name}</td>
                      <td className={styles.critDesc}>{t.description}</td>
                      <td>{fmt(t.observed_date)}</td>
                      <td>
                        <span className={styles.statusBadge} style={{ backgroundColor: STATUS_COLOR[t.status] || '#999' }}>
                          {t.status}
                        </span>
                      </td>
                      <td>
                        <span className={t.days_open >= 30 ? styles.daysRed : t.days_open >= 14 ? styles.daysOrange : styles.daysNorm}>
                          {t.days_open}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }
      </div>
    </div>
  )
}
