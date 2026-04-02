import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { HeroHeader } from './header'
import { UsersIcon, FileTextIcon, BarChart3Icon } from 'lucide-react'

export default function HeroSection() {
    return (
        <>
            <HeroHeader />
            <main className="bg-[#F8FAFC] overflow-hidden min-h-screen">
                <section>
                    <div className="relative py-24">
                        <div className="mx-auto max-w-5xl px-6">
                            <div>
                                <h1 className="mt-8 max-w-2xl text-balance text-5xl font-bold lg:text-6xl text-[#0F172A]">
                                    Streamline Team Management with OpTraxx
                                </h1>
                                <p className="text-foreground my-6 max-w-2xl text-balance text-2xl">
                                    Custom forms, real-time tracking, analytics, seamless collaboration.
                                </p>

                                <div className="flex flex-col items-center gap-3 *:w-full sm:flex-row sm:*:w-fit">
                                    <Button asChild size="lg" className="bg-[#2563eb] hover:bg-[#2563eb]/90">
                                        <Link to="/signup">
                                            <span className="text-nowrap">Get Started Free</span>
                                        </Link>
                                    </Button>
                                    <Button asChild size="lg" variant="outline" className="border-[#64748B]">
                                        <Link to="#demo">
                                            <span className="text-nowrap">Contact the OpTraxx team</span>
                                        </Link>
                                    </Button>
                                </div>
                            </div>

                            {/* Features Grid */}
                            <div className="mt-16 grid gap-8 md:grid-cols-3">
                                <div className="rounded-lg border border-[#64748B]/20 bg-white p-6 shadow-sm">
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#2563eb]/10">
                                        <UsersIcon className="h-6 w-6 text-[#2563eb]" />
                                    </div>
                                    <h3 className="mb-2 text-lg font-semibold text-[#0F172A]">Team Management</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Organize teams, assign roles, and track member progress all in one place.
                                    </p>
                                </div>

                                <div className="rounded-lg border border-[#64748B]/20 bg-white p-6 shadow-sm">
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#10B981]/10">
                                        <FileTextIcon className="h-6 w-6 text-[#10B981]" />
                                    </div>
                                    <h3 className="mb-2 text-lg font-semibold text-[#0F172A]">Custom Forms</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Build and deploy custom forms tailored to your team's specific needs.
                                    </p>
                                </div>

                                <div className="rounded-lg border border-[#64748B]/20 bg-white p-6 shadow-sm">
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#0891B2]/10">
                                        <BarChart3Icon className="h-6 w-6 text-[#0891B2]" />
                                    </div>
                                    <h3 className="mb-2 text-lg font-semibold text-[#0F172A]">Real-Time Analytics</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Track task completion, monitor performance, and visualize team metrics.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}
