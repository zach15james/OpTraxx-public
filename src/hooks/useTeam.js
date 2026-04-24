import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase'
import { collection, query, where, onSnapshot, getDocs } from 'firebase/firestore'

export function useTeam({ teamId, uid }) {
    const [teamMembers, setTeamMembers] = useState([])
    const [liveActivity, setLiveActivity] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!teamId || !uid) return

        const membersQuery = query(
            collection(db, 'users'),
            where('teamId', '==', teamId),
            where('role', '==', 'employee')
        )

        const unsubscribe = onSnapshot(membersQuery, async (memberSnapshot) => {
            const membersData = memberSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))

            const tasksQuery = query(
                collection(db, 'tasks'),
                where('assignedBy', '==', uid)
            )

            const tasksSnapshot = await getDocs(tasksQuery)
            const tasks = tasksSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))

            const enrichedMembers = membersData.map(member => {
                const memberTasks = tasks.filter(t => t.assigneeId === member.id)
                const openTasks = memberTasks.filter(t => ['pending', 'in_progress'].includes(t.status)).length
                const completedTasks = memberTasks.filter(t => t.status === 'done').length
                const workload = memberTasks.length > 0 ? Math.round((openTasks / memberTasks.length) * 100) : 0

                return {
                    id: member.id,
                    initials: (member.name || member.email).split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
                    name: member.name || member.email,
                    role: member.role || 'Team Member',
                    status: 'On-Site',
                    statusColor: 'bg-green-100 text-green-800',
                    statusIcon: '📍',
                    workload: Math.min(workload + Math.random() * 20, 100),
                    tasksCompleted: completedTasks,
                    tasksPending: openTasks,
                    trendData: [45, 52, 58, 65, 72, 78, 85],
                    trendDirection: 'up',
                    lastAction: '5 mins ago - Working on tasks',
                    isOverloaded: workload > 70,
                }
            })

            setTeamMembers(enrichedMembers)

            const recentActivity = tasks
                .sort((a, b) => (b.updatedAt || b.createdAt) - (a.updatedAt || a.createdAt))
                .slice(0, 5)
                .map(task => {
                    const assignee = membersData.find(m => m.id === task.assigneeId)
                    return {
                        time: '5 mins ago',
                        action: assignee?.name || 'Someone',
                        task: task.name || 'Task',
                        icon: task.status === 'done' ? '✅' : '▶️',
                    }
                })

            setLiveActivity(recentActivity)
            setLoading(false)
        })

        return unsubscribe
    }, [teamId, uid])

    return { teamMembers, liveActivity, loading }
}
