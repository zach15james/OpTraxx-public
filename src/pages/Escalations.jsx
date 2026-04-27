import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  AlertTriangle,
  Clock,
  MessageSquare,
  Send,
  Share2,
  CheckCircle2,
  Flame,
  ChevronRight,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useEscalations } from '@/hooks/useEscalations'
import { db } from '@/lib/firebase'
import {
  doc,
  updateDoc,
  arrayUnion,
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore'

export default function Escalations() {
  const { user, userProfile } = useAuth()
  const navigate = useNavigate()
  const { escalations, loading } = useEscalations({ uid: user?.uid })
  const [selectedEscalation, setSelectedEscalation] = useState(null)
  const [teamMembers, setTeamMembers] = useState([])
  const [showReassignFor, setShowReassignFor] = useState(null)
  const [noteText, setNoteText] = useState('')
  const [actionStatus, setActionStatus] = useState('')
  const [pending, setPending] = useState(false)

  // Pull team for reassign picker
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

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  const showStatus = (msg) => {
    setActionStatus(msg)
    setTimeout(() => setActionStatus(''), 3000)
  }

  const handleReassign = async (taskId, newAssigneeId) => {
    if (!newAssigneeId) return
    setPending(true)
    try {
      await updateDoc(doc(db, 'tasks', taskId), {
        assigneeId: newAssigneeId,
        isEscalated: false,
        updatedAt: serverTimestamp(),
      })
      showStatus('Task reassigned.')
      setShowReassignFor(null)
    } catch (err) {
      showStatus('Failed to reassign: ' + (err.message || err))
    } finally {
      setPending(false)
    }
  }

  const handleOverride = async (taskId) => {
    setPending(true)
    try {
      await updateDoc(doc(db, 'tasks', taskId), {
        status: 'done',
        isEscalated: false,
        completedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
      showStatus('Task marked complete.')
    } catch (err) {
      showStatus('Failed to override: ' + (err.message || err))
    } finally {
      setPending(false)
    }
  }

  const handleNudge = async (esc) => {
    if (!esc.assigneeId || !user?.uid) return
    setPending(true)
    try {
      await addDoc(collection(db, 'nudges'), {
        toUid: esc.assigneeId,
        toName: esc.assignee.name,
        fromUid: user.uid,
        taskId: esc.id,
        message: `High-priority nudge on "${esc.title}".`,
        createdAt: serverTimestamp(),
        read: false,
      })
      showStatus(`Nudge sent to ${esc.assignee.name}.`)
    } catch (err) {
      showStatus('Failed to nudge: ' + (err.message || err))
    } finally {
      setPending(false)
    }
  }

  const handleAddNote = async (taskId) => {
    const text = noteText.trim()
    if (!text || !user?.uid) return
    setPending(true)
    try {
      await updateDoc(doc(db, 'tasks', taskId), {
        notes: arrayUnion({
          text,
          byUid: user.uid,
          byName: userProfile?.name || user.email || 'Supervisor',
          at: new Date(),
        }),
        updatedAt: serverTimestamp(),
      })
      setNoteText('')
      showStatus('Note added.')
    } catch (err) {
      showStatus('Failed to add note: ' + (err.message || err))
    } finally {
      setPending(false)
    }
  }

  const hasEscalations = escalations.length > 0

  if (!hasEscalations) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-center space-y-6">
          <div className="text-6xl">🎉</div>
          <h1 className="text-4xl font-bold text-slate-900">All Clear!</h1>
          <p className="text-xl text-slate-600 max-w-md">
            Your team is running smoothly. No escalated tasks to worry about.
          </p>
          <Button onClick={() => navigate('/tasks')} className="bg-blue-600 hover:bg-blue-700 text-white mt-8">
            View All Tasks
          </Button>
        </div>
      </div>
    )
  }

  const selected = selectedEscalation
    ? escalations.find((e) => e.id === selectedEscalation)
    : escalations[0]

  const getHeatColor = (heat) => {
    if (heat > 20) return 'text-red-600 bg-red-50 border-red-200'
    if (heat > 12) return 'text-orange-600 bg-orange-50 border-orange-200'
    return 'text-yellow-600 bg-yellow-50 border-yellow-200'
  }

  const getBlockerColor = (type) => {
    const colors = {
      approval: 'bg-red-100 text-red-800',
      resources: 'bg-orange-100 text-orange-800',
      dependency: 'bg-yellow-100 text-yellow-800',
      safety: 'bg-red-100 text-red-800',
    }
    return colors[type] || 'bg-slate-100 text-slate-800'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Escalations</h1>
          <p className="text-slate-600 mt-1">
            {escalations.length} task{escalations.length !== 1 ? 's' : ''} requiring attention
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-lg">
          <Flame className="w-5 h-5 text-red-600" />
          <span className="text-sm font-semibold text-red-600">
            {escalations.length} Active Escalation{escalations.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Split View */}
      <div className="grid grid-cols-3 gap-6 h-[calc(100vh-250px)]">
        {/* Left: Escalations List */}
        <div className="col-span-1 space-y-3 overflow-y-auto">
          {escalations.map((escalation) => {
            const isSelected = selected?.id === escalation.id
            const heatColor = getHeatColor(escalation.heat)
            return (
              <Card
                key={escalation.id}
                onClick={() => setSelectedEscalation(escalation.id)}
                className={`p-4 border-2 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-red-500 bg-red-50 shadow-lg'
                    : 'border-slate-200 hover:border-red-300 hover:shadow-md'
                }`}
              >
                <div className="space-y-3">
                  {/* Title */}
                  <h3 className="font-bold text-slate-900 leading-snug">
                    {escalation.title}
                  </h3>

                  {/* Assignee */}
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6 bg-blue-600 text-white text-xs font-semibold flex items-center justify-center">
                      <AvatarFallback className="bg-blue-600 text-white text-xs">
                        {escalation.assignee.initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-slate-600">{escalation.assignee.name}</span>
                  </div>

                  {/* Blocker Reason */}
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${getBlockerColor(escalation.blockerType)}`}>
                      {escalation.blockerReason}
                    </span>
                  </div>

                  {/* Heat */}
                  <div className={`text-sm font-semibold px-3 py-1 rounded-full border ${heatColor}`}>
                    🔥 {escalation.heat}h stuck
                  </div>

                  {/* Meta */}
                  <div className="flex justify-between text-xs text-slate-600 pt-2 border-t border-slate-200">
                    <span>{escalation.daysOverdue}d overdue</span>
                    <span>{escalation.escalatedAt}</span>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Right: Detail View */}
        {selected && (
          <div className="col-span-2 space-y-6 overflow-y-auto">
            {/* Task Header Card */}
            <Card className="p-8 border-slate-200 bg-gradient-to-br from-red-50 to-white">
              <div className="space-y-6">
                {/* Title & Status */}
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    {selected.title}
                  </h2>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-red-600 text-white text-sm font-semibold rounded-full">
                      {selected.priority}
                    </span>
                    <span className="text-sm text-slate-600">
                      Escalated {selected.escalatedAt}
                    </span>
                  </div>
                </div>

                {/* Task Info Grid */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                  <div>
                    <p className="text-xs text-slate-600 font-semibold uppercase">Assigned To</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Avatar className="h-8 w-8 bg-blue-600 text-white text-sm font-semibold flex items-center justify-center">
                        <AvatarFallback className="bg-blue-600 text-white">
                          {selected.assignee.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-slate-900">{selected.assignee.name}</p>
                        <p className="text-xs text-slate-600">{selected.assignee.role}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 font-semibold uppercase">Blocker</p>
                    <p className={`text-sm font-bold mt-2 px-3 py-1.5 rounded inline-block ${getBlockerColor(selected.blockerType)}`}>
                      {selected.blockerReason}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 font-semibold uppercase">Days Overdue</p>
                    <p className="text-2xl font-bold text-red-600 mt-2">{selected.daysOverdue} days</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 font-semibold uppercase">Time Stuck</p>
                    <p className="text-2xl font-bold text-orange-600 mt-2">🔥 {selected.heat}h</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-slate-600">Task Progress</p>
                    <span className="text-sm font-bold text-slate-900">{selected.completionRate}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${selected.completionRate}%` }}
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6 border-slate-200">
              <h3 className="font-bold text-slate-900 mb-4">Quick Actions</h3>
              {actionStatus && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
                  {actionStatus}
                </div>
              )}
              <div className="grid grid-cols-3 gap-3">
                <Button
                  onClick={() => setShowReassignFor(showReassignFor === selected.id ? null : selected.id)}
                  disabled={pending}
                  className="bg-blue-100 text-blue-700 hover:bg-blue-200 font-semibold h-12"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Reassign
                </Button>
                <Button
                  onClick={() => handleNudge(selected)}
                  disabled={pending}
                  className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 font-semibold h-12"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Nudge
                </Button>
                <Button
                  onClick={() => handleOverride(selected.id)}
                  disabled={pending}
                  className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 font-semibold h-12"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Override
                </Button>
              </div>
              {showReassignFor === selected.id && (
                <div className="mt-4 p-4 border border-blue-200 rounded-lg bg-blue-50">
                  <p className="text-sm font-medium text-slate-700 mb-2">Reassign to:</p>
                  {teamMembers.length === 0 ? (
                    <p className="text-sm text-slate-500">No other team members available.</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {teamMembers
                        .filter(m => m.id !== selected.assigneeId)
                        .map(m => (
                          <Button
                            key={m.id}
                            onClick={() => handleReassign(selected.id, m.id)}
                            disabled={pending}
                            className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs"
                          >
                            {m.name || m.email}
                          </Button>
                        ))}
                    </div>
                  )}
                </div>
              )}
              <p className="text-xs text-slate-600 mt-4">
                💡 <strong>Tip:</strong> Use Nudge to send a high-priority notification, Reassign to move to another team member, or Override if you've handled it manually.
              </p>
            </Card>

            {/* Timeline */}
            <Card className="p-6 border-slate-200">
              <h3 className="font-bold text-slate-900 mb-6">Activity Timeline</h3>
              <div className="space-y-4">
                {selected.timeline.map((event, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 bg-blue-600 rounded-full mt-1.5" />
                      {idx < selected.timeline.length - 1 && (
                        <div className="w-0.5 h-12 bg-slate-300 mt-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="text-xs font-semibold text-slate-600 uppercase">
                        {event.time}
                      </p>
                      <p className="text-sm text-slate-900 mt-1">{event.action}</p>
                      <p className="text-xs text-slate-500 mt-1">by {event.user}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Comments Section */}
            <Card className="p-6 border-slate-200">
              <h3 className="font-bold text-slate-900 mb-4">Add Note</h3>
              <form
                onSubmit={(e) => { e.preventDefault(); handleAddNote(selected.id) }}
                className="flex gap-3"
              >
                <input
                  type="text"
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Add a note for the team..."
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button
                  type="submit"
                  disabled={pending || !noteText.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
