import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Link } from 'react-router-dom'
import { Logo } from '@/components/logo'

const faqItems = [
    {
        id: 'item-1',
        question: 'What is OpTraxx?',
        answer: 'OpTraxx is a web-based team management platform that lets supervisors and employees collaborate through custom form building, role-based team management, and real-time performance tracking — all in one place.',
    },
    {
        id: 'item-2',
        question: 'How do I get started?',
        answer: 'Simply sign up for a free account, create your first team, and invite your members. From there you can assign roles, build custom forms, and start tracking progress right away — no technical setup required.',
    },
    {
        id: 'item-3',
        question: 'What is the difference between a Supervisor and an Employee?',
        answer: 'Supervisors can create and manage teams, build and assign forms, and view analytics across their team. Employees can complete assigned forms and view their own progress. Roles can be customized on Pro and Enterprise plans.',
    },
    {
        id: 'item-4',
        question: 'Can I use OpTraxx for multiple teams?',
        answer: 'Yes. The Free plan supports 1 team, the Pro plan supports up to 10 teams, and the Enterprise plan supports unlimited teams. Each team has its own dashboard, members, and forms.',
    },
    {
        id: 'item-5',
        question: 'How does the custom form builder work?',
        answer: 'The form builder lets you design forms tailored to your team\'s workflows — no coding required. You can create forms from scratch or use templates, then assign them to specific team members or the whole team.',
    },
    {
        id: 'item-6',
        question: 'Can I change or cancel my plan at any time?',
        answer: 'Yes. You can upgrade, downgrade, or cancel your plan at any time from your account settings. If you cancel, you\'ll retain access to your plan features until the end of your billing period.',
    },
    {
        id: 'item-7',
        question: 'Is my data secure?',
        answer: 'Yes. OpTraxx uses industry-standard encryption for all data in transit and at rest. Enterprise plans include additional security features such as SSO/SAML, audit logs, and a dedicated account manager.',
    },
    {
        id: 'item-8',
        question: 'Do you offer a free trial for paid plans?',
        answer: 'You can get started for free with our Free plan, which includes core features with no time limit. If you\'re interested in a guided trial of the Pro or Enterprise plan, reach out to us via the Contact page.',
    },
]

export default function FaqsSectionTwo() {
    return (
        <section className="py-16 md:py-32" style={{ backgroundColor: 'var(--color-background)' }}>
            <div className="mx-auto max-w-5xl px-6">
                <div className="mx-auto max-w-2xl">
                    <div className="flex justify-center mb-6">
                        <Logo className="h-28" />
                    </div>
                </div>
                <div className="grid gap-8 md:grid-cols-5 md:gap-12 mt-8 md:mt-10">
                    <div className="md:col-span-2">
                        <h2 className="text-balance text-3xl font-bold md:text-4xl lg:text-5xl text-[#0F172A]">FAQs</h2>
                        <p className="text-muted-foreground mt-4 text-balance text-lg">Your questions answered</p>
                        <p className="text-muted-foreground mt-6 hidden md:block">
                            Can't find what you're looking for?
                        </p>
                        <Link to="/contact" className="font-medium hover:underline hidden md:block mt-1" style={{ color: '#2563eb' }}>
                            Contact the team
                        </Link>
                    </div>

                    <div className="md:col-span-3">
                        <Accordion type="single" collapsible>
                            {faqItems.map((item) => (
                                <AccordionItem key={item.id} value={item.id}>
                                    <AccordionTrigger className="cursor-pointer text-base hover:no-underline text-[#0F172A]">
                                        {item.question}
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <p className="text-base text-muted-foreground">{item.answer}</p>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>

                    <p className="text-muted-foreground mt-6 md:hidden">
                        Can't find what you're looking for?
                    </p>
                    <Link to="/contact" className="font-medium hover:underline md:hidden mt-1 block" style={{ color: '#2563eb' }}>
                        Contact the team
                    </Link>
                </div>
            </div>
        </section>
    )
}
