// Premade templates the supervisor can spawn from. Tailored to OpTraxx domain
// (task mgmt, supervisor/employee). Field shape matches formBuilderStore.js.

function f(type, label, extra = {}) {
    return { type, label, required: false, ...extra }
}

export const FORM_TEMPLATES = [
    {
        key: 'daily_checkin',
        name: 'Daily Check-in',
        description: 'Quick start-of-shift status from each employee.',
        fields: [
            f('short_text', 'Where are you working today?', { required: true }),
            f('long_text', 'What are your top tasks for today?', { required: true }),
            f('long_text', 'Any blockers or things you need from your supervisor?'),
            f('rating', 'How are you feeling about today? (1 low - 5 great)'),
        ],
    },
    {
        key: 'incident_report',
        name: 'Incident Report',
        description: 'Capture what happened, when, and how serious it is.',
        fields: [
            f('date', 'Date of incident', { required: true }),
            f('short_text', 'Location', { required: true }),
            f('single_select', 'Severity', {
                required: true,
                options: ['Low', 'Medium', 'High', 'Critical'],
            }),
            f('long_text', 'Describe what happened', { required: true }),
            f('multi_select', 'Who was involved?', {
                options: ['Self', 'Coworker', 'Customer', 'Equipment', 'Other'],
            }),
            f('yes_no', 'Was anyone injured?', { required: true }),
        ],
    },
    {
        key: 'equipment_inspection',
        name: 'Equipment Inspection',
        description: 'Pre-shift safety / equipment readiness check.',
        fields: [
            f('short_text', 'Equipment ID or name', { required: true }),
            f('single_select', 'Overall condition', {
                required: true,
                options: ['Good', 'Needs attention', 'Out of service'],
            }),
            f('multi_select', 'Issues found', {
                options: ['None', 'Damage', 'Wear', 'Missing parts', 'Software', 'Other'],
            }),
            f('long_text', 'Notes'),
            f('yes_no', 'Safe to operate?', { required: true }),
        ],
    },
    {
        key: 'task_completion',
        name: 'Task Completion',
        description: 'Wrap-up form when an employee finishes an assigned task.',
        fields: [
            f('short_text', 'Task ID or title', { required: true }),
            f('yes_no', 'Was the task fully completed?', { required: true }),
            f('number', 'Hours spent'),
            f('long_text', 'Summary of work done', { required: true }),
            f('rating', 'How smooth was this task? (1-5)'),
        ],
    },
]

export function getTemplate(key) {
    return FORM_TEMPLATES.find(t => t.key === key) || null
}
