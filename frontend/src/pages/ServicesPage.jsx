import React, { useEffect, useState } from 'react'
import { Layout } from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import { serviceAPI, sectorAPI, departmentAPI, userAPI } from '../services/api'
import api from '../services/api'
import { Plus, Search, Edit, Trash2, RefreshCw, Filter, X } from 'lucide-react'
import toast from 'react-hot-toast'
import styles from './ServicesPage.module.css'

const STATUS_LABELS = {
  developing: 'قيد التطوير',
  uat: 'UAT',
  live: 'مطلقة',
  'قيد التطوير': 'قيد التطوير',
  'UAT': 'UAT',
  'مطلقة': 'مطلقة',
}

const EMPTY_FORM = {
  name: '',
  sector_id: '',
  department_id: '',
  coordinator_id: '',
  service_owner: '',
  status: '',
  phase_id: '',
}

export function ServicesPage() {
  const { user } = useAuth()
  const [services, setServices] = useState([])
  const [sectors, setSectors] = useState([])
  const [departments, setDepartments] = useState([])
  const [filteredDepts, setFilteredDepts] = useState([])
  const [coordinators, setCoordinators] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [editModal, setEditModal] = useState(null)
  const [editForm, setEditForm] = useState(EMPTY_FORM)
  const [editFilteredDepts, setEditFilteredDepts] = useState([])
  const [statusModal, setStatusModal] = useState(null)
  const [statusValue, setStatusValue] = useState('')

  // فلاتر البحث (للمشرف والمدير فقط)
  const [filterSector, setFilterSector] = useState('')
  const [filterDept, setFilterDept] = useState('')
  const [filterCoordinator, setFilterCoordinator] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterDeptOptions, setFilterDeptOptions] = useState([])

  useEffect(() => {
    fetchServices()
    if (user?.role === 'admin' || user?.role === 'manager') {
      fetchDropdownData()
    }
  }, [user])

  const fetchServices = async () => {
    try {
      setLoading(true)
      const params = {}
      if (filterSector) params.sector = filterSector
      if (filterDept) params.department = filterDept
      if (filterCoordinator) params.coordinator = filterCoordinator
      if (filterStatus) params.status = filterStatus
      const response = await serviceAPI.list(params)
      setServices(response.data || [])
    } catch (error) {
      toast.error('فشل تحميل الخدمات')
      console.error('Failed to fetch services:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchDropdownData = async () => {
    try {
      const [sectorsRes, deptsRes, usersRes] = await Promise.all([
        sectorAPI.list(),
        departmentAPI.list(),
        userAPI.list(),
      ])
      setSectors(sectorsRes.data || [])
      setDepartments(deptsRes.data || [])
      const allUsers = usersRes.data || []
      setCoordinators(allUsers.filter(u => u.role === 'coordinator'))
    } catch (error) {
      console.error('Failed to fetch dropdown data:', error)
    }
  }

  // إعادة جلب الخدمات عند تغيير أي فلتر
  useEffect(() => {
    if (user) fetchServices()
  }, [filterSector, filterDept, filterCoordinator, filterStatus])

  // عند تغيير قطاع الفلتر — تفلتر الإدارات تلقائياً
  const handleFilterSectorChange = (val) => {
    setFilterSector(val)
    setFilterDept('')
    if (val) {
      setFilterDeptOptions(departments.filter(d => String(d.sector_id) === String(val)))
    } else {
      setFilterDeptOptions(departments)
    }
  }

  const clearFilters = () => {
    setFilterSector('')
    setFilterDept('')
    setFilterCoordinator('')
    setFilterStatus('')
    setFilterDeptOptions(departments)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'sector_id') {
      // فلترة الإدارات بناءً على القطاع المختار
      const sectorDepts = departments.filter(d => String(d.sector_id) === String(value))
      setFilteredDepts(sectorDepts)
      setFormData(prev => ({ ...prev, sector_id: value, department_id: '' }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name) {
      toast.error('يرجى إدخال اسم الخدمة')
      return
    }

    try {
      await serviceAPI.create(formData)
      toast.success('تم إنشاء الخدمة بنجاح')
      setFormData(EMPTY_FORM)
      setFilteredDepts([])
      setShowForm(false)
      fetchServices()
    } catch (error) {
      toast.error('فشل إنشاء الخدمة')
      console.error('Failed to create service:', error)
    }
  }

  const openEdit = (service) => {
    setEditForm({
      name: service.name || '',
      sector_id: service.sector_id || '',
      department_id: service.department_id || '',
      coordinator_id: service.coordinator_id || '',
      service_owner: service.service_owner || service.owner || '',
      status: service.status || '',
      phase_id: service.phase_id || '',
    })
    const depts = departments.filter(d => String(d.sector_id) === String(service.sector_id))
    setEditFilteredDepts(depts)
    setEditModal(service)
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    if (name === 'sector_id') {
      const depts = departments.filter(d => String(d.sector_id) === String(value))
      setEditFilteredDepts(depts)
      setEditForm(prev => ({ ...prev, sector_id: value, department_id: '' }))
    } else {
      setEditForm(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleEditSave = async () => {
    if (!editForm.name) return toast.error('اسم الخدمة مطلوب')
    try {
      await api.put(`/services/${editModal.id}`, {
        name: editForm.name,
        sectorId: editForm.sector_id || null,
        departmentId: editForm.department_id || null,
        coordinatorId: editForm.coordinator_id || null,
        serviceOwner: editForm.service_owner || null,
        status: editForm.status || null,
        phaseId: editForm.phase_id || null,
      })
      toast.success('تم تعديل الخدمة')
      setEditModal(null)
      fetchServices()
    } catch (e) { toast.error(e.response?.data?.error || 'فشل التعديل') }
  }

  const openStatusModal = (service) => {
    setStatusValue(service.status || '')
    setStatusModal(service)
  }

  const handleStatusSave = async () => {
    try {
      await api.put(`/services/${statusModal.id}`, { status: statusValue })
      toast.success('تم تحديث حالة الخدمة')
      setStatusModal(null)
      fetchServices()
    } catch (e) { toast.error(e.response?.data?.error || 'فشل التحديث') }
  }

  const handleDelete = async (id, name) => {
    if (!confirm(`هل أنت متأكد من حذف خدمة "${name}"؟`)) return
    try {
      await api.delete(`/services/${id}`)
      toast.success('تم حذف الخدمة')
      fetchServices()
    } catch (e) { toast.error(e.response?.data?.error || 'فشل الحذف') }
  }

  const filteredServices = services.filter((service) =>
    (service.name || '').includes(searchTerm) ||
    (service.sector_name || service.sector || '').includes(searchTerm) ||
    (service.service_owner || service.owner || '').includes(searchTerm) ||
    (service.coordinator_name || service.coordinator || '').includes(searchTerm)
  )

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <h1 className={styles.title}>الخدمات</h1>
            <p className={styles.subtitle}>إدارة خدمات النظام والقطاعات</p>
          </div>
          {user?.role === 'admin' && (
            <button onClick={() => setShowForm(!showForm)} className={styles.newButton}>
              <Plus size={20} />
              خدمة جديدة
            </button>
          )}
        </div>

        {showForm && user?.role === 'admin' && (
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGrid}>

              {/* اسم الخدمة */}
              <div className={styles.formGroup}>
                <label htmlFor="name">اسم الخدمة *</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="أدخل اسم الخدمة"
                  className={styles.input}
                  required
                />
              </div>

              {/* القطاع */}
              <div className={styles.formGroup}>
                <label htmlFor="sector_id">القطاع</label>
                <select
                  id="sector_id"
                  name="sector_id"
                  value={formData.sector_id}
                  onChange={handleChange}
                  className={styles.select}
                >
                  <option value="">-- اختر القطاع --</option>
                  {sectors.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              {/* الإدارة */}
              <div className={styles.formGroup}>
                <label htmlFor="department_id">الإدارة</label>
                <select
                  id="department_id"
                  name="department_id"
                  value={formData.department_id}
                  onChange={handleChange}
                  className={styles.select}
                  disabled={!formData.sector_id}
                >
                  <option value="">-- اختر الإدارة --</option>
                  {filteredDepts.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              {/* المنسق */}
              <div className={styles.formGroup}>
                <label htmlFor="coordinator_id">المنسق</label>
                <select
                  id="coordinator_id"
                  name="coordinator_id"
                  value={formData.coordinator_id}
                  onChange={handleChange}
                  className={styles.select}
                >
                  <option value="">-- اختر المنسق --</option>
                  {coordinators.map(c => (
                    <option key={c.id} value={c.id}>{c.full_name || c.name}</option>
                  ))}
                </select>
              </div>

              {/* مالك الخدمة */}
              <div className={styles.formGroup}>
                <label htmlFor="service_owner">مالك الخدمة</label>
                <input
                  id="service_owner"
                  type="text"
                  name="service_owner"
                  value={formData.service_owner}
                  onChange={handleChange}
                  placeholder="أدخل اسم المالك"
                  className={styles.input}
                />
              </div>

              {/* الحالة */}
              <div className={styles.formGroup}>
                <label htmlFor="status">الحالة</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className={styles.select}
                >
                  <option value="">-- اختر الحالة --</option>
                  <option value="مطلقة">مطلقة</option>
                  <option value="قيد التطوير">قيد التطوير</option>
                  <option value="UAT">UAT</option>
                </select>
              </div>

            </div>

            <div className={styles.formActions}>
              <button type="submit" className={styles.submitButton}>
                إنشاء الخدمة
              </button>
              <button type="button" onClick={() => { setShowForm(false); setFormData(EMPTY_FORM); setFilteredDepts([]) }} className={styles.cancelButton}>
                إلغاء
              </button>
            </div>
          </form>
        )}

        <div className={styles.searchSection}>
          <div className={styles.searchInput}>
            <Search size={18} />
            <input
              type="text"
              placeholder="ابحث عن الخدمات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* فلاتر متقدمة — للمشرف والمدير فقط */}
        {(user?.role === 'admin' || user?.role === 'manager') && (
          <div className={styles.filtersRow}>
            <div className={styles.filterIcon}><Filter size={16} /></div>

            <select
              value={filterSector}
              onChange={(e) => handleFilterSectorChange(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">جميع القطاعات</option>
              {sectors.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>

            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              className={styles.filterSelect}
              disabled={!filterSector}
            >
              <option value="">جميع الإدارات</option>
              {(filterDeptOptions.length ? filterDeptOptions : departments).map(d =>
                <option key={d.id} value={d.id}>{d.name}</option>
              )}
            </select>

            <select
              value={filterCoordinator}
              onChange={(e) => setFilterCoordinator(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">جميع المنسقين</option>
              {coordinators.map(c => <option key={c.id} value={c.id}>{c.full_name || c.fullName}</option>)}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">جميع الحالات</option>
              <option value="مطلقة">مطلقة</option>
              <option value="قيد التطوير">قيد التطوير</option>
              <option value="UAT">UAT</option>
            </select>

            {(filterSector || filterDept || filterCoordinator || filterStatus) && (
              <button onClick={clearFilters} className={styles.clearFiltersBtn}>
                <X size={14} /> مسح الفلاتر
              </button>
            )}
          </div>
        )}

        {loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p>جاري تحميل الخدمات...</p>
          </div>
        ) : filteredServices.length > 0 ? (
          <div className={styles.servicesGrid}>
            {filteredServices.map((service) => (
              <div key={service.id} className={styles.serviceCard}>
                <div className={styles.serviceHeader}>
                  <h3 className={styles.serviceName}>{service.name}</h3>
                  <span className={styles.statusBadge}>
                    {STATUS_LABELS[service.status] || service.status || '-'}
                  </span>
                </div>

                <div className={styles.serviceDetails}>
                  {(service.sector_name || service.sector) && (
                    <div className={styles.detail}>
                      <span className={styles.label}>القطاع:</span>
                      <span className={styles.value}>{service.sector_name || service.sector}</span>
                    </div>
                  )}

                  {(service.department_name || service.department) && (
                    <div className={styles.detail}>
                      <span className={styles.label}>الإدارة:</span>
                      <span className={styles.value}>{service.department_name || service.department}</span>
                    </div>
                  )}

                  {(service.coordinator_name || service.coordinator) && (
                    <div className={styles.detail}>
                      <span className={styles.label}>المنسق:</span>
                      <span className={styles.value}>{service.coordinator_name || service.coordinator}</span>
                    </div>
                  )}

                  {(service.service_owner || service.owner) && (
                    <div className={styles.detail}>
                      <span className={styles.label}>مالك الخدمة:</span>
                      <span className={styles.value}>{service.service_owner || service.owner}</span>
                    </div>
                  )}

                  {(service.phase_name || service.phase) && (
                    <div className={styles.detail}>
                      <span className={styles.label}>المرحلة:</span>
                      <span className={styles.value}>{service.phase_name || service.phase}</span>
                    </div>
                  )}
                </div>

                {user?.role === 'admin' && (
                  <div className={styles.cardActions}>
                    <button onClick={() => openEdit(service)} className={styles.editBtn}>
                      <Edit size={14} /> تعديل
                    </button>
                    <button onClick={() => handleDelete(service.id, service.name)} className={styles.deleteBtn}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
                {user?.role === 'coordinator' && (
                  <div className={styles.cardActions}>
                    <button onClick={() => openStatusModal(service)} className={styles.editBtn}>
                      <RefreshCw size={14} /> تعديل الحالة
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p>لم يتم العثور على خدمات</p>
          </div>
        )}

        {/* مودال تعديل حالة الخدمة — للمنسق فقط */}
        {statusModal && (
          <div className={styles.modalOverlay} onClick={e => e.target === e.currentTarget && setStatusModal(null)}>
            <div className={styles.modal}>
              <h2 className={styles.modalTitle}>تعديل حالة: {statusModal.name}</h2>
              <div className={styles.formGroup}>
                <label>الحالة</label>
                <select value={statusValue} onChange={e => setStatusValue(e.target.value)} className={styles.select}>
                  <option value="">-- اختر الحالة --</option>
                  <option value="مطلقة">مطلقة</option>
                  <option value="قيد التطوير">قيد التطوير</option>
                  <option value="UAT">UAT</option>
                </select>
              </div>
              <div className={styles.modalActions}>
                <button onClick={handleStatusSave} className={styles.submitButton}><RefreshCw size={15} /> حفظ</button>
                <button onClick={() => setStatusModal(null)} className={styles.cancelButton}>إلغاء</button>
              </div>
            </div>
          </div>
        )}

        {/* مودال التعديل الكامل — للمشرف */}
        {editModal && (
          <div className={styles.modalOverlay} onClick={e => e.target === e.currentTarget && setEditModal(null)}>
            <div className={styles.modal}>
              <h2 className={styles.modalTitle}>تعديل خدمة: {editModal.name}</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className={styles.formGroup}>
                  <label>اسم الخدمة *</label>
                  <input type="text" name="name" value={editForm.name} onChange={handleEditChange} className={styles.input} />
                </div>
                <div className={styles.formGroup}>
                  <label>القطاع</label>
                  <select name="sector_id" value={editForm.sector_id} onChange={handleEditChange} className={styles.select}>
                    <option value="">-- اختر القطاع --</option>
                    {sectors.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>الإدارة</label>
                  <select name="department_id" value={editForm.department_id} onChange={handleEditChange} className={styles.select} disabled={!editForm.sector_id}>
                    <option value="">-- اختر الإدارة --</option>
                    {editFilteredDepts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>المنسق</label>
                  <select name="coordinator_id" value={editForm.coordinator_id} onChange={handleEditChange} className={styles.select}>
                    <option value="">-- اختر المنسق --</option>
                    {coordinators.map(c => <option key={c.id} value={c.id}>{c.full_name || c.name}</option>)}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>مالك الخدمة</label>
                  <input type="text" name="service_owner" value={editForm.service_owner} onChange={handleEditChange} className={styles.input} />
                </div>
                <div className={styles.formGroup}>
                  <label>الحالة</label>
                  <select name="status" value={editForm.status} onChange={handleEditChange} className={styles.select}>
                    <option value="">-- اختر الحالة --</option>
                    <option value="مطلقة">مطلقة</option>
                    <option value="قيد التطوير">قيد التطوير</option>
                    <option value="UAT">UAT</option>
                  </select>
                </div>
              </div>
              <div className={styles.modalActions}>
                <button onClick={handleEditSave} className={styles.submitButton}><Edit size={15} /> حفظ</button>
                <button onClick={() => setEditModal(null)} className={styles.cancelButton}>إلغاء</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

