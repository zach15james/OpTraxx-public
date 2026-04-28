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
import { doc, deleteDoc, updateDoc } from 'firebase/firestore'

export default function TaskList() {
  const location = useLocation()
  const [sortBy, setSortBy] = useState('due-date')
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedIds, setSelectedIds] = useState([])
  const [deleting, setDeleting] = useState(false)
  const [unassigningIds, setUnassigningIds] = useState([])
  const [bulkUnassigning, setBulkUnassigning] = useState(false)
  const { user, userProfile } = useAuth()
  const { tasks, loading } = useTaskList({ uid: user?.uid, userRole: userProfile?.role })

  useEffect(() => {
    if (location.state?.filterStatus) {
      setStatusFilter(location.state.filterStatus)
    }
  }, [location.state?.filterStatus])

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
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
        const aOverdue = a.rawStatus === 'overdue' ? 0 : 1
        const bOverdue = b.rawStatus === 'overdue' ? 0 : 1
        if (aOverdue !== bOverdue) return aOverdue - bOverdue
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

  const unassignTask = async (taskId) => {
    if (!isSupervisor) return
    if (!confirm('Unassign this task from its current employee?')) return

    setUnassigningIds(prev => [...prev, taskId])
    try {
      await updateDoc(doc(db, 'tasks', taskId), {
        assigneeId: null,
        status: 'pending',
      })
      setSelectedIds(prev => prev.filter(id => id !== taskId))
    } catch (err) {
      alert('Failed to unassign task: ' + (err.message || err))
    } finally {
      setUnassigningIds(prev => prev.filter(id => id !== taskId))
    }
  }

  const unassignSelected = async () => {
    if (!isSupervisor || selectedIds.length === 0) return
    if (!confirm(`Unassign ${selectedIds.length} task${selectedIds.length === 1 ? '' : 's'} from ${selectedIds.length === 1 ? 'this employee' : 'these employees'}?`)) return

    setBulkUnassigning(true)
    try {
      await Promise.all(
        selectedIds.map(id =>
          updateDoc(doc(db, 'tasks', id), {
            assigneeId: null,
            status: 'pending',
          })
        )
      )
      setSelectedIds([])
    } catch (err) {
      alert('Failed to unassign selected tasks: ' + (err.message || err))
    } finally {
      setBulkUnassigning(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Task List</h1>
          <p className="mt-1 text-slate-600">Manage and track all assigned tasks</p>
        </div>
        {isSupervisor && (
          <Button asChild className="bg-blue-600 text-white hover:bg-blue-700">
            <Link to="/assign">+ Assign Task</Link>
          </Button>
        )}
      </div>

      {!userProfile?.teamId && <JoinTeamCard />}

      {tasks.length === 0 && userProfile?.teamId && (
        <Card className="border-dashed border-slate-300 p-8 text-center">
          <p className="mb-1 font-medium text-slate-700">No tasks yet</p>
          <p className="text-sm text-slate-500">
            {isSupervisor
              ? 'Assign a form-backed task to a team member to get started.'
              : 'When your supervisor assigns you a task, it will show up here.'}
          </p>
        </Card>
      )}

      <Card className="border-slate-200 p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 transform text-slate-400" size={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tasks..."
              className="w-full rounded-lg border border-slate-300 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="cursor-pointer rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
            <option value="overdue">Overdue</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="cursor-pointer rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="due-date">Sort by Due Date</option>
            <option value="priority">Sort by Priority</option>
            <option value="name">Sort by Name</option>
            <option value="status">Sort by Status</option>
          </select>
        </div>
      </Card>

      {isSupervisor && selectedIds.length > 0 && (
        <Card className="flex items-center justify-between border-blue-200 bg-blue-50 p-3">
          <p className="text-sm font-medium text-blue-800">
            {selectedIds.length} task{selectedIds.length === 1 ? '' : 's'} selected
          </p>
          <div className="flex gap-2">
            <Button onClick={() => setSelectedIds([])} variant="outline" size="sm">
              Clear
            </Button>
            <Button onClick={unassignSelected} disabled={bulkUnassigning} variant="outline" size="sm">
              {bulkUnassigning ? 'Unassigning...' : 'Unassign'}
            </Button>
            <Button
              onClick={deleteSelected}
              disabled={deleting}
              size="sm"
              className="bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
            >
              <Trash2 size={14} className="mr-1" />
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </Card>
      )}

      <Card className="overflow-hidden border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-600">
                  {isSupervisor ? (
                    <input
                      type="checkbox"
                      checked={allFilteredSelected}
                      onChange={toggleAll}
                      className="cursor-pointer rounded"
                    />
                  ) : null}
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-600">Task Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-600">Assignee</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-600">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-600">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-600">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-600">Form</th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase text-slate-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => {
                const canComplete = !isSupervisor && task.formId && task.rawStatus !== 'done'
                const isUnassigning = unassigningIds.includes(task.id)

                return (
                  <tr key={task.id} className="border-b border-slate-200 transition-colors hover:bg-slate-50">
                    <td className="px-6 py-4">
                      {isSupervisor ? (
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(task.id)}
                          onChange={() => toggleOne(task.id)}
                          className="cursor-pointer rounded"
                        />
                      ) : null}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{task.name}</td>
                    <td className="px-6 py-4">
                      {task.assignee.isUnassigned ? (
                        <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                          Unassigned
                        </span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Avatar className="flex h-7 w-7 items-center justify-center bg-blue-600 text-xs font-semibold text-white">
                            <AvatarFallback className="bg-blue-600 text-xs text-white">
                              {task.assignee.initials}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-slate-600">{task.assignee.name}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${task.statusColor}`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${task.priorityColor}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{task.dueDate}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{task.form}</td>
                    <td className="px-6 py-4 text-right">
                      {isSupervisor ? (
                        task.rawStatus === 'done' && task.formId ? (
                          <Button asChild size="sm" variant="outline">
                            <Link to={`/forms-manage/submissions/${task.formId}?taskId=${task.id}`}>
                              View submission
                            </Link>
                          </Button>
                        ) : task.assigneeId ? (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={isUnassigning}
                            onClick={() => unassignTask(task.id)}
                          >
                            {isUnassigning ? 'Unassigning...' : 'Unassign'}
                          </Button>
                        ) : (
                          <span className="text-xs text-slate-400">-</span>
                        )
                      ) : canComplete ? (
                        <Button asChild size="sm" className="bg-blue-600 text-white hover:bg-blue-700">
                          <Link to={`/my-forms/${task.formId}?taskId=${task.id}`}>
                            Complete
                          </Link>
                        </Button>
                      ) : task.rawStatus === 'done' ? (
                        <span className="text-xs font-medium text-green-600">Done</span>
                      ) : (
                        <span className="text-xs text-slate-400">-</span>
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
