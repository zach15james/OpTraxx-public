// VoiceFill extractor — pure heuristics, no AI required.
// Takes a transcript + the form's field schema, returns extracted values.
//
// To upgrade to LLM extraction later: replace `extractFieldsFromTranscript` with
// an async function that POSTs { transcript, fields } to a server endpoint
// that calls Claude with structured-output. Same return shape.

function normalize(s) {
    return String(s ?? '').toLowerCase().trim()
}

// Find a window of text after a label mention (case-insensitive). null if not found.
function chunkNearLabel(transcript, label, windowSize = 100) {
    const t = normalize(transcript)
    const l = normalize(label)
    if (!l) return null
    const idx = t.indexOf(l)
    if (idx < 0) return null
    return t.slice(idx + l.length, idx + l.length + windowSize)
}

function firstSentence(s) {
    return s.replace(/^[\s:,\-—]+/, '').split(/[.!?\n]/)[0].trim()
}

const YES_RE = /\b(yes|yeah|yep|yup|absolutely|sure|correct|affirmative)\b/i
const NO_RE = /\b(no|nope|nah|negative|not really)\b/i

export function extractFieldsFromTranscript(transcript, fields) {
    const result = {}
    const filled = new Set()
    const t = normalize(transcript)

    for (const field of fields) {
        let value

        switch (field.type) {
            case 'yes_no': {
                const nearby = chunkNearLabel(transcript, field.label, 60)
                if (nearby) {
                    if (YES_RE.test(nearby) && !NO_RE.test(nearby.split(/[.!?]/)[0])) value = 'yes'
                    else if (NO_RE.test(nearby)) value = 'no'
                }
                if (value === undefined) {
                    const yesCount = (t.match(YES_RE) || []).length
                    const noCount = (t.match(NO_RE) || []).length
                    if (yesCount && !noCount) value = 'yes'
                    else if (noCount && !yesCount) value = 'no'
                }
                break
            }

            case 'rating': {
                const nearby = chunkNearLabel(transcript, field.label, 60)
                let m = nearby && nearby.match(/(\d)\b/)
                if (!m) {
                    m = t.match(/\b(\d)\s*(?:out of\s*\d|stars?|\/\s*5)\b/)
                }
                if (m) {
                    const n = parseInt(m[1], 10)
                    if (n >= 1 && n <= 5) value = n
                }
                break
            }

            case 'number': {
                const nearby = chunkNearLabel(transcript, field.label, 60)
                const target = nearby || t
                const m = target.match(/-?\d+(?:\.\d+)?/)
                if (m) value = Number(m[0])
                break
            }

            case 'single_select': {
                const options = field.options || []
                const nearby = chunkNearLabel(transcript, field.label, 80) || t
                let best = options.find(opt => normalize(nearby).includes(normalize(opt)))
                if (!best) best = options.find(opt => t.includes(normalize(opt)))
                if (best) value = best
                break
            }

            case 'multi_select': {
                const options = field.options || []
                const matches = options.filter(opt => t.includes(normalize(opt)))
                if (matches.length) value = matches
                break
            }

            case 'date': {
                if (/\btoday\b/.test(t)) value = new Date().toISOString().slice(0, 10)
                else if (/\byesterday\b/.test(t)) {
                    const d = new Date(); d.setDate(d.getDate() - 1)
                    value = d.toISOString().slice(0, 10)
                } else {
                    const m = t.match(/\b(\d{4})-(\d{2})-(\d{2})\b/)
                    if (m) value = m[0]
                }
                break
            }

            case 'short_text':
            case 'long_text': {
                const nearby = chunkNearLabel(transcript, field.label, 200)
                if (nearby) {
                    const cleaned = firstSentence(nearby)
                    if (cleaned.length > 1 && cleaned.length < (field.type === 'short_text' ? 100 : 500)) {
                        value = cleaned
                    }
                }
                break
            }
        }

        if (value !== undefined && value !== '') {
            result[field.id] = value
            filled.add(field.id)
        }
    }

    const missingRequired = fields
        .filter(f => f.required && !filled.has(f.id))
        .map(f => f.id)

    let followUpQuestion = null
    if (missingRequired.length) {
        const firstMissing = fields.find(f => f.id === missingRequired[0])
        if (firstMissing) followUpQuestion = `I didn't catch: ${firstMissing.label}. Could you say that again?`
    }

    return {
        fields: result,
        missingRequired,
        followUpQuestion,
        filledCount: filled.size,
        totalCount: fields.length,
    }
}
