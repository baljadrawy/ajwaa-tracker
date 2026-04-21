import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Loader } from 'lucide-react'
import toast from 'react-hot-toast'
import styles from './LoginPage.module.css'

export function LoginPage() {
  const navigate = useNavigate()
  const { login, loading, isAuthenticated } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!username || !password) {
      toast.error('يرجى ملء جميع الحقول')
      return
    }

    const result = await login(username, password)
    if (result.success) {
      toast.success('تم تسجيل الدخول بنجاح')
      navigate('/dashboard')
    } else {
      toast.error(result.error || 'فشل تسجيل الدخول')
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <div className={styles.header}>
          <img src="/logo.png" alt="متابعة ملاحظات منصة أجواء" className={styles.logo} />
          <h1 className={styles.title}>متابعة ملاحظات منصة أجواء</h1>
          <p className={styles.subtitle}>نظام متابعة ملاحظات منصة أجواء</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="username">اسم المستخدم</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="أدخل اسم المستخدم"
              disabled={loading}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">كلمة المرور</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="أدخل كلمة المرور"
              disabled={loading}
              className={styles.input}
            />
          </div>

          <button type="submit" disabled={loading} className={styles.submitButton}>
            {loading ? (
              <>
                <Loader size={18} className={styles.spinner} />
                جاري تسجيل الدخول...
              </>
            ) : (
              'تسجيل الدخول'
            )}
          </button>
        </form>

        <div className={styles.footer}>
          <p className={styles.footerText}>
            منصة تتبع ملاحظات وتحسين خدمات أجواء
          </p>
        </div>
      </div>
    </div>
  )
}
