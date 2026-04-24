const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

exports.escalateOverdueTasks = functions.pubsub
    .schedule('every 1 hours')
    .onRun(async (context) => {
        const now = new Date();

        const tasksSnapshot = await db.collection('tasks')
            .where('status', 'in', ['pending', 'in_progress'])
            .where('isEscalated', '==', false)
            .get();

        const batch = db.batch();
        let escalatedCount = 0;

        tasksSnapshot.forEach((doc) => {
            const task = doc.data();

            if (task.dueDate && task.dueDate.toDate() < now) {
                batch.update(doc.ref, {
                    isEscalated: true,
                    status: 'overdue',
                    escalatedAt: admin.firestore.FieldValue.serverTimestamp(),
                });
                escalatedCount++;
            }
        });

        if (escalatedCount > 0) {
            await batch.commit();
            console.log(`Escalated ${escalatedCount} overdue tasks`);
        } else {
            console.log('No tasks to escalate');
        }

        return { escalated: escalatedCount };
    });
