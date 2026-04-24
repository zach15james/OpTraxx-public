import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase'
import { doc, onSnapshot, updateDoc, arrayUnion, arrayRemove, setDoc } from 'firebase/firestore'
import { generateInviteCode } from '@/lib/inviteCodeGenerator'

export function useTeamInvites({ teamId }) {
  const [inviteCode, setInviteCode] = useState(null)
  const [pendingRequests, setPendingRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!teamId) return

    const teamDocRef = doc(db, 'teams', teamId)

    const unsubscribe = onSnapshot(teamDocRef, async (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data()

        // Generate invite code if it doesn't exist
        if (!data.inviteCode) {
          try {
            const newCode = generateInviteCode()
            await updateDoc(teamDocRef, {
              inviteCode: newCode,
            })
            setInviteCode(newCode)
          } catch (error) {
            console.error('Error generating invite code:', error)
          }
        } else {
          setInviteCode(data.inviteCode)
        }

        setPendingRequests(data.pendingRequests || [])
      } else {
        // Team document doesn't exist, create it with an invite code
        try {
          const newCode = generateInviteCode()
          await setDoc(teamDocRef, {
            inviteCode: newCode,
            pendingRequests: [],
            memberIds: [],
            createdAt: new Date(),
          })
          setInviteCode(newCode)
          setPendingRequests([])
        } catch (error) {
          console.error('Error creating team document:', error)
        }
      }
      setLoading(false)
    })

    return unsubscribe
  }, [teamId])

  const acceptRequest = async (userId, userData) => {
    if (!teamId) return

    const teamDocRef = doc(db, 'teams', teamId)
    const userDocRef = doc(db, 'users', userId)

    try {
      await updateDoc(teamDocRef, {
        pendingRequests: arrayRemove(userData),
        memberIds: arrayUnion(userId),
      })

      await updateDoc(userDocRef, {
        teamId: teamId,
      })
    } catch (error) {
      console.error('Error accepting request:', error)
      throw error
    }
  }

  const declineRequest = async (userData) => {
    if (!teamId) return

    const teamDocRef = doc(db, 'teams', teamId)

    try {
      await updateDoc(teamDocRef, {
        pendingRequests: arrayRemove(userData),
      })
    } catch (error) {
      console.error('Error declining request:', error)
      throw error
    }
  }

  return {
    inviteCode,
    pendingRequests,
    loading,
    acceptRequest,
    declineRequest,
  }
}
