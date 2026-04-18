import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
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
import { LayoutDashboardIcon, CheckSquareIcon, SendIcon, SquareIcon, BarChart3Icon, UsersIcon, AlertTriangle, FileTextIcon } from 'lucide-react'
import logoWithText from '@/assets/OpTraxx_Logo_withText.png'

export default function MainLayout() {
  const location = useLocation()
  const navigate = useNavigate()

  // Mock user data - replace with actual user context later
  const user = {
    name: 'Jordan Davis',
    email: 'j.davis@company.com',
    avatar: null,
    initials: 'JD',
    role: 'Supervisor',
  }

  // OVERVIEW: Bird's Eye View (Data & Insights)
  const overviewItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboardIcon, path: '/dashboard/1' },
    { id: 'tasks', label: 'Task List', icon: CheckSquareIcon, path: '/tasks', badge: '12' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3Icon, path: '/analytics' },
  ]

  // SUPERVISOR: Actions & Creation
  const supervisorItems = [
    { id: 'assign', label: 'Assign Tasks', icon: SendIcon, path: '/assign' },
    { id: 'form-builder', label: 'Form Builder', icon: SquareIcon, path: '/form-builder' },
  ]

  // TEAM: Team Management & Issues
  const teamItems = [
    { id: 'team', label: 'My Team', icon: UsersIcon, path: '/team/1' },
    { id: 'escalations', label: 'Escalations', icon: AlertTriangle, path: '/escalations', badge: '3' },
  ]

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path.split('/')[1])

  return (
    <SidebarProvider
      style={{
        '--sidebar-width': '14rem',
      }}
    >
      <Sidebar className="!bg-slate-950 !border-slate-950">
        <SidebarContent className="!bg-slate-950 !text-slate-200">
          {/* Logo */}
          <div className="px-4 py-4 mb-8">
            <Link to="/">
              <img src={logoWithText} alt="OpTraxx" className="h-6" />
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
                  className="!text-slate-300 hover:!bg-slate-800/50 hover:!text-white px-3 py-2 rounded-lg"
                >
                  <Link to="/profile" className="flex items-center gap-2">
                    <FileTextIcon size={18} />
                    <span className="text-sm">Reports & Export</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </div>
        </SidebarContent>

        {/* User Footer */}
        <SidebarFooter className="!bg-slate-950 border-t border-slate-800">
          <div className="flex items-center gap-3 px-2 py-3">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-blue-600 text-white text-sm font-semibold">
                {user.initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.name}</p>
              <p className="text-xs text-slate-400 truncate">{user.role}</p>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        {/* Topbar */}
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-8">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="text-slate-600" />
          </div>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-blue-600 text-white text-sm font-semibold">
                      {user.initials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={async () => { await signOut(auth); navigate('/login') }}>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 bg-slate-50 p-8">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
