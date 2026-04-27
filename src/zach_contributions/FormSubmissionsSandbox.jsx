// SANDBOX — supervisor reviews submissions for a form. Standalone.
// Route suggestion: /sandbox/forms/submissions/:formId

import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getForm, listSubmissions } from './formBuilderStore'

export default function FormSubmissionsSandbox() {
    const { formId } = useParams()
    const [form, setForm] = useState(null)
    const [submissions, setSubmissions] = useState([])
    const [openId, setOpenId] = useState(null)

    useEffect(() => {
        setForm(getForm(formId))
        setSubmissions(listSubmissions(formId).sort((a, b) => b.submittedAt - a.submittedAt))
    }, [formId])

    if (!form) {
        return (
            <div style={styles.page}>
                <p style={styles.muted}>Form not found.</p>
                <Link to="/sandbox/forms" style={styles.btn}>← Back</Link>
            </div>
        )
    }

    function exportJson() {
        const blob = new Blob([JSON.stringify({ form, submissions }, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${form.title.replace(/\s+/g, '_')}_submissions.json`
        a.click()
        URL.revokeObjectURL(url)
    }

    function exportCsv() {
        const headers = ['submittedAt', ...form.fields.map(f => f.label)]
        const rows = submissions.map(s => {
            const row = [new Date(s.submittedAt).toISOString()]
            for (const f of form.fields) {
                const v = s.answers?.[f.id]
                row.push(Array.isArray(v) ? v.join('; ') : (v ?? ''))
            }
            return row
        })
        const csv = [headers, ...rows]
            .map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(','))
            .join('\n')
        const blob = new Blob([csv], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${form.title.replace(/\s+/g, '_')}_submissions.csv`
        a.click()
        URL.revokeObjectURL(url)
    }

    return (
        <div style={styles.page}>
            <header style={styles.header}>
                <Link to="/sandbox/forms" style={styles.tinyMuted}>← Forms</Link>
                <h1 style={styles.h1}>{form.title} <span style={styles.badge}>submissions</span></h1>
                <p style={styles.muted}>{submissions.length} submission{submissions.length === 1 ? '' : 's'}</p>
                <div style={styles.actions}>
                    <Link to={`/sandbox/forms/fill/${form.id}`} style={styles.btn}>+ New submission</Link>
                    <button onClick={exportJson} style={styles.btn} disabled={!submissions.length}>Export JSON</button>
                    <button onClick={exportCsv} style={styles.btn} disabled={!submissions.length}>Export CSV</button>
                </div>
            </header>

            {submissions.length === 0 ? (
                <p style={styles.muted}>No submissions yet. Use "Preview as employee" or the link above to fill one out.</p>
            ) : (
                <ul style={styles.list}>
                    {submissions.map(s => {
                        const open = openId === s.id
                        return (
                            <li key={s.id} style={styles.row}>
                                <button onClick={() => setOpenId(open ? null : s.id)} style={styles.rowHeader}>
                                    <span>{new Date(s.submittedAt).toLocaleString()}</span>
                                    <span style={styles.tinyMuted}>{open ? 'hide ▲' : 'show ▼'}</span>
                                </button>
                                {open && (
                                    <div style={styles.answers}>
                                        {form.fields.map(f => {
                                            const v = s.answers?.[f.id]
                                            const display = Array.isArray(v) ? v.join(', ') : (v === '' || v === undefined ? <em style={styles.muted}>(empty)</em> : String(v))
                                            return (
                                                <div key={f.id} style={styles.answerRow}>
                                                    <div style={styles.answerLabel}>{f.label}</div>
                                                    <div>{display}</div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
                            </li>
                        )
                    })}
                </ul>
            )}
        </div>
    )
}

const styles = {
    page: { maxWidth: 880, margin: '0 auto', padding: '32px 20px', fontFamily: 'system-ui, sans-serif', color: '#111' },
    header: { marginBottom: 24 },
    h1: { fontSize: 26, fontWeight: 700, margin: '4px 0' },
    badge: { fontSize: 11, fontWeight: 500, padding: '2px 8px', background: '#dcfce7', color: '#166534', borderRadius: 999, marginLeft: 8, verticalAlign: 'middle' },
    muted: { color: '#6b7280', fontSize: 14 },
    tinyMuted: { color: '#9ca3af', fontSize: 12, textDecoration: 'none' },
    actions: { display: 'flex', gap: 8, marginTop: 12 },
    btn: { padding: '6px 12px', background: '#fff', color: '#111', border: '1px solid #d1d5db', borderRadius: 8, cursor: 'pointer', fontSize: 13, textDecoration: 'none', display: 'inline-block' },
    list: { listStyle: 'none', padding: 0, margin: 0 },
    row: { border: '1px solid #e5e7eb', borderRadius: 10, marginBottom: 8, background: '#fff', overflow: 'hidden' },
    rowHeader: { width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: '#fff', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: 14 },
    answers: { padding: '0 14px 14px', borderTop: '1px solid #f3f4f6' },
    answerRow: { padding: '8px 0', borderBottom: '1px solid #f9fafb' },
    answerLabel: { fontSize: 12, color: '#6b7280', marginBottom: 2 },
}
