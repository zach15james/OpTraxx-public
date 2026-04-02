import { Button } from '@/components/ui/button'
import { Check, Users, FileText, Shield } from 'lucide-react'
import { Link } from 'react-router-dom'

const teamManagement = [
    { feature: 'Teams',           free: '1',           pro: 'Up to 10',   enterprise: 'Unlimited' },
    { feature: 'Members per team',free: 'Up to 5',     pro: 'Unlimited',  enterprise: 'Unlimited' },
    { feature: 'Custom roles',    free: false,         pro: true,         enterprise: true },
    { feature: 'Activity tracking',free: false,        pro: true,         enterprise: true },
]

const formsAnalytics = [
    { feature: 'Custom forms',    free: '3',           pro: 'Unlimited',  enterprise: 'Unlimited' },
    { feature: 'Form templates',  free: false,         pro: true,         enterprise: true },
    { feature: 'Advanced analytics', free: false,      pro: true,         enterprise: true },
    { feature: 'Custom reports',  free: false,         pro: '5 / mo',     enterprise: 'Unlimited' },
]

const securitySupport = [
    { feature: 'Email support',   free: true,          pro: true,         enterprise: true },
    { feature: 'Priority support',free: false,         pro: true,         enterprise: true },
    { feature: 'SSO / SAML',      free: false,         pro: false,        enterprise: true },
    { feature: 'Audit logs',      free: false,         pro: false,        enterprise: true },
    { feature: 'SLA guarantee',   free: false,         pro: false,        enterprise: true },
]

function Cell({ value }) {
    if (value === true) return <Check className="size-3 shrink-0" strokeWidth={3.5} style={{ color: '#2563eb' }} />
    if (value === false) return <span className="text-muted-foreground">—</span>
    return <span>{value}</span>
}

export default function PricingComparatorOne() {
    return (
        <section className="bg-[#F8FAFC] py-16 md:py-32">
            <div className="mx-auto max-w-5xl px-6">
                <div className="mx-auto max-w-2xl text-center mb-12 md:mb-20">
                    <h2 className="text-balance text-3xl font-bold md:text-4xl text-[#0F172A]">
                        Compare plans in detail
                    </h2>
                    <p className="text-muted-foreground mx-auto mt-4 max-w-xl text-balance text-lg">
                        See exactly what's included in each plan before you commit.
                    </p>
                </div>
                <div className="w-full overflow-auto lg:overflow-visible">
                    <table className="w-[200vw] border-separate border-spacing-x-3 md:w-full">
                        <thead className="bg-[#F8FAFC]/95 sticky top-0">
                            <tr className="*:py-4 *:text-left *:font-medium">
                                <th className="lg:w-2/5"></th>
                                <th className="space-y-3">
                                    <span className="block text-[#0F172A]">Free</span>
                                    <Button asChild variant="outline" size="sm">
                                        <Link to="/signup">Get Started</Link>
                                    </Button>
                                </th>
                                <th className="space-y-3">
                                    <span className="block text-[#0F172A]">Pro</span>
                                    <Button asChild size="sm" className="bg-[#2563eb] hover:bg-[#2563eb]/90 text-white">
                                        <Link to="/signup">Get Started</Link>
                                    </Button>
                                </th>
                                <th className="space-y-3">
                                    <span className="block text-[#0F172A]">Enterprise</span>
                                    <Button asChild variant="outline" size="sm">
                                        <Link to="/signup">Contact Sales</Link>
                                    </Button>
                                </th>
                            </tr>
                        </thead>
                        <tbody>

                            {/* Team Management */}
                            <tr className="*:py-4">
                                <td className="flex items-center gap-2 font-medium text-[#0F172A]">
                                    <Users className="size-4" style={{ color: '#2563eb' }} />
                                    <span>Team Management</span>
                                </td>
                                <td></td><td></td><td></td>
                            </tr>
                            {teamManagement.map((row, index) => (
                                <tr key={index} className="*:border-b *:py-4">
                                    <td className="text-muted-foreground">{row.feature}</td>
                                    <td><Cell value={row.free} /></td>
                                    <td><Cell value={row.pro} /></td>
                                    <td><Cell value={row.enterprise} /></td>
                                </tr>
                            ))}

                            {/* Forms & Analytics */}
                            <tr className="*:pb-4 *:pt-8">
                                <td className="flex items-center gap-2 font-medium text-[#0F172A]">
                                    <FileText className="size-4" style={{ color: '#10B981' }} />
                                    <span>Forms & Analytics</span>
                                </td>
                                <td></td><td></td><td></td>
                            </tr>
                            {formsAnalytics.map((row, index) => (
                                <tr key={index} className="*:border-b *:py-4">
                                    <td className="text-muted-foreground">{row.feature}</td>
                                    <td><Cell value={row.free} /></td>
                                    <td><Cell value={row.pro} /></td>
                                    <td><Cell value={row.enterprise} /></td>
                                </tr>
                            ))}

                            {/* Security & Support */}
                            <tr className="*:pb-4 *:pt-8">
                                <td className="flex items-center gap-2 font-medium text-[#0F172A]">
                                    <Shield className="size-4" style={{ color: '#0891B2' }} />
                                    <span>Security & Support</span>
                                </td>
                                <td></td><td></td><td></td>
                            </tr>
                            {securitySupport.map((row, index) => (
                                <tr key={index} className="*:border-b *:py-4">
                                    <td className="text-muted-foreground">{row.feature}</td>
                                    <td><Cell value={row.free} /></td>
                                    <td><Cell value={row.pro} /></td>
                                    <td><Cell value={row.enterprise} /></td>
                                </tr>
                            ))}

                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}
