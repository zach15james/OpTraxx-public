import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import RoleSelection from '@/components/RoleSelection'

export default function RoleSelectionPage() {
  const navigate = useNavigate()
  const { user, userProfile, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (authLoading === false && !user) {
      navigate('/login')
    }
  }, [user, authLoading, navigate])

  const handleRoleSelect = async (role) => {
    if (!user) return

    setLoading(true)
    try {
      const userDocRef = doc(db, 'users', user.uid)
      await updateDoc(userDocRef, { role })

      const redirectUrl = role === 'supervisor' ? `/dashboard/${userProfile?.teamId || '1'}` : '/tasks'
      navigate(redirectUrl)
    } catch (error) {
      console.error('Error updating role:', error)
      setLoading(false)
    }
  }

  if (authLoading) return null

  return <RoleSelection onRoleSelect={handleRoleSelect} loading={loading} />
}
