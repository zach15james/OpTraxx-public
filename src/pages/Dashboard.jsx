import { Link, useParams } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ArrowUp, ArrowDown, CheckCircle2, AlertCircle, Clock, TrendingUp } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useDashboard } from '@/hooks/useDashboard'

export default function Dashboard() {
  const { teamId } = useParams()
  const { user, userProfile } = useAuth()
  const { stats, activeTasks, teamMembers, recentActivity, loading } = useDashboard({ uid: user?.uid, teamId })

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  const statIcons = {
    'Open Tasks': Clock,
    'Completed': CheckCircle2,
    'Overdue': AlertCircle,
    'Completion Rate': TrendingUp,
  }

  const statColors = {
    'Open Tasks': 'text-blue-600',
    'Completed': 'text-green-600',
    'Overdue': 'text-red-600',
    'Completion Rate': 'text-emerald-600',
  }

  const enrichedStats = stats.map(stat => ({
    ...stat,
    icon: statIcons[stat.label] || Clock,
    color: statColors[stat.label] || 'text-blue-600',
  }))

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Good morning, {(userProfile?.name || 'User').split(' ')[0]} 👋
          </h1>
          <p className="text-slate-600 mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} • {userProfile?.role === 'supervisor' ? 'Supervisor' : 'Employee'} • <span className="font-medium">{activeTasks.length} open tasks</span>
          </p>
        </div>
        <Link to="/assign">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            + Assign Task
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6">
        {enrichedStats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="p-6 border-slate-200 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-600 uppercase tracking-wide font-semibold">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">{stat.value}</p>
                  <p
                    className={`text-xs mt-2 font-medium ${
                      stat.changeType === 'positive'
                        ? 'text-emerald-600'
                        : stat.changeType === 'negative'
                        ? 'text-red-600'
                        : 'text-slate-600'
                    }`}
                  >
                    {stat.changeType === 'positive' && '↑ '}
                    {stat.changeType === 'negative' && '↓ '}
                    {stat.change}
                  </p>
                </div>
                <Icon className={`${stat.color} opacity-30`} size={32} />
              </div>
            </Card>
          )
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Active Tasks */}
        <div className="col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Active Tasks</h2>
            <Link to="/tasks" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View all →
            </Link>
          </div>

          <div className="space-y-3">
            {activeTasks.map((task) => (
              <Card
                key={task.id}
                className={`p-4 border-slate-200 hover:shadow-md transition-all cursor-pointer ${
                  task.completed ? 'bg-slate-50' : 'bg-white'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3
                        className={`font-medium ${
                          task.completed
                            ? 'text-slate-500 line-through'
                            : 'text-slate-900'
                        }`}
                      >
                        {task.title}
                      </h3>
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${task.statusColor}`}
                      >
                        {task.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mt-1">{task.team}</p>
                  </div>
                  <p className="text-sm font-medium text-slate-600 whitespace-nowrap">
                    {task.dueDate}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* My Team */}
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-4">My Team</h2>
            <div className="space-y-3">
              {teamMembers.map((member) => (
                <Card key={member.name} className="p-3 border-slate-200 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8 bg-blue-600 text-white text-xs font-semibold flex items-center justify-center flex-shrink-0">
                      <AvatarFallback className="bg-blue-600 text-white text-xs">
                        {member.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900">{member.name}</p>
                      <p className="text-xs text-slate-600">{member.role}</p>
                      <p className={`text-xs font-semibold mt-1 ${member.openColor}`}>
                        {member.open}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {recentActivity.map((activity, idx) => (
                <div key={idx} className="flex gap-3 pb-3 border-b border-slate-200 last:border-0">
                  <Avatar className="h-7 w-7 bg-blue-600 text-white text-xs font-semibold flex items-center justify-center flex-shrink-0">
                    <AvatarFallback className="bg-blue-600 text-white text-xs">
                      {activity.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-600">
                      <span className="font-semibold text-slate-900">{activity.name}</span>{' '}
                      {activity.action}{' '}
                      <span className="font-medium">{activity.task}</span>
                    </p>
                    <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}