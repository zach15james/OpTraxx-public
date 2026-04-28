import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Check, Copy, UserPlus, X } from 'lucide-react'
import { useTeamInvites } from '@/hooks/useTeamInvites'

export default function InviteTeamMembers({ teamId }) {
  const { inviteCode, pendingRequests, loading, acceptRequest, declineRequest } = useTeamInvites({ teamId })
  const [copied, setCopied] = useState(false)
  const [actionLoading, setActionLoading] = useState(null)

  const handleCopyCode = () => {
    if (inviteCode) {
      navigator.clipboard.writeText(inviteCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleAccept = async (userId, userData) => {
    setActionLoading(`accept-${userId}`)
    try {
      await acceptRequest(userId, userData)
    } catch (error) {
      console.error('Error accepting request:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleDecline = async (userData) => {
    setActionLoading(`decline-${userData.uid}`)
    try {
      await declineRequest(userData)
    } catch (error) {
      console.error('Error declining request:', error)
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) {
    return <div>Loading invites...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-4">Invite Team Members</h2>

        {/* Invite Code Card */}
        <Card className="p-6 border-slate-200 bg-gradient-to-br from-blue-50 to-slate-50 mb-6">
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-sm font-medium text-slate-600 dark:text-slate-700">Team Invite Code</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-white border-2 border-blue-200 rounded-lg p-4">
                  <p className="text-4xl font-bold tracking-widest text-slate-900 text-center font-mono">
                    {inviteCode || 'Loading...'}
                  </p>
                </div>
                <Button
                  onClick={handleCopyCode}
                  disabled={!inviteCode}
                  className={`${
                    copied
                      ? 'bg-green-600 hover:bg-green-600'
                      : 'bg-blue-600 hover:bg-blue-700'
                  } text-white flex items-center gap-2`}
                >
                  {copied ? (
                    <>
                      <Check size={18} />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={18} />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-700">
              Share this code with employees. They'll use it to request to join your team.
            </p>
          </div>
        </Card>

        {/* Pending Requests */}
        {pendingRequests.length > 0 && (
          <div>
            <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <UserPlus size={18} />
              Pending Join Requests ({pendingRequests.length})
            </h3>

            <div className="space-y-3">
              {pendingRequests.map((request) => (
                <Card
                  key={request.uid}
                  className="p-4 border-slate-200 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <Avatar className="h-10 w-10 bg-blue-600 text-white font-semibold flex items-center justify-center">
                      <AvatarFallback className="bg-blue-600 text-white">
                        {(request.name || request.email)
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase()
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 text-left">
                      <p className="font-medium text-slate-900">{request.name}</p>
                      <p className="text-sm text-slate-600">{request.email}</p>
                      {request.requestedAt && (
                        <p className="text-xs text-slate-500 mt-1">
                          Requested{' '}
                          {new Date(request.requestedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => handleAccept(request.uid, request)}
                      disabled={actionLoading === `accept-${request.uid}`}
                      className="bg-green-600 hover:bg-green-700 text-white text-sm disabled:opacity-50"
                    >
                      {actionLoading === `accept-${request.uid}` ? 'Accepting...' : 'Accept'}
                    </Button>
                    <Button
                      onClick={() => handleDecline(request)}
                      disabled={actionLoading === `decline-${request.uid}`}
                      variant="outline"
                      className="border-red-300 text-red-600 hover:bg-red-50 text-sm disabled:opacity-50"
                    >
                      {actionLoading === `decline-${request.uid}` ? 'Declining...' : 'Decline'}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {pendingRequests.length === 0 && (
          <Card className="p-6 border-slate-200 bg-slate-50 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              No pending join requests yet. Share the invite code with your team!
            </p>
          </Card>
        )}
      </div>
    </div>
  )
}
