import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  BarChart3, BookOpen, ChevronLeft, ChevronRight, CircleHelp, FileText,
  GraduationCap, LayoutDashboard, Menu, Settings, X,
} from 'lucide-react'

const navigation = [
  { label: 'Dashboard', to: '/', icon: LayoutDashboard },
  { label: 'AI Tutor', to: '/tutor', icon: CircleHelp },
  { label: 'My Resources', to: '/resources', icon: FileText },
  { label: 'Practice & Quizzes', to: '/practice', icon: BookOpen },
  { label: 'Learning Progress', to: '/progress', icon: BarChart3 },
  { label: 'Settings', to: '/settings', icon: Settings },
]

const pageTitles: Record<string, string> = {
  '/': 'Dashboard', '/tutor': 'AI Tutor', '/resources': 'My Resources',
  '/practice': 'Practice & Quizzes', '/progress': 'Learning Progress', '/settings': 'Settings',
}

interface AppLayoutProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export function AppLayout({ sidebarOpen, setSidebarOpen }: AppLayoutProps) {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const title = pageTitles[location.pathname] ?? 'Page not found'

  return (
    <div className={`app-shell${collapsed ? ' is-collapsed' : ''}`}>
      {sidebarOpen && <button className="drawer-scrim" aria-label="Close navigation" onClick={() => setSidebarOpen(false)} />}
      <aside className={`sidebar${sidebarOpen ? ' mobile-open' : ''}`} aria-label="Main navigation">
        <div className="brand-lockup">
          <div className="brand-mark" aria-hidden="true"><GraduationCap size={21} strokeWidth={2.2} /></div>
          <span className="brand-name">bolun<span>shika</span></span>
          <button className="icon-button mobile-close" onClick={() => setSidebarOpen(false)} aria-label="Close menu"><X size={19} /></button>
        </div>
        <p className="nav-caption">LEARN</p>
        <nav className="main-nav">
          {navigation.map(({ label, to, icon: Icon }) => (
            <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} onClick={() => setSidebarOpen(false)}>
              <Icon size={19} strokeWidth={1.8} /><span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-note"><div className="note-icon"><BookOpen size={16} /></div><div><strong>Small steps add up.</strong><p>Keep your learning streak going.</p></div></div>
          <div className="profile-row">
            <div className="avatar">AS</div>
            <div className="profile-text"><strong>Alex Student</strong><span>Demo profile</span></div>
            <NavLink className="profile-settings" to="/settings" aria-label="Profile settings"><Settings size={16} /></NavLink>
          </div>
        </div>
        <button className="collapse-toggle" onClick={() => setCollapsed(!collapsed)} aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
          {collapsed ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}
          {!collapsed && <span>Collapse menu</span>}
        </button>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <button className="icon-button mobile-menu" onClick={() => setSidebarOpen(true)} aria-label="Open menu"><Menu size={21} /></button>
          <div className="breadcrumb"><span>Workspace</span><span className="breadcrumb-separator">/</span><strong>{title}</strong></div>
          <div className="topbar-right"><span className="demo-badge"><span /> Demo workspace</span><div className="avatar avatar-small" title="Alex Student">AS</div></div>
        </header>
        <main className="page-content"><Outlet /></main>
      </div>
    </div>
  )
}
