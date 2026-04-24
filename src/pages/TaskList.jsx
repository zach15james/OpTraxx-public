import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ChevronDown, Search } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useTaskList } from '@/hooks/useTaskList'
import JoinTeamCard from '@/components/JoinTeamCard'

export default function TaskList() {
  const [sortBy, setSortBy] = useState('due-date')
  const { user, userProfile } = useAuth()
  const { tasks: firestoreTasks, loading } = useTaskList({ uid: user?.uid })

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  const tasks = firestoreTasks.length > 0 ? firestoreTasks : [
    {
      id: 1,
      name: 'Server Patch Deployment — Prod',
      assignee: { initials: 'AP', name: 'A. Patel' },
      status: 'In Progress',
      statusColor: 'bg-blue-100 text-blue-800',
      priority: 'High',
      priorityColor: 'bg-red-100 text-red-800',
      dueDate: 'Mar 5',
      form: 'Server Deployment',
    },
    {
      id: 2,
      name: 'Fix Critical Bug — Auth Service',
      assignee: { initials: 'JK', name: 'J. Kim' },
      status: 'Overdue',
      statusColor: 'bg-red-100 text-red-800',
      priority: 'High',
      priorityColor: 'bg-red-100 text-red-800',
      dueDate: 'Mar 2',
      form: 'Bug Report',
    },
    {
      id: 3,
      name: 'Code Review — Payment Module',
      assignee: { initials: 'LC', name: 'L. Chen' },
      status: 'Done',
      statusColor: 'bg-green-100 text-green-800',
      priority: 'Medium',
      priorityColor: 'bg-yellow-100 text-yellow-800',
      dueDate: 'Mar 4',
      form: 'Code Review',
    },
    {
      id: 4,
      name: 'Deploy Monitoring Stack — Prod',
      assignee: { initials: 'MR', name: 'M. Rivera' },
      status: 'Pending',
      statusColor: 'bg-yellow-100 text-yellow-800',
      priority: 'Medium',
      priorityColor: 'bg-yellow-100 text-yellow-800',
      dueDate: 'Mar 8',
      form: 'Deployment',
    },
    {
      id: 5,
      name: 'Database Migration v2.1',
      assignee: { initials: 'AP', name: 'A. Patel' },
      status: 'In Progress',
      statusColor: 'bg-blue-100 text-blue-800',
      priority: 'High',
      priorityColor: 'bg-red-100 text-red-800',
      dueDate: 'Mar 10',
      form: 'Infrastructure',
    },
    {
      id: 6,
      name: 'Security Vulnerability Audit',
      assignee: { initials: 'LC', name: 'L. Chen' },
      status: 'Pending',
      statusColor: 'bg-yellow-100 text-yellow-800',
      priority: 'High',
      priorityColor: 'bg-red-100 text-red-800',
      dueDate: 'Mar 12',
      form: 'Security Audit',
    },
  ]

  const statusOptions = [
    { label: 'All Status', value: 'all' },
    { label: 'In Progress', value: 'in-progress' },
    { label: 'Done', value: 'done' },
    { label: 'Pending', value: 'pending' },
    { label: 'Overdue', value: 'overdue' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Task List</h1>
          <p className="text-slate-600 mt-1">Manage and track all assigned tasks</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          + Create Task
        </Button>
      </div>

      {/* Join Team Card - Show if no team */}
      {!userProfile?.teamId && <JoinTeamCard />}

      {/* Filters and Search */}
      <Card className="p-4 border-slate-200">
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search tasks..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium">
              All Status
              <ChevronDown size={16} />
            </button>
          </div>

          {/* Sort */}
          <div className="relative">
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium">
              Sort Due Date
              <ChevronDown size={16} />
            </button>
          </div>
        </div>
      </Card>

      {/* Tasks Table */}
      <Card className="border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                  <input type="checkbox" className="rounded" />
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                  Task Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                  Assignee
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                  Form
                </th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <input type="checkbox" className="rounded" />
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">
                    {task.name}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-7 w-7 bg-blue-600 text-white text-xs font-semibold flex items-center justify-center">
                        <AvatarFallback className="bg-blue-600 text-white text-xs">
                          {task.assignee.initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-slate-600">{task.assignee.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${task.statusColor}`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${task.priorityColor}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {task.dueDate}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {task.form}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
