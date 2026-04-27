import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Copy, Check, ChevronRight, LogOut, Trash2, X } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { db } from '@/lib/firebase'
import {
  doc,
  updateDoc,
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  arrayRemove,
  getDoc,
} from 'firebase/firestore'
import { useTeamInvites } from '@/hooks/useTeamInvites'

export default function Settings() {
  const navigate = useNavigate()
  const { user: firebaseUser, userProfile } = useAuth()
  const isSupervisor = userProfile?.role === 'supervisor'

  // Section tabs
  const [activeSection, setActiveSection] = useState('account')
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  // Account section state
  const [accountForm, setAccountForm] = useState({
    name: userProfile?.name || '',
    department: userProfile?.department || '',
  })

  // Team section state
  const [teamName, setTeamName] = useState('')
  const [teamMembers, setTeamMembers] = useState([])
  const [editingTeamName, setEditingTeamName] = useState(false)
  const [removingMemberId, setRemovingMemberId] = useState(null)

  // Notifications section state
  const [notifications, setNotifications] = useState({
    taskAssigned: true,
    overdueAlerts: true,
    taskCompletions: true,
    escalationAlerts: false,
    teamMemberJoined: false,
  })

  // Appearance section state
  const [theme, setTheme] = useState('system')

  // Danger zone state
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    type: null,
    target: null,
  })

  // Get invite code
  const { inviteCode } = useTeamInvites({ teamId: userProfile?.teamId })
  const [copiedInvite, setCopiedInvite] = useState(false)

  // Account form change handler
  const handleAccountChange = (field, value) => {
    setAccountForm(prev => ({ ...prev, [field]: value }))
  }

  // Save account changes
  const handleSaveAccount = async () => {
    if (!firebaseUser?.uid) return
    setSaving(true)
    setSaveMessage('')
    try {
      await updateDoc(doc(db, 'users', firebaseUser.uid), {
        name: accountForm.name,
        department: accountForm.department,
      })
      setSaveMessage('Account updated ✓')
      setTimeout(() => setSaveMessage(''), 3000)
    } catch (err) {
      setSaveMessage('Error saving: ' + (err.message || err))
    } finally {
      setSaving(false)
    }
  }

  // Save team name
  const handleSaveTeamName = async () => {
    if (!userProfile?.teamId) return
    setSaving(true)
    setSaveMessage('')
    try {
      await updateDoc(doc(db, 'teams', userProfile.teamId), {
        name: teamName,
      })
      setSaveMessage('Team name updated ✓')
      setEditingTeamName(false)
      setTimeout(() => setSaveMessage(''), 3000)
    } catch (err) {
      setSaveMessage('Error saving: ' + (err.message || err))
    } finally {
      setSaving(false)
    }
  }

  // Toggle notification
  const handleNotificationToggle = async (key) => {
    const newValue = !notifications[key]
    setNotifications(prev => ({ ...prev, [key]: newValue }))

    if (!firebaseUser?.uid) return
    try {
      await updateDoc(doc(db, 'users', firebaseUser.uid), {
        notificationPreferences: {
          ...notifications,
          [key]: newValue,
        },
      })
    } catch (err) {
      setSaveMessage('Error saving preference: ' + (err.message || err))
      setNotifications(prev => ({ ...prev, [key]: !newValue }))
    }
  }

  // Save theme preference
  const handleThemeChange = async (newTheme) => {
    setTheme(newTheme)
    if (!firebaseUser?.uid) return
    try {
      await updateDoc(doc(db, 'users', firebaseUser.uid), {
        appearancePreference: newTheme,
      })
      setSaveMessage('Theme updated ✓')
      setTimeout(() => setSaveMessage(''), 3000)
    } catch (err) {
      setSaveMessage('Error saving: ' + (err.message || err))
    }
  }

  // Copy invite code
  const handleCopyInvite = () => {
    if (inviteCode) {
      navigator.clipboard.writeText(inviteCode)
      setCopiedInvite(true)
      setTimeout(() => setCopiedInvite(false), 2000)
    }
  }

  // Remove team member
  const handleRemoveMember = async () => {
    if (!removingMemberId || !userProfile?.teamId) return
    setSaving(true)
    setSaveMessage('')
    try {
      const memberDoc = doc(db, 'users', removingMemberId)
      await updateDoc(memberDoc, {
        teamId: null,
      })

      const teamDoc = doc(db, 'teams', userProfile.teamId)
      await updateDoc(teamDoc, {
        memberIds: arrayRemove(removingMemberId),
      })

      setSaveMessage('Member removed ✓')
      setRemovingMemberId(null)
      setConfirmDialog({ open: false, type: null, target: null })
      setTimeout(() => setSaveMessage(''), 3000)
    } catch (err) {
      setSaveMessage('Error removing member: ' + (err.message || err))
    } finally {
      setSaving(false)
    }
  }

  // Leave team
  const handleLeaveTeam = async () => {
    if (!firebaseUser?.uid || !userProfile?.teamId) return
    setSaving(true)
    setSaveMessage('')
    try {
      await updateDoc(doc(db, 'users', firebaseUser.uid), {
        teamId: null,
      })

      const teamDoc = doc(db, 'teams', userProfile.teamId)
      await updateDoc(teamDoc, {
        memberIds: arrayRemove(firebaseUser.uid),
      })

      setConfirmDialog({ open: false, type: null, target: null })
      navigate('/dashboard')
    } catch (err) {
      setSaveMessage('Error leaving team: ' + (err.message || err))
      setSaving(false)
    }
  }

  // Delete team
  const handleDeleteTeam = async () => {
    if (!userProfile?.teamId) return
    setSaving(true)
    setSaveMessage('')
    try {
      // Get all team members
      const usersQuery = query(
        collection(db, 'users'),
        where('teamId', '==', userProfile.teamId)
      )
      const usersSnapshot = await (async () => {
        return new Promise((resolve) => {
          const unsubscribe = onSnapshot(usersQuery, resolve)
          return unsubscribe
        })
      })()

      // Clear teamId from all members
      for (const userDoc of usersSnapshot.docs) {
        await updateDoc(doc(db, 'users', userDoc.id), {
          teamId: null,
        })
      }

      // Delete team document
      await deleteDoc(doc(db, 'teams', userProfile.teamId))

      setConfirmDialog({ open: false, type: null, target: null })
      navigate('/dashboard')
    } catch (err) {
      setSaveMessage('Error deleting team: ' + (err.message || err))
      setSaving(false)
    }
  }

  // Load team name on mount
  useEffect(() => {
    if (userProfile?.teamId) {
      const loadTeamName = async () => {
        const teamDoc = await getDoc(doc(db, 'teams', userProfile.teamId))
        if (teamDoc.exists()) {
          setTeamName(teamDoc.data().name || 'Team')
        }
      }
      loadTeamName()
    }
  }, [userProfile?.teamId])

  // Subscribe to team members
  useEffect(() => {
    if (!userProfile?.teamId) return
    const q = query(
      collection(db, 'users'),
      where('teamId', '==', userProfile.teamId),
      where('role', '==', 'employee')
    )
    return onSnapshot(q, (snap) => {
      setTeamMembers(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    })
  }, [userProfile?.teamId])

  // Load user preferences
  useEffect(() => {
    if (!userProfile) return
    setAccountForm({
      name: userProfile.name || '',
      department: userProfile.department || '',
    })
    if (userProfile.notificationPreferences) {
      setNotifications(prev => ({ ...prev, ...userProfile.notificationPreferences }))
    }
    if (userProfile.appearancePreference) {
      setTheme(userProfile.appearancePreference)
    }
  }, [userProfile])

  const getFormattedDate = (timestamp) => {
    if (!timestamp) return 'Recently'
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  const sections = [
    { id: 'account', label: 'Account' },
    ...(isSupervisor ? [{ id: 'team', label: 'Team' }] : []),
    { id: 'notifications', label: 'Notifications' },
    { id: 'appearance', label: 'Appearance' },
    { id: 'danger', label: 'Danger Zone' },
  ]

  const ToggleSwitch = ({ checked, onChange }) => (
    <button
      onClick={onChange}
      className={`relative h-6 w-11 rounded-full transition-colors ${
        checked ? 'bg-blue-600' : 'bg-slate-300'
      }`}
    >
      <div
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0.5'
        }`}
      />
    </button>
  )

  const ConfirmationDialog = () => {
    const isRemoveMember = confirmDialog.type === 'removeMember'
    const isLeaveTeam = confirmDialog.type === 'leaveTeam'
    const isDeleteTeam = confirmDialog.type === 'deleteTeam'

    const member = isRemoveMember && teamMembers.find(m => m.id === confirmDialog.target)
    const title = isRemoveMember
      ? `Remove ${member?.name}?`
      : isLeaveTeam
      ? 'Leave Team?'
      : 'Delete Team?'

    const description = isRemoveMember
      ? `${member?.name} will be removed from the team and will no longer receive task assignments.`
      : isLeaveTeam
      ? 'You will leave the team and return to your personal dashboard. You can join a different team using an invite code.'
      : 'This will delete the entire team and remove all members. This action cannot be undone.'

    const confirmText = isRemoveMember ? 'Remove Member' : isLeaveTeam ? 'Leave Team' : 'Delete Team'
    const isDangerous = true

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <Card className="p-6 w-full max-w-md border-slate-200">
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">{title}</h2>
            <button
              onClick={() => setConfirmDialog({ open: false, type: null, target: null })}
              className="text-slate-500 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-slate-600 mb-6">{description}</p>

          <div className="flex gap-3">
            <Button
              onClick={() => setConfirmDialog({ open: false, type: null, target: null })}
              className="flex-1 bg-slate-200 text-slate-900 hover:bg-slate-300"
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (isRemoveMember) handleRemoveMember()
                else if (isLeaveTeam) handleLeaveTeam()
                else if (isDeleteTeam) handleDeleteTeam()
              }}
              disabled={saving}
              className={`flex-1 ${
                isDangerous
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {saving ? 'Processing…' : confirmText}
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  // ========== ACCOUNT SECTION ==========
  const AccountSection = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-2">
          Display Name
        </label>
        <input
          type="text"
          value={accountForm.name}
          onChange={(e) => handleAccountChange('name', e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Your name"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-2">
          Department
        </label>
        <select
          value={accountForm.department}
          onChange={(e) => handleAccountChange('department', e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option>Engineering Operations</option>
          <option>Finance</option>
          <option>Sales</option>
          <option>Marketing</option>
          <option>Operations</option>
          <option>HR</option>
          <option>Other</option>
        </select>
      </div>

      <div className="pt-4 border-t border-slate-200">
        <div className="space-y-2 mb-6">
          <div className="flex justify-between">
            <span className="text-sm text-slate-600">Email</span>
            <span className="text-sm font-medium text-slate-900">{firebaseUser?.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-slate-600">Role</span>
            <span className="text-sm font-medium text-slate-900">
              {isSupervisor ? 'Supervisor' : 'Employee'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-slate-600">Member Since</span>
            <span className="text-sm font-medium text-slate-900">
              {getFormattedDate(userProfile?.createdAt)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        {saveMessage && (
          <span className="text-sm text-slate-600">{saveMessage}</span>
        )}
        <Button
          onClick={handleSaveAccount}
          disabled={saving}
          className="ml-auto bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save Changes'}
        </Button>
      </div>
    </div>
  )

  // ========== TEAM SECTION ==========
  const TeamSection = () => (
    <div className="space-y-6">
      {/* Team Name */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-semibold text-slate-900">
            Team Name
          </label>
          <button
            onClick={() => setEditingTeamName(!editingTeamName)}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            {editingTeamName ? 'Cancel' : 'Edit'}
          </button>
        </div>
        {editingTeamName ? (
          <div className="flex gap-2" key="team-edit-input">
            <input
              autoFocus
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveTeamName()}
              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter team name"
            />
            <Button
              onClick={handleSaveTeamName}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save'}
            </Button>
          </div>
        ) : (
          <p className="text-slate-900 font-medium">{teamName || 'Team'}</p>
        )}
      </div>

      {/* Invite Code */}
      <div className="pt-4 border-t border-slate-200">
        <label className="block text-sm font-semibold text-slate-900 mb-4">
          Team Invite Code
        </label>
        <div className="flex gap-3 items-center">
          <code className="flex-1 bg-slate-100 px-4 py-3 rounded-lg font-mono text-lg font-bold text-slate-900 text-center">
            {inviteCode || 'Loading...'}
          </code>
          <Button
            onClick={handleCopyInvite}
            disabled={!inviteCode}
            className="bg-slate-200 text-slate-900 hover:bg-slate-300 disabled:opacity-50"
            title="Copy to clipboard"
          >
            {copiedInvite ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </Button>
        </div>
        <p className="text-xs text-slate-600 mt-2">
          Share this code with team members to let them join
        </p>
      </div>

      {/* Team Members */}
      <div className="pt-4 border-t border-slate-200">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Team Members</h3>
        {teamMembers.length === 0 ? (
          <p className="text-sm text-slate-600">No team members yet</p>
        ) : (
          <div className="space-y-3">
            {teamMembers.map(member => (
              <div key={member.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3 flex-1">
                  <Avatar className="h-8 w-8 bg-blue-600 text-white text-sm font-bold flex items-center justify-center">
                    <AvatarFallback className="bg-blue-600 text-white text-sm">
                      {(member.name || 'U').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{member.name}</p>
                    <p className="text-xs text-slate-600">{member.email}</p>
                  </div>
                </div>
                <Button
                  onClick={() => {
                    setRemovingMemberId(member.id)
                    setConfirmDialog({
                      open: true,
                      type: 'removeMember',
                      target: member.id,
                    })
                  }}
                  className="bg-red-100 text-red-700 hover:bg-red-200 text-xs font-medium"
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {saveMessage && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">{saveMessage}</p>
        </div>
      )}
    </div>
  )

  // ========== NOTIFICATIONS SECTION ==========
  const NotificationsSection = () => (
    <div className="space-y-4">
      <div className="flex items-start justify-between pb-4 border-b border-slate-200">
        <div>
          <h4 className="font-medium text-slate-900">Task assigned to me</h4>
          <p className="text-xs text-slate-600 mt-1">
            Notify when a supervisor assigns a task
          </p>
        </div>
        <ToggleSwitch
          checked={notifications.taskAssigned}
          onChange={() => handleNotificationToggle('taskAssigned')}
        />
      </div>

      <div className="flex items-start justify-between pb-4 border-b border-slate-200">
        <div>
          <h4 className="font-medium text-slate-900">Overdue alerts</h4>
          <p className="text-xs text-slate-600 mt-1">
            Escalation warnings for past-due tasks
          </p>
        </div>
        <ToggleSwitch
          checked={notifications.overdueAlerts}
          onChange={() => handleNotificationToggle('overdueAlerts')}
        />
      </div>

      <div className="flex items-start justify-between pb-4 border-b border-slate-200">
        <div>
          <h4 className="font-medium text-slate-900">Task completions</h4>
          <p className="text-xs text-slate-600 mt-1">
            Notify when a team member marks a task done
          </p>
        </div>
        <ToggleSwitch
          checked={notifications.taskCompletions}
          onChange={() => handleNotificationToggle('taskCompletions')}
        />
      </div>

      {isSupervisor && (
        <>
          <div className="flex items-start justify-between pb-4 border-b border-slate-200">
            <div>
              <h4 className="font-medium text-slate-900">Escalation alerts</h4>
              <p className="text-xs text-slate-600 mt-1">
                Notify when a task is escalated
              </p>
            </div>
            <ToggleSwitch
              checked={notifications.escalationAlerts}
              onChange={() => handleNotificationToggle('escalationAlerts')}
            />
          </div>

          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-medium text-slate-900">New team member joined</h4>
              <p className="text-xs text-slate-600 mt-1">
                Notify when someone joins your team
              </p>
            </div>
            <ToggleSwitch
              checked={notifications.teamMemberJoined}
              onChange={() => handleNotificationToggle('teamMemberJoined')}
            />
          </div>
        </>
      )}

      <p className="text-xs text-slate-600 pt-4">Changes save automatically</p>
    </div>
  )

  // ========== APPEARANCE SECTION ==========
  const AppearanceSection = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-4">
          Color Theme
        </label>
        <div className="space-y-2">
          {[
            { value: 'light', label: 'Light' },
            { value: 'dark', label: 'Dark' },
            { value: 'system', label: 'System Default' },
          ].map(option => (
            <label key={option.value} className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
              <input
                type="radio"
                name="theme"
                value={option.value}
                checked={theme === option.value}
                onChange={(e) => handleThemeChange(e.target.value)}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-sm font-medium text-slate-900">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      <p className="text-xs text-slate-600 pt-4">Your theme preference updates immediately</p>
    </div>
  )

  // ========== DANGER ZONE SECTION ==========
  const DangerZoneSection = () => (
    <div className="space-y-4">
      {!isSupervisor ? (
        // Employee: Leave Team
        <div className="p-4 border-2 border-red-200 bg-red-50 rounded-lg">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-red-900">Leave Team</h3>
              <p className="text-sm text-red-800 mt-1">
                You will no longer be part of this team and won't receive task assignments.
              </p>
            </div>
            <Button
              onClick={() =>
                setConfirmDialog({
                  open: true,
                  type: 'leaveTeam',
                  target: null,
                })
              }
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Leave Team
            </Button>
          </div>
        </div>
      ) : (
        // Supervisor: Delete Team
        <div className="p-4 border-2 border-red-200 bg-red-50 rounded-lg">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-red-900">Delete Team</h3>
              <p className="text-sm text-red-800 mt-1">
                Permanently delete this team and remove all members. This action cannot be undone.
              </p>
            </div>
            <Button
              onClick={() =>
                setConfirmDialog({
                  open: true,
                  type: 'deleteTeam',
                  target: null,
                })
              }
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Team
            </Button>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="text-sm text-slate-600">
        OpTraxx › <span className="text-slate-900">Settings</span>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-600 mt-1">Manage your account, team, and preferences</p>
      </div>

      {/* Settings Layout */}
      <div className="grid grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="col-span-1">
          <nav className="space-y-1">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-between ${
                  activeSection === section.id
                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {section.label}
                {activeSection === section.id && <ChevronRight className="w-4 h-4" />}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="col-span-3">
          <Card className="p-8 border-slate-200">
            {activeSection === 'account' && <AccountSection />}
            {activeSection === 'team' && isSupervisor && <TeamSection />}
            {activeSection === 'notifications' && <NotificationsSection />}
            {activeSection === 'appearance' && <AppearanceSection />}
            {activeSection === 'danger' && <DangerZoneSection />}
          </Card>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {confirmDialog.open && <ConfirmationDialog />}
    </div>
  )
}
