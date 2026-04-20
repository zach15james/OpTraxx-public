import { useLocation, useNavigate } from 'react-router-dom'
import './Sidebar.css'

export default function Sidebar({ user = { initials: 'JD', name: 'John Doe' } }) {
  const location = useLocation()
  const navigate = useNavigate()

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', path: '/dashboard/1', icon: '◼' },
    { id: 'tasks', label: 'Task List', path: '/tasks', icon: '☑' },
    { id: 'assign', label: 'Assign Tasks', path: '/assign', icon: '📤' },
    { id: 'form-builder', label: 'Form Builder', path: '/form-builder', icon: '⊞' },
    { id: 'analytics', label: 'Analytics', path: '/analytics', icon: '▤' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <aside className="sidebar">
      {/* Navigation Items */}
      <div className="sidebar-nav">
        {navItems.map((item) => (
          <div
            key={item.id}
            className={`sidebar-item ${isActive(item.path) ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <span className="s-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </div>
        ))}
      </div>

      {/* User Avatar at Bottom */}
      <div className="sidebar-user">
        <div className="user-avatar av-ink">
          {user.initials}
        </div>
        <span className="user-name">{user.name}</span>
      </div>
    </aside>
  )
}
