import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { signOut } from 'firebase/auth'
import { auth, db } from '@/lib/firebase'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { useAuth } from '@/context/AuthContext'
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { LayoutDashboardIcon, CheckSquareIcon, SendIcon, SquareIcon, BarChart3Icon, UsersIcon, AlertTriangle, FileTextIcon, Settings as SettingsIcon } from 'lucide-react'
import logoWithText from '@/assets/OpTraxx_Logo_withText.png'

export default function MainLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user: firebaseUser, userProfile } = useAuth()

  const user = {
    name: userProfile?.name || 'User',
    email: firebaseUser?.email || '',
    avatar: null,
    initials: (userProfile?.name || 'U').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
    role: userProfile?.role === 'supervisor' ? 'Supervisor' : 'Employee',
  }

  const isSupervisor = userProfile?.role === 'supervisor'

  // Live counts for sidebar badges
  const [openTaskCount, setOpenTaskCount] = useState(0)
  const [escalationCount, setEscalationCount] = useState(0)

  useEffect(() => {
    if (!firebaseUser?.uid) return
    const field = isSupervisor ? 'assignedBy' : 'assigneeId'
    const tasksQ = query(collection(db, 'tasks'), where(field, '==', firebaseUser.uid))
    return onSnapshot(tasksQ, (snap) => {
      const docs = snap.docs.map(d => d.data())
      setOpenTaskCount(docs.filter(d => d.status !== 'done').length)
      setEscalationCount(docs.filter(d => d.isEscalated === true && d.status !== 'done').length)
    })
  }, [firebaseUser?.uid, isSupervisor])

  const taskBadge = openTaskCount > 0 ? String(openTaskCount) : null
  const escalationBadge = escalationCount > 0 ? String(escalationCount) : null

  // OVERVIEW: Bird's Eye View (Data & Insights)
  const overviewItems = [
    ...(isSupervisor ? [{ id: 'dashboard', label: 'Dashboard', icon: LayoutDashboardIcon, path: '/dashboard/1' }] : []),
    { id: 'tasks', label: 'Task List', icon: CheckSquareIcon, path: '/tasks', badge: taskBadge },
    ...(!isSupervisor ? [{ id: 'my-forms', label: 'Forms', icon: FileTextIcon, path: '/my-forms' }] : []),
    ...(isSupervisor ? [{ id: 'analytics', label: 'Analytics', icon: BarChart3Icon, path: '/analytics' }] : []),
  ]

  // SUPERVISOR: Actions & Creation
  const supervisorItems = [
    { id: 'assign', label: 'Assign Tasks', icon: SendIcon, path: '/assign' },
    // Original teammate Form Builder (4-step UI, no save) — superseded by /forms-manage:
    // { id: 'form-builder', label: 'Form Builder', icon: SquareIcon, path: '/form-builder' },
    { id: 'forms-manage', label: 'Form Builder', icon: SquareIcon, path: '/forms-manage' },
  ]

  // TEAM: Team Management & Issues
  const teamItems = [
    ...(isSupervisor ? [{ id: 'team', label: 'My Team', icon: UsersIcon, path: '/team/1' }] : []),
    { id: 'escalations', label: 'Escalations', icon: AlertTriangle, path: '/escalations', badge: escalationBadge },
  ]

  const isActive = (path) => {
    const target = path.split('/')[1]
    const current = location.pathname.split('/')[1]
    return target === current
  }

  return (
    <SidebarProvider
      style={{
        '--sidebar-width': '14rem',
      }}
    >
      <Sidebar className="!bg-slate-950 !border-slate-950">
        <SidebarContent className="!bg-slate-950 !text-slate-200">
          {/* Logo */}
          <div className="px-4 py-6 mb-10 border-b border-slate-800">
            <Link to="/" className="flex items-center">
              <img src={logoWithText} alt="OpTraxx" className="h-8" />
            </Link>
          </div>

          {/* OVERVIEW Section - Bird's Eye Data */}
          <div className="px-2 mb-6">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Overview</p>
            <SidebarMenu className="gap-2">
              {overviewItems.map((item) => {
                const Icon = item.icon
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(item.path)}
                      className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-all ${
                        isActive(item.path)
                          ? '!bg-blue-600 !text-white'
                          : '!text-slate-300 hover:!bg-slate-800/50 hover:!text-white'
                      }`}
                    >
                      <Link to={item.path} className="flex items-center w-full gap-2">
                        <Icon size={18} />
                        <span className="text-sm">{item.label}</span>
                        {item.badge && (
                          <span className="ml-auto text-xs font-semibold bg-blue-600 text-white px-2 py-0.5 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </div>

          {/* SUPERVISOR Section - Actions & Creation */}
          {isSupervisor && (
            <div className="px-2 mb-6">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Supervisor</p>
              <SidebarMenu className="gap-2">
                {supervisorItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive(item.path)}
                        className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-all ${
                          isActive(item.path)
                            ? '!bg-blue-600 !text-white'
                            : '!text-slate-300 hover:!bg-slate-800/50 hover:!text-white'
                        }`}
                      >
                        <Link to={item.path} className="flex items-center w-full gap-2">
                          <Icon size={18} />
                          <span className="text-sm">{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </div>
          )}

          {/* TEAM Section - Team Management & Issues */}
          <div className="px-2 mb-6">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Team</p>
            <SidebarMenu className="gap-2">
              {teamItems.map((item) => {
                const Icon = item.icon
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(item.path)}
                      className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-all ${
                        isActive(item.path)
                          ? '!bg-blue-600 !text-white'
                          : '!text-slate-300 hover:!bg-slate-800/50 hover:!text-white'
                      }`}
                    >
                      <Link to={item.path} className="flex items-center w-full gap-2">
                        <Icon size={18} />
                        <span className="text-sm">{item.label}</span>
                        {item.badge && (
                          <span className="ml-auto text-xs font-semibold text-red-400 bg-red-500/20 px-2 py-0.5 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </div>

          {/* ACCOUNT Section */}
          <div className="px-2">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Account</p>
            <SidebarMenu className="gap-2">
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive('/settings')}
                  className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-all ${
                    isActive('/settings')
                      ? '!bg-blue-600 !text-white'
                      : '!text-slate-300 hover:!bg-slate-800/50 hover:!text-white'
                  }`}
                >
                  <Link to="/settings" className="flex items-center gap-2">
                    <SettingsIcon size={18} />
                    <span className="text-sm">Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </div>
        </SidebarContent>

        {/* User Footer */}
        <SidebarFooter className="!bg-slate-950 border-t border-slate-800">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 px-2 py-3 w-full hover:bg-slate-800 rounded-lg transition-colors cursor-pointer">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-blue-600 text-white text-sm font-semibold">
                    {user.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-medium text-white truncate">{user.name}</p>
                  <p className="text-xs text-slate-400 truncate">{user.role}</p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 mb-2">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/profile')}>Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')}>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={async () => { await signOut(auth); navigate('/login') }}>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        {/* Topbar */}
        <header className="sticky top-0 z-10 flex h-16 items-center border-b border-border bg-background px-8">
          <SidebarTrigger className="text-muted-foreground" />
        </header>

        {/* Main Content */}
        <main className="flex-1 bg-background p-8">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
