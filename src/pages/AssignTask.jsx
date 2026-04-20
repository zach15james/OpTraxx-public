import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Search, ChevronRight, Calendar, Bell } from 'lucide-react'

export default function AssignTask() {
  const [currentStep, setCurrentStep] = useState('select-form')
  const [selectedForm, setSelectedForm] = useState(null)
  const [selectedAssignees, setSelectedAssignees] = useState([])
  const [schedule, setSchedule] = useState('one-time')
  const [dueDate, setDueDate] = useState('Mar 15, 2026')
  const [priority, setPriority] = useState('Medium')

  const forms = [
    {
      id: 1,
      name: 'Server Deployment Checklist',
      fields: 6,
      lastUsed: 'Mar 4',
      description: 'Checklist for server deployments',
    },
    {
      id: 2,
      name: 'Daily Bug Report Form',
      fields: 7,
      lastUsed: 'Mar 9',
      description: 'Daily bug report submission',
    },
    {
      id: 3,
      name: 'Bug Incident Report',
      fields: 9,
      lastUsed: 'Feb 28',
      description: 'Comprehensive incident reporting',
    },
    {
      id: 4,
      name: 'Sprint Handover Log',
      fields: 5,
      lastUsed: 'Feb 10',
      description: 'End of sprint handover documentation',
    },
  ]

  const teamMembers = [
    { id: 1, initials: 'AP', name: 'A. Patel', role: 'Senior Engineer' },
    { id: 2, initials: 'JK', name: 'J. Kim', role: 'Frontend Engineer' },
    { id: 3, initials: 'LC', name: 'L. Chen', role: 'QA Engineer' },
    { id: 4, initials: 'MR', name: 'M. Rivera', role: 'DevOps Engineer' },
  ]

  const tabs = [
    { id: 'select-form', label: '1 Select Form', number: '1' },
    { id: 'assignees', label: '2 Assignees', number: '2' },
    { id: 'schedule', label: '3 Schedule', number: '3' },
    { id: 'notifications', label: '4 Notifications', number: '4' },
  ]

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
                  placeholder="Search form templates..."
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-3">
                {forms.map((form) => (
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
                        <h3 className="font-semibold text-slate-900">{form.name}</h3>
                        <p className="text-sm text-slate-600 mt-1">{form.description}</p>
                        <p className="text-xs text-slate-500 mt-2">
                          {form.fields} fields • Last used {form.lastUsed}
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
              </div>
            </div>
          )}

          {/* Step 2: Assignees */}
          {currentStep === 'assignees' && (
            <div className="space-y-4">
              <p className="text-sm text-slate-600">Select which team members should complete this task</p>
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
              <div className="text-right pt-4">
                <Button
                  onClick={() => setCurrentStep('schedule')}
                  className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 ml-auto"
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
                    title: 'Assignment Notification',
                    description: 'Send notification when task is assigned',
                  },
                  {
                    title: 'Due Date Reminder',
                    description: 'Remind team members 24 hours before due date',
                  },
                  {
                    title: 'Overdue Alert',
                    description: 'Alert when task is overdue',
                  },
                ].map((notification, idx) => (
                  <Card key={idx} className="p-4 border-slate-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-slate-900">
                          {notification.title}
                        </h4>
                        <p className="text-sm text-slate-600 mt-1">
                          {notification.description}
                        </p>
                      </div>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                  </Card>
                ))}
              </div>

              <div className="text-right pt-4">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Publish Task Assignment
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
                    {selectedForm?.name || 'Not selected'}
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
              <div className="space-y-3 text-sm">
                <div className="text-slate-600">
                  <p className="font-medium">Daily Standup Report</p>
                  <p className="text-xs text-slate-500 mt-1">All team • Due today</p>
                </div>
                <div className="text-slate-600">
                  <p className="font-medium">Code Review — Auth Module</p>
                  <p className="text-xs text-slate-500 mt-1">L. Chen • Due Mar 12</p>
                </div>
                <div className="text-slate-600">
                  <p className="font-medium">CI/CD Pipeline Setup</p>
                  <p className="text-xs text-slate-500 mt-1">M. Rivera • Due Mar 8</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
