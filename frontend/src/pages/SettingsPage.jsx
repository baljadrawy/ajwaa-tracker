import React, { useEffect, useState } from 'react'
import { Layout } from '../components/Layout'
import { userAPI, sectorAPI, departmentAPI, phaseAPI } from '../services/api'
import { Plus, Trash2, Edit, X, Search, Key, RotateCcw } from 'lucide-react'
import toast from 'react-hot-toast'
import styles from './SettingsPage.module.css'
import api from '../services/api'

const ROLE_LABELS = { admin: 'مشرف', coordinator: 'منسق', manager: 'مدير' }

// ─── مكوّن المودال العام ──────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div className={styles.modalOverlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <h2 className={styles.modalTitle}>{title}</h2>
        {children}
      </div>
    </div>
  )
}

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState('users')
  const [users, setUsers] = useState([])
  const [sectors, setSectors] = useState([])
  const [departments, setDepartments] = useState([])
  const [phases, setPhases] = useState([])
  const [loading, setLoading] = useState(true)

  // حالات المودال
  const [editModal, setEditModal] = useState(null)   // { type, item }
  const [pwModal, setPwModal] = useState(null)        // { userId, username }
  const [newPassword, setNewPassword] = useState('')
  const [editForm, setEditForm] = useState({})

  // فورم إضافة
  const [newUser, setNewUser] = useState({ name: '', username: '', role: 'coordinator', password: '' })
  const [newSector, setNewSector] = useState({ name: '' })
  const [newDepartment, setNewDepartment] = useState({ name: '', sectorId: '' })
  const [newPhase, setNewPhase] = useState({ name: '' })

  useEffect(() => { loadData() }, [activeTab])

  const loadData = async () => {
    try {
      setLoading(true)
      if (activeTab === 'users') {
        const r = await userAPI.list(); setUsers(r.data || [])
      } else if (activeTab === 'sectors') {
        const r = await sectorAPI.list(); setSectors(r.data || [])
      } else if (activeTab === 'departments') {
        const [dr, sr] = await Promise.all([departmentAPI.list(), sectorAPI.list()])
        setDepartments(dr.data || []); setSectors(sr.data || [])
      } else if (activeTab === 'phases') {
        const r = await phaseAPI.list(); setPhases(r.data || [])
      }
    } catch {
      toast.error('فشل تحميل البيانات')
    } finally {
      setLoading(false)
    }
  }

  // ─── إضافة ───────────────────────────────────────────────────────────
  const handleAddUser = async (e) => {
    e.preventDefault()
    if (!newUser.name || !newUser.username || !newUser.password) return toast.error('يرجى ملء جميع الحقول')
    try {
      await userAPI.create({ fullName: newUser.name, username: newUser.username, password: newUser.password, role: newUser.role })
      toast.success('تم إنشاء المستخدم')
      setNewUser({ name: '', username: '', role: 'coordinator', password: '' })
      loadData()
    } catch (e) { toast.error(e.response?.data?.error || 'فشل إنشاء المستخدم') }
  }

  const handleAddSector = async (e) => {
    e.preventDefault()
    if (!newSector.name) return toast.error('أدخل اسم القطاع')
    try {
      await sectorAPI.create(newSector)
      toast.success('تم إنشاء القطاع')
      setNewSector({ name: '' }); loadData()
    } catch { toast.error('فشل إنشاء القطاع') }
  }

  const handleAddDepartment = async (e) => {
    e.preventDefault()
    if (!newDepartment.name || !newDepartment.sectorId) return toast.error('أدخل الاسم والقطاع')
    try {
      await departmentAPI.create(newDepartment)
      toast.success('تم إنشاء الإدارة')
      setNewDepartment({ name: '', sectorId: '' }); loadData()
    } catch { toast.error('فشل إنشاء الإدارة') }
  }

  const handleAddPhase = async (e) => {
    e.preventDefault()
    if (!newPhase.name) return toast.error('أدخل اسم المرحلة')
    try {
      await phaseAPI.create(newPhase)
      toast.success('تم إنشاء المرحلة')
      setNewPhase({ name: '' }); loadData()
    } catch { toast.error('فشل إنشاء المرحلة') }
  }

  // ─── حذف ─────────────────────────────────────────────────────────────
  const handleDelete = async (type, id, name) => {
    if (!confirm(`هل أنت متأكد من حذف "${name}"؟`)) return
    try {
      if (type === 'user') await userAPI.delete(id)
      else if (type === 'sector') await api.delete(`/sectors/${id}`)
      else if (type === 'department') await api.delete(`/sectors/departments/${id}`)
      else if (type === 'phase') await api.delete(`/sectors/phases/${id}`)
      toast.success('تم الحذف')
      loadData()
    } catch (e) { toast.error(e.response?.data?.error || 'فشل الحذف') }
  }

  // ─── فتح مودال التعديل ───────────────────────────────────────────────
  const openEdit = (type, item) => {
    setEditModal({ type, item })
    if (type === 'user') setEditForm({ fullName: item.full_name, role: item.role, isActive: item.is_active })
    else if (type === 'sector') setEditForm({ name: item.name })
    else if (type === 'department') setEditForm({ name: item.name, sectorId: item.sector_id })
    else if (type === 'phase') setEditForm({ name: item.name })
  }

  const handleEditSave = async () => {
    const { type, item } = editModal
    try {
      if (type === 'user') await api.put(`/users/${item.id}`, editForm)
      else if (type === 'sector') await api.put(`/sectors/${item.id}`, editForm)
      else if (type === 'department') await api.put(`/sectors/departments/${item.id}`, editForm)
      else if (type === 'phase') await api.put(`/sectors/phases/${item.id}`, editForm)
      toast.success('تم التعديل بنجاح')
      setEditModal(null); loadData()
    } catch (e) { toast.error(e.response?.data?.error || 'فشل التعديل') }
  }

  // ─── تغيير كلمة المرور ───────────────────────────────────────────────
  const handleChangePassword = async () => {
    if (!newPassword || newPassword.length < 6) return toast.error('كلمة المرور يجب أن تكون 6 أحرف على الأقل')
    try {
      await api.put(`/users/${pwModal.userId}`, { password: newPassword })
      toast.success('تم تغيير كلمة المرور')
      setPwModal(null); setNewPassword('')
    } catch { toast.error('فشل تغيير كلمة المرور') }
  }

  const handleRestore = async (id, name) => {
    if (!confirm(`هل أنت متأكد من استعادة المستخدم "${name}"؟`)) return
    try {
      await userAPI.restore(id)
      toast.success('تم استعادة المستخدم')
      loadData()
    } catch (e) { toast.error(e.response?.data?.error || 'فشل الاستعادة') }
  }

  const getSectorName = (id) => sectors.find(s => s.id === id || String(s.id) === String(id))?.name || '-'

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>الإعدادات</h1>
          <p className={styles.subtitle}>إدارة المستخدمين والإعدادات العامة</p>
        </div>

        <div className={styles.tabs}>
          {['users', 'sectors', 'departments', 'phases'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`${styles.tab} ${activeTab === tab ? styles.activeTab : ''}`}>
              {{ users: 'المستخدمون', sectors: 'القطاعات', departments: 'الإدارات', phases: 'المراحل' }[tab]}
            </button>
          ))}
        </div>

        {loading ? (
          <div className={styles.loadingContainer}><div className={styles.spinner}></div><p>جاري التحميل...</p></div>
        ) : (
          <>
            {/* ── تبويب المستخدمين ── */}
            {activeTab === 'users' && (
              <div className={styles.tabContent}>
                <form onSubmit={handleAddUser} className={styles.form}>
                  <h2 className={styles.formTitle}>إضافة مستخدم جديد</h2>
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label>الاسم الكامل</label>
                      <input type="text" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} placeholder="الاسم" className={styles.input} />
                    </div>
                    <div className={styles.formGroup}>
                      <label>اسم المستخدم</label>
                      <input type="text" value={newUser.username} onChange={e => setNewUser({ ...newUser, username: e.target.value })} placeholder="username" className={styles.input} />
                    </div>
                    <div className={styles.formGroup}>
                      <label>كلمة المرور</label>
                      <input type="password" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} placeholder="••••••" className={styles.input} />
                    </div>
                    <div className={styles.formGroup}>
                      <label>الدور</label>
                      <select value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })} className={styles.select}>
                        <option value="admin">مشرف</option>
                        <option value="coordinator">منسق</option>
                        <option value="manager">مدير</option>
                      </select>
                    </div>
                  </div>
                  <button type="submit" className={styles.submitButton}><Plus size={18} /> إضافة مستخدم</button>
                </form>

                <div className={styles.table}>
                  <h2 className={styles.tableTitle}>
                    المستخدمون ({users.filter(u => u.is_active).length} نشط
                    {users.filter(u => !u.is_active).length > 0 && ` · ${users.filter(u => !u.is_active).length} معطل`})
                  </h2>
                  <table>
                    <thead>
                      <tr><th>الاسم</th><th>اسم المستخدم</th><th>الدور</th><th>الحالة</th><th>الإجراءات</th></tr>
                    </thead>
                    <tbody>
                      {users.map(u => (
                        <tr key={u.id} className={!u.is_active ? styles.inactiveRow : ''}>
                          <td>{u.full_name}</td>
                          <td>{u.username}</td>
                          <td><span className={`${styles.roleBadge} ${styles[u.role]}`}>{ROLE_LABELS[u.role] || u.role}</span></td>
                          <td><span className={`${styles.statusBadge} ${u.is_active ? styles.active : styles.inactive}`}>{u.is_active ? 'نشط' : 'معطل'}</span></td>
                          <td>
                            <div className={styles.actionButtons}>
                              {u.is_active ? (
                                <>
                                  <button onClick={() => openEdit('user', u)} className={styles.editButton} title="تعديل"><Edit size={15} /></button>
                                  <button onClick={() => { setPwModal({ userId: u.id, username: u.username }); setNewPassword('') }} className={styles.editButton} title="تغيير كلمة المرور"><Key size={15} /></button>
                                  <button onClick={() => handleDelete('user', u.id, u.full_name)} className={styles.deleteButton} title="تعطيل"><Trash2 size={15} /></button>
                                </>
                              ) : (
                                <button onClick={() => handleRestore(u.id, u.full_name)} className={styles.restoreButton} title="استعادة">
                                  <RotateCcw size={15} /> استعادة
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── تبويب القطاعات ── */}
            {activeTab === 'sectors' && (
              <div className={styles.tabContent}>
                <form onSubmit={handleAddSector} className={styles.form}>
                  <h2 className={styles.formTitle}>إضافة قطاع جديد</h2>
                  <div className={styles.formGroup}>
                    <label>اسم القطاع</label>
                    <input type="text" value={newSector.name} onChange={e => setNewSector({ name: e.target.value })} placeholder="أدخل اسم القطاع" className={styles.input} />
                  </div>
                  <button type="submit" className={styles.submitButton}><Plus size={18} /> إضافة قطاع</button>
                </form>

                <div className={styles.itemsList}>
                  <h2 className={styles.tableTitle}>القطاعات ({sectors.length})</h2>
                  {sectors.length > 0 ? sectors.map(s => (
                    <div key={s.id} className={styles.item}>
                      <span>{s.name}</span>
                      <div className={styles.actionButtons}>
                        <button onClick={() => openEdit('sector', s)} className={styles.editButton}><Edit size={15} /></button>
                        <button onClick={() => handleDelete('sector', s.id, s.name)} className={styles.deleteButton}><Trash2 size={15} /></button>
                      </div>
                    </div>
                  )) : <p className={styles.emptyMessage}>لا توجد قطاعات</p>}
                </div>
              </div>
            )}

            {/* ── تبويب الإدارات ── */}
            {activeTab === 'departments' && (
              <div className={styles.tabContent}>
                <form onSubmit={handleAddDepartment} className={styles.form}>
                  <h2 className={styles.formTitle}>إضافة إدارة جديدة</h2>
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label>اسم الإدارة</label>
                      <input type="text" value={newDepartment.name} onChange={e => setNewDepartment({ ...newDepartment, name: e.target.value })} placeholder="أدخل اسم الإدارة" className={styles.input} />
                    </div>
                    <div className={styles.formGroup}>
                      <label>القطاع</label>
                      <select value={newDepartment.sectorId} onChange={e => setNewDepartment({ ...newDepartment, sectorId: e.target.value })} className={styles.select}>
                        <option value="">-- اختر القطاع --</option>
                        {sectors.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                    </div>
                  </div>
                  <button type="submit" className={styles.submitButton}><Plus size={18} /> إضافة إدارة</button>
                </form>

                <div className={styles.itemsList}>
                  <h2 className={styles.tableTitle}>الإدارات ({departments.length})</h2>
                  {departments.length > 0 ? departments.map(d => (
                    <div key={d.id} className={styles.item}>
                      <div>
                        <div>{d.name}</div>
                        <div className={styles.itemSub}>{getSectorName(d.sector_id)}</div>
                      </div>
                      <div className={styles.actionButtons}>
                        <button onClick={() => openEdit('department', d)} className={styles.editButton}><Edit size={15} /></button>
                        <button onClick={() => handleDelete('department', d.id, d.name)} className={styles.deleteButton}><Trash2 size={15} /></button>
                      </div>
                    </div>
                  )) : <p className={styles.emptyMessage}>لا توجد إدارات</p>}
                </div>
              </div>
            )}

            {/* ── تبويب المراحل ── */}
            {activeTab === 'phases' && (
              <div className={styles.tabContent}>
                <form onSubmit={handleAddPhase} className={styles.form}>
                  <h2 className={styles.formTitle}>إضافة مرحلة جديدة</h2>
                  <div className={styles.formGroup}>
                    <label>اسم المرحلة</label>
                    <input type="text" value={newPhase.name} onChange={e => setNewPhase({ name: e.target.value })} placeholder="أدخل اسم المرحلة" className={styles.input} />
                  </div>
                  <button type="submit" className={styles.submitButton}><Plus size={18} /> إضافة مرحلة</button>
                </form>

                <div className={styles.itemsList}>
                  <h2 className={styles.tableTitle}>المراحل ({phases.length})</h2>
                  {phases.length > 0 ? phases.map(p => (
                    <div key={p.id} className={styles.item}>
                      <span>{p.name}</span>
                      <div className={styles.actionButtons}>
                        <button onClick={() => openEdit('phase', p)} className={styles.editButton}><Edit size={15} /></button>
                        <button onClick={() => handleDelete('phase', p.id, p.name)} className={styles.deleteButton}><Trash2 size={15} /></button>
                      </div>
                    </div>
                  )) : <p className={styles.emptyMessage}>لا توجد مراحل</p>}
                </div>
              </div>
            )}
          </>
        )}

        {/* ── مودال تغيير كلمة المرور ── */}
        {pwModal && (
          <Modal title={`تغيير كلمة مرور: ${pwModal.username}`} onClose={() => setPwModal(null)}>
            <div className={styles.formGroup}>
              <label>كلمة المرور الجديدة</label>
              <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
                placeholder="6 أحرف على الأقل" className={styles.input} autoFocus />
            </div>
            <div className={styles.modalActions}>
              <button onClick={handleChangePassword} className={styles.submitButton}><Key size={16} /> حفظ</button>
              <button onClick={() => setPwModal(null)} className={styles.cancelButton}>إلغاء</button>
            </div>
          </Modal>
        )}

        {/* ── مودال التعديل ── */}
        {editModal && (
          <Modal title={{ user: 'تعديل مستخدم', sector: 'تعديل قطاع', department: 'تعديل إدارة', phase: 'تعديل مرحلة' }[editModal.type]}
            onClose={() => setEditModal(null)}>

            {editModal.type === 'user' && (
              <>
                <div className={styles.formGroup} style={{ marginBottom: 14 }}>
                  <label>الاسم الكامل</label>
                  <input type="text" value={editForm.fullName || ''} onChange={e => setEditForm({ ...editForm, fullName: e.target.value })} className={styles.input} />
                </div>
                <div className={styles.formGroup} style={{ marginBottom: 14 }}>
                  <label>الدور</label>
                  <select value={editForm.role || ''} onChange={e => setEditForm({ ...editForm, role: e.target.value })} className={styles.select}>
                    <option value="admin">مشرف</option>
                    <option value="coordinator">منسق</option>
                    <option value="manager">مدير</option>
                  </select>
                </div>
                <div className={styles.formGroup} style={{ marginBottom: 14 }}>
                  <label>الحالة</label>
                  <select value={editForm.isActive ? 'true' : 'false'} onChange={e => setEditForm({ ...editForm, isActive: e.target.value === 'true' })} className={styles.select}>
                    <option value="true">نشط</option>
                    <option value="false">معطل</option>
                  </select>
                </div>
              </>
            )}

            {(editModal.type === 'sector' || editModal.type === 'phase') && (
              <div className={styles.formGroup} style={{ marginBottom: 14 }}>
                <label>الاسم</label>
                <input type="text" value={editForm.name || ''} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className={styles.input} autoFocus />
              </div>
            )}

            {editModal.type === 'department' && (
              <>
                <div className={styles.formGroup} style={{ marginBottom: 14 }}>
                  <label>اسم الإدارة</label>
                  <input type="text" value={editForm.name || ''} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className={styles.input} autoFocus />
                </div>
                <div className={styles.formGroup} style={{ marginBottom: 14 }}>
                  <label>القطاع</label>
                  <select value={editForm.sectorId || ''} onChange={e => setEditForm({ ...editForm, sectorId: e.target.value })} className={styles.select}>
                    <option value="">-- اختر القطاع --</option>
                    {sectors.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              </>
            )}

            <div className={styles.modalActions}>
              <button onClick={handleEditSave} className={styles.submitButton}><Edit size={16} /> حفظ التعديلات</button>
              <button onClick={() => setEditModal(null)} className={styles.cancelButton}>إلغاء</button>
            </div>
          </Modal>
        )}
      </div>
    </Layout>
  )
}
