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

                // Calculate if task is overdue
                const dueDateTime = data.dueDate ? data.dueDate.toDate() : null
                const now = new Date()
                const isOverdue = dueDateTime && dueDateTime < now && data.status !== 'done'

                // Determine actual status (including calculated overdue)
                let actualStatus = data.status || 'pending'
                if (isOverdue) {
                    actualStatus = 'overdue'
                }

                return {
                    id: docSnapshot.id,
                    name: data.name || 'Untitled Task',
                    assigneeId: data.assigneeId || null,
                    assignee: {
                        initials: (assignee?.name || 'Unassigned').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
                        name: assignee?.name || 'Unassigned',
                        isUnassigned: !data.assigneeId,
                    },
                    status: actualStatus === 'in_progress' ? 'In Progress' : actualStatus === 'done' ? 'Done' : actualStatus === 'overdue' ? 'Overdue' : 'Pending',
                    rawStatus: actualStatus,
                    statusColor:
                        actualStatus === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        actualStatus === 'done' ? 'bg-green-100 text-green-800' :
                        actualStatus === 'overdue' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800',
                    priority: data.priority || 'Medium',
                    priorityColor:
                        data.priority === 'High' ? 'bg-red-100 text-red-800' :
                        data.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800',
                    dueDate: dueDateTime ? new Date(dueDateTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No date',
                    dueDateObj: dueDateTime,
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
