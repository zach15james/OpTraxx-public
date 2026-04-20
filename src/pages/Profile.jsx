import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false)
  const [notifications, setNotifications] = useState({
    taskAssigned: true,
    overdueAlerts: true,
    taskCompletions: true,
    weeklySummary: false,
  })

  const [formData, setFormData] = useState({
    fullName: 'Jordan Davis',
    email: 'j.davis@company.com',
    department: 'Engineering Operations',
    role: 'Supervisor',
  })

  const user = {
    initials: 'JD',
    name: formData.fullName,
    role: formData.role,
    email: formData.email,
    department: formData.department,
    tasksCompleted: 47,
    teamMembers: 4,
    since: 'Jan 2024',
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleNotificationToggle = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="text-sm text-slate-600">
        OpTraxx › <span className="text-slate-900">Profile</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isEditing ? 'Save Changes' : 'Edit Profile'}
        </Button>
      </div>

      <p className="text-slate-600">Manage your account settings and preferences</p>

      {/* User Card */}
      <Card className="p-6 border-slate-200">
        <div className="flex items-center gap-6">
          <Avatar className="h-20 w-20 bg-slate-900 text-white text-2xl font-bold flex items-center justify-center flex-shrink-0">
            <AvatarFallback className="bg-slate-900 text-white text-2xl">
              {user.initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-900">{user.name}</h2>
            <p className="text-slate-600 mt-1">
              {user.role} • {user.department}
            </p>
            <div className="flex gap-6 mt-4 text-sm">
              <div>
                <p className="text-slate-900 font-bold">{user.tasksCompleted}</p>
                <p className="text-slate-600">tasks completed</p>
              </div>
              <div>
                <p className="text-slate-900 font-bold">{user.teamMembers}</p>
                <p className="text-slate-600">team members</p>
              </div>
              <div>
                <p className="text-slate-900 font-bold">Since {user.since}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Account Information */}
        <Card className="p-6 border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Account Information</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  !isEditing ? 'bg-slate-50 text-slate-600' : 'bg-white'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">
                Work Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  !isEditing ? 'bg-slate-50 text-slate-600' : 'bg-white'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">
                Department
              </label>
              <select
                value={formData.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  !isEditing ? 'bg-slate-50 text-slate-600' : 'bg-white'
                }`}
              >
                <option>Engineering Operations</option>
                <option>Finance</option>
                <option>Sales</option>
                <option>Marketing</option>
                <option>Operations</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">
                Role
              </label>
              <select
                value={formData.role}
                onChange={(e) => handleInputChange('role', e.target.value)}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  !isEditing ? 'bg-slate-50 text-slate-600' : 'bg-white'
                }`}
              >
                <option>Supervisor</option>
                <option>Employee</option>
                <option>Manager</option>
                <option>Admin</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Notification Preferences */}
        <Card className="p-6 border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Notification Preferences</h3>
          <div className="space-y-4">
            {/* Task Assigned */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-200">
              <div>
                <h4 className="font-medium text-slate-900">Task assigned to team</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Get notified when work is sent to your team
                </p>
              </div>
              <button
                onClick={() => handleNotificationToggle('taskAssigned')}
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  notifications.taskAssigned ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                    notifications.taskAssigned ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Overdue Alerts */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-200">
              <div>
                <h4 className="font-medium text-slate-900">Overdue alerts</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Escalation warnings for past-due tasks
                </p>
              </div>
              <button
                onClick={() => handleNotificationToggle('overdueAlerts')}
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  notifications.overdueAlerts ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                    notifications.overdueAlerts ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Task Completions */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-200">
              <div>
                <h4 className="font-medium text-slate-900">Task completions</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Notify when a member marks a task done
                </p>
              </div>
              <button
                onClick={() => handleNotificationToggle('taskCompletions')}
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  notifications.taskCompletions ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                    notifications.taskCompletions ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Weekly Summary */}
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium text-slate-900">Weekly summary report</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Monday digest of team performance
                </p>
              </div>
              <button
                onClick={() => handleNotificationToggle('weeklySummary')}
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  notifications.weeklySummary ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                    notifications.weeklySummary ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}