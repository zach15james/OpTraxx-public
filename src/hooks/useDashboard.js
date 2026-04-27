import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase'
import { collection, query, where, onSnapshot, getDocs, doc, getDoc } from 'firebase/firestore'

export function useDashboard({ uid, teamId }) {
    const [tasks, setTasks] = useState([])
    const [members, setMembers] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!uid) return

        const tasksQuery = query(
            collection(db, 'tasks'),
            where('assignedBy', '==', uid)
        )

        const unsubscribe = onSnapshot(tasksQuery, async (snapshot) => {
            const tasksData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))

            setTasks(tasksData)

            if (teamId) {
                const membersQuery = query(
                    collection(db, 'users'),
                    where('teamId', '==', teamId),
                    where('role', '==', 'employee')
                )

                const memberSnapshot = await getDocs(membersQuery)
                const membersData = memberSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }))

                setMembers(membersData)
            }

            setLoading(false)
        })

        return unsubscribe
    }, [uid, teamId])

    const startOfToday = new Date()
    startOfToday.setHours(0, 0, 0, 0)
    const addedToday = tasks.filter(t => {
        const created = t.createdAt?.toDate?.() || (t.createdAt instanceof Date ? t.createdAt : null)
        return created && created >= startOfToday
    }).length
    const overdueCount = tasks.filter(t => t.status === 'overdue').length

    const stats = [
        {
            label: 'Open Tasks',
            value: tasks.filter(t => ['pending', 'in_progress'].includes(t.status)).length.toString(),
            change: addedToday > 0 ? `+${addedToday} added today` : 'No new today',
            changeType: 'neutral',
        },
        {
            label: 'Completed',
            value: tasks.filter(t => t.status === 'done').length.toString(),
            change: 'All time',
            changeType: 'positive',
        },
        {
            label: 'Overdue',
            value: overdueCount.toString(),
            change: overdueCount > 0 ? 'Needs attention' : 'On track',
            changeType: overdueCount > 0 ? 'negative' : 'positive',
        },
        {
            label: 'Completion Rate',
            value: tasks.length > 0 ? Math.round((tasks.filter(t => t.status === 'done').length / tasks.length) * 100) + '%' : '0%',
            change: `${tasks.filter(t => t.status === 'done').length} of ${tasks.length}`,
            changeType: 'positive',
        },
    ]

    const activeTasks = tasks
        .filter(t => ['pending', 'in_progress'].includes(t.status))
        .map(t => {
            const assignee = members.find(m => m.id === t.assigneeId)
            return {
                id: t.id,
                title: t.name || 'Untitled Task',
                team: assignee ? `${assignee.name} • ${assignee.role || 'Team Member'}` : 'Unassigned',
                status: t.status === 'in_progress' ? 'In Progress' : 'Pending',
                statusColor: t.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800',
                dueDate: t.dueDate ? new Date(t.dueDate.toDate()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No date',
            }
        })

    const teamMembers = members.map(m => ({
        initials: (m.name || m.email).split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
        name: m.name || m.email,
        role: m.role || 'Team Member',
        open: `${tasks.filter(t => t.assigneeId === m.id && ['pending', 'in_progress'].includes(t.status)).length} open`,
        openColor: 'text-blue-600',
    }))

    const recentActivity = tasks
        .sort((a, b) => (b.updatedAt || b.createdAt) - (a.updatedAt || a.createdAt))
        .slice(0, 5)
        .map(t => {
            const assignee = members.find(m => m.id === t.assigneeId)
            return {
                initials: (assignee?.name || 'Unknown').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
                name: assignee?.name || 'Unknown',
                action: t.status === 'done' ? 'completed' : 'updated',
                task: t.name || 'Untitled Task',
                time: 'Recently',
            }
        })

    return {
        stats,
        activeTasks,
        teamMembers,
        recentActivity,
        loading,
    }
}
