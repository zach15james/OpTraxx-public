import { Outlet, Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
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
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'
import { LayoutDashboardIcon, UsersIcon, FileTextIcon, ChevronDownIcon, ChevronRightIcon } from 'lucide-react'
import logoWithText from '@/assets/OpTraxx_Logo_withText.png'

export default function MainLayout() {
  const location = useLocation()
  const [isTeamsOpen, setIsTeamsOpen] = useState(true)

  // Mock user data - replace with actual user context later
  const user = {
    name: 'John Doe',
    email: 'john@example.com',
    avatar: null,
    initials: 'JD',
  }

  // Mock teams data - replace with actual data from context/API
  const teams = [
    { id: '1', name: 'Engineering Team', role: 'Supervisor' },
    { id: '2', name: 'Design Team', role: 'Employee' },
    { id: '3', name: 'Marketing Team', role: 'Employee' },
  ]

  return (
    <SidebarProvider
      style={{
        '--sidebar-width': '12rem',
      }}
    >
      <Sidebar className="!bg-[#0F172A] !border-[#0F172A]">
        <SidebarContent className="!bg-[#0F172A]">
          <SidebarMenu className="gap-1">
            {/* Dashboard */}
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={location.pathname.startsWith('/dashboard')}
                className="!text-white hover:!bg-white/10 data-active:!bg-[#2563eb] data-active:!text-white [&>svg]:!text-white"
              >
                <Link to="/dashboard/1">
                  <LayoutDashboardIcon />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* Team - Collapsible */}
            <Collapsible open={isTeamsOpen} onOpenChange={setIsTeamsOpen} asChild>
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    isActive={location.pathname.startsWith('/team')}
                    className="!text-white hover:!bg-white/10 data-active:!bg-[#2563eb] data-active:!text-white [&>svg]:!text-white"
                  >
                    <UsersIcon />
                    <span>Team</span>
                    <ChevronRightIcon className="ml-auto transition-transform group-data-open/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub className="!border-white/20">
                    {teams.map((team) => (
                      <SidebarMenuSubItem key={team.id}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={location.pathname === `/team/${team.id}`}
                          className="!text-white/80 hover:!bg-white/10 hover:!text-white data-active:!bg-[#2563eb] data-active:!text-white"
                        >
                          <Link to={`/team/${team.id}`}>
                            <span>{team.name}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>

            {/* Forms */}
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={location.pathname.startsWith('/forms')}
                className="!text-white hover:!bg-white/10 data-active:!bg-[#2563eb] data-active:!text-white [&>svg]:!text-white"
              >
                <Link to="/forms">
                  <FileTextIcon />
                  <span>Forms</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>

      <SidebarInset>
        {/* Topbar */}
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-[#F8FAFC] px-6">
          {/* Left: Sidebar trigger + Logo */}
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <Link to="/dashboard/1" className="flex items-center">
              <img
                src={logoWithText}
                alt="OpTraxx"
                className="h-8"
              />
            </Link>
          </div>

          {/* Center-Left: My Dashboards Dropdown */}
          <div className="flex-1 px-8">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="gap-2 border-white bg-[#2563eb] text-white hover:bg-[#2563eb]/90"
                >
                  My Dashboards
                  <ChevronDownIcon className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64">
                <DropdownMenuLabel>Your Teams</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {teams.map((team) => (
                  <DropdownMenuItem key={team.id} asChild>
                    <Link
                      to={`/dashboard/${team.id}`}
                      className="flex flex-col items-start gap-0.5"
                    >
                      <span className="font-medium">{team.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {team.role}
                      </span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Right: User Avatar with Dropdown */}
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative size-8 rounded-full p-0">
                  <Avatar>
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-[#2563eb] text-white">
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
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
