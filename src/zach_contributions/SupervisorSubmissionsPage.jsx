import { useEffect, useMemo, useState } from 'react'
import { useParams, Link, useSearchParams } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getForm, subscribeSubmissions } from './formStoreFirestore'
import { ArrowLeft, Download, ChevronDown, ChevronUp } from 'lucide-react'

export default function SupervisorSubmissionsPage() {
    const { formId } = useParams()
    const [searchParams] = useSearchParams()
    const taskId = searchParams.get('taskId')
    const [form, setForm] = useState(null)
    const [loading, setLoading] = useState(true)
    const [submissions, setSubmissions] = useState([])
    const [openId, setOpenId] = useState(null)

    useEffect(() => {
        let active = true
        setLoading(true)
        getForm(formId).then(f => {
            if (active) {
                setForm(f)
                setLoading(false)
            }
        })
        return () => { active = false }
    }, [formId])

    useEffect(() => subscribeSubmissions(formId, setSubmissions), [formId])

    const visibleSubmissions = useMemo(() => {
        if (!taskId) return submissions
        return submissions.filter(s => s.taskId === taskId)
    }, [submissions, taskId])

    useEffect(() => {
        if (!visibleSubmissions.length) {
            setOpenId(null)
            return
        }
        setOpenId(prev => prev && visibleSubmissions.some(s => s.id === prev) ? prev : visibleSubmissions[0].id)
    }, [visibleSubmissions])

    if (loading) {
        return (
            <div className="mx-auto max-w-2xl">
                <Card className="p-6 text-center text-slate-500">Loading...</Card>
            </div>
        )
    }

    if (!form) {
        return (
            <div className="mx-auto max-w-2xl">
                <Card className="p-6 text-center text-slate-500">
                    <p className="mb-4">Form not found.</p>
                    <Button asChild variant="outline"><Link to="/forms-manage">Back</Link></Button>
                </Card>
            </div>
        )
    }

    function exportJson() {
        const blob = new Blob([JSON.stringify({ form, submissions: visibleSubmissions }, null, 2)], { type: 'application/json' })
        downloadBlob(blob, `${form.title.replace(/\s+/g, '_')}_submissions.json`)
    }

    function exportCsv() {
        const headers = ['submittedAt', 'submitterName', ...form.fields.map(f => f.label)]
        const rows = visibleSubmissions.map(s => {
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
        a.href = url
        a.download = name
        a.click()
        URL.revokeObjectURL(url)
    }

    const backHref = taskId ? '/tasks' : '/forms-manage'
    const backLabel = taskId ? 'Tasks' : 'Forms'

    return (
        <div className="mx-auto max-w-4xl space-y-6">
            <header>
                <Link to={backHref} className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900">
                    <ArrowLeft className="h-3 w-3" /> {backLabel}
                </Link>
                <h1 className="mt-1 text-2xl font-bold text-slate-900">{form.title}</h1>
                <p className="text-sm text-slate-600">
                    {visibleSubmissions.length} submission{visibleSubmissions.length === 1 ? '' : 's'}
                    {taskId ? ' for this completed task' : ''}
                </p>
                <div className="mt-3 flex gap-2">
                    <Button onClick={exportJson} disabled={!visibleSubmissions.length} variant="outline" size="sm">
                        <Download className="mr-1 h-3.5 w-3.5" />JSON
                    </Button>
                    <Button onClick={exportCsv} disabled={!visibleSubmissions.length} variant="outline" size="sm">
                        <Download className="mr-1 h-3.5 w-3.5" />CSV
                    </Button>
                </div>
            </header>

            {visibleSubmissions.length === 0 ? (
                <Card className="p-8 text-center text-sm text-slate-500">
                    {taskId ? 'No submission is attached to this completed task yet.' : 'No submissions yet.'}
                </Card>
            ) : (
                <div className="space-y-2">
                    {visibleSubmissions.map(s => {
                        const open = openId === s.id
                        return (
                            <Card key={s.id} className="overflow-hidden">
                                <button
                                    onClick={() => setOpenId(open ? null : s.id)}
                                    className="flex w-full items-center justify-between p-4 text-left hover:bg-slate-50"
                                >
                                    <div>
                                        <div className="font-medium text-slate-900">{s.submitterName || 'Anonymous'}</div>
                                        <div className="text-xs text-slate-500">{new Date(s.submittedAt).toLocaleString()}</div>
                                    </div>
                                    {open ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                                </button>
                                {open && (
                                    <div className="space-y-3 border-t border-slate-100 px-4 pb-4 pt-3">
                                        {form.fields.map(f => {
                                            const v = s.answers?.[f.id]
                                            const display = Array.isArray(v) ? v.join(', ') : (v === '' || v === undefined ? <em className="text-slate-400">(empty)</em> : String(v))
                                            return (
                                                <div key={f.id}>
                                                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">{f.label}</div>
                                                    <div className="mt-1 text-sm text-slate-900">{display}</div>
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
