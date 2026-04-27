// Firestore-backed form & submission store. Mirrors the localStorage API in
// formBuilderStore.js, but every function is async / subscription-based.
//
// Collections used (matching firestore.rules):
//   forms/{id}        — supervisor write, any auth read
//   submissions/{id}  — auth create with submittedBy == uid; supervisor read all,
//                       employees read own
//
// Doc shapes:
//   form        : { title, description, fields:[{id,type,label,required,options?}],
//                   ownerId, createdAt, updatedAt }
//   submission  : { formId, formTitle, answers, submittedBy, submitterName,
//                   submittedAt }

import { db } from '@/lib/firebase'
import {
    collection, doc, getDoc, addDoc, updateDoc, deleteDoc,
    query, where, orderBy, onSnapshot, serverTimestamp,
} from 'firebase/firestore'

const formsCol = () => collection(db, 'forms')
const subsCol = () => collection(db, 'submissions')

function tsToMs(t) {
    if (!t) return 0
    if (typeof t === 'number') return t
    if (t.toMillis) return t.toMillis()
    if (t.seconds != null) return t.seconds * 1000
    return 0
}

function normalizeForm(d) {
    const data = d.data()
    return {
        id: d.id,
        ...data,
        createdAt: tsToMs(data.createdAt),
        updatedAt: tsToMs(data.updatedAt),
    }
}

function normalizeSubmission(d) {
    const data = d.data()
    return {
        id: d.id,
        ...data,
        submittedAt: tsToMs(data.submittedAt),
    }
}

// ---- Forms ----

// Live subscription for the forms list. Returns unsubscribe.
export function subscribeForms(cb) {
    const q = query(formsCol(), orderBy('updatedAt', 'desc'))
    return onSnapshot(
        q,
        snap => cb(snap.docs.map(normalizeForm)),
        err => { console.error('subscribeForms error:', err); cb([]) }
    )
}

// One-shot fetch for a single form.
export async function getForm(id) {
    if (!id) return null
    const snap = await getDoc(doc(db, 'forms', id))
    return snap.exists() ? normalizeForm(snap) : null
}

// Save (create or update). When updating, pass form.id.
export async function saveForm(form, ownerId) {
    const now = serverTimestamp()
    if (form.id) {
        const ref = doc(db, 'forms', form.id)
        const { id, createdAt, updatedAt, ...rest } = form
        await updateDoc(ref, { ...rest, updatedAt: now })
        return { ...form }
    }
    const { id, createdAt, updatedAt, ...rest } = form
    const ref = await addDoc(formsCol(), {
        ...rest,
        ownerId: ownerId || null,
        createdAt: now,
        updatedAt: now,
    })
    return { ...form, id: ref.id }
}

export async function deleteForm(id) {
    await deleteDoc(doc(db, 'forms', id))
}

// ---- Submissions ----

export async function saveSubmission(submission) {
    const ref = await addDoc(subsCol(), {
        ...submission,
        submittedAt: serverTimestamp(),
    })
    return { id: ref.id, ...submission }
}

// Live subscription to submissions for a form (supervisor only — rules block
// employees from reading other people's submissions).
export function subscribeSubmissions(formId, cb) {
    if (!formId) { cb([]); return () => {} }
    const q = query(subsCol(), where('formId', '==', formId))
    return onSnapshot(
        q,
        snap => {
            const list = snap.docs.map(normalizeSubmission)
            list.sort((a, b) => b.submittedAt - a.submittedAt)
            cb(list)
        },
        err => { console.error('subscribeSubmissions error:', err); cb([]) }
    )
}

// Live subscription to submissions across all forms (supervisor only).
// Useful for the supervisor list page to show per-form counts.
export function subscribeAllSubmissions(cb) {
    return onSnapshot(
        subsCol(),
        snap => cb(snap.docs.map(normalizeSubmission)),
        err => { console.error('subscribeAllSubmissions error:', err); cb([]) }
    )
}

// Live subscription to *my* submissions (any auth user). Used by employee
// list page to show "you submitted X times".
export function subscribeMySubmissions(uid, cb) {
    if (!uid) { cb([]); return () => {} }
    const q = query(subsCol(), where('submittedBy', '==', uid))
    return onSnapshot(
        q,
        snap => cb(snap.docs.map(normalizeSubmission)),
        err => { console.error('subscribeMySubmissions error:', err); cb([]) }
    )
}
