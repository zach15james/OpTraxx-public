// Employee fill-out page for a form. Tailwind, fits MainLayout.

import { useEffect, useRef, useState } from 'react'
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'
import { db } from '@/lib/firebase'
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { getForm, saveSubmission } from './formStoreFirestore'
import { CheckCircle2, ArrowLeft } from 'lucide-react'
import VoiceFillPanel from './VoiceFillPanel'

export default function EmployeeFormFillPage() {
    const { formId } = useParams()
    const [searchParams] = useSearchParams()
    const taskId = searchParams.get('taskId')
    const navigate = useNavigate()
    const { user, userProfile } = useAuth()
    const [form, setForm] = useState(null)
    const [loading, setLoading] = useState(true)
    const [answers, setAnswers] = useState({})
    const [errors, setErrors] = useState({})
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [recentlyFilled, setRecentlyFilled] = useState(new Set())
    const highlightTimer = useRef(null)

    useEffect(() => {
        let active = true
        setLoading(true)
        getForm(formId).then(f => {
            if (active) { setForm(f); setLoading(false) }
        })
        return () => { active = false }
    }, [formId])

    function handleVoiceExtract(result) {
        const filledIds = Object.keys(result.fields)
        if (!filledIds.length) return
        setAnswers(prev => ({ ...prev, ...result.fields }))
        setRecentlyFilled(new Set(filledIds))
        if (highlightTimer.current) clearTimeout(highlightTimer.current)
        highlightTimer.current = setTimeout(() => setRecentlyFilled(new Set()), 3000)
    }

    useEffect(() => () => {
        if (highlightTimer.current) clearTimeout(highlightTimer.current)
    }, [])

    if (loading) {
        return (
            <div className="max-w-2xl mx-auto">
                <Card className="p-6 text-center text-slate-500">Loading form…</Card>
            </div>
        )
    }

    if (!form) {
        return (
            <div className="max-w-2xl mx-auto">
                <Card className="p-6 text-center text-slate-500">
                    <p className="mb-4">Form not found.</p>
                    <Button asChild variant="outline"><Link to="/my-forms">← Back to forms</Link></Button>
                </Card>
            </div>
        )
    }

    function setAnswer(fid, v) { setAnswers(p => ({ ...p, [fid]: v })) }
    function toggleMulti(fid, opt) {
        const cur = answers[fid] || []
        setAnswer(fid, cur.includes(opt) ? cur.filter(o => o !== opt) : [...cur, opt])
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

    async function handleSubmit(e) {
        e.preventDefault()
        if (!validate()) return
        if (!user?.uid) { alert('You must be signed in to submit.'); return }
        setSubmitting(true)
        try {
            await saveSubmission({
                formId: form.id,
                formTitle: form.title,
                answers,
                submittedBy: user.uid,
                submitterName: userProfile?.name || user.email || 'Anonymous',
                taskId: taskId || null,
            })
            // If this fill is tied to an assigned task, mark it complete.
            if (taskId) {
                try {
                    await updateDoc(doc(db, 'tasks', taskId), {
                        status: 'done',
                        completedAt: serverTimestamp(),
                        updatedAt: serverTimestamp(),
                    })
                } catch (err) {
                    console.error('Could not mark task complete:', err)
                }
            }
            setSubmitted(true)
        } catch (err) {
            alert('Failed to submit: ' + (err.message || err))
        } finally {
            setSubmitting(false)
        }
    }

    if (submitted) {
        return (
            <div className="max-w-2xl mx-auto">
                <Card className="p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="w-9 h-9 text-green-600" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">
                        {taskId ? 'Task complete!' : 'Submitted!'}
                    </h2>
                    <p className="text-slate-600 mb-6">
                        {taskId
                            ? 'Your supervisor will see your submission and the task as completed.'
                            : 'Your response was sent to your supervisor.'}
                    </p>
                    <div className="flex justify-center gap-2">
                        {taskId ? (
                            <Button onClick={() => navigate('/tasks')} className="!bg-blue-600 hover:!bg-blue-700 !text-white">Back to tasks</Button>
                        ) : (
                            <>
                                <Button onClick={() => navigate('/my-forms')} variant="outline">Back to forms</Button>
                                <Button onClick={() => { setAnswers({}); setSubmitted(false); setErrors({}) }} className="!bg-blue-600 hover:!bg-blue-700 !text-white">Submit another</Button>
                            </>
                        )}
                    </div>
                </Card>
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <header>
                <Link to={taskId ? '/tasks' : '/my-forms'} className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900">
                    <ArrowLeft className="w-3 h-3" /> {taskId ? 'Tasks' : 'Forms'}
                </Link>
                <h1 className="text-2xl font-bold text-slate-900 mt-1">{form.title}</h1>
                {form.description && <p className="text-slate-600 text-sm mt-1">{form.description}</p>}
                {taskId && (
                    <p className="mt-2 inline-block text-xs px-2 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                        Submitting this form will mark your task as complete.
                    </p>
                )}
            </header>

            <VoiceFillPanel fields={form.fields} onExtract={handleVoiceExtract} />

            <form onSubmit={handleSubmit} className="space-y-3">
                {form.fields.map(field => (
                    <FieldRenderer
                        key={field.id}
                        field={field}
                        value={answers[field.id]}
                        error={errors[field.id]}
                        highlighted={recentlyFilled.has(field.id)}
                        onChange={v => setAnswer(field.id, v)}
                        onToggleMulti={opt => toggleMulti(field.id, opt)}
                    />
                ))}

                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" onClick={() => navigate('/my-forms')} variant="outline" disabled={submitting}>Cancel</Button>
                    <Button type="submit" disabled={submitting} className="!bg-blue-600 hover:!bg-blue-700 !text-white">
                        {submitting ? 'Submitting…' : 'Submit'}
                    </Button>
                </div>
            </form>
        </div>
    )
}

function FieldRenderer({ field, value, error, highlighted, onChange, onToggleMulti }) {
    return (
        <Card className={`p-4 transition-colors duration-700 ${highlighted ? 'bg-yellow-50 border-yellow-300' : ''}`}>
            <label className="block font-semibold text-slate-900 mb-2">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
                {highlighted && <span className="ml-2 text-xs font-normal text-yellow-700">✨ filled by voice</span>}
            </label>
            {renderInput(field, value, onChange, onToggleMulti)}
            {error && <div className="text-xs text-red-600 mt-2">{error}</div>}
        </Card>
    )
}

function renderInput(field, value, onChange, onToggleMulti) {
    const inputBase = "w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    switch (field.type) {
        case 'short_text':
            return <input className={inputBase} value={value || ''} onChange={e => onChange(e.target.value)} />
        case 'long_text':
            return <textarea className={inputBase + ' resize-none'} rows="3" value={value || ''} onChange={e => onChange(e.target.value)} />
        case 'number':
            return <input type="number" className={inputBase} value={value ?? ''} onChange={e => onChange(e.target.value === '' ? '' : Number(e.target.value))} />
        case 'date':
            return <input type="date" className={inputBase} value={value || ''} onChange={e => onChange(e.target.value)} />
        case 'single_select':
            return (
                <div className="space-y-2">
                    {(field.options || []).map(opt => (
                        <label key={opt} className="flex items-center gap-2 p-2 rounded-md hover:bg-slate-50 cursor-pointer">
                            <input type="radio" name={field.id} checked={value === opt} onChange={() => onChange(opt)} />
                            <span className="text-sm">{opt}</span>
                        </label>
                    ))}
                </div>
            )
        case 'multi_select':
            return (
                <div className="space-y-2">
                    {(field.options || []).map(opt => (
                        <label key={opt} className="flex items-center gap-2 p-2 rounded-md hover:bg-slate-50 cursor-pointer">
                            <input type="checkbox" checked={(value || []).includes(opt)} onChange={() => onToggleMulti(opt)} />
                            <span className="text-sm">{opt}</span>
                        </label>
                    ))}
                </div>
            )
        case 'rating':
            return (
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(n => (
                        <button
                            key={n}
                            type="button"
                            onClick={() => onChange(n)}
                            className={`w-10 h-10 rounded-lg border text-sm font-medium transition-all ${
                                value === n ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-300 hover:border-blue-400'
                            }`}
                        >
                            {n}
                        </button>
                    ))}
                </div>
            )
        case 'yes_no':
            return (
                <div className="flex gap-2">
                    <button type="button" onClick={() => onChange('yes')}
                        className={`px-5 py-2 rounded-lg border text-sm font-medium ${value === 'yes' ? 'bg-green-600 text-white border-green-600' : 'bg-white border-slate-300 hover:border-green-400'}`}>
                        Yes
                    </button>
                    <button type="button" onClick={() => onChange('no')}
                        className={`px-5 py-2 rounded-lg border text-sm font-medium ${value === 'no' ? 'bg-red-600 text-white border-red-600' : 'bg-white border-slate-300 hover:border-red-400'}`}>
                        No
                    </button>
                </div>
            )
        default:
            return <div className="text-xs text-slate-500">Unsupported field type: {field.type}</div>
    }
}
