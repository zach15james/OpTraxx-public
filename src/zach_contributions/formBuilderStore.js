// Isolated sandbox store for the form builder. localStorage-backed.
// Swap these 4 functions for Firestore equivalents to wire to real DB:
//   listForms, getForm, saveForm, deleteForm  (and saveSubmission, listSubmissions)
// Schema kept intentionally close to the eventual Firestore `forms` / `submissions` collections.

const FORMS_KEY = 'optraxx_sandbox_forms_v1'
const SUBMISSIONS_KEY = 'optraxx_sandbox_submissions_v1'

function read(key) {
    try {
        const raw = localStorage.getItem(key)
        return raw ? JSON.parse(raw) : []
    } catch {
        return []
    }
}

function write(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
}

function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

export function listForms() {
    return read(FORMS_KEY).sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))
}

export function getForm(id) {
    return read(FORMS_KEY).find(f => f.id === id) || null
}

export function saveForm(form) {
    const all = read(FORMS_KEY)
    const now = Date.now()
    const id = form.id || uid()
    const next = { ...form, id, updatedAt: now, createdAt: form.createdAt || now }
    const idx = all.findIndex(f => f.id === id)
    if (idx >= 0) all[idx] = next
    else all.push(next)
    write(FORMS_KEY, all)
    return next
}

export function deleteForm(id) {
    write(FORMS_KEY, read(FORMS_KEY).filter(f => f.id !== id))
}

export function saveSubmission(submission) {
    const all = read(SUBMISSIONS_KEY)
    const next = { ...submission, id: submission.id || uid(), submittedAt: Date.now() }
    all.push(next)
    write(SUBMISSIONS_KEY, all)
    return next
}

export function listSubmissions(formId) {
    const all = read(SUBMISSIONS_KEY)
    return formId ? all.filter(s => s.formId === formId) : all
}

export const FIELD_TYPES = [
    { value: 'short_text', label: 'Short text' },
    { value: 'long_text', label: 'Long text' },
    { value: 'number', label: 'Number' },
    { value: 'single_select', label: 'Single choice' },
    { value: 'multi_select', label: 'Multiple choice' },
    { value: 'date', label: 'Date' },
    { value: 'rating', label: 'Rating (1-5)' },
    { value: 'yes_no', label: 'Yes / No' },
]

export function newField(type = 'short_text') {
    const base = { id: uid(), type, label: 'Untitled question', required: false }
    if (type === 'single_select' || type === 'multi_select') {
        base.options = ['Option 1', 'Option 2']
    }
    return base
}

export function newForm(seed = {}) {
    return {
        id: null,
        title: seed.title || 'Untitled form',
        description: seed.description || '',
        fields: seed.fields || [],
    }
}
