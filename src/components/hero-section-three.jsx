import React from 'react'
import { Link } from 'react-router-dom'
import {
    ArrowRight,
    BarChart3,
    BellRing,
    CheckCircle2,
    Clock3,
    ClipboardList,
    FileText,
    ShieldCheck,
    TrendingUp,
    Users,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const workflowSteps = [
    {
        title: 'Build forms that fit the work',
        description: 'Create repeatable inspections, checklists, and compliance tasks without making your team learn a new process.',
        icon: FileText,
    },
    {
        title: 'Assign work with clear ownership',
        description: 'Send one-time or recurring requests to the right employees and keep expectations visible from day one.',
        icon: Users,
    },
    {
        title: 'Track progress before things slip',
        description: 'See completions, overdue items, and submission quality in one place so supervisors can intervene early.',
        icon: BarChart3,
    },
]

const capabilityGroups = [
    {
        title: 'Supervisor control without spreadsheet churn',
        description: 'OpTraxx keeps assignments, due dates, approvals, and follow-up in one operating view.',
        bullets: ['Reusable form templates', 'Recurring task scheduling', 'Approval-ready submission review'],
        icon: ClipboardList,
    },
    {
        title: 'Employee experience that stays simple',
        description: 'Team members see the work they own, complete forms fast, and submit with less back-and-forth.',
        bullets: ['Clear task list by assignee', 'Structured form completion', 'Fewer missed handoffs'],
        icon: CheckCircle2,
    },
    {
        title: 'Operational visibility that holds up',
        description: 'Supervisors can spot slowdowns, prove completion, and keep audit trails ready when stakeholders ask.',
        bullets: ['Completion and overdue tracking', 'Submission history by form', 'Escalation and reporting support'],
        icon: ShieldCheck,
    },
]

const outcomeStats = [
    { value: '1 place', label: 'for forms, assignments, and submissions' },
    { value: 'Faster', label: 'follow-up on overdue work and blocked tasks' },
    { value: 'Clearer', label: 'accountability between supervisors and employees' },
    { value: 'Ready', label: 'for audits, reviews, and operational reporting' },
]

const previewStats = [
    { label: 'OPEN TASKS', value: '12', note: '+3 added today', tone: 'text-blue-600 dark:text-blue-400', icon: Clock3 },
    { label: 'COMPLETED', value: '47', note: '↑ This week', tone: 'text-emerald-600 dark:text-emerald-400', icon: CheckCircle2 },
    { label: 'OVERDUE', value: '2', note: 'Needs attention', tone: 'text-red-600 dark:text-red-400', icon: BarChart3 },
    { label: 'COMPLETION RATE', value: '89%', note: '↑ +5% vs last week', tone: 'text-emerald-600 dark:text-emerald-400', icon: TrendingUp },
]

const previewTasks = [
    { title: 'Server Patch - Prod', assignee: 'A. Patel', due: 'Apr 30', status: 'In Progress', statusTone: 'bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-300', done: false },
    { title: 'Safety Checklist', assignee: 'J. Kim', due: 'Apr 29', status: 'Pending', statusTone: 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300', done: false },
    { title: 'Code Review', assignee: 'L. Chen', due: 'Apr 28', status: 'Done', statusTone: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300', done: true },
]

const previewTeam = [
    { name: 'A. Patel', initials: 'AP', status: '3 open', statusTone: 'text-blue-600 dark:text-blue-400' },
    { name: 'J. Kim', initials: 'JK', status: '1 overdue', statusTone: 'text-red-600 dark:text-red-400' },
    { name: 'L. Chen', initials: 'LC', status: 'All clear', statusTone: 'text-emerald-600 dark:text-emerald-400' },
]

export default function HeroSectionThree() {
    const [mockupVisible, setMockupVisible] = React.useState(false)

    React.useEffect(() => {
        const frame = window.requestAnimationFrame(() => setMockupVisible(true))
        return () => window.cancelAnimationFrame(frame)
    }, [])

    return (
        <main className="bg-[#F3F7FB] text-slate-950 dark:bg-slate-950 dark:text-slate-50">
            <section className="border-b border-slate-200/80 bg-white dark:border-white/10 dark:bg-slate-950">
                <div className="mx-auto max-w-6xl px-6 pb-14 pt-28 sm:pb-16 sm:pt-32 lg:px-8 lg:pb-20 lg:pt-36">
                    <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14">
                        <div className="space-y-8">
                            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700 dark:border-white/12 dark:bg-white/6 dark:text-slate-200">
                                <BellRing className="size-4 text-[#2563eb] dark:text-blue-400" />
                                Operational accountability for teams that cannot afford dropped work
                            </div>

                            <div className="space-y-5">
                                <h1 className="max-w-2xl text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl lg:text-6xl dark:text-slate-50">
                                    Manage forms, assignments, and follow-through from one calm control center.
                                </h1>
                                <p className="max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-300">
                                    OpTraxx gives supervisors a cleaner way to assign custom work, track completions, and keep teams aligned without chasing updates across spreadsheets, inboxes, and chat.
                                </p>
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row">
                                <Button asChild size="lg" className="h-11 bg-[#2563eb] px-5 text-sm font-semibold text-white hover:bg-[#1d4ed8]">
                                    <Link to="/signup">
                                        Start with OpTraxx
                                        <ArrowRight className="size-4" />
                                    </Link>
                                </Button>
                                <Button asChild size="lg" variant="outline" className="h-11 border-slate-300 px-5 text-sm font-semibold text-slate-900 hover:bg-slate-50 dark:border-white/12 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800">
                                    <Link to="/contact">Schedule a demo</Link>
                                </Button>
                            </div>

                            <div className="grid gap-3 border-t border-slate-200 pt-6 sm:grid-cols-3 dark:border-white/10">
                                <div>
                                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">For supervisors</p>
                                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Build forms, assign work, review submissions.</p>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">For employees</p>
                                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">See assigned tasks clearly and complete them faster.</p>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">For operations</p>
                                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Keep overdue work, approvals, and history visible.</p>
                                </div>
                            </div>
                        </div>

                        <div
                            className={`relative w-full self-start overflow-hidden lg:max-w-[610px] lg:justify-self-end transition-all duration-500 ease-out ${
                                mockupVisible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
                            }`}
                        >
                            <div className="rounded-[28px] border border-slate-200 bg-slate-100 p-3 shadow-[0_30px_100px_-45px_rgba(15,23,42,0.5)] dark:border-white/10 dark:bg-slate-900 dark:shadow-[0_30px_100px_-45px_rgba(0,0,0,0.9)]">
                                <div className="rounded-[24px] border border-slate-200 bg-white shadow-[0_18px_40px_-24px_rgba(15,23,42,0.35)] dark:border-white/10 dark:bg-slate-950">
                                    <div className="flex items-center gap-3 rounded-t-[24px] border-b border-slate-200 bg-slate-50 px-5 py-3 dark:border-white/10 dark:bg-slate-900">
                                        <div className="flex gap-2">
                                            <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                                            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                                            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                                        </div>
                                        <div className="flex-1 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-500 dark:border-white/10 dark:bg-slate-950 dark:text-slate-400">
                                            app.optraxx.com/dashboard/1
                                        </div>
                                    </div>

                                    <div className="space-y-3.5 p-4">
                                        <div className="flex items-center justify-between gap-4">
                                            <div>
                                                <h3 className="text-[1.65rem] font-semibold text-slate-900 dark:text-slate-100">Good morning, Sarah</h3>
                                                <p className="mt-1 text-[13px] text-slate-500 dark:text-slate-400">Tuesday, April 28 · Supervisor · 12 open tasks</p>
                                            </div>
                                            <Button size="sm" className="hidden h-10 bg-[#2563eb] px-4 text-sm font-semibold text-white hover:bg-[#1d4ed8] md:inline-flex">
                                                + Assign Task
                                            </Button>
                                        </div>

                                        <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
                                            {previewStats.map((stat) => {
                                                const Icon = stat.icon
                                                return (
                                                    <div key={stat.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-slate-900">
                                                        <div className="flex items-start justify-between gap-3">
                                                            <div>
                                                                <p className="text-[10px] font-semibold uppercase tracking-[0.06em] text-slate-500 dark:text-slate-400 sm:text-[11px]">{stat.label}</p>
                                                                <p className="mt-2 text-[1.7rem] font-semibold leading-none text-slate-900 dark:text-slate-100">{stat.value}</p>
                                                                <p className={`mt-2 text-[11px] font-medium ${stat.tone}`}>{stat.note}</p>
                                                            </div>
                                                            <Icon className={`size-6 ${stat.tone} opacity-70`} />
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>

                                        <div className="grid gap-3 lg:grid-cols-[1.5fr_0.7fr]">
                                            <div className="rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-950">
                                                <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-white/10">
                                                    <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Active Tasks</h4>
                                                    <span className="text-xs font-medium text-blue-600 dark:text-blue-400">View all</span>
                                                </div>
                                                <div className="space-y-2.5 p-3">
                                                    {previewTasks.map((task) => (
                                                        <div key={task.title} className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-slate-900">
                                                            <div className="flex items-start justify-between gap-3">
                                                                <div className="min-w-0">
                                                                    <div className="flex items-center gap-2">
                                                                        <p className={`max-w-[170px] overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold dark:text-slate-100 ${task.done ? 'text-slate-500 line-through dark:text-slate-400' : 'text-slate-900'}`}>{task.title}</p>
                                                                        <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${task.statusTone}`}>
                                                                            {task.status}
                                                                        </span>
                                                                    </div>
                                                                    <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">{task.assignee}</p>
                                                                </div>
                                                                <p className="shrink-0 text-sm font-medium text-slate-600 dark:text-slate-300">{task.due}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-950">
                                                <div className="border-b border-slate-200 px-4 py-3 dark:border-white/10">
                                                    <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">My Team</h4>
                                                </div>
                                                <div className="space-y-2.5 p-3">
                                                    {previewTeam.map((member) => (
                                                        <div key={member.name} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-slate-900">
                                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
                                                                {member.initials}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="text-[13px] font-semibold text-slate-900 dark:text-slate-100">{member.name}</p>
                                                                <p className={`mt-1 text-[11px] font-medium ${member.statusTone}`}>{member.status}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="pointer-events-none absolute inset-x-3 bottom-0 h-24 bg-[linear-gradient(to_bottom,transparent_60%,white_100%)] dark:bg-[linear-gradient(to_bottom,transparent_60%,rgb(2,6,23)_100%)]" />
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-[#F3F7FB] py-16 sm:py-20 dark:bg-slate-950">
                <div className="mx-auto max-w-6xl px-6 lg:px-8">
                    <div className="max-w-2xl">
                        <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[#2563eb] dark:text-blue-400">How it works</p>
                        <h2 className="mt-3 text-3xl font-semibold text-slate-950 sm:text-4xl dark:text-slate-50">
                            A simple loop for operational work that needs real accountability
                        </h2>
                    </div>

                    <div className="mt-10 grid gap-4 lg:grid-cols-3">
                        {workflowSteps.map((step) => {
                            const Icon = step.icon
                            return (
                                <div key={step.title} className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-slate-900">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#2563eb]/10 dark:bg-blue-500/15">
                                        <Icon className="size-5 text-[#2563eb] dark:text-blue-400" />
                                    </div>
                                    <h3 className="mt-5 text-xl font-semibold text-slate-900 dark:text-slate-100">{step.title}</h3>
                                    <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">{step.description}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            <section className="border-y border-slate-200 bg-white py-16 sm:py-20 dark:border-white/10 dark:bg-slate-900/60">
                <div className="mx-auto max-w-6xl px-6 lg:px-8">
                    <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[#2563eb] dark:text-blue-400">What teams get</p>
                            <h2 className="mt-3 text-3xl font-semibold text-slate-950 sm:text-4xl dark:text-slate-50">
                                Built for the daily rhythm of supervisors and front-line teams
                            </h2>
                            <p className="mt-4 max-w-xl text-base leading-7 text-slate-600 dark:text-slate-300">
                                The product is strongest when work needs structure but teams still need flexibility. That means less admin drag for supervisors and less confusion for employees.
                            </p>
                        </div>

                        <div className="grid gap-4">
                            {capabilityGroups.map((group) => {
                                const Icon = group.icon
                                return (
                                    <div key={group.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-white/10 dark:bg-slate-900">
                                        <div className="flex items-start gap-4">
                                            <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm dark:bg-slate-950 dark:shadow-none">
                                                <Icon className="size-5 text-[#2563eb] dark:text-blue-400" />
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{group.title}</h3>
                                                <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-400">{group.description}</p>
                                                <ul className="mt-4 grid gap-2 text-sm text-slate-700 dark:text-slate-300 sm:grid-cols-3">
                                                    {group.bullets.map((bullet) => (
                                                        <li key={bullet} className="rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-white/10 dark:bg-slate-950">
                                                            {bullet}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-[#F3F7FB] py-16 sm:py-20 dark:bg-slate-950">
                <div className="mx-auto max-w-6xl px-6 lg:px-8">
                    <div className="rounded-3xl border border-slate-200 bg-slate-950 px-6 py-8 text-white sm:px-8 sm:py-10 dark:border-white/10 dark:bg-slate-900">
                        <div className="max-w-2xl">
                            <p className="text-sm font-semibold uppercase tracking-[0.08em] text-slate-300">Operational outcomes</p>
                            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
                                Better visibility, faster follow-through, and cleaner records of completed work
                            </h2>
                            <p className="mt-4 text-base leading-7 text-slate-300">
                                OpTraxx is designed for teams that need to prove the work happened, catch problems sooner, and keep accountability from slipping between roles.
                            </p>
                        </div>

                        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {outcomeStats.map((stat) => (
                                <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                                    <p className="text-2xl font-semibold">{stat.value}</p>
                                    <p className="mt-2 text-sm leading-6 text-slate-300">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-white py-16 sm:py-20 dark:bg-slate-950">
                <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
                    <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[#2563eb] dark:text-blue-400">Get started</p>
                    <h2 className="mt-3 text-3xl font-semibold text-slate-950 sm:text-4xl dark:text-slate-50">
                        Bring form-driven work into one reliable workflow
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
                        Set up supervisors, define team work, and give employees a simpler way to complete what is assigned.
                    </p>
                    <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                        <Button asChild size="lg" className="h-11 bg-[#2563eb] px-5 text-sm font-semibold text-white hover:bg-[#1d4ed8]">
                            <Link to="/signup">
                                Create an account
                                <ArrowRight className="size-4" />
                            </Link>
                        </Button>
                        <Button asChild size="lg" variant="outline" className="h-11 border-slate-300 px-5 text-sm font-semibold text-slate-900 hover:bg-slate-50 dark:border-white/12 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800">
                            <Link to="/contact">Talk to the team</Link>
                        </Button>
                    </div>
                </div>
            </section>
        </main>
    )
}
