import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Download } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { db } from '@/lib/firebase'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { subscribeAllSubmissions } from '@/zach_contributions/formStoreFirestore'

export default function Analytics() {
  const { user, userProfile } = useAuth()
  const [timePeriod, setTimePeriod] = useState('7days')
  const [tasks, setTasks] = useState([])
  const [submissions, setSubmissions] = useState([])
  const [members, setMembers] = useState([])

  useEffect(() => {
    if (!user?.uid) return
    const q = query(collection(db, 'tasks'), where('assignedBy', '==', user.uid))
    return onSnapshot(q, (snap) => {
      setTasks(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    })
  }, [user?.uid])

  useEffect(() => subscribeAllSubmissions(setSubmissions), [])

  useEffect(() => {
    if (!userProfile?.teamId) return
    const q = query(collection(db, 'users'), where('teamId', '==', userProfile.teamId))
    return onSnapshot(q, (snap) => {
      setMembers(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    })
  }, [userProfile?.teamId])

  const periodDays = timePeriod === '90days' ? 90 : timePeriod === '30days' ? 30 : 7
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - periodDays)

  const periodTasks = tasks.filter(t => {
    const created = t.createdAt?.toDate?.()
    return created ? created >= cutoff : true
  })
  const periodSubs = submissions.filter(s => (s.submittedAt || 0) >= cutoff.getTime())

  const completed = periodTasks.filter(t => t.status === 'done').length
  const totalTasks = periodTasks.length
  const completionRate = totalTasks > 0 ? Math.round((completed / totalTasks) * 100) : 0
  const escalations = tasks.filter(t => t.isEscalated && t.status !== 'done').length
  const onTimeCount = periodTasks.filter(t => {
    if (t.status !== 'done') return false
    const due = t.dueDate?.toDate?.()
    const completedAt = t.completedAt?.toDate?.()
    if (!due || !completedAt) return true
    return completedAt <= due
  }).length
  const onTimeRate = completed > 0 ? Math.round((onTimeCount / completed) * 100) : 0

  const metrics = [
    {
      label: 'Avg Completion Rate',
      value: `${completionRate}%`,
      change: `${completed} of ${totalTasks}`,
      changeType: 'positive',
    },
    {
      label: 'Forms Submitted',
      value: String(periodSubs.length),
      change: `Last ${periodDays} days`,
      changeType: 'positive',
    },
    {
      label: 'Escalations',
      value: String(escalations),
      change: escalations === 0 ? 'On track' : 'Needs attention',
      changeType: escalations === 0 ? 'positive' : 'negative',
    },
    {
      label: 'On-Time Rate',
      value: `${onTimeRate}%`,
      change: `${onTimeCount} of ${completed} completed`,
      changeType: 'positive',
    },
  ]

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const chartData = []
  for (let i = 6; i >= 0; i--) {
    const day = new Date(today)
    day.setDate(today.getDate() - i)
    const dayEnd = new Date(day)
    dayEnd.setDate(day.getDate() + 1)
    const dayCompleted = tasks.filter(t => {
      if (t.status !== 'done') return false
      const at = t.completedAt?.toDate?.() || t.updatedAt?.toDate?.()
      return at && at >= day && at < dayEnd
    }).length
    const dayOverdue = tasks.filter(t => {
      const due = t.dueDate?.toDate?.()
      return t.status === 'overdue' && due && due >= day && due < dayEnd
    }).length
    chartData.push({ day: dayLabels[day.getDay()], completed: dayCompleted, overdue: dayOverdue })
  }
  const maxValue = Math.max(...chartData.map(d => d.completed + d.overdue), 1)

  const statusCounts = {
    done: tasks.filter(t => t.status === 'done').length,
    in_progress: tasks.filter(t => t.status === 'in_progress').length,
    pending: tasks.filter(t => t.status === 'pending').length,
    overdue: tasks.filter(t => t.status === 'overdue').length,
  }
  const totalStatus = Object.values(statusCounts).reduce((a, b) => a + b, 0) || 1
  const pct = (n) => Math.round((n / totalStatus) * 100)
  const piePct = {
    done: pct(statusCounts.done),
    in_progress: pct(statusCounts.in_progress),
    pending: pct(statusCounts.pending),
    overdue: pct(statusCounts.overdue),
  }
  const pieCircumference = 250
  const pieDash = {
    done: (piePct.done / 100) * pieCircumference,
    in_progress: (piePct.in_progress / 100) * pieCircumference,
    pending: (piePct.pending / 100) * pieCircumference,
    overdue: (piePct.overdue / 100) * pieCircumference,
  }
  const pieOffset = {
    done: 0,
    in_progress: -pieDash.done,
    pending: -(pieDash.done + pieDash.in_progress),
    overdue: -(pieDash.done + pieDash.in_progress + pieDash.pending),
  }

  const employeeMembers = members.filter(m => m.role === 'employee')
  const performanceData = employeeMembers.map(m => {
    const memberTasks = periodTasks.filter(t => t.assigneeId === m.id)
    const mCompleted = memberTasks.filter(t => t.status === 'done').length
    const mOverdue = memberTasks.filter(t => t.status === 'overdue').length
    const mTotal = memberTasks.length
    const percentage = mTotal > 0 ? Math.round((mCompleted / mTotal) * 100) : 0
    return {
      initials: (m.name || m.email || 'X').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
      name: m.name || m.email || 'Member',
      completed: mCompleted,
      overdue: mOverdue,
      percentage,
      label: '',
      labelColor: '',
    }
  }).sort((a, b) => b.percentage - a.percentage)
  if (performanceData.length > 0 && performanceData[0].completed > 0) {
    performanceData[0].label = 'Top performer'
    performanceData[0].labelColor = 'text-green-600'
  }

  const handleExportCSV = () => {
    const headers = ['Task Name', 'Assignee', 'Status', 'Priority', 'Due Date', 'Created', 'Completed']
    const memberMap = Object.fromEntries(members.map(m => [m.id, m.name || m.email || 'Unknown']))
    const escape = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`
    const rows = periodTasks.map(t => [
      escape(t.name || ''),
      escape(memberMap[t.assigneeId] || 'Unassigned'),
      escape(t.status || 'pending'),
      escape(t.priority || ''),
      escape(t.dueDate?.toDate?.()?.toISOString().slice(0, 10) || ''),
      escape(t.createdAt?.toDate?.()?.toISOString().slice(0, 10) || ''),
      escape(t.completedAt?.toDate?.()?.toISOString().slice(0, 10) || ''),
    ].join(','))
    const csv = [headers.join(','), ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `optraxx-analytics-${periodDays}d-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Analytics</h1>
          <p className="text-slate-600 mt-1">Performance insights across your operation</p>
        </div>
        <div className="flex items-center gap-2">
          {[
            { label: '7 days', value: '7days' },
            { label: '30 days', value: '30days' },
            { label: '90 days', value: '90days' },
          ].map((period) => (
            <button
              key={period.value}
              onClick={() => setTimePeriod(period.value)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                timePeriod === period.value
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              {period.label}
            </button>
          ))}
          <button
            onClick={handleExportCSV}
            className="ml-4 flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-700 text-sm font-medium"
          >
            <Download size={16} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <Card key={metric.label} className="p-6 border-slate-200">
            <p className="text-sm text-slate-600 uppercase tracking-wide font-semibold">
              {metric.label}
            </p>
            <p className="text-3xl font-bold text-slate-900 mt-2">{metric.value}</p>
            <p className={`text-xs font-medium mt-2 ${metric.changeType === 'negative' ? 'text-red-600' : 'text-emerald-600'}`}>
              {metric.change}
            </p>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Task Completion Chart */}
        <Card className="p-6 border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Task Completion — Last 7 Days</h3>
          <div className="flex items-end justify-between gap-3 h-64">
            {chartData.map((data, idx) => {
              const completedHeight = (data.completed / maxValue) * 100
              const overdueHeight = (data.overdue / maxValue) * 100
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex flex-col-reverse gap-0.5 h-48">
                    {data.overdue > 0 && (
                      <div
                        className="w-full bg-red-500 rounded-t"
                        style={{ height: `${overdueHeight * 1.5}%` }}
                      />
                    )}
                    {data.completed > 0 && (
                      <div
                        className="w-full bg-blue-600 rounded-t"
                        style={{ height: `${completedHeight * 1.5}%` }}
                      />
                    )}
                  </div>
                  <span className="text-xs font-semibold text-slate-600">{data.day}</span>
                </div>
              )
            })}
          </div>
          <div className="flex gap-4 mt-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-600 rounded" />
              <span className="text-slate-600">Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded" />
              <span className="text-slate-600">Overdue</span>
            </div>
          </div>
        </Card>

        {/* Tasks by Status Pie Chart */}
        <Card className="p-6 border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Tasks by Status</h3>
          <div className="flex items-center justify-between">
            <div className="flex justify-center items-center">
              <svg className="w-40 h-40" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="20" />
                {piePct.done > 0 && (
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#10b981" strokeWidth="20"
                    strokeDasharray={`${pieDash.done} ${pieCircumference}`}
                    strokeDashoffset={pieOffset.done} transform="rotate(-90 50 50)" />
                )}
                {piePct.in_progress > 0 && (
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#3b82f6" strokeWidth="20"
                    strokeDasharray={`${pieDash.in_progress} ${pieCircumference}`}
                    strokeDashoffset={pieOffset.in_progress} transform="rotate(-90 50 50)" />
                )}
                {piePct.pending > 0 && (
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#f97316" strokeWidth="20"
                    strokeDasharray={`${pieDash.pending} ${pieCircumference}`}
                    strokeDashoffset={pieOffset.pending} transform="rotate(-90 50 50)" />
                )}
                {piePct.overdue > 0 && (
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#ef4444" strokeWidth="20"
                    strokeDasharray={`${pieDash.overdue} ${pieCircumference}`}
                    strokeDashoffset={pieOffset.overdue} transform="rotate(-90 50 50)" />
                )}
                <text x="50" y="55" textAnchor="middle" className="text-2xl font-bold" fill="#111827">
                  {piePct.done}%
                </text>
                <text x="50" y="70" textAnchor="middle" className="text-xs" fill="#6b7280">
                  Done
                </text>
              </svg>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between gap-8">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-600 rounded-full" />
                  <span className="text-slate-600">Completed</span>
                </div>
                <span className="font-bold text-slate-900">{piePct.done}%</span>
              </div>
              <div className="flex items-center justify-between gap-8">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-600 rounded-full" />
                  <span className="text-slate-600">In Progress</span>
                </div>
                <span className="font-bold text-slate-900">{piePct.in_progress}%</span>
              </div>
              <div className="flex items-center justify-between gap-8">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full" />
                  <span className="text-slate-600">Pending</span>
                </div>
                <span className="font-bold text-slate-900">{piePct.pending}%</span>
              </div>
              <div className="flex items-center justify-between gap-8">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <span className="text-slate-600">Overdue</span>
                </div>
                <span className="font-bold text-slate-900">{piePct.overdue}%</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Individual Performance */}
      <Card className="p-6 border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-900">Individual Performance</h3>
          <button
            onClick={handleExportCSV}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Export
          </button>
        </div>
        {performanceData.length === 0 ? (
          <p className="text-sm text-slate-500">No team members in this period.</p>
        ) : (
          <div className="space-y-4">
            {performanceData.map((member) => (
              <div key={member.name} className="flex items-center gap-4">
                <Avatar className="h-8 w-8 bg-blue-600 text-white text-xs font-semibold flex items-center justify-center flex-shrink-0">
                  <AvatarFallback className="bg-blue-600 text-white text-xs">
                    {member.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-slate-900">{member.name}</span>
                    <span className="text-xs text-slate-600">
                      {member.completed} completed • {member.overdue} overdue
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-green-600 h-full rounded-full"
                      style={{ width: `${member.percentage}%` }}
                    />
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-lg font-bold text-slate-900">{member.percentage}%</p>
                  {member.label && (
                    <p className={`text-xs font-semibold ${member.labelColor}`}>
                      ↑ {member.label}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
