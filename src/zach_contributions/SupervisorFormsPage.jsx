// Supervisor-facing forms manager, styled to fit inside MainLayout (Tailwind).
// Backed by Firestore (formStoreFirestore.js). Live updates via onSnapshot.

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'
import { FIELD_TYPES, newField, newForm } from './formBuilderStore'
import {
    subscribeForms, subscribeAllSubmissions, getForm, saveForm, deleteForm,
} from './formStoreFirestore'
import { FORM_TEMPLATES, getTemplate } from './formTemplates'
import { Plus, Trash2, ArrowUp, ArrowDown, FileText, Eye, Inbox, Pencil } from 'lucide-react'

export default function SupervisorFormsPage() {
    const { user } = useAuth()
    const [forms, setForms] = useState([])
    const [submissions, setSubmissions] = useState([])
    const [editing, setEditing] = useState(null)
    const [busy, setBusy] = useState(false)

    useEffect(() => subscribeForms(setForms), [])
    useEffect(() => subscribeAllSubmissions(setSubmissions), [])

    function startBlank() { setEditing(newForm()) }
    function startFromTemplate(key) {
        const t = getTemplate(key)
        if (!t) return
        setEditing(newForm({
            title: t.name,
            description: t.description,
            fields: t.fields.map(f => ({ ...newField(f.type), ...f })),
        }))
    }
    async function startEdit(id) {
        setBusy(true)
        const f = await getForm(id)
        setBusy(false)
        if (f) setEditing(f)
    }
    async function handleSave(form) {
        setBusy(true)
        try {
            await saveForm(form, user?.uid)
            setEditing(null)
        } catch (e) {
            alert('Failed to save form: ' + (e.message || e))
        } finally {
            setBusy(false)
        }
    }
    async function handleDelete(id) {
        if (!confirm('Delete this form?')) return
        try {
            await deleteForm(id)
        } catch (e) {
            alert('Failed to delete: ' + (e.message || e))
        }
    }

    if (editing) {
        return <FormEditor initial={editing} onCancel={() => setEditing(null)} onSave={handleSave} />
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <header>
                <h1 className="text-2xl font-bold text-slate-900">Forms</h1>
                <p className="text-slate-600 text-sm">Build forms employees fill out, then review submissions.</p>
            </header>

            <section>
                <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Start from a template</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {FORM_TEMPLATES.map(t => (
                        <button
                            key={t.key}
                            onClick={() => startFromTemplate(t.key)}
                            className="text-left p-4 rounded-lg border border-slate-200 bg-white hover:border-blue-500 hover:shadow-sm transition-all"
                        >
                            <div className="font-semibold text-slate-900 mb-1">{t.name}</div>
                            <div className="text-xs text-slate-500 mb-2">{t.description}</div>
                            <div className="text-xs text-slate-400">{t.fields.length} questions</div>
                        </button>
                    ))}
                    <button
                        onClick={startBlank}
                        className="text-left p-4 rounded-lg border border-dashed border-slate-300 bg-white hover:border-blue-500 hover:bg-blue-50 transition-all"
                    >
                        <div className="font-semibold text-slate-900 mb-1 flex items-center gap-2"><Plus className="w-4 h-4" /> Blank form</div>
                        <div className="text-xs text-slate-500">Start from scratch</div>
                    </button>
                </div>
            </section>

            <section>
                <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Your forms ({forms.length})</h2>
                {forms.length === 0 ? (
                    <Card className="p-6 text-center text-slate-500 text-sm">No forms yet. Pick a template above to get started.</Card>
                ) : (
                    <div className="space-y-2">
                        {forms.map(f => {
                            const subCount = submissions.filter(s => s.formId === f.id).length
                            return (
                                <Card key={f.id} className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <FileText className="w-5 h-5 text-slate-400 flex-shrink-0" />
                                        <div className="min-w-0">
                                            <div className="font-semibold text-slate-900 truncate">{f.title}</div>
                                            <div className="text-xs text-slate-500">
                                                {f.fields.length} questions · {subCount} submission{subCount === 1 ? '' : 's'} · updated {new Date(f.updatedAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <Button asChild variant="outline" size="sm">
                                            <Link to={`/my-forms/${f.id}`}><Eye className="w-3.5 h-3.5 mr-1" />Preview</Link>
                                        </Button>
                                        <Button asChild variant="outline" size="sm">
                                            <Link to={`/forms-manage/submissions/${f.id}`}><Inbox className="w-3.5 h-3.5 mr-1" />Submissions ({subCount})</Link>
                                        </Button>
                                        <Button onClick={() => startEdit(f.id)} variant="outline" size="sm">
                                            <Pencil className="w-3.5 h-3.5 mr-1" />Edit
                                        </Button>
                                        <Button onClick={() => handleDelete(f.id)} variant="outline" size="sm" className="!text-red-600 hover:!bg-red-50">
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                </Card>
                            )
                        })}
                    </div>
                )}
            </section>
        </div>
    )
}

function FormEditor({ initial, onSave, onCancel }) {
    const [form, setForm] = useState(initial)
    const patch = p => setForm(prev => ({ ...prev, ...p }))

    function addField(type) { patch({ fields: [...form.fields, newField(type)] }) }
    function updateField(idx, p) {
        const fields = form.fields.slice()
        fields[idx] = { ...fields[idx], ...p }
        patch({ fields })
    }
    function removeField(idx) { patch({ fields: form.fields.filter((_, i) => i !== idx) }) }
    function moveField(idx, dir) {
        const fields = form.fields.slice()
        const t = idx + dir
        if (t < 0 || t >= fields.length) return
        ;[fields[idx], fields[t]] = [fields[t], fields[idx]]
        patch({ fields })
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <header>
                <button onClick={onCancel} className="text-xs text-slate-500 hover:text-slate-900">← Back to forms</button>
                <h1 className="text-2xl font-bold text-slate-900 mt-1">{initial.id ? 'Edit form' : 'New form'}</h1>
            </header>

            <Card className="p-6 space-y-4">
                <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">Title</label>
                    <input
                        value={form.title}
                        onChange={e => patch({ title: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">Description</label>
                    <textarea
                        value={form.description}
                        onChange={e => patch({ description: e.target.value })}
                        rows="2"
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                </div>
            </Card>

            <div>
                <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Questions ({form.fields.length})</h2>
                {form.fields.length === 0 && (
                    <Card className="p-6 text-center text-sm text-slate-500">No questions yet — add one below.</Card>
                )}
                <div className="space-y-3">
                    {form.fields.map((field, idx) => (
                        <FieldEditor
                            key={field.id}
                            field={field}
                            onChange={p => updateField(idx, p)}
                            onRemove={() => removeField(idx)}
                            onMoveUp={() => moveField(idx, -1)}
                            onMoveDown={() => moveField(idx, +1)}
                            canMoveUp={idx > 0}
                            canMoveDown={idx < form.fields.length - 1}
                        />
                    ))}
                </div>
            </div>

            <Card className="p-4">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Add a question</div>
                <div className="flex flex-wrap gap-2">
                    {FIELD_TYPES.map(t => (
                        <Button key={t.value} onClick={() => addField(t.value)} variant="outline" size="sm">
                            <Plus className="w-3 h-3 mr-1" />{t.label}
                        </Button>
                    ))}
                </div>
            </Card>

            <div className="flex justify-end gap-2 sticky bottom-0 bg-slate-50 py-4 border-t border-slate-200">
                <Button onClick={onCancel} variant="outline">Cancel</Button>
                <Button onClick={() => onSave(form)} className="!bg-blue-600 hover:!bg-blue-700 !text-white">Save form</Button>
            </div>
        </div>
    )
}

function FieldEditor({ field, onChange, onRemove, onMoveUp, onMoveDown, canMoveUp, canMoveDown }) {
    const hasOptions = field.type === 'single_select' || field.type === 'multi_select'

    function setOption(idx, value) {
        const options = field.options.slice()
        options[idx] = value
        onChange({ options })
    }
    function addOption() { onChange({ options: [...(field.options || []), `Option ${(field.options?.length || 0) + 1}`] }) }
    function removeOption(idx) { onChange({ options: field.options.filter((_, i) => i !== idx) }) }

    return (
        <Card className="p-4">
            <div className="flex items-center justify-between gap-3 mb-3">
                <select
                    value={field.type}
                    onChange={e => {
                        const newType = e.target.value
                        const optionsNeeded = newType === 'single_select' || newType === 'multi_select'
                        onChange({ type: newType, options: optionsNeeded ? (field.options || ['Option 1', 'Option 2']) : undefined })
                    }}
                    className="px-3 py-1.5 border border-slate-300 rounded-md text-sm bg-white"
                >
                    {FIELD_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
                <div className="flex items-center gap-1">
                    <Button onClick={onMoveUp} disabled={!canMoveUp} variant="outline" size="sm"><ArrowUp className="w-3 h-3" /></Button>
                    <Button onClick={onMoveDown} disabled={!canMoveDown} variant="outline" size="sm"><ArrowDown className="w-3 h-3" /></Button>
                    <Button onClick={onRemove} variant="outline" size="sm" className="!text-red-600 hover:!bg-red-50"><Trash2 className="w-3 h-3" /></Button>
                </div>
            </div>

            <input
                value={field.label}
                onChange={e => onChange({ label: e.target.value })}
                placeholder="Question label"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <label className="flex items-center gap-2 mt-2 text-sm text-slate-700">
                <input type="checkbox" checked={!!field.required} onChange={e => onChange({ required: e.target.checked })} />
                Required
            </label>

            {hasOptions && (
                <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Options</div>
                    <div className="space-y-2">
                        {(field.options || []).map((opt, i) => (
                            <div key={i} className="flex gap-2">
                                <input
                                    value={opt}
                                    onChange={e => setOption(i, e.target.value)}
                                    className="flex-1 px-3 py-1.5 border border-slate-300 rounded-md text-sm bg-white"
                                />
                                <Button onClick={() => removeOption(i)} variant="outline" size="sm"><Trash2 className="w-3 h-3" /></Button>
                            </div>
                        ))}
                        <Button onClick={addOption} variant="outline" size="sm"><Plus className="w-3 h-3 mr-1" />Add option</Button>
                    </div>
                </div>
            )}
        </Card>
    )
}
