// Employee-facing list of available forms, styled for MainLayout.
// Backed by Firestore — forms are readable by any auth user; submissions are
// scoped to the current employee only.

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'
import { subscribeForms, subscribeMySubmissions } from './formStoreFirestore'
import { FileText, ChevronRight, CheckCircle2 } from 'lucide-react'

export default function EmployeeFormsPage() {
    const { user } = useAuth()
    const [forms, setForms] = useState([])
    const [mySubs, setMySubs] = useState([])

    useEffect(() => subscribeForms(setForms), [])
    useEffect(() => subscribeMySubmissions(user?.uid, setMySubs), [user?.uid])

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <header>
                <h1 className="text-2xl font-bold text-slate-900">Forms</h1>
                <p className="text-slate-600 text-sm">Forms assigned to you. Tap one to fill it out.</p>
            </header>

            {forms.length === 0 ? (
                <Card className="p-8 text-center">
                    <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-600 font-medium">No forms available yet</p>
                    <p className="text-slate-500 text-sm mt-1">Check back later — your supervisor hasn't published any forms.</p>
                </Card>
            ) : (
                <div className="space-y-2">
                    {forms.map(f => {
                        const myCount = mySubs.filter(s => s.formId === f.id).length
                        return (
                            <Link
                                key={f.id}
                                to={`/my-forms/${f.id}`}
                                className="block"
                            >
                                <Card className="p-4 hover:border-blue-500 hover:shadow-sm transition-all cursor-pointer">
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                                                <FileText className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="font-semibold text-slate-900 truncate">{f.title}</div>
                                                {f.description && <div className="text-xs text-slate-500 truncate">{f.description}</div>}
                                                <div className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                                                    <span>{f.fields.length} question{f.fields.length === 1 ? '' : 's'}</span>
                                                    {myCount > 0 && (
                                                        <span className="flex items-center gap-1 text-green-600">
                                                            <CheckCircle2 className="w-3 h-3" />
                                                            Submitted {myCount} time{myCount === 1 ? '' : 's'}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-slate-400 flex-shrink-0" />
                                    </div>
                                </Card>
                            </Link>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
