import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Logo } from '@/components/logo'

export default function PricingSectionTwo() {
    return (
        <div className="bg-[#F8FAFC] py-16 md:py-32">
            <div className="mx-auto max-w-5xl px-6">
                <div className="mx-auto max-w-2xl text-center">
                    <div className="flex justify-center mb-6">
                        <Logo className="h-28" />
                    </div>
                    <h2 className="text-balance text-3xl font-bold md:text-4xl lg:text-5xl text-[#0F172A]">
                        Simple, transparent pricing
                    </h2>
                    <p className="text-muted-foreground mx-auto mt-4 max-w-xl text-balance text-lg">
                        Choose the plan that fits your team. Upgrade or downgrade at any time.
                    </p>
                </div>
                <div className="@container relative mt-12 md:mt-20">
                    <Card className="@4xl:max-w-full relative mx-auto max-w-sm">
                        <div className="@4xl:grid-cols-3 grid">

                            {/* Free */}
                            <div>
                                <CardHeader className="p-8">
                                    <CardTitle className="font-medium">Free</CardTitle>
                                    <span className="mb-0.5 mt-2 block text-2xl font-semibold">$0 / mo</span>
                                    <CardDescription className="text-sm">Up to 5 team members</CardDescription>
                                </CardHeader>
                                <div className="border-y px-8 py-4">
                                    <Button asChild className="w-full" variant="outline">
                                        <Link to="/signup">Get Started</Link>
                                    </Button>
                                </div>
                                <ul role="list" className="space-y-3 p-8">
                                    {[
                                        '1 team',
                                        'Up to 5 members',
                                        '3 custom forms',
                                        'Basic analytics',
                                        'Email support',
                                    ].map((item, index) => (
                                        <li key={index} className="flex items-center gap-2">
                                            <Check className="size-3 shrink-0" strokeWidth={3.5} style={{ color: '#2563eb' }} />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Pro - featured */}
                            <div className="ring-foreground/10 bg-background rounded-lg @3xl:mx-0 @3xl:-my-3 -mx-1 border-transparent shadow ring-1">
                                <div className="@3xl:py-3 @3xl:px-0 relative px-1">
                                    <CardHeader className="p-8">
                                        <CardTitle className="font-medium">Pro</CardTitle>
                                        <span className="mb-0.5 mt-2 block text-2xl font-semibold">$12 / mo</span>
                                        <CardDescription className="text-sm">Per user, billed monthly</CardDescription>
                                    </CardHeader>
                                    <div className="@3xl:mx-0 -mx-1 border-y px-8 py-4">
                                        <Button asChild className="w-full bg-[#2563eb] hover:bg-[#2563eb]/90 text-white">
                                            <Link to="/signup">Get Started</Link>
                                        </Button>
                                    </div>
                                    <ul role="list" className="space-y-3 p-8">
                                        {[
                                            'Everything in Free',
                                            'Up to 10 teams',
                                            'Unlimited members',
                                            'Unlimited custom forms',
                                            'Form templates library',
                                            'Advanced analytics',
                                            'Custom member roles',
                                            'Activity tracking',
                                            'Priority email support',
                                            '5 custom reports / mo',
                                        ].map((item, index) => (
                                            <li key={index} className="flex items-center gap-2">
                                                <Check className="size-3 shrink-0" strokeWidth={3.5} style={{ color: '#2563eb' }} />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Enterprise */}
                            <div>
                                <CardHeader className="p-8">
                                    <CardTitle className="font-medium">Enterprise</CardTitle>
                                    <span className="mb-0.5 mt-2 block text-2xl font-semibold">$29 / mo</span>
                                    <CardDescription className="text-sm">Per user, billed monthly</CardDescription>
                                </CardHeader>
                                <div className="border-y px-8 py-4">
                                    <Button asChild className="w-full" variant="outline">
                                        <Link to="/signup">Contact Sales</Link>
                                    </Button>
                                </div>
                                <ul role="list" className="space-y-3 p-8">
                                    {[
                                        'Everything in Pro',
                                        'Unlimited teams',
                                        'Unlimited custom reports',
                                        'SSO / SAML',
                                        'Audit logs',
                                        'Dedicated account manager',
                                        'SLA guarantee',
                                        'Custom integrations',
                                    ].map((item, index) => (
                                        <li key={index} className="flex items-center gap-2">
                                            <Check className="size-3 shrink-0" strokeWidth={3.5} style={{ color: '#2563eb' }} />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
