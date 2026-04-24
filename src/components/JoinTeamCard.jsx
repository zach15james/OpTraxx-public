import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'
import { db } from '@/lib/firebase'
import { collection, query, where, getDocs, doc, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore'
import { CheckCircle, Users } from 'lucide-react'

export default function JoinTeamCard({ onTeamJoined }) {
  const { user, userProfile } = useAuth()
  const [inviteCode, setInviteCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!inviteCode.trim()) {
        setError('Please enter an invite code')
        setLoading(false)
        return
      }

      // Find the team with this invite code
      const teamsRef = collection(db, 'teams')
      const q = query(teamsRef, where('inviteCode', '==', inviteCode.toUpperCase()))
      const snapshot = await getDocs(q)

      if (snapshot.empty) {
        setError('Invalid invite code. Please check and try again.')
        setLoading(false)
        return
      }

      const teamDoc = snapshot.docs[0]
      const teamId = teamDoc.id

      // Create a join request on the team document
      const teamDocRef = doc(db, 'teams', teamId)
      await updateDoc(teamDocRef, {
        pendingRequests: arrayUnion({
          uid: user.uid,
          name: userProfile?.name || user.email,
          email: user.email,
          requestedAt: new Date().toISOString(),
        }),
      })

      setSuccess(true)
      setInviteCode('')

      // Notify parent if callback provided
      if (onTeamJoined) {
        setTimeout(() => onTeamJoined(teamId), 2000)
      }
    } catch (err) {
      console.error('Error submitting invite code:', err)
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Card className="p-6 border-2 border-green-200 bg-green-50 mb-6">
        <div className="flex items-start gap-4">
          <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-green-900 text-lg">Request Sent! 🎉</h3>
            <p className="text-green-800 text-sm mt-1">
              Your request to join the team has been sent to your supervisor. You'll be notified once they approve it.
            </p>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6 border-2 border-blue-200 bg-blue-50 mb-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-slate-900">Join a Team</h3>
            <p className="text-sm text-slate-600 mt-1">
              Ask your supervisor for an invite code to join your team and start receiving assignments.
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <div>
            <label htmlFor="invite-code" className="block text-sm font-medium text-slate-900 mb-2">
              Invite Code
            </label>
            <input
              id="invite-code"
              type="text"
              placeholder="e.g., ENG-4829"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              disabled={loading}
              className="w-full px-4 py-2 border border-blue-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase font-mono text-lg tracking-wider disabled:opacity-50"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 font-medium">{error}</p>
          )}

          <Button
            type="submit"
            disabled={loading || !inviteCode.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Sending Request...' : 'Join Team'}
          </Button>
        </div>
      </form>
    </Card>
  )
}
