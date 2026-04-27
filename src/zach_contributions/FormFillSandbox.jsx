// SANDBOX — employee fills out a form. Standalone, no auth/db deps.
// Route suggestion: /sandbox/forms/fill/:formId

import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getForm, saveSubmission, listSubmissions } from './formBuilderStore'

export default function FormFillSandbox() {
    const { formId } = useParams()
    const [form, setForm] = useState(null)
    const [answers, setAnswers] = useState({})
    const [submitted, setSubmitted] = useState(null)
    const [errors, setErrors] = useState({})

    useEffect(() => {
        const f = getForm(formId)
        setForm(f)
    }, [formId])

    if (!form) {
        return (
            <div style={styles.page}>
                <p style={styles.muted}>Form not found.</p>
                <Link to="/sandbox/forms" style={styles.btnSecondary}>← Back to forms</Link>
            </div>
        )
    }

    function setAnswer(fieldId, value) {
        setAnswers(prev => ({ ...prev, [fieldId]: value }))
    }

    function toggleMulti(fieldId, option) {
        const cur = answers[fieldId] || []
        const next = cur.includes(option) ? cur.filter(o => o !== option) : [...cur, option]
        setAnswer(fieldId, next)
    }

    function validate() {
        const errs = {}
        for (const f of form.fields) {
            if (!f.required) continue
            const v = answers[f.id]
            const empty = v === undefined || v === '' || v === null || (Array.isArray(v) && v.length === 0)
            if (empty) errs[f.id] = 'Required'
        }
        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    function handleSubmit(e) {
        e.preventDefault()
        if (!validate()) return
        const sub = saveSubmission({
            formId: form.id,
            formTitle: form.title,
            answers,
        })
        setSubmitted(sub)
    }

    if (submitted) {
        const all = listSubmissions(form.id)
        return (
            <div style={styles.page}>
                <h1 style={styles.h1}>Submitted ✓</h1>
                <p style={styles.muted}>Your response was saved locally. ({all.length} total submission{all.length === 1 ? '' : 's'} for this form)</p>
                <details style={styles.details}>
                    <summary>Show what you submitted</summary>
                    <pre style={styles.pre}>{JSON.stringify(submitted, null, 2)}</pre>
                </details>
                <div style={styles.actions}>
                    <Link to="/sandbox/forms" style={styles.btnSecondary}>Back to forms</Link>
                    <button onClick={() => { setAnswers({}); setSubmitted(null) }} style={styles.btnPrimary}>Submit another</button>
                </div>
            </div>
        )
    }

    return (
        <div style={styles.page}>
            <header style={styles.header}>
                <Link to="/sandbox/forms" style={styles.tinyMuted}>← Forms</Link>
                <h1 style={styles.h1}>{form.title} <span style={styles.badge}>employee view</span></h1>
                {form.description && <p style={styles.muted}>{form.description}</p>}
            </header>

            <form onSubmit={handleSubmit}>
                {form.fields.map(field => (
                    <FieldRenderer
                        key={field.id}
                        field={field}
                        value={answers[field.id]}
                        error={errors[field.id]}
                        onChange={v => setAnswer(field.id, v)}
                        onToggleMulti={opt => toggleMulti(field.id, opt)}
                    />
                ))}

                <div style={styles.actions}>
                    <button type="submit" style={styles.btnPrimary}>Submit</button>
                </div>
            </form>
        </div>
    )
}

function FieldRenderer({ field, value, error, onChange, onToggleMulti }) {
    return (
        <div style={styles.fieldCard}>
            <label style={styles.qLabel}>
                {field.label}
                {field.required && <span style={styles.required}> *</span>}
            </label>
            {renderInput(field, value, onChange, onToggleMulti)}
            {error && <div style={styles.errorText}>{error}</div>}
        </div>
    )
}

function renderInput(field, value, onChange, onToggleMulti) {
    switch (field.type) {
        case 'short_text':
            return <input style={styles.input} value={value || ''} onChange={e => onChange(e.target.value)} />
        case 'long_text':
            return <textarea style={styles.textarea} value={value || ''} onChange={e => onChange(e.target.value)} />
        case 'number':
            return <input type="number" style={styles.input} value={value ?? ''} onChange={e => onChange(e.target.value === '' ? '' : Number(e.target.value))} />
        case 'date':
            return <input type="date" style={styles.input} value={value || ''} onChange={e => onChange(e.target.value)} />
        case 'single_select':
            return (
                <div>
                    {(field.options || []).map(opt => (
                        <label key={opt} style={styles.radioRow}>
                            <input
                                type="radio"
                                name={field.id}
                                checked={value === opt}
                                onChange={() => onChange(opt)}
                            />
                            {opt}
                        </label>
                    ))}
                </div>
            )
        case 'multi_select':
            return (
                <div>
                    {(field.options || []).map(opt => (
                        <label key={opt} style={styles.radioRow}>
                            <input
                                type="checkbox"
                                checked={(value || []).includes(opt)}
                                onChange={() => onToggleMulti(opt)}
                            />
                            {opt}
                        </label>
                    ))}
                </div>
            )
        case 'rating':
            return (
                <div style={styles.ratingRow}>
                    {[1, 2, 3, 4, 5].map(n => (
                        <button
                            key={n}
                            type="button"
                            onClick={() => onChange(n)}
                            style={{ ...styles.ratingBtn, ...(value === n ? styles.ratingBtnActive : {}) }}
                        >
                            {n}
                        </button>
                    ))}
                </div>
            )
        case 'yes_no':
            return (
                <div style={styles.ynRow}>
                    <button type="button" onClick={() => onChange('yes')} style={{ ...styles.ynBtn, ...(value === 'yes' ? styles.ynYes : {}) }}>Yes</button>
                    <button type="button" onClick={() => onChange('no')} style={{ ...styles.ynBtn, ...(value === 'no' ? styles.ynNo : {}) }}>No</button>
                </div>
            )
        default:
            return <div style={styles.muted}>Unsupported field type: {field.type}</div>
    }
}

const styles = {
    page: { maxWidth: 720, margin: '0 auto', padding: '32px 20px', fontFamily: 'system-ui, sans-serif', color: '#111' },
    header: { marginBottom: 24 },
    h1: { fontSize: 26, fontWeight: 700, margin: '4px 0' },
    badge: { fontSize: 11, fontWeight: 500, padding: '2px 8px', background: '#dbeafe', color: '#1e40af', borderRadius: 999, marginLeft: 8, verticalAlign: 'middle' },
    muted: { color: '#6b7280', fontSize: 14 },
    tinyMuted: { color: '#9ca3af', fontSize: 12, textDecoration: 'none' },
    fieldCard: { padding: 14, border: '1px solid #e5e7eb', borderRadius: 10, background: '#fff', marginBottom: 12 },
    qLabel: { display: 'block', fontWeight: 500, marginBottom: 8 },
    required: { color: '#b91c1c' },
    input: { width: '100%', padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' },
    textarea: { width: '100%', padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, minHeight: 80, boxSizing: 'border-box' },
    radioRow: { display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', fontSize: 14 },
    ratingRow: { display: 'flex', gap: 6 },
    ratingBtn: { width: 38, height: 38, border: '1px solid #d1d5db', borderRadius: 8, background: '#fff', cursor: 'pointer', fontSize: 14 },
    ratingBtnActive: { background: '#111', color: '#fff', borderColor: '#111' },
    ynRow: { display: 'flex', gap: 8 },
    ynBtn: { padding: '8px 18px', border: '1px solid #d1d5db', borderRadius: 8, background: '#fff', cursor: 'pointer' },
    ynYes: { background: '#065f46', color: '#fff', borderColor: '#065f46' },
    ynNo: { background: '#991b1b', color: '#fff', borderColor: '#991b1b' },
    errorText: { color: '#b91c1c', fontSize: 12, marginTop: 6 },
    actions: { display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16 },
    btnPrimary: { padding: '10px 16px', background: '#111', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 500 },
    btnSecondary: { padding: '8px 14px', background: '#fff', color: '#111', border: '1px solid #d1d5db', borderRadius: 8, cursor: 'pointer', textDecoration: 'none' },
    details: { marginTop: 16, padding: 12, background: '#f9fafb', borderRadius: 8, border: '1px solid #e5e7eb' },
    pre: { fontSize: 12, overflow: 'auto', marginTop: 8 },
}
