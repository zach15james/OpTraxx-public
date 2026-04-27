// Supervisor submissions review page, styled for MainLayout.
// Backed by Firestore — live submissions via onSnapshot.

import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getForm, subscribeSubmissions } from './formStoreFirestore'
import { ArrowLeft, Download, ChevronDown, ChevronUp } from 'lucide-react'

export default function SupervisorSubmissionsPage() {
    const { formId } = useParams()
    const [form, setForm] = useState(null)
    const [loading, setLoading] = useState(true)
    const [submissions, setSubmissions] = useState([])
    const [openId, setOpenId] = useState(null)

    useEffect(() => {
        let active = true
        setLoading(true)
        getForm(formId).then(f => { if (active) { setForm(f); setLoading(false) } })
        return () => { active = false }
    }, [formId])

    useEffect(() => subscribeSubmissions(formId, setSubmissions), [formId])

    if (loading) {
        return (
            <div className="max-w-2xl mx-auto">
                <Card className="p-6 text-center text-slate-500">Loading…</Card>
            </div>
        )
    }

    if (!form) {
        return (
            <div className="max-w-2xl mx-auto">
                <Card className="p-6 text-center text-slate-500">
                    <p className="mb-4">Form not found.</p>
                    <Button asChild variant="outline"><Link to="/forms-manage">← Back</Link></Button>
                </Card>
            </div>
        )
    }

    function exportJson() {
        const blob = new Blob([JSON.stringify({ form, submissions }, null, 2)], { type: 'application/json' })
        downloadBlob(blob, `${form.title.replace(/\s+/g, '_')}_submissions.json`)
    }
    function exportCsv() {
        const headers = ['submittedAt', 'submitterName', ...form.fields.map(f => f.label)]
        const rows = submissions.map(s => {
            const row = [new Date(s.submittedAt).toISOString(), s.submitterName || '']
            for (const f of form.fields) {
                const v = s.answers?.[f.id]
                row.push(Array.isArray(v) ? v.join('; ') : (v ?? ''))
            }
            return row
        })
        const csv = [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
        downloadBlob(new Blob([csv], { type: 'text/csv' }), `${form.title.replace(/\s+/g, '_')}_submissions.csv`)
    }
    function downloadBlob(blob, name) {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url; a.download = name; a.click()
        URL.revokeObjectURL(url)
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <header>
                <Link to="/forms-manage" className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900">
                    <ArrowLeft className="w-3 h-3" /> Forms
                </Link>
                <h1 className="text-2xl font-bold text-slate-900 mt-1">{form.title}</h1>
                <p className="text-slate-600 text-sm">{submissions.length} submission{submissions.length === 1 ? '' : 's'}</p>
                <div className="flex gap-2 mt-3">
                    <Button onClick={exportJson} disabled={!submissions.length} variant="outline" size="sm"><Download className="w-3.5 h-3.5 mr-1" />JSON</Button>
                    <Button onClick={exportCsv} disabled={!submissions.length} variant="outline" size="sm"><Download className="w-3.5 h-3.5 mr-1" />CSV</Button>
                </div>
            </header>

            {submissions.length === 0 ? (
                <Card className="p-8 text-center text-slate-500 text-sm">No submissions yet.</Card>
            ) : (
                <div className="space-y-2">
                    {submissions.map(s => {
                        const open = openId === s.id
                        return (
                            <Card key={s.id} className="overflow-hidden">
                                <button
                                    onClick={() => setOpenId(open ? null : s.id)}
                                    className="w-full p-4 flex items-center justify-between hover:bg-slate-50 text-left"
                                >
                                    <div>
                                        <div className="font-medium text-slate-900">{s.submitterName || 'Anonymous'}</div>
                                        <div className="text-xs text-slate-500">{new Date(s.submittedAt).toLocaleString()}</div>
                                    </div>
                                    {open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                                </button>
                                {open && (
                                    <div className="px-4 pb-4 border-t border-slate-100 pt-3 space-y-3">
                                        {form.fields.map(f => {
                                            const v = s.answers?.[f.id]
                                            const display = Array.isArray(v) ? v.join(', ') : (v === '' || v === undefined ? <em className="text-slate-400">(empty)</em> : String(v))
                                            return (
                                                <div key={f.id}>
                                                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{f.label}</div>
                                                    <div className="text-sm text-slate-900 mt-1">{display}</div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
                            </Card>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
