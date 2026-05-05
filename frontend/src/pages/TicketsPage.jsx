import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import { ticketAPI, serviceAPI } from '../services/api'
import api from '../services/api'
import { Plus, Search, Filter, ChevronLeft, ChevronRight, Download, X, User, Calendar } from 'lucide-react'
import toast from 'react-hot-toast'
import styles from './TicketsPage.module.css'

const PRIORITY_COLORS = {
  'حرجة': '#ef4444',
  'عالية': '#f59e0b',
  'متوسطة': '#3b82f6',
  'منخفضة': '#10b981',
}

const IMPACT_COLORS = {
  'عائق تشغيل':       { bg: '#fef2f2', color: '#dc2626' },
  'عائق غير تشغيلي': { bg: '#fff7ed', color: '#ea580c' },
  'غير عائق':         { bg: '#eff6ff', color: '#2563eb' },
  'تحسيني':           { bg: '#f0fdf4', color: '#15803d' },
}

const STATUS_COLORS = {
  'جديدة': { bg: '#eff6ff', color: '#1d4ed8' },
  'تحت الإجراء': { bg: '#fff7ed', color: '#c2410c' },
  'مغلقة': { bg: '#f0fdf4', color: '#15803d' },
}

export function TicketsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [tickets, setTickets] = useState([])
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterPriority, setFilterPriority] = useState('')
  const [filterService, setFilterService] = useState('')
  const [filterClassification, setFilterClassification] = useState('')
  const [filterImpact, setFilterImpact] = useState('')
  const [filterResponsibility, setFilterResponsibility] = useState('')
  const [filterCoordinator, setFilterCoordinator] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  const itemsPerPage = 15

  useEffect(() => {
    fetchTickets()
    fetchServices()
  }, [filterStatus, filterPriority, filterService, filterClassification, filterImpact, filterResponsibility, filterCoordinator, currentPage])

  const fetchTickets = async () => {
    try {
      setLoading(true)
      const params = {
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage,
      }
      if (filterStatus)         params.status = filterStatus
      if (filterPriority)       params.priority = filterPriority
      if (filterService)        params.service = filterService
      if (filterClassification) params.classification = filterClassification
      if (filterImpact)         params.impact = filterImpact
      if (filterResponsibility) params.responsibility = filterResponsibility
      if (filterCoordinator)    params.coordinator = filterCoordinator
      if (searchTerm)           params.search = searchTerm

      const response = await ticketAPI.list(params)
      const data = response.data
      const ticketList = Array.isArray(data) ? data : (data.tickets || [])
      const total = data.total ?? ticketList.length
      setTickets(ticketList)
      setTotalCount(total)
    } catch (error) {
      toast.error('فشل تحميل التذاكر')
      console.error('Failed to fetch tickets:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchServices = async () => {
    try {
      const response = await serviceAPI.list()
      setServices(response.data || [])
    } catch (error) {
      console.error('Failed to fetch services:', error)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setCurrentPage(1)
    if (currentPage === 1) fetchTickets()
  }

  const handleExport = async () => {
    try {
      const params = new URLSearchParams()
      if (filterStatus)         params.append('status', filterStatus)
      if (filterPriority)       params.append('priority', filterPriority)
      if (filterService)        params.append('service', filterService)
      if (filterClassification) params.append('classification', filterClassification)
      if (filterImpact)         params.append('impact', filterImpact)
      if (filterResponsibility) params.append('responsibility', filterResponsibility)
      if (filterCoordinator)    params.append('coordinator', filterCoordinator)

      const response = await api.get(`/export/excel?${params.toString()}`, {
        responseType: 'blob',
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      const fileName = `ajwaa-tickets-${new Date().toISOString().slice(0,10)}.xlsx`
      link.setAttribute('download', fileName)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (e) {
      toast.error('فشل التصدير')
    }
  }

  const resetFilters = () => {
    setFilterStatus('')
    setFilterPriority('')
    setFilterService('')
    setFilterClassification('')
    setFilterImpact('')
    setFilterResponsibility('')
    setFilterCoordinator('')
    setSearchTerm('')
    setCurrentPage(1)
  }

  const hasActiveFilters = filterStatus || filterPriority || filterService ||
    filterClassification || filterImpact || filterResponsibility || filterCoordinator || searchTerm

  const coordinators = [...new Map(
    services
      .filter(s => s.coordinator_id && s.coordinator_name)
      .map(s => [s.coordinator_id, { id: s.coordinator_id, name: s.coordinator_name }])
  ).values()]

  const paginatedTickets = tickets
  const totalPages = Math.ceil(totalCount / itemsPerPage)

  const fmt = (d) => {
    if (!d) return '-'
    const dt = new Date(d)
    const day   = String(dt.getDate()).padStart(2, '0')
    const month = String(dt.getMonth() + 1).padStart(2, '0')
    const year  = dt.getFullYear()
    return `${day}/${month}/${year}`
  }

  const isAdmin = user?.role === 'admin'
  const isManager = user?.role === 'manager'
  const isCoordinator = user?.role === 'coordinator'

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <h1 className={styles.title}>التذاكر</h1>
            <p className={styles.subtitle}>إدارة وتتبع جميع ملاحظات النظام</p>
          </div>
          <div className={styles.headerActions}>
            {(isAdmin || isManager || isCoordinator) && (
              <button onClick={handleExport} className={styles.exportButton}>
                <Download size={16} />
                تصدير Excel
              </button>
            )}
            {!isManager && (
              <Link to="/tickets/new" className={styles.newButton}>
                <Plus size={18} />
                تذكرة جديدة
              </Link>
            )}
          </div>
        </div>

        <div className={styles.filtersSection}>
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <div className={styles.searchInput}>
              <Search size={16} />
              <input
                type="text"
                placeholder="ابحث برقم التذكرة أو الوصف..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button type="submit" className={styles.searchButton}>بحث</button>
          </form>

          <div className={styles.filters}>
            <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1) }} className={styles.filterSelect}>
              <option value="">جميع الحالات</option>
              <option value="جديدة">جديدة</option>
              <option value="تحت الإجراء">تحت الإجراء</option>
              <option value="مغلقة">مغلقة</option>
            </select>

            <select value={filterPriority} onChange={(e) => { setFilterPriority(e.target.value); setCurrentPage(1) }} className={styles.filterSelect}>
              <option value="">جميع الأولويات</option>
              <option value="حرجة">حرجة</option>
              <option value="عالية">عالية</option>
              <option value="متوسطة">متوسطة</option>
              <option value="منخفضة">منخفضة</option>
            </select>

            <select value={filterClassification} onChange={(e) => { setFilterClassification(e.target.value); setCurrentPage(1) }} className={styles.filterSelect}>
              <option value="">جميع التصنيفات</option>
              <option value="تشغيلي">تشغيلي</option>
              <option value="تحليلي">تحليلي</option>
              <option value="نقل البيانات">نقل البيانات</option>
            </select>

            <select value={filterImpact} onChange={(e) => { setFilterImpact(e.target.value); setCurrentPage(1) }} className={styles.filterSelect}>
              <option value="">جميع مستويات الأثر</option>
              <option value="عائق تشغيل">عائق تشغيل</option>
              <option value="عائق غير تشغيلي">عائق غير تشغيلي</option>
              <option value="غير عائق">غير عائق</option>
              <option value="تحسيني">تحسيني</option>
            </select>

            <select value={filterResponsibility} onChange={(e) => { setFilterResponsibility(e.target.value); setCurrentPage(1) }} className={styles.filterSelect}>
              <option value="">جميع المسؤوليات</option>
              <option value="الهيئة">الهيئة</option>
              <option value="شركة علم">شركة علم</option>
            </select>

            <select value={filterService} onChange={(e) => { setFilterService(e.target.value); setCurrentPage(1) }} className={styles.filterSelect}>
              <option value="">جميع الخدمات</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>{service.name}</option>
              ))}
            </select>

            {(isAdmin || isManager) && coordinators.length > 0 && (
              <select value={filterCoordinator} onChange={(e) => { setFilterCoordinator(e.target.value); setCurrentPage(1) }} className={styles.filterSelect}>
                <option value="">جميع المنسقين</option>
                {coordinators.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            )}

            {hasActiveFilters && (
              <button onClick={resetFilters} className={styles.resetBtn}>
                <X size={14} /> مسح الفلاتر
              </button>
            )}
          </div>

          <div className={styles.infoBar}>
            <span className={styles.totalBadge}>{totalCount} تذكرة</span>
            {hasActiveFilters && <span className={styles.filterNote}>نتائج مفلترة</span>}
          </div>
        </div>

        {loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p>جاري تحميل التذاكر...</p>
          </div>
        ) : paginatedTickets.length > 0 ? (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>رقم التذكرة</th>
                  <th>الخدمة</th>
                  <th>الوصف</th>
                  <th>الحالة</th>
                  <th>الأولوية</th>
                  <th>الأثر</th>
                  <th>التصنيف</th>
                  {(isAdmin || isManager) && <th><User size={13} style={{verticalAlign:'middle'}} /> المنشئ</th>}
                  <th><Calendar size={13} style={{verticalAlign:'middle'}} /> التاريخ</th>
                </tr>
              </thead>
              <tbody>
                {paginatedTickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className={styles.tableRow}
                    onClick={() => navigate(`/tickets/${ticket.id}`)}
                  >
                    <td className={styles.ticketNumber}>{ticket.ticket_number}</td>
                    <td className={styles.serviceCell}>
                      {ticket.service_name || <span className={styles.generalBadge}>عامة</span>}
                    </td>
                    <td className={styles.description}>
                      {ticket.description?.length > 55
                        ? ticket.description.substring(0, 55) + '…'
                        : ticket.description}
                    </td>
                    <td>
                      <span
                        className={styles.statusBadge}
                        style={{
                          background: STATUS_COLORS[ticket.status]?.bg || '#f3f4f6',
                          color: STATUS_COLORS[ticket.status]?.color || '#374151',
                        }}
                      >
                        {ticket.status}
                      </span>
                    </td>
                    <td>
                      <span
                        className={styles.priorityBadge}
                        style={{ backgroundColor: PRIORITY_COLORS[ticket.priority] || '#6b7280' }}
                      >
                        {ticket.priority}
                      </span>
                    </td>
                    <td>
                      <span
                        className={styles.impactBadge}
                        style={{
                          background: IMPACT_COLORS[ticket.impact]?.bg || '#f3f4f6',
                          color: IMPACT_COLORS[ticket.impact]?.color || '#374151',
                        }}
                      >
                        {ticket.impact || '-'}
                      </span>
                    </td>
                    <td className={styles.classCell}>{ticket.classification || '-'}</td>
                    {(isAdmin || isManager) && (
                      <td className={styles.creatorCell}>{ticket.created_by_name || '-'}</td>
                    )}
                    <td className={styles.dateCell}>{fmt(ticket.updated_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={styles.paginationButton}
                >
                  <ChevronRight size={16} />
                </button>
                <span className={styles.pageInfo}>
                  صفحة {currentPage} من {totalPages} ({totalCount} إجمالي)
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className={styles.paginationButton}
                >
                  <ChevronLeft size={16} />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <Filter size={48} />
            <h3>لا توجد تذاكر</h3>
            <p>لم يتم العثور على أي تذاكر تطابق معايير البحث</p>
            {hasActiveFilters && (
              <button onClick={resetFilters} className={styles.resetBtn} style={{marginTop: 8}}>
                <X size={14} /> مسح الفلاتر
              </button>
            )}
          </div>
        )}
      </div>
    </Layout>
  )
}
