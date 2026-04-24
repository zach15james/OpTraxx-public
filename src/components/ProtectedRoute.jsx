import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export default function ProtectedRoute({ allowedRoles }) {
    const { user, role, loading } = useAuth()

    if (loading || user === undefined) return null

    if (!user) return <Navigate to="/login" replace />

    if (allowedRoles && !allowedRoles.includes(role)) {
        return <Navigate to="/login" replace />
    }

    return <Outlet />
}
