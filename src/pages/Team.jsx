import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  MessageSquare,
  Zap,
  TrendingUp,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Activity,
} from 'lucide-react'

export default function Team() {
  const [selectedMember, setSelectedMember] = useState(null)

  const teamMembers = [
    {
      id: 1,
      initials: 'AP',
      name: 'A. Patel',
      role: 'Senior Engineer',
      status: 'On-Site',
      statusColor: 'bg-green-100 text-green-800',
      statusIcon: '📍',
      workload: 85, // 0-100%
      tasksCompleted: 12,
      tasksPending: 3,
      trendData: [45, 52, 58, 65, 72, 78, 85],
      trendDirection: 'up',
      lastAction: '2 mins ago - Completed "Server Patch"',
      isOverloaded: true,
    },
    {
      id: 2,
      initials: 'JK',
      name: 'J. Kim',
      role: 'Frontend Engineer',
      status: 'In Field',
      statusColor: 'bg-blue-100 text-blue-800',
      statusIcon: '🛣️',
      workload: 45,
      tasksCompleted: 8,
      tasksPending: 1,
      trendData: [40, 38, 42, 45, 43, 44, 45],
      trendDirection: 'stable',
      lastAction: '15 mins ago - Started "Form Redesign"',
      isOverloaded: false,
    },
    {
      id: 3,
      initials: 'LC',
      name: 'L. Chen',
      role: 'QA Engineer',
      status: 'Clocked Out',
      statusColor: 'bg-slate-100 text-slate-800',
      statusIcon: '✓',
      workload: 20,
      tasksCompleted: 15,
      tasksPending: 0,
      trendData: [85, 82, 78, 72, 65, 45, 20],
      trendDirection: 'down',
      lastAction: '1 hour ago - Clocked out',
      isOverloaded: false,
    },
    {
      id: 4,
      initials: 'MR',
      name: 'M. Rivera',
      role: 'DevOps Engineer',
      status: 'On-Site',
      statusColor: 'bg-green-100 text-green-800',
      statusIcon: '📍',
      workload: 60,
      tasksCompleted: 10,
      tasksPending: 2,
      trendData: [55, 58, 60, 62, 60, 58, 60],
      trendDirection: 'stable',
      lastAction: '5 mins ago - Uploaded deployment logs',
      isOverloaded: false,
    },
  ]

  const liveActivity = [
    { time: '2 mins ago', action: 'A. Patel completed', task: 'Server Patch Deployment', icon: '✅' },
    { time: '5 mins ago', action: 'M. Rivera uploaded files for', task: 'Infrastructure Check', icon: '📤' },
    { time: '12 mins ago', action: 'J. Kim flagged blocker on', task: 'Form Redesign', icon: '⚠️' },
    { time: '18 mins ago', action: 'L. Chen clocked out from', task: 'Daily Tasks', icon: '🕐' },
    { time: '25 mins ago', action: 'A. Patel started task', task: 'Database Migration', icon: '▶️' },
  ]

  const overloadedMembers = teamMembers.filter(m => m.isOverloaded)

  const rebalanceWorkload = () => {
    if (overloadedMembers.length === 0) {
      alert('No overloaded team members!')
      return
    }
    const overloaded = overloadedMembers[0]
    const underutilized = teamMembers.find(m => m.workload < 50 && m.id !== overloaded.id)
    if (underutilized) {
      alert(`💡 Suggestion: Move non-urgent tasks from ${overloaded.name} to ${underutilized.name}`)
    }
  }

  const sendNudge = (memberName) => {
    alert(`📢 Nudge sent to ${memberName}`)
  }

  // Mini sparkline component
  const Sparkline = ({ data, direction }) => {
    const maxVal = Math.max(...data)
    const minVal = Math.min(...data)
    const range = maxVal - minVal || 1
    const points = data.map((v, i) => ({
      x: (i / (data.length - 1)) * 100,
      y: ((maxVal - v) / range) * 100,
    }))

    const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
    const color = direction === 'up' ? '#10b981' : direction === 'down' ? '#f97316' : '#6b7280'

    return (
      <svg viewBox="0 0 100 40" className="w-full h-10">
        <path d={pathD} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" />
        <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="1.5" fill={color} />
      </svg>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Team</h1>
          <p className="text-slate-600 mt-1">Real-time workload & accountability dashboard</p>
        </div>
        {overloadedMembers.length > 0 && (
          <Button onClick={rebalanceWorkload} className="bg-orange-600 hover:bg-orange-700 text-white">
            <Zap className="w-4 h-4 mr-2" />
            Rebalance Workload
          </Button>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-4 gap-6">
        {/* Team Member Cards */}
        <div className="col-span-3 space-y-6">
          {/* Workload At-A-Glance Grid */}
          <div className="grid grid-cols-2 gap-6">
            {teamMembers.map((member) => (
              <Card
                key={member.id}
                onClick={() => setSelectedMember(member.id)}
                className={`p-6 border-2 cursor-pointer transition-all ${
                  selectedMember === member.id
                    ? 'border-blue-500 shadow-lg bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Header with Avatar & Status */}
                <div className="flex items-start gap-4 mb-4">
                  {/* Capacity Ring */}
                  <div className="relative w-20 h-20 flex-shrink-0">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      {/* Background circle */}
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="6" />
                      {/* Progress circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke={member.workload > 70 ? '#ef4444' : member.workload > 50 ? '#f59e0b' : '#10b981'}
                        strokeWidth="6"
                        strokeDasharray={`${(member.workload / 100) * 283} 283`}
                        strokeLinecap="round"
                      />
                    </svg>
                    {/* Center Avatar */}
                    <Avatar className="absolute inset-0 m-auto h-16 w-16 bg-blue-600 text-white font-bold text-lg flex items-center justify-center">
                      <AvatarFallback className="bg-blue-600 text-white text-lg">{member.initials}</AvatarFallback>
                    </Avatar>
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900">{member.name}</h3>
                    <p className="text-xs text-slate-600 mb-2">{member.role}</p>
                    <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${member.statusColor}`}>
                      {member.statusIcon} {member.status}
                    </span>
                  </div>
                </div>

                {/* Workload Percentage */}
                <div className="mb-4 p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-end justify-between mb-2">
                    <p className="text-xs font-semibold text-slate-600 uppercase">Workload</p>
                    <p className="text-lg font-bold text-slate-900">{member.workload}%</p>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className={`h-full rounded-full transition-all ${
                        member.workload > 70 ? 'bg-red-600' : member.workload > 50 ? 'bg-yellow-600' : 'bg-green-600'
                      }`}
                      style={{ width: `${member.workload}%` }}
                    />
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-xs text-slate-600 mb-1">Completed</p>
                    <p className="text-2xl font-bold text-green-600">{member.tasksCompleted}</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-xs text-slate-600 mb-1">Pending</p>
                    <p className="text-2xl font-bold text-blue-600">{member.tasksPending}</p>
                  </div>
                </div>

                {/* Performance Trend */}
                <div className="mb-4">
                  <p className="text-xs font-semibold text-slate-600 uppercase mb-2">7-Day Trend</p>
                  <Sparkline data={member.trendData} direction={member.trendDirection} />
                </div>

                {/* Last Action */}
                <p className="text-xs text-slate-500 mb-4 pb-4 border-b border-slate-200">
                  {member.lastAction}
                </p>

                {/* Action Buttons */}
                <Button
                  onClick={() => sendNudge(member.name)}
                  className="w-full bg-blue-100 text-blue-700 hover:bg-blue-200 text-sm font-medium"
                >
                  <MessageSquare className="w-3 h-3 mr-2" />
                  Send Nudge
                </Button>
              </Card>
            ))}
          </div>

          {/* Overload Alert */}
          {overloadedMembers.length > 0 && (
            <Card className="p-4 border-orange-200 bg-orange-50">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-orange-900">⚠️ Team Alert</p>
                  <p className="text-sm text-orange-800 mt-1">
                    {overloadedMembers.map(m => m.name).join(' and ')} {overloadedMembers.length === 1 ? 'is' : 'are'} at over 70% workload.
                    Consider rebalancing tasks.
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Right Sidebar: Live Activity */}
        <div className="col-span-1 space-y-6">
          {/* Activity Header */}
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-900">Live Activity</h3>
            <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
          </div>

          {/* Activity Feed */}
          <Card className="p-4 space-y-4 border-slate-200">
            {liveActivity.map((activity, idx) => (
              <div key={idx} className="text-sm space-y-1 pb-4 border-b border-slate-200 last:border-0 last:pb-0">
                <p className="text-xs text-slate-500">{activity.time}</p>
                <div className="flex items-start gap-2">
                  <span className="text-lg flex-shrink-0">{activity.icon}</span>
                  <div>
                    <p className="text-slate-700">
                      <span className="font-medium text-slate-900">{activity.action}</span>
                    </p>
                    <p className="text-slate-600 font-medium">"{activity.task}"</p>
                  </div>
                </div>
              </div>
            ))}
          </Card>

          {/* Performance Summary */}
          <Card className="p-4 border-slate-200">
            <h4 className="font-bold text-slate-900 mb-3">Team Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Avg Workload</span>
                <span className="font-bold text-slate-900">
                  {Math.round(teamMembers.reduce((a, b) => a + b.workload, 0) / teamMembers.length)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Total Completed</span>
                <span className="font-bold text-slate-900">
                  {teamMembers.reduce((a, b) => a + b.tasksCompleted, 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Pending Tasks</span>
                <span className="font-bold text-slate-900">
                  {teamMembers.reduce((a, b) => a + b.tasksPending, 0)}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}