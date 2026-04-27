import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase'
import { collection, query, where, onSnapshot, orderBy, getDoc, doc } from 'firebase/firestore'

export function useTaskList({ uid, userRole }) {
    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!uid) return

        // Supervisors see tasks they assigned, employees see tasks assigned to them
        const whereCondition = userRole === 'supervisor'
            ? where('assignedBy', '==', uid)
            : where('assigneeId', '==', uid)

        const tasksQuery = query(
            collection(db, 'tasks'),
            whereCondition,
            orderBy('dueDate', 'asc')
        )

        const unsubscribe = onSnapshot(tasksQuery, async (snapshot) => {
            const tasksData = await Promise.all(snapshot.docs.map(async (docSnapshot) => {
                const data = docSnapshot.data()
                const assignee = data.assigneeId ? (await getDoc(doc(db, 'users', data.assigneeId))).data() : null

                return {
                    id: docSnapshot.id,
                    name: data.name || 'Untitled Task',
                    assignee: {
                        initials: (assignee?.name || 'Unknown').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
                        name: assignee?.name || 'Unassigned',
                    },
                    status: data.status === 'in_progress' ? 'In Progress' : data.status === 'done' ? 'Done' : data.status === 'overdue' ? 'Overdue' : 'Pending',
                    rawStatus: data.status || 'pending',
                    statusColor:
                        data.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        data.status === 'done' ? 'bg-green-100 text-green-800' :
                        data.status === 'overdue' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800',
                    priority: data.priority || 'Medium',
                    priorityColor:
                        data.priority === 'High' ? 'bg-red-100 text-red-800' :
                        data.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800',
                    dueDate: data.dueDate ? new Date(data.dueDate.toDate()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No date',
                    formId: data.formId || null,
                    form: data.formId ? 'Form attached' : 'N/A',
                }
            }))

            setTasks(tasksData)
            setLoading(false)
        })

        return unsubscribe
    }, [uid])

    return { tasks, loading }
}
