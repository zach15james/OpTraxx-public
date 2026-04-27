// Zach's contribution — supervisor form builder.
// Standalone: no Firestore, no AuthContext, no MainLayout dependency.
// Wired into App.jsx at /sandbox/forms.

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
    listForms, getForm, saveForm, deleteForm,
    FIELD_TYPES, newField, newForm,
} from './formBuilderStore'
import { FORM_TEMPLATES, getTemplate } from './formTemplates'

export default function FormBuilderSandbox() {
    const [forms, setForms] = useState([])
    const [editing, setEditing] = useState(null) // form being edited or null

    useEffect(() => { setForms(listForms()) }, [])

    function refresh() { setForms(listForms()) }

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

    function startEdit(id) { setEditing(getForm(id)) }

    function handleSave(form) {
        saveForm(form)
        setEditing(null)
        refresh()
    }

    function handleDelete(id) {
        if (!confirm('Delete this form?')) return
        deleteForm(id)
        refresh()
    }

    if (editing) {
        return (
            <FormEditor
                initial={editing}
                onCancel={() => setEditing(null)}
                onSave={handleSave}
            />
        )
    }

    return (
        <div style={styles.page}>
            <header style={styles.header}>
                <h1 style={styles.h1}>Form Builder <span style={styles.badge}>sandbox</span></h1>
                <p style={styles.muted}>Supervisor view — create and manage forms employees fill out.</p>
            </header>

            <section style={styles.section}>
                <h2 style={styles.h2}>Start from a template</h2>
                <div style={styles.grid}>
                    {FORM_TEMPLATES.map(t => (
                        <button
                            key={t.key}
                            style={styles.templateCard}
                            onClick={() => startFromTemplate(t.key)}
                        >
                            <div style={styles.templateName}>{t.name}</div>
                            <div style={styles.muted}>{t.description}</div>
                            <div style={styles.tinyMuted}>{t.fields.length} questions</div>
                        </button>
                    ))}
                    <button style={{ ...styles.templateCard, ...styles.blank }} onClick={startBlank}>
                        <div style={styles.templateName}>+ Blank form</div>
                        <div style={styles.muted}>Start from scratch</div>
                    </button>
                </div>
            </section>

            <section style={styles.section}>
                <h2 style={styles.h2}>Your forms ({forms.length})</h2>
                {forms.length === 0 ? (
                    <p style={styles.muted}>No forms yet. Pick a template above to get started.</p>
                ) : (
                    <ul style={styles.list}>
                        {forms.map(f => (
                            <li key={f.id} style={styles.listRow}>
                                <div>
                                    <div style={styles.formTitle}>{f.title}</div>
                                    <div style={styles.tinyMuted}>{f.fields.length} questions · updated {new Date(f.updatedAt).toLocaleString()}</div>
                                </div>
                                <div style={styles.rowActions}>
                                    <Link to={`/sandbox/forms/fill/${f.id}`} style={styles.btnSecondary}>Preview as employee</Link>
                                    <Link to={`/sandbox/forms/submissions/${f.id}`} style={styles.btnSecondary}>Submissions</Link>
                                    <button onClick={() => startEdit(f.id)} style={styles.btnSecondary}>Edit</button>
                                    <button onClick={() => handleDelete(f.id)} style={styles.btnDanger}>Delete</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    )
}

function FormEditor({ initial, onSave, onCancel }) {
    const [form, setForm] = useState(initial)

    function patch(p) { setForm(prev => ({ ...prev, ...p })) }

    function addField(type) {
        patch({ fields: [...form.fields, newField(type)] })
    }

    function updateField(idx, patchObj) {
        const fields = form.fields.slice()
        fields[idx] = { ...fields[idx], ...patchObj }
        patch({ fields })
    }

    function removeField(idx) {
        patch({ fields: form.fields.filter((_, i) => i !== idx) })
    }

    function moveField(idx, dir) {
        const fields = form.fields.slice()
        const target = idx + dir
        if (target < 0 || target >= fields.length) return
        ;[fields[idx], fields[target]] = [fields[target], fields[idx]]
        patch({ fields })
    }

    return (
        <div style={styles.page}>
            <header style={styles.header}>
                <h1 style={styles.h1}>{initial.id ? 'Edit form' : 'New form'} <span style={styles.badge}>sandbox</span></h1>
            </header>

            <div style={styles.editorCard}>
                <label style={styles.label}>Title</label>
                <input
                    style={styles.input}
                    value={form.title}
                    onChange={e => patch({ title: e.target.value })}
                />
                <label style={styles.label}>Description</label>
                <textarea
                    style={styles.textarea}
                    value={form.description}
                    onChange={e => patch({ description: e.target.value })}
                />
            </div>

            <h2 style={styles.h2}>Questions</h2>
            {form.fields.length === 0 && (
                <p style={styles.muted}>No questions yet — add one below.</p>
            )}
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

            <div style={styles.addRow}>
                <span style={styles.muted}>Add question:</span>
                {FIELD_TYPES.map(t => (
                    <button key={t.value} onClick={() => addField(t.value)} style={styles.btnSecondary}>
                        + {t.label}
                    </button>
                ))}
            </div>

            <div style={styles.footerActions}>
                <button onClick={onCancel} style={styles.btnSecondary}>Cancel</button>
                <button onClick={() => onSave(form)} style={styles.btnPrimary}>Save form</button>
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

    function addOption() {
        onChange({ options: [...(field.options || []), `Option ${field.options.length + 1}`] })
    }

    function removeOption(idx) {
        onChange({ options: field.options.filter((_, i) => i !== idx) })
    }

    return (
        <div style={styles.fieldCard}>
            <div style={styles.fieldHeader}>
                <select
                    value={field.type}
                    onChange={e => onChange({ type: e.target.value, options: (e.target.value === 'single_select' || e.target.value === 'multi_select') ? (field.options || ['Option 1', 'Option 2']) : undefined })}
                    style={styles.select}
                >
                    {FIELD_TYPES.map(t => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                </select>
                <div style={styles.rowActions}>
                    <button onClick={onMoveUp} disabled={!canMoveUp} style={styles.btnTiny}>↑</button>
                    <button onClick={onMoveDown} disabled={!canMoveDown} style={styles.btnTiny}>↓</button>
                    <button onClick={onRemove} style={styles.btnDanger}>Remove</button>
                </div>
            </div>

            <input
                style={styles.input}
                value={field.label}
                onChange={e => onChange({ label: e.target.value })}
                placeholder="Question label"
            />

            <label style={styles.checkRow}>
                <input
                    type="checkbox"
                    checked={!!field.required}
                    onChange={e => onChange({ required: e.target.checked })}
                />
                Required
            </label>

            {hasOptions && (
                <div style={styles.optionsBox}>
                    <div style={styles.tinyMuted}>Options</div>
                    {(field.options || []).map((opt, i) => (
                        <div key={i} style={styles.optionRow}>
                            <input
                                style={styles.input}
                                value={opt}
                                onChange={e => setOption(i, e.target.value)}
                            />
                            <button onClick={() => removeOption(i)} style={styles.btnTiny}>×</button>
                        </div>
                    ))}
                    <button onClick={addOption} style={styles.btnSecondary}>+ Add option</button>
                </div>
            )}
        </div>
    )
}

const styles = {
    page: { maxWidth: 880, margin: '0 auto', padding: '32px 20px', fontFamily: 'system-ui, sans-serif', color: '#111' },
    header: { marginBottom: 24 },
    h1: { fontSize: 28, fontWeight: 700, margin: 0 },
    h2: { fontSize: 18, fontWeight: 600, margin: '24px 0 12px' },
    badge: { fontSize: 11, fontWeight: 500, padding: '2px 8px', background: '#fde68a', color: '#92400e', borderRadius: 999, marginLeft: 8, verticalAlign: 'middle' },
    section: { marginBottom: 32 },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 },
    templateCard: { textAlign: 'left', padding: 14, border: '1px solid #e5e7eb', borderRadius: 10, background: '#fff', cursor: 'pointer' },
    blank: { borderStyle: 'dashed' },
    templateName: { fontWeight: 600, marginBottom: 4 },
    muted: { color: '#6b7280', fontSize: 14 },
    tinyMuted: { color: '#9ca3af', fontSize: 12, marginTop: 4 },
    list: { listStyle: 'none', padding: 0, margin: 0 },
    listRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', border: '1px solid #e5e7eb', borderRadius: 10, marginBottom: 8, background: '#fff' },
    formTitle: { fontWeight: 600 },
    rowActions: { display: 'flex', gap: 8 },
    btnPrimary: { padding: '8px 14px', background: '#111', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 500 },
    btnSecondary: { padding: '6px 12px', background: '#fff', color: '#111', border: '1px solid #d1d5db', borderRadius: 8, cursor: 'pointer', fontSize: 13, textDecoration: 'none', display: 'inline-block' },
    btnDanger: { padding: '6px 12px', background: '#fff', color: '#b91c1c', border: '1px solid #fca5a5', borderRadius: 8, cursor: 'pointer', fontSize: 13 },
    btnTiny: { padding: '4px 8px', background: '#fff', border: '1px solid #d1d5db', borderRadius: 6, cursor: 'pointer', fontSize: 12 },
    editorCard: { padding: 16, border: '1px solid #e5e7eb', borderRadius: 10, background: '#fff', marginBottom: 16 },
    fieldCard: { padding: 14, border: '1px solid #e5e7eb', borderRadius: 10, background: '#fafafa', marginBottom: 10 },
    fieldHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    label: { display: 'block', fontSize: 13, fontWeight: 500, marginTop: 8, marginBottom: 4 },
    input: { width: '100%', padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' },
    textarea: { width: '100%', padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, minHeight: 60, boxSizing: 'border-box' },
    select: { padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 13, background: '#fff' },
    checkRow: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, marginTop: 8 },
    optionsBox: { marginTop: 10, padding: 10, background: '#fff', border: '1px dashed #e5e7eb', borderRadius: 8 },
    optionRow: { display: 'flex', gap: 6, marginBottom: 6 },
    addRow: { display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center', margin: '12px 0 24px' },
    footerActions: { display: 'flex', justifyContent: 'flex-end', gap: 8 },
}
