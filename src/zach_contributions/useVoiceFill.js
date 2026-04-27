// Hook that wraps the browser Web Speech API.
// Chrome/Edge/Safari supported; Firefox falls back to manual typing.

import { useEffect, useRef, useState } from 'react'

export function useVoiceFill() {
    const [transcript, setTranscript] = useState('')
    const [interim, setInterim] = useState('')
    const [isListening, setIsListening] = useState(false)
    const [error, setError] = useState(null)
    const recognitionRef = useRef(null)

    const SR = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition)
    const isSupported = !!SR

    useEffect(() => {
        if (!isSupported) return
        const r = new SR()
        r.continuous = true
        r.interimResults = true
        r.lang = 'en-US'

        r.onresult = (event) => {
            let finalChunk = ''
            let interimChunk = ''
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const text = event.results[i][0].transcript
                if (event.results[i].isFinal) finalChunk += text + ' '
                else interimChunk += text
            }
            if (finalChunk) setTranscript(prev => (prev + ' ' + finalChunk).trim())
            setInterim(interimChunk)
        }

        r.onerror = (e) => {
            setError(e.error || 'speech_error')
            setIsListening(false)
        }
        r.onend = () => {
            setIsListening(false)
            setInterim('')
        }

        recognitionRef.current = r

        return () => {
            try { r.stop() } catch {}
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSupported])

    function start() {
        if (!recognitionRef.current) return
        setError(null)
        try {
            recognitionRef.current.start()
            setIsListening(true)
        } catch (e) {
            setError(e.message || 'failed_to_start')
        }
    }

    function stop() {
        if (!recognitionRef.current) return
        try { recognitionRef.current.stop() } catch {}
        setIsListening(false)
    }

    function reset() {
        setTranscript('')
        setInterim('')
        setError(null)
    }

    return { transcript, setTranscript, interim, isListening, isSupported, error, start, stop, reset }
}
