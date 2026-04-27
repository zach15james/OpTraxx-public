import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Search, ChevronRight, Calendar, Bell, Plus } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { db } from '@/lib/firebase'
import { collection, query, where, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore'
import { subscribeForms } from '@/zach_contributions/formStoreFirestore'

export default function AssignTask() {
  const { user, userProfile } = useAuth()
  const [currentStep, setCurrentStep] = useState('select-form')
  const [selectedForm, setSelectedForm] = useState(null)
  const [selectedAssignees, setSelectedAssignees] = useState([])
  const [schedule, setSchedule] = useState('one-time')
  const today = new Date()
  const defaultDue = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
  const [dueDate, setDueDate] = useState(
    defaultDue.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  )
  const [priority, setPriority] = useState('Medium')
  const [teamMembers, setTeamMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [publishing, setPublishing] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [forms, setForms] = useState([])
  const [formSearch, setFormSearch] = useState('')
  const [notifSettings, setNotifSettings] = useState({
    assignmentNotification: true,
    dueDateReminder: true,
    overdueAlert: true,
  })
  const [recentTasks, setRecentTasks] = useState([])

  // Live subscription to real forms from Firestore
  useEffect(() => subscribeForms(setForms), [])

  // Live recent tasks assigned by this supervisor
  useEffect(() => {
    if (!user?.uid) return
    const recentQ = query(collection(db, 'tasks'), where('assignedBy', '==', user.uid))
    return onSnapshot(recentQ, (snap) => {
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      docs.sort((a, b) => {
        const aMs = a.createdAt?.toMillis?.() || 0
        const bMs = b.createdAt?.toMillis?.() || 0
        return bMs - aMs
      })
      setRecentTasks(docs.slice(0, 3))
    })
  }, [user?.uid])

  const filteredForms = forms.filter(f =>
    !formSearch.trim()
      || f.title?.toLowerCase().includes(formSearch.toLowerCase())
      || f.description?.toLowerCase().includes(formSearch.toLowerCase())
  )

  const tabs = [
    { id: 'select-form', label: '1 Select Form', number: '1' },
    { id: 'assignees', label: '2 Assignees', number: '2' },
    { id: 'schedule', label: '3 Schedule', number: '3' },
    { id: 'notifications', label: '4 Notifications', number: '4' },
  ]

  // Fetch team members from Firestore with real-time updates
  useEffect(() => {
    if (!userProfile?.teamId) {
      setLoading(false)
      return
    }

    const membersQuery = query(
      collection(db, 'users'),
      where('teamId', '==', userProfile.teamId),
      where('role', '==', 'employee')
    )

    const unsubscribe = onSnapshot(membersQuery, (snapshot) => {
      const members = snapshot.docs.map((doc) => ({
        id: doc.id,
        initials: (doc.data().name || doc.data().email).split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
        name: doc.data().name || doc.data().email,
        role: doc.data().role || 'Team Member',
      }))

      setTeamMembers(members)
      setLoading(false)
    })

    return unsubscribe
  }, [userProfile?.teamId])

  const handlePublishTasks = async () => {
    if (!selectedForm || selectedAssignees.length === 0 || !user) {
      return
    }

    setPublishing(true)
    setSuccessMessage('')

    try {
      // Parse due date (simple parsing for "Mar 15, 2026" format)
      const dueDateObj = new Date(dueDate)

      // Create a task for each selected assignee
      const taskPromises = selectedAssignees.map((assigneeId) =>
        addDoc(collection(db, 'tasks'), {
          name: selectedForm.title,
          formId: selectedForm.id,
          assigneeId: assigneeId,
          assignedBy: user.uid,
          status: 'pending',
          priority: priority,
          dueDate: dueDateObj,
          schedule: schedule,
          isEscalated: false,
          notifications: notifSettings,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      )

      await Promise.all(taskPromises)

      setSuccessMessage(`✓ Successfully assigned "${selectedForm.title}" to ${selectedAssignees.length} team member${selectedAssignees.length > 1 ? 's' : ''}!`)

      // Reset form after 2 seconds
      setTimeout(() => {
        setCurrentStep('select-form')
        setSelectedForm(null)
        setSelectedAssignees([])
        setSchedule('one-time')
        setPriority('Medium')
        setSuccessMessage('')
      }, 2000)
    } catch (error) {
      console.error('Error publishing tasks:', error)
      setSuccessMessage('✗ Failed to assign tasks. Please try again.')
    } finally {
      setPublishing(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading team members...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Assign Tasks</h1>
          <p className="text-slate-600 mt-1">
            Attach a form to engineers or teams with scheduling and priority
          </p>
        </div>
      </div>

      {successMessage && (
        <Card className={`p-4 ${successMessage.includes('Successfully') ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <p className={successMessage.includes('Successfully') ? 'text-green-700' : 'text-red-700'}>
            {successMessage}
          </p>
        </Card>
      )}

      <div className="grid grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="col-span-2 space-y-6">
          {/* Tabs */}
          <div className="flex gap-1 border-b border-slate-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCurrentStep(tab.id)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  currentStep === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Step 1: Select Form */}
          {currentStep === 'select-form' && (
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Search forms..."
                  value={formSearch}
                  onChange={e => setFormSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {forms.length === 0 ? (
                <Card className="p-8 text-center border-dashed border-slate-300">
                  <p className="text-slate-700 font-medium mb-1">No forms yet</p>
                  <p className="text-sm text-slate-500 mb-4">
                    Build a form first, then come back to assign it as a task.
                  </p>
                  <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Link to="/forms-manage"><Plus size={16} className="mr-1" />Create your first form</Link>
                  </Button>
                </Card>
              ) : (
                <div className="space-y-3">
                  {filteredForms.map((form) => (
                    <Card
                      key={form.id}
                      onClick={() => {
                        setSelectedForm(form)
                        setCurrentStep('assignees')
                      }}
                      className={`p-4 border cursor-pointer transition-all hover:shadow-md ${
                        selectedForm?.id === form.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-slate-900">{form.title}</h3>
                          {form.description && <p className="text-sm text-slate-600 mt-1">{form.description}</p>}
                          <p className="text-xs text-slate-500 mt-2">
                            {form.fields?.length || 0} fields
                            {form.updatedAt ? ` • Updated ${new Date(form.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : ''}
                          </p>
                        </div>
                        {selectedForm?.id === form.id ? (
                          <div className="text-blue-600 font-semibold">Selected ✓</div>
                        ) : (
                          <ChevronRight className="text-slate-400" />
                        )}
                      </div>
                    </Card>
                  ))}
                  {filteredForms.length === 0 && (
                    <p className="text-center text-sm text-slate-500 py-4">No forms match "{formSearch}"</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Assignees */}
          {currentStep === 'assignees' && (
            <div className="space-y-4">
              <p className="text-sm text-slate-600">Select which team members should complete this task</p>
              {teamMembers.length === 0 ? (
                <Card className="p-8 text-center border-slate-200">
                  <p className="text-slate-600 mb-2">No team members found</p>
                  <p className="text-sm text-slate-500">You need to add employees to your team first</p>
                </Card>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {teamMembers.map((member) => (
                    <Card
                      key={member.id}
                      onClick={() => {
                        setSelectedAssignees(
                          selectedAssignees.includes(member.id)
                            ? selectedAssignees.filter((id) => id !== member.id)
                            : [...selectedAssignees, member.id]
                        )
                      }}
                      className={`p-4 border cursor-pointer transition-all hover:shadow-md ${
                        selectedAssignees.includes(member.id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10 bg-blue-600 text-white text-sm font-semibold flex items-center justify-center flex-shrink-0">
                          <AvatarFallback className="bg-blue-600 text-white text-sm">
                            {member.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium text-slate-900">{member.name}</p>
                          <p className="text-xs text-slate-600">{member.role}</p>
                        </div>
                        {selectedAssignees.includes(member.id) && (
                          <div className="text-blue-600">✓</div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
              <div className="text-right pt-4">
                <Button
                  onClick={() => setCurrentStep('schedule')}
                  disabled={selectedAssignees.length === 0}
                  className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next: Select Assignees
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Schedule */}
          {currentStep === 'schedule' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-slate-900 mb-4">Scheduling</h3>
                <div className="space-y-3">
                  {['One-time', 'Daily', 'Weekly', 'Monthly'].map((option) => (
                    <label
                      key={option}
                      className="flex items-center gap-3 p-3 border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="schedule"
                        value={option}
                        checked={schedule === option.toLowerCase()}
                        onChange={(e) => setSchedule(e.target.value.toLowerCase())}
                        className="w-4 h-4"
                      />
                      <span className="text-sm font-medium text-slate-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 mb-4">Due Date</h3>
                <div className="flex gap-2">
                  <Calendar size={20} className="text-slate-400" />
                  <input
                    type="text"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 mb-4">Priority</h3>
                <div className="flex gap-3">
                  {['Low', 'Medium', 'High'].map((p) => (
                    <button
                      key={p}
                      onClick={() => setPriority(p)}
                      className={`flex-1 px-3 py-2 rounded-lg border transition-all ${
                        priority === p
                          ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
                          : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-right pt-4">
                <Button
                  onClick={() => setCurrentStep('notifications')}
                  className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 ml-auto"
                >
                  Next: Configure Notifications
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Notifications */}
          {currentStep === 'notifications' && (
            <div className="space-y-6">
              <div className="space-y-4">
                {[
                  {
                    key: 'assignmentNotification',
                    title: 'Assignment Notification',
                    description: 'Send notification when task is assigned',
                  },
                  {
                    key: 'dueDateReminder',
                    title: 'Due Date Reminder',
                    description: 'Remind team members 24 hours before due date',
                  },
                  {
                    key: 'overdueAlert',
                    title: 'Overdue Alert',
                    description: 'Alert when task is overdue',
                  },
                ].map((notification) => (
                  <Card key={notification.key} className="p-4 border-slate-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-slate-900">
                          {notification.title}
                        </h4>
                        <p className="text-sm text-slate-600 mt-1">
                          {notification.description}
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifSettings[notification.key]}
                        onChange={(e) => setNotifSettings(prev => ({
                          ...prev,
                          [notification.key]: e.target.checked,
                        }))}
                        className="rounded cursor-pointer"
                      />
                    </div>
                  </Card>
                ))}
              </div>

              <div className="text-right pt-4">
                <Button
                  onClick={handlePublishTasks}
                  disabled={publishing}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {publishing ? 'Publishing...' : 'Publish Task Assignment'}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar - Summary */}
        <div>
          <Card className="p-6 border-slate-200 sticky top-24 space-y-6">
            <div>
              <h3 className="font-bold text-slate-900 mb-4">Assignment Summary</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-slate-600 font-medium">Form</p>
                  <p className="text-slate-900 font-semibold mt-1">
                    {selectedForm?.title || 'Not selected'}
                  </p>
                </div>
                <div>
                  <p className="text-slate-600 font-medium">Assignees</p>
                  <p className="text-slate-900 font-semibold mt-1">
                    {selectedAssignees.length > 0
                      ? `${selectedAssignees.length} member${selectedAssignees.length > 1 ? 's' : ''}`
                      : 'None selected'}
                  </p>
                </div>
                <div>
                  <p className="text-slate-600 font-medium">Priority</p>
                  <p className="text-slate-900 font-semibold mt-1 capitalize">{priority}</p>
                </div>
                <div>
                  <p className="text-slate-600 font-medium">Due</p>
                  <p className="text-slate-900 font-semibold mt-1">{dueDate}</p>
                </div>
                <div>
                  <p className="text-slate-600 font-medium">Recurrence</p>
                  <p className="text-slate-900 font-semibold mt-1 capitalize">{schedule}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-6">
              <h3 className="font-bold text-slate-900 mb-4">Recently Assigned</h3>
              {recentTasks.length === 0 ? (
                <p className="text-xs text-slate-500">Nothing assigned yet.</p>
              ) : (
                <div className="space-y-3 text-sm">
                  {recentTasks.map((t) => {
                    const dueAt = t.dueDate?.toDate ? t.dueDate.toDate() : null
                    const dueLabel = dueAt
                      ? `Due ${dueAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                      : 'No due date'
                    const assigneeLabel = teamMembers.find(m => m.id === t.assigneeId)?.name || 'Team member'
                    return (
                      <div key={t.id} className="text-slate-600">
                        <p className="font-medium">{t.name}</p>
                        <p className="text-xs text-slate-500 mt-1">{assigneeLabel} • {dueLabel}</p>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
