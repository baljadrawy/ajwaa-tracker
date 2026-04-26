import React, { useEffect, useState } from 'react'
import { Layout } from '../components/Layout'
import api from '../services/api'
import {
  AlertTriangle, RefreshCw, Trash2, ChevronDown, ChevronUp,
  Download, Activity, Users, Zap, Clock
} from 'lucide-react'
import toast from 'react-hot-toast'
import styles from './LogsPage.module.css'

const STATUS_COLOR = {
  500: '#ef4444', 404: '#f59e0b', 403: '#8b5cf6',
  401: '#3b82f6', 400: '#f97316', 200: '#10b981', 201: '#10b981',
}

const METHOD_COLOR = {
  GET: '#3b82f6', POST: '#10b981', PUT: '#f59e0b',
  DELETE: '#ef4444', PATCH: '#8b5cf6',
}

export function LogsPage() {
  const [tab, setTab] = useState('stats') // stats | errors | access
  const [stats, setStats] = useState(null)
  const [logs, setLogs] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [accessLogEnabled, setAccessLogEnabled] = useState(true)
  const [expandedId, setExpandedId] = useState(null)
  const [page, setPage] = useState(1)
  const perPage = 50

  // فلاتر
  const [filterStatus, setFilterStatus] = useState('')
  const [filterUser, setFilterUser] = useState('')
  const [filterMethod, setFilterMethod] = useState('')
  const [filterDateFrom, setFilterDateFrom] = useState('')
  const [filterDateTo, setFilterDateTo] = useState('')

  useEffect(() => { fetchData() }, [tab, page, filterStatus, filterUser, filterMethod, filterDateFrom, filterDateTo])

  const fetchData = async () => {
    setLoading(true)
    try {
      if (tab === 'stats') {
        const res = await api.get('/logs/stats')
        setStats(res.data)
        setAccessLogEnabled(res.data.accessLogEnabled !== false)
      } else {
        const params = { limit: perPage, offset: (page - 1) * perPage }
        if (filterStatus)   params.status_code = filterStatus
        if (filterUser)     params.user_id = filterUser
        if (filterMethod)   params.method = filterMethod
        if (filterDateFrom) params.date_from = filterDateFrom
        if (filterDateTo)   params.date_to = filterDateTo

        const endpoint = tab === 'errors' ? '/logs/errors' : '/logs/access'
        const res = await api.get(endpoint, { params })
        setLogs(res.data.logs || [])
        setTotal(res.data.total || 0)
      }
    } catch (e) {
      console.error('Logs fetch error:', e)
      toast.error('فشل تحميل البيانات')
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async () => {
    try {
      const type = tab === 'access' ? 'access' : 'errors'
      const params = new URLSearchParams({ type })
      if (filterDateFrom) params.append('date_from', filterDateFrom)
      if (filterDateTo)   params.append('date_to', filterDateTo)

      const res = await api.get(`/logs/export?${params}`, { responseType: 'blob' })
      const filename = `${type}_log_${new Date().toISOString().slice(0,10)}.csv`
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      toast.success('تم تصدير السجل')
    } catch (e) {
      toast.error('فشل التصدير')
    }
  }

  const handleClear = async () => {
    const type = tab === 'access' ? 'access' : 'errors'
    if (!confirm(`هل أنت متأكد من مسح سجل ${tab === 'access' ? 'الطلبات' : 'الأخطاء'}؟`)) return
    try {
      await api.delete(`/logs?type=${type}`)
      toast.success('تم المسح')
      fetchData()
    } catch (e) {
      toast.error('فشل المسح')
    }
  }

  const resetFilters = () => {
    setFilterStatus('')
    setFilterUser('')
    setFilterMethod('')
    setFilterDateFrom('')
    setFilterDateTo('')
    setPage(1)
  }

  const fmt = (d) => d ? new Date(d).toLocaleString('ar-SA-u-nu-latn', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  }) : '-'

  const totalPages = Math.ceil(total / perPage)

  return (
    <Layout>
      <div className={styles.container}>

        {/* الرأس */}
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <Activity size={24} />
            <div>
              <h1 className={styles.title}>مراقبة النظام</h1>
              <p className={styles.subtitle}>تتبع الطلبات والأخطاء</p>
            </div>
          </div>
          <div className={styles.headerActions}>
            <button onClick={fetchData} className={styles.refreshBtn}>
              <RefreshCw size={15} /> تحديث
            </button>
            {tab !== 'stats' && (
              <>
                <button onClick={handleExport} className={styles.exportBtn}>
                  <Download size={15} /> تصدير CSV
                </button>
                <button onClick={handleClear} className={styles.clearBtn}>
                  <Trash2 size={15} /> مسح
                </button>
              </>
            )}
          </div>
        </div>

        {/* التبويبات */}
        <div className={styles.tabs}>
          {[
            { key: 'stats',  label: 'الإحصائيات', icon: <Zap size={15} /> },
            { key: 'errors', label: 'الأخطاء',     icon: <AlertTriangle size={15} /> },
            { key: 'access', label: 'سجل الطلبات', icon: <Activity size={15} /> },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => { setTab(t.key); setPage(1) }}
              className={`${styles.tab} ${tab === t.key ? styles.tabActive : ''}`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className={styles.loading}><div className={styles.spinner} /><p>جاري التحميل...</p></div>
        ) : tab === 'stats' ? (
          <StatsView stats={stats} />
        ) : (
          <>
            {/* الفلاتر */}
            <div className={styles.filters}>
              <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1) }} className={styles.filterSelect}>
                <option value="">جميع الأكواد</option>
                {tab === 'errors'
                  ? <><option value="500">500</option><option value="404">404</option><option value="403">403</option><option value="401">401</option><option value="400">400</option></>
                  : <><option value="200">200</option><option value="201">201</option><option value="400">400</option><option value="401">401</option><option value="403">403</option><option value="404">404</option><option value="500">500</option></>
                }
              </select>
              {tab === 'access' && (
                <select value={filterMethod} onChange={e => { setFilterMethod(e.target.value); setPage(1) }} className={styles.filterSelect}>
                  <option value="">جميع الأنواع</option>
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                </select>
              )}
              <input type="date" value={filterDateFrom} onChange={e => { setFilterDateFrom(e.target.value); setPage(1) }} className={styles.filterInput} placeholder="من تاريخ" />
              <input type="date" value={filterDateTo}   onChange={e => { setFilterDateTo(e.target.value); setPage(1) }}   className={styles.filterInput} placeholder="إلى تاريخ" />
              {(filterStatus || filterMethod || filterDateFrom || filterDateTo) && (
                <button onClick={resetFilters} className={styles.resetBtn}>مسح الفلاتر</button>
              )}
              <span className={styles.totalBadge}>{total} سجل</span>
            </div>

            {/* تنبيه لو access_log غير مفعّل */}
            {tab === 'access' && !accessLogEnabled && (
              <div className={styles.migrationWarning}>
                <AlertTriangle size={18} />
                <div>
                  <strong>جدول سجل الطلبات غير موجود</strong>
                  <p>شغّل هذا الأمر لتفعيله:</p>
                  <code>docker compose exec -T postgres psql -U ajwaa -d ajwaa_db &lt; db/migrate_add_access_log.sql</code>
                </div>
              </div>
            )}

            {/* الجدول */}
            {logs.length === 0 ? (
              <div className={styles.empty}><AlertTriangle size={40} /><p>لا توجد سجلات</p></div>
            ) : (
              <>
                <div className={styles.tableWrapper}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>الوقت</th>
                        <th>Method</th>
                        <th>المسار</th>
                        <th>الكود</th>
                        {tab === 'access' && <th><Clock size={13} /> مدة</th>}
                        {tab === 'errors' && <th>الخطأ</th>}
                        <th><Users size={13} /> المستخدم</th>
                        <th>IP</th>
                        {tab === 'errors' && <th></th>}
                      </tr>
                    </thead>
                    <tbody>
                      {logs.map(log => (
                        <React.Fragment key={log.id}>
                          <tr
                            className={`${styles.row} ${tab === 'errors' ? styles.clickable : ''}`}
                            onClick={() => tab === 'errors' && setExpandedId(expandedId === log.id ? null : log.id)}
                          >
                            <td className={styles.idCell}>{log.id}</td>
                            <td className={styles.dateCell}>{fmt(log.created_at)}</td>
                            <td>
                              <span className={styles.methodBadge} style={{ background: METHOD_COLOR[log.method] || '#6b7280' }}>
                                {log.method}
                              </span>
                            </td>
                            <td className={styles.pathCell} title={log.path}>{log.path}</td>
                            <td>
                              <span className={styles.statusBadge} style={{ background: STATUS_COLOR[log.status_code] || '#6b7280' }}>
                                {log.status_code}
                              </span>
                            </td>
                            {tab === 'access' && (
                              <td className={log.duration_ms > 2000 ? styles.slow : ''}>
                                {log.duration_ms}ms
                              </td>
                            )}
                            {tab === 'errors' && (
                              <td className={styles.messageCell} title={log.error_message}>
                                {log.error_message?.substring(0, 50)}{log.error_message?.length > 50 ? '…' : ''}
                              </td>
                            )}
                            <td>{log.full_name || log.username || <span className={styles.anonymous}>غير مسجّل</span>}</td>
                            <td className={styles.ipCell}>{log.ip || '-'}</td>
                            {tab === 'errors' && (
                              <td>{expandedId === log.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}</td>
                            )}
                          </tr>
                          {tab === 'errors' && expandedId === log.id && (
                            <tr className={styles.expandedRow}>
                              <td colSpan={9}>
                                <div className={styles.stackTrace}>
                                  <strong>الرسالة الكاملة:</strong>
                                  <pre>{log.error_message}</pre>
                                  {log.error_stack && <><strong>Stack Trace:</strong><pre>{log.error_stack}</pre></>}
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>

                {totalPages > 1 && (
                  <div className={styles.pagination}>
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className={styles.pageBtn}>السابق</button>
                    <span>صفحة {page} من {totalPages} ({total} إجمالي)</span>
                    <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className={styles.pageBtn}>التالي</button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </Layout>
  )
}

function StatsView({ stats }) {
  if (!stats) return null
  return (
    <div className={styles.statsContainer}>
      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} ${styles.statBlue}`}>
          <Activity size={28} />
          <div><p className={styles.statNum}>{stats.today?.requests ?? 0}</p><p className={styles.statLabel}>طلب اليوم</p></div>
        </div>
        <div className={`${styles.statCard} ${styles.statRed}`}>
          <AlertTriangle size={28} />
          <div><p className={styles.statNum}>{stats.today?.errors ?? 0}</p><p className={styles.statLabel}>خطأ اليوم</p></div>
        </div>
        <div className={`${styles.statCard} ${styles.statOrange}`}>
          <Clock size={28} />
          <div><p className={styles.statNum}>{stats.today?.slowRequests ?? 0}</p><p className={styles.statLabel}>طلب بطيء (+2ث)</p></div>
        </div>
        <div className={`${styles.statCard} ${styles.statGreen}`}>
          <Users size={28} />
          <div><p className={styles.statNum}>{stats.today?.activeUsers ?? 0}</p><p className={styles.statLabel}>مستخدم نشط اليوم</p></div>
        </div>
      </div>

      <div className={styles.statsRow}>
        {stats.errorsByCode?.length > 0 && (
          <div className={styles.statsCard}>
            <h3>توزيع الأخطاء اليوم</h3>
            {stats.errorsByCode.map(e => (
              <div key={e.status_code} className={styles.statsRow2}>
                <span className={styles.statusBadge} style={{ background: STATUS_COLOR[e.status_code] || '#6b7280' }}>{e.status_code}</span>
                <span>{e.count} خطأ</span>
              </div>
            ))}
          </div>
        )}
        {stats.topUsers?.length > 0 && (
          <div className={styles.statsCard}>
            <h3>أكثر المستخدمين نشاطاً اليوم</h3>
            {stats.topUsers.map((u, i) => (
              <div key={i} className={styles.statsRow2}>
                <span className={styles.userRank}>{i + 1}</span>
                <span>{u.full_name || u.username}</span>
                <span className={styles.reqCount}>{u.requests} طلب</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
