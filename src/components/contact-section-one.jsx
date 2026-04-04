import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Logo } from '@/components/logo'

export default function ContactSectionOne() {
    return (
        <section className="bg-[#F8FAFC] py-15 sm:py-24 lg:py-32">
            <div className="mx-auto max-w-4xl px-4 lg:px-0">
                <div className="flex justify-center mb-6">
                    <Logo className="h-28" />
                </div>
                <h1 className="text-balance text-3xl font-bold md:text-4xl lg:text-5xl text-[#0F172A] text-center">Get in touch with the team</h1>
                <p className="text-muted-foreground mt-4 text-lg text-center">Whether you have questions about pricing, features, or getting your team set up, we're happy to help.</p>
                <div className="mt-10 grid gap-12 lg:grid-cols-5">
                    <div className="grid grid-cols-2 lg:col-span-2 lg:block lg:space-y-12">
                        <div className="flex flex-col justify-between space-y-6">
                            <div>
                                <h2 className="mb-3 text-lg font-semibold text-[#0F172A]">Email/Phone</h2>
                                <p className="text-lg text-[#0F172A]">contact@optraxx.com</p>
                                <p className="text-lg text-[#0F172A]">(000)-000-0000</p>
                                <p className="mt-3 text-sm text-muted-foreground">We typically respond within one business day.</p>
                            </div>
                        </div>
                        <div className="flex flex-col justify-between space-y-6">
                            <div>
                                <h3 className="mb-3 text-lg font-semibold text-[#0F172A]">Enterpise Plan Sales</h3>
                                <p className="text-lg text-[#0F172A]">sales@optraxx.com</p>
                                <p className="mt-3 text-sm text-muted-foreground">Interested in Enterprise? Let's talk.</p>
                            </div>
                        </div>
                    </div>

                    <form action="" className="@container lg:col-span-3">
                        <Card className="p-8 sm:p-12">
                            <h3 className="text-xl font-semibold text-[#0F172A]">Send us a message</h3>
                            <p className="mt-4 text-sm text-muted-foreground">Tell us a bit about yourself and what you're looking for — we'll get back to you shortly.</p>

                            <div className="**:[&>label]:block mt-12 space-y-6 *:space-y-3">
                                <div className="@md:grid-cols-2 grid gap-3 *:space-y-3">
                                    <div>
                                        <Label htmlFor="name">Full name</Label>
                                        <Input type="text" id="name" required />
                                    </div>
                                    <div>
                                        <Label htmlFor="email">Work Email</Label>
                                        <Input type="email" id="email" required />
                                    </div>
                                </div>
                                <div className="@md:grid-cols-2 grid gap-3 *:space-y-3">
                                    <div>
                                        <Label htmlFor="company">Company / Organization</Label>
                                        <Input type="text" id="company" />
                                    </div>
                                    <div>
                                        <Label htmlFor="role">Your Role</Label>
                                        <Select>
                                            <SelectTrigger id="role">
                                                <SelectValue placeholder="Select a role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="supervisor">Supervisor / Manager</SelectItem>
                                                <SelectItem value="employee">Employee / Team Member</SelectItem>
                                                <SelectItem value="it">IT / Operations</SelectItem>
                                                <SelectItem value="executive">Executive / Owner</SelectItem>
                                                <SelectItem value="other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="subject">Subject</Label>
                                    <Select>
                                        <SelectTrigger id="subject">
                                            <SelectValue placeholder="What can we help you with?" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="general">General Question</SelectItem>
                                            <SelectItem value="pricing">Pricing & Plans</SelectItem>
                                            <SelectItem value="demo">Request a Demo</SelectItem>
                                            <SelectItem value="enterprise">Enterprise Inquiry</SelectItem>
                                            <SelectItem value="support">Technical Support</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="msg">Message</Label>
                                    <Textarea id="msg" rows={4} placeholder="Tell us more..." />
                                </div>
                                <Button className="bg-[#2563eb] hover:bg-[#2563eb]/90 text-white">Submit</Button>
                            </div>
                        </Card>
                    </form>
                </div>
            </div>
        </section>
    );
}
