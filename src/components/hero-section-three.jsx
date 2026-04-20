import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Users, FileText, BarChart3, Zap } from 'lucide-react'
import landingImage from '@/assets/Landing-Page-Image.png'

export default function HeroSection() {
    return (
        <main className="bg-white overflow-hidden">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white" />

                <div className="relative w-full max-w-7xl mx-auto px-6 lg:px-8 py-20">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <div className="space-y-8">
                            <div className="space-y-6">
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-200">
                                    <Zap className="w-4 h-4 text-blue-600" />
                                    <span className="text-sm font-semibold text-blue-600">Operational clarity starts here</span>
                                </div>

                                <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-tight">
                                    Your team runs on <span className="text-blue-600">accountability</span>
                                </h1>

                                <p className="text-xl text-slate-600 leading-relaxed max-w-lg">
                                    Join teams who replaced scattered spreadsheets and chat threads with a single source of truth. OpTraxx organizes your team hierarchy, sends customized work requests, and monitors progress all in one system.
                                </p>
                            </div>

                            {/* CTA Buttons with Better Hierarchy */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white text-base font-semibold h-12 shadow-lg hover:shadow-xl transition-all duration-300 group">
                                    <Link to="/signup" className="flex items-center gap-2">
                                        Get Started Free
                                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                                    </Link>
                                </Button>
                                <Button asChild size="lg" className="border-2 border-blue-600 bg-transparent text-blue-600 hover:bg-blue-50 text-base font-semibold h-12 transition-all duration-300">
                                    <Link to="/contact">
                                        Schedule a Demo
                                    </Link>
                                </Button>
                            </div>

                            {/* Trust Indicators */}
                            <div className="pt-8 border-t border-slate-200">
                                <p className="text-sm text-slate-600 mb-4 font-medium">Trusted by operational teams at:</p>
                                <div className="flex flex-wrap gap-8 text-slate-500 text-sm font-semibold">
                                    <span>Engineering Teams</span>
                                    <span>Facility Ops</span>
                                    <span>Field Service</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Image with Glassmorphism & Glow */}
                        <div className="relative h-[500px] lg:h-[600px] group">
                            {/* Animated Glow Background */}
                            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500 animate-pulse" />

                            {/* Inner Glow */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-transparent to-purple-400/20 rounded-2xl pointer-events-none" />

                            {/* Glassmorphism Border */}
                            <div className="absolute inset-0 rounded-2xl border-2 border-white/30 backdrop-blur-sm bg-white/5" />

                            {/* Image Container */}
                            <div className="absolute inset-0 rounded-2xl overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-purple-600/10" />
                                <img
                                    src={landingImage}
                                    alt="OpTraxx dashboard preview"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>

                            {/* Shine Effect */}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="relative py-20 lg:py-32 bg-slate-50">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-4xl lg:text-5xl font-bold text-slate-900">
                            Everything you need to scale
                        </h2>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                            Purpose-built for supervisors who need accountability and flexibility
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="group relative bg-white p-8 rounded-2xl border border-slate-200/60 hover:border-blue-300 hover:shadow-xl transition-all duration-300 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="relative">
                                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 group-hover:from-blue-200 transition-all duration-300">
                                    <FileText className="h-7 w-7 text-blue-600" />
                                </div>
                                <h3 className="mb-3 text-xl font-bold text-slate-900">Custom Form Builder</h3>
                                <p className="text-slate-600 leading-relaxed">
                                    Create unlimited custom forms with drag-and-drop simplicity. No coding required. Tailor every field to your workflow.
                                </p>
                            </div>
                        </div>

                        {/* Feature 2 */}
                        <div className="group relative bg-white p-8 rounded-2xl border border-slate-200/60 hover:border-green-300 hover:shadow-xl transition-all duration-300 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="relative">
                                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-green-100 to-green-50 group-hover:from-green-200 transition-all duration-300">
                                    <Users className="h-7 w-7 text-green-600" />
                                </div>
                                <h3 className="mb-3 text-xl font-bold text-slate-900">Team Hierarchy</h3>
                                <p className="text-slate-600 leading-relaxed">
                                    Organize teams by role and permission level. Assign tasks to individuals or entire teams with one click.
                                </p>
                            </div>
                        </div>

                        {/* Feature 3 */}
                        <div className="group relative bg-white p-8 rounded-2xl border border-slate-200/60 hover:border-purple-300 hover:shadow-xl transition-all duration-300 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="relative">
                                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-purple-100 to-purple-50 group-hover:from-purple-200 transition-all duration-300">
                                    <BarChart3 className="h-7 w-7 text-purple-600" />
                                </div>
                                <h3 className="mb-3 text-xl font-bold text-slate-900">Real-Time Tracking</h3>
                                <p className="text-slate-600 leading-relaxed">
                                    Monitor task completion, view detailed analytics, and export reports. See what matters in seconds.
                                </p>
                            </div>
                        </div>

                        {/* Feature 4 */}
                        <div className="group relative bg-white p-8 rounded-2xl border border-slate-200/60 hover:border-orange-300 hover:shadow-xl transition-all duration-300 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="relative">
                                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-orange-100 to-orange-50 group-hover:from-orange-200 transition-all duration-300">
                                    <CheckCircle2 className="h-7 w-7 text-orange-600" />
                                </div>
                                <h3 className="mb-3 text-xl font-bold text-slate-900">Approval Workflows</h3>
                                <p className="text-slate-600 leading-relaxed">
                                    Review and approve submissions with built-in compliance tracking. Maintain audit trails automatically.
                                </p>
                            </div>
                        </div>

                        {/* Feature 5 */}
                        <div className="group relative bg-white p-8 rounded-2xl border border-slate-200/60 hover:border-red-300 hover:shadow-xl transition-all duration-300 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="relative">
                                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-red-100 to-red-50 group-hover:from-red-200 transition-all duration-300">
                                    <Zap className="h-7 w-7 text-red-600" />
                                </div>
                                <h3 className="mb-3 text-xl font-bold text-slate-900">Automation</h3>
                                <p className="text-slate-600 leading-relaxed">
                                    Schedule recurring tasks, set notifications, and escalate overdue items automatically. Save hours weekly.
                                </p>
                            </div>
                        </div>

                        {/* Feature 6 */}
                        <div className="group relative bg-white p-8 rounded-2xl border border-slate-200/60 hover:border-cyan-300 hover:shadow-xl transition-all duration-300 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="relative">
                                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-100 to-cyan-50 group-hover:from-cyan-200 transition-all duration-300">
                                    <FileText className="h-7 w-7 text-cyan-600" />
                                </div>
                                <h3 className="mb-3 text-xl font-bold text-slate-900">Export & Reporting</h3>
                                <p className="text-slate-600 leading-relaxed">
                                    Generate PDF and CSV reports in seconds. Perfect for compliance documentation and stakeholder updates.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section with Glassmorphism */}
            <section className="relative py-20 lg:py-32 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse animation-delay-2000" />
                </div>

                <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center space-y-8">
                    <h2 className="text-4xl lg:text-5xl font-bold text-white">
                        Ready to transform your operations?
                    </h2>
                    <p className="text-xl text-blue-100">
                        Join teams who've eliminated task chaos and gained real accountability.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                        <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-slate-100 text-base font-semibold h-12 shadow-xl hover:shadow-2xl transition-all duration-300">
                            <Link to="/signup" className="flex items-center gap-2">
                                Start Free Trial
                                <span>→</span>
                            </Link>
                        </Button>
                        <Button asChild size="lg" className="border-2 border-white/80 bg-white/10 text-white hover:bg-white/20 text-base font-semibold h-12 backdrop-blur-sm transition-all duration-300">
                            <Link to="/contact">
                                Talk to Sales
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>
        </main>
    );
}
