import { ArrowRight, Users, FileText, BarChart3 } from 'lucide-react'
import { Logo } from '@/components/logo'

export default function ContentFour() {
    return (
        <section className="bg-[#F8FAFC]">
            <div className="py-16 md:py-32">
                <div className="mx-auto w-full max-w-5xl px-6">
                    <div className="@container mx-auto max-w-2xl">
                        <div className="mb-6 flex justify-center">
                            <Logo className="h-28" />
                        </div>
                        <div className="text-center">
                            <h2 className="text-balance text-3xl font-bold text-[#0F172A] md:text-4xl lg:text-5xl">Built for every team, every industry</h2>
                            <p className="mb-12 mt-4 text-xl text-muted-foreground">
                                OpTraxx is a web-based platform that empowers supervisors and employees to collaborate effectively - through custom form building, role-based team management, and real-time performance tracking. Whether you're managing a field crew, a retail team, or a remote workforce, OpTraxx adapts to how you work.
                            </p>
                        </div>

                        <div className="@sm:grid-cols-2 @2xl:grid-cols-3 my-12 grid gap-6">
                            <div className="space-y-2">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#2563eb]/10">
                                    <Users className="h-6 w-6 text-[#2563eb]" />
                                </div>
                                <h3 className="text-xl font-medium text-[#0F172A]">Team Management</h3>
                                <p className="text-muted-foreground">Organize teams, assign custom roles, and keep everyone aligned from one centralized dashboard.</p>
                            </div>
                            <div className="space-y-2">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#10B981]/10">
                                    <FileText className="h-6 w-6 text-[#10B981]" />
                                </div>
                                <h3 className="text-xl font-medium text-[#0F172A]">Custom Form Builder</h3>
                                <p className="text-muted-foreground">Design and deploy forms tailored to your team's workflows - no code required.</p>
                            </div>
                            <div className="space-y-2">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#0891B2]/10">
                                    <BarChart3 className="h-6 w-6 text-[#0891B2]" />
                                </div>
                                <h3 className="text-xl font-medium text-[#0F172A]">Real-Time Analytics</h3>
                                <p className="text-muted-foreground">Track task completion, monitor team performance, and surface insights when you need them.</p>
                            </div>
                        </div>

                        <div className="border-t">
                            <ul role="list" className="mt-8 space-y-2 text-muted-foreground">
                                {[
                                    { value: 'Any industry', label: '- field crews, retail, remote, and beyond' },
                                    { value: 'No-code', label: 'form builder with reusable templates' },
                                    { value: 'Role-based', label: 'access for supervisors and employees' },
                                    { value: 'Real-time', label: 'progress tracking and team analytics' },
                                ].map((stat, index) => (
                                    <li key={index} className="-ml-0.5 flex items-center gap-1.5">
                                        <ArrowRight className="size-4 opacity-50" />
                                        <span className="font-medium text-[#0F172A]">{stat.value}</span> {stat.label}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
