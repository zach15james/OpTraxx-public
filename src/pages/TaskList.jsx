import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Search, Trash2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useTaskList } from '@/hooks/useTaskList'
import JoinTeamCard from '@/components/JoinTeamCard'
import { db } from '@/lib/firebase'
import { doc, deleteDoc } from 'firebase/firestore'

export default function TaskList() {
  const location = useLocation()
  const [sortBy, setSortBy] = useState('due-date')
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedIds, setSelectedIds] = useState([])
  const [deleting, setDeleting] = useState(false)
  const { user, userProfile } = useAuth()
  const { tasks, loading } = useTaskList({ uid: user?.uid, userRole: userProfile?.role })

  // Apply filter from navigation state if present
  useEffect(() => {
    if (location.state?.filterStatus) {
      setStatusFilter(location.state.filterStatus)
    }
  }, [location.state?.filterStatus])

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  const isSupervisor = userProfile?.role === 'supervisor'

  const priorityOrder = { High: 0, Medium: 1, Low: 2 }
  const filteredTasks = tasks
    .filter(t => statusFilter === 'all'
      || (statusFilter === 'in-progress' && t.rawStatus === 'in_progress')
      || t.rawStatus === statusFilter)
    .filter(t => !searchTerm.trim()
      || t.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .slice()
    .sort((a, b) => {
      if (sortBy === 'due-date') {
        // Sort by due date, with overdue tasks first
        const aOverdue = a.rawStatus === 'overdue' ? 0 : 1
        const bOverdue = b.rawStatus === 'overdue' ? 0 : 1
        if (aOverdue !== bOverdue) return aOverdue - bOverdue
        // Then sort by actual due date
        if (a.dueDateObj && b.dueDateObj) return a.dueDateObj - b.dueDateObj
        if (a.dueDateObj) return -1
        if (b.dueDateObj) return 1
        return 0
      }
      if (sortBy === 'priority') return (priorityOrder[a.priority] ?? 99) - (priorityOrder[b.priority] ?? 99)
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'status') return a.rawStatus.localeCompare(b.rawStatus)
      return 0
    })

  const allFilteredSelected = filteredTasks.length > 0 && filteredTasks.every(t => selectedIds.includes(t.id))

  const toggleOne = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const toggleAll = () => {
    if (allFilteredSelected) setSelectedIds([])
    else setSelectedIds(filteredTasks.map(t => t.id))
  }

  const deleteSelected = async () => {
    if (!isSupervisor || selectedIds.length === 0) return
    if (!confirm(`Delete ${selectedIds.length} task${selectedIds.length === 1 ? '' : 's'}?`)) return
    setDeleting(true)
    try {
      await Promise.all(selectedIds.map(id => deleteDoc(doc(db, 'tasks', id))))
      setSelectedIds([])
    } catch (err) {
      alert('Failed to delete: ' + (err.message || err))
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Task List</h1>
          <p className="text-slate-600 mt-1">Manage and track all assigned tasks</p>
        </div>
        {userProfile?.role === 'supervisor' && (
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
            <Link to="/assign">+ Assign Task</Link>
          </Button>
        )}
      </div>

      {/* Join Team Card - Show if no team */}
      {!userProfile?.teamId && <JoinTeamCard />}

      {/* Empty state */}
      {tasks.length === 0 && userProfile?.teamId && (
        <Card className="p-8 text-center border-dashed border-slate-300">
          <p className="text-slate-700 font-medium mb-1">No tasks yet</p>
          <p className="text-sm text-slate-500">
            {userProfile?.role === 'supervisor'
              ? 'Assign a form-backed task to a team member to get started.'
              : 'When your supervisor assigns you a task, it\'ll show up here.'}
          </p>
        </Card>
      )}

      {/* Filters and Search */}
      <Card className="p-4 border-slate-200">
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tasks..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
            <option value="overdue">Overdue</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="due-date">Sort by Due Date</option>
            <option value="priority">Sort by Priority</option>
            <option value="name">Sort by Name</option>
            <option value="status">Sort by Status</option>
          </select>
        </div>
      </Card>

      {/* Bulk action bar (supervisor only, when selection exists) */}
      {isSupervisor && selectedIds.length > 0 && (
        <Card className="p-3 border-blue-200 bg-blue-50 flex items-center justify-between">
          <p className="text-sm text-blue-800 font-medium">
            {selectedIds.length} task{selectedIds.length === 1 ? '' : 's'} selected
          </p>
          <div className="flex gap-2">
            <Button
              onClick={() => setSelectedIds([])}
              variant="outline"
              size="sm"
            >
              Clear
            </Button>
            <Button
              onClick={deleteSelected}
              disabled={deleting}
              size="sm"
              className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
            >
              <Trash2 size={14} className="mr-1" />
              {deleting ? 'Deleting…' : 'Delete'}
            </Button>
          </div>
        </Card>
      )}

      {/* Tasks Table */}
      <Card className="border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                  {isSupervisor ? (
                    <input
                      type="checkbox"
                      checked={allFilteredSelected}
                      onChange={toggleAll}
                      className="rounded cursor-pointer"
                    />
                  ) : null}
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
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => {
                const canComplete = task.formId && task.rawStatus !== 'done'
                return (
                  <tr key={task.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      {isSupervisor ? (
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(task.id)}
                          onChange={() => toggleOne(task.id)}
                          className="rounded cursor-pointer"
                        />
                      ) : null}
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
                    <td className="px-6 py-4 text-right">
                      {canComplete ? (
                        <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                          <Link to={`/my-forms/${task.formId}?taskId=${task.id}`}>
                            Complete
                          </Link>
                        </Button>
                      ) : task.rawStatus === 'done' ? (
                        <span className="text-xs text-green-600 font-medium">✓ Done</span>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
