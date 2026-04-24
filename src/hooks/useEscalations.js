import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase'
import { collection, query, where, onSnapshot, getDoc, doc } from 'firebase/firestore'

export function useEscalations({ uid }) {
    const [escalations, setEscalations] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!uid) return

        const escalationsQuery = query(
            collection(db, 'tasks'),
            where('assignedBy', '==', uid),
            where('isEscalated', '==', true)
        )

        const unsubscribe = onSnapshot(escalationsQuery, async (snapshot) => {
            const escalationsData = await Promise.all(snapshot.docs.map(async (docSnapshot) => {
                const data = docSnapshot.data()
                const assignee = data.assigneeId ? (await getDoc(doc(db, 'users', data.assigneeId))).data() : null

                const createdTime = data.createdAt?.toDate ? new Date(data.createdAt.toDate()) : new Date()
                const now = new Date()
                const daysOverdue = Math.floor((now - createdTime) / (1000 * 60 * 60 * 24))
                const hoursStuck = Math.floor((now - createdTime) / (1000 * 60 * 60))

                return {
                    id: docSnapshot.id,
                    title: data.name || 'Untitled Task',
                    assignee: {
                        initials: (assignee?.name || 'Unknown').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
                        name: assignee?.name || 'Unknown',
                        role: assignee?.role || 'Team Member',
                    },
                    blockerReason: data.escalationReason || 'Unknown',
                    blockerType: 'dependency',
                    heat: hoursStuck % 24,
                    daysOverdue: Math.max(daysOverdue, 0),
                    priority: data.priority || 'High',
                    escalatedAt: daysOverdue === 0 ? 'Today' : `${daysOverdue} day${daysOverdue === 1 ? '' : 's'} ago`,
                    form: 'Task Form',
                    lastUpdate: 'Recently',
                    timeline: [
                        { time: new Date().toLocaleString(), action: 'Task escalated', user: 'System' },
                    ],
                    completionRate: 50,
                }
            }))

            setEscalations(escalationsData)
            setLoading(false)
        })

        return unsubscribe
    }, [uid])

    return { escalations, loading }
}
