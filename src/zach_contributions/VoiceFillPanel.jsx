// Voice/typing input panel that extracts answers from natural-language input.
// Drops into any form fill page. Calls onExtract with the parsed result.

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Mic, MicOff, Sparkles, AlertCircle } from 'lucide-react'
import { useVoiceFill } from './useVoiceFill'
import { extractFieldsFromTranscript } from './voiceFill'

export default function VoiceFillPanel({ fields, onExtract }) {
    const { transcript, setTranscript, interim, isListening, isSupported, error, start, stop, reset } = useVoiceFill()
    const [open, setOpen] = useState(false)
    const [lastResult, setLastResult] = useState(null)

    function handleProcess() {
        if (!transcript.trim()) return
        const result = extractFieldsFromTranscript(transcript, fields)
        setLastResult(result)
        onExtract(result)
    }

    function handleClear() {
        reset()
        setLastResult(null)
    }

    if (!open) {
        return (
            <Card className="p-4 mb-4 border-blue-200 bg-blue-50/50">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <div className="font-semibold text-slate-900 text-sm">Fill with voice</div>
                            <div className="text-xs text-slate-600">Just describe everything — we'll fill the form for you</div>
                        </div>
                    </div>
                    <Button onClick={() => setOpen(true)} className="!bg-blue-600 hover:!bg-blue-700 !text-white">
                        <Mic className="w-4 h-4 mr-1.5" /> Start
                    </Button>
                </div>
            </Card>
        )
    }

    return (
        <Card className="p-4 mb-4 border-blue-200 bg-blue-50/50 space-y-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-semibold text-slate-900 text-sm">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    Voice / quick fill
                </div>
                <button onClick={() => setOpen(false)} className="text-xs text-slate-500 hover:text-slate-900">close</button>
            </div>

            {!isSupported && (
                <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-md text-xs text-amber-900">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <div>Voice input isn't supported in this browser. You can still type in the box below — the extractor works the same way.</div>
                </div>
            )}

            {error && (
                <div className="flex items-start gap-2 p-2 bg-red-50 border border-red-200 rounded-md text-xs text-red-700">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                    <div>Mic error: {error}. Try the type-instead box below.</div>
                </div>
            )}

            <div className="flex gap-2 items-center">
                {isSupported && !isListening && (
                    <Button onClick={start} size="sm" className="!bg-blue-600 hover:!bg-blue-700 !text-white">
                        <Mic className="w-3.5 h-3.5 mr-1.5" /> Start recording
                    </Button>
                )}
                {isSupported && isListening && (
                    <Button onClick={stop} size="sm" className="!bg-red-600 hover:!bg-red-700 !text-white animate-pulse">
                        <MicOff className="w-3.5 h-3.5 mr-1.5" /> Stop
                    </Button>
                )}
                {transcript && (
                    <Button onClick={handleClear} variant="outline" size="sm">Clear</Button>
                )}
                {isListening && <span className="text-xs text-red-600 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                    Listening…
                </span>}
            </div>

            <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isSupported ? 'Transcript (you can edit before processing):' : 'Type a description of your answers:'}
                </label>
                <textarea
                    rows="3"
                    value={transcript + (interim ? ` ${interim}` : '')}
                    onChange={e => setTranscript(e.target.value)}
                    placeholder='e.g. "Site is in good condition, no issues, safe to operate, rate it 4."'
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
            </div>

            <div className="flex gap-2 justify-end">
                <Button onClick={handleProcess} disabled={!transcript.trim()} className="!bg-blue-600 hover:!bg-blue-700 !text-white" size="sm">
                    <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Fill form from this
                </Button>
            </div>

            {lastResult && (
                <div className="p-3 bg-white border border-slate-200 rounded-md text-xs space-y-1">
                    <div className="font-semibold text-slate-900">
                        Filled {lastResult.filledCount} of {lastResult.totalCount} field{lastResult.totalCount === 1 ? '' : 's'}
                    </div>
                    {lastResult.missingRequired.length > 0 && (
                        <div className="text-amber-700">
                            Still need: {lastResult.missingRequired.map(id => fields.find(f => f.id === id)?.label).filter(Boolean).join(', ')}
                        </div>
                    )}
                    {lastResult.followUpQuestion && (
                        <div className="text-slate-600 italic">{lastResult.followUpQuestion}</div>
                    )}
                </div>
            )}
        </Card>
    )
}
