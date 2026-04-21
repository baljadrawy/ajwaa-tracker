import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard,
  Ticket,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Briefcase,
  AlertTriangle,
} from 'lucide-react'
import styles from './Layout.module.css'

export function Layout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navItems = [
    {
      label: 'لوحة التحكم',
      href: '/dashboard',
      icon: LayoutDashboard,
      roles: ['admin', 'coordinator', 'manager'],
    },
    {
      label: 'التذاكر',
      href: '/tickets',
      icon: Ticket,
      roles: ['admin', 'coordinator', 'manager'],
    },
    {
      label: 'الخدمات',
      href: '/services',
      icon: Briefcase,
      roles: ['admin', 'coordinator'],
    },
    {
      label: 'الإعدادات',
      href: '/settings',
      icon: Settings,
      roles: ['admin'],
    },
    {
      label: 'سجل الأخطاء',
      href: '/logs',
      icon: AlertTriangle,
      roles: ['admin'],
    },
  ]

  const visibleNavItems = navItems.filter((item) => item.roles.includes(user?.role))

  const isActive = (href) => location.pathname === href || location.pathname.startsWith(href + '/')

  return (
    <div className={styles.layout}>
      <nav className={styles.navbar}>
        <div className={styles.navbarContent}>
          <div className={styles.navbarLeft}>
            <button
              className={styles.sidebarToggle}
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <img src="/logo.png" alt="متابعة ملاحظات منصة أجواء" className={styles.logo} />
            <h1 className={styles.appName}>متابعة ملاحظات منصة أجواء</h1>
          </div>

          <div className={styles.navbarRight}>
            <div className={styles.userMenu}>
              <button
                className={styles.userMenuButton}
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <div className={styles.userInfo}>
                  <span className={styles.userName}>{user?.fullName || user?.username}</span>
                  <span className={styles.userRole}>
                    {
                      {
                        admin: 'مشرف',
                        coordinator: 'منسق',
                        manager: 'مدير',
                      }[user?.role]
                    }
                  </span>
                </div>
                <ChevronDown size={18} />
              </button>

              {userMenuOpen && (
                <div className={styles.userMenuDropdown}>
                  <button onClick={handleLogout} className={styles.logoutButton}>
                    <LogOut size={18} />
                    تسجيل الخروج
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className={styles.mainContainer}>
        <aside className={`${styles.sidebar} ${!sidebarOpen ? styles.sidebarClosed : ''}`}>
          <nav className={styles.sidebarNav}>
            {visibleNavItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`${styles.navLink} ${isActive(item.href) ? styles.active : ''}`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </aside>

        <main className={styles.mainContent}>{children}</main>
      </div>
    </div>
  )
}
