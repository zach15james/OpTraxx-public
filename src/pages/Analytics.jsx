import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Download } from 'lucide-react'

export default function Analytics() {
  const [timePeriod, setTimePeriod] = useState('7days')

  const metrics = [
    {
      label: 'Avg Completion Rate',
      value: '79%',
      change: '+4% vs prior period',
      changeType: 'positive',
    },
    {
      label: 'Forms Submitted',
      value: '142',
      change: '+18 vs prior period',
      changeType: 'positive',
    },
    {
      label: 'Escalations',
      value: '3',
      change: '-2 vs prior period',
      changeType: 'positive',
    },
    {
      label: 'On-Time Rate',
      value: '89%',
      change: '+5% vs prior period',
      changeType: 'positive',
    },
  ]

  const performanceData = [
    {
      initials: 'AP',
      name: 'A. Patel',
      completed: 18,
      overdue: 0,
      percentage: 92,
      label: 'Top performer',
      labelColor: 'text-green-600',
    },
    {
      initials: 'LC',
      name: 'L. Chen',
      completed: 16,
      overdue: 0,
      percentage: 88,
      label: '',
      labelColor: '',
    },
  ]

  // Simple bar chart data for last 7 days
  const chartData = [
    { day: 'Mon', completed: 8, overdue: 1 },
    { day: 'Tue', completed: 10, overdue: 0 },
    { day: 'Wed', completed: 6, overdue: 2 },
    { day: 'Thu', completed: 9, overdue: 0 },
    { day: 'Fri', completed: 8, overdue: 1 },
    { day: 'Sat', completed: 5, overdue: 1 },
    { day: 'Sun', completed: 4, overdue: 2 },
  ]

  const maxValue = Math.max(...chartData.map(d => d.completed + d.overdue))

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Analytics</h1>
          <p className="text-slate-600 mt-1">Performance insights across your operation</p>
        </div>
        <div className="flex items-center gap-2">
          {['7 days', '30 days', '90 days'].map((period) => (
            <button
              key={period}
              onClick={() => setTimePeriod(period)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                timePeriod === period.toLowerCase().replace(' ', '')
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              {period}
            </button>
          ))}
          <button className="ml-4 flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-700 text-sm font-medium">
            <Download size={16} />
            Export CSV
          </button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
            <Download size={16} />
            Export PDF
          </Button>
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
            <p className="text-xs text-emerald-600 font-medium mt-2">
              ↑ {metric.change}
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
            {chartData.map((data) => {
              const total = data.completed + data.overdue
              const completedHeight = (data.completed / maxValue) * 100
              const overdueHeight = (data.overdue / maxValue) * 100
              return (
                <div key={data.day} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex flex-col-reverse gap-0.5 h-48">
                    {data.overdue > 0 && (
                      <div
                        className="w-full bg-red-500 rounded-t"
                        style={{ height: `${overdueHeight * 1.5}%` }}
                      />
                    )}
                    <div
                      className="w-full bg-blue-600 rounded-t"
                      style={{ height: `${completedHeight * 1.5}%` }}
                    />
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
                {/* Completed - 64% (Green) */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="20"
                  strokeDasharray="160 250"
                  transform="rotate(-90 50 50)"
                />
                {/* In Progress - 21% (Blue) */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="20"
                  strokeDasharray="52.5 250"
                  strokeDashoffset="-160"
                  transform="rotate(-90 50 50)"
                />
                {/* Pending - 8% (Orange) */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="20"
                  strokeDasharray="20 250"
                  strokeDashoffset="-212.5"
                  transform="rotate(-90 50 50)"
                />
                {/* Overdue - 7% (Red) */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="20"
                  strokeDasharray="17.5 250"
                  strokeDashoffset="-232.5"
                  transform="rotate(-90 50 50)"
                />
                <text x="50" y="55" textAnchor="middle" className="text-2xl font-bold" fill="#111827">
                  79%
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
                <span className="font-bold text-slate-900">64%</span>
              </div>
              <div className="flex items-center justify-between gap-8">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-600 rounded-full" />
                  <span className="text-slate-600">In Progress</span>
                </div>
                <span className="font-bold text-slate-900">21%</span>
              </div>
              <div className="flex items-center justify-between gap-8">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full" />
                  <span className="text-slate-600">Pending</span>
                </div>
                <span className="font-bold text-slate-900">8%</span>
              </div>
              <div className="flex items-center justify-between gap-8">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <span className="text-slate-600">Overdue</span>
                </div>
                <span className="font-bold text-slate-900">7%</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Individual Performance */}
      <Card className="p-6 border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-900">Individual Performance</h3>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">Export</button>
        </div>
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
      </Card>
    </div>
  )
}
