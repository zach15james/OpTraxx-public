import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ChevronRight, XIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'

const members = [
    { src: '', name: 'Jacob Pham',    role: 'Co-Founder, CEO, & Developer' },
    { src: '', name: 'Ethan Moak',     role: 'Co-Founder & Developer' },
    { src: '', name: 'Zach James',     role: 'Co-Founder & Developer' },
]

export default function TeamSectionTwo() {
    return (
        <section>
            <div className="bg-[#F8FAFC] py-24">
                <div className="@container mx-auto w-full max-w-5xl px-6">
                    <div className="mx-auto max-w-2xl mb-12">
                        <h2 className="text-balance text-3xl font-bold md:text-4xl lg:text-5xl text-[#0F172A]">Meet the team</h2>
                        <p className="text-muted-foreground my-4 text-balance text-lg">
                            We're a small, focused team on a mission to make team management simpler for supervisors and employees in every industry.
                        </p>
                    </div>

                    <div className="@sm:grid-cols-2 @xl:grid-cols-3 @3xl:grid-cols-4 grid gap-6 md:gap-y-10 mx-auto max-w-2xl">
                        {members.map((member, index) => (
                            <HoverCard key={index} openDelay={300}>
                                <HoverCardTrigger className="grid cursor-pointer grid-cols-[auto_1fr] items-center gap-2.5">
                                    <Avatar className="ring-foreground/10 size-6 border border-transparent shadow ring-1">
                                        <AvatarImage src={member.src} alt={member.name} />
                                        <AvatarFallback style={{ backgroundColor: '#2563eb', color: '#fff', fontSize: '0.6rem' }}>
                                            {member.name.split(' ').map(n => n[0]).join('')}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="text-foreground font-medium">{member.name}</span>
                                </HoverCardTrigger>

                                <HoverCardContent>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <Avatar className="rounded-lg ring-foreground/10 size-10 border border-transparent shadow ring-1">
                                                <AvatarImage src={member.src} alt={member.name} />
                                                <AvatarFallback className="rounded-lg" style={{ backgroundColor: '#2563eb', color: '#fff' }}>
                                                    {member.name.split(' ').map(n => n[0]).join('')}
                                                </AvatarFallback>
                                            </Avatar>
                                            <Button variant="ghost" asChild aria-label="X Account">
                                                <Link to="#">
                                                    <XIcon className="fill-muted-foreground stroke-muted-foreground" />
                                                </Link>
                                            </Button>
                                        </div>
                                        <div>
                                            <span className="text-foreground font-medium">{member.name}</span>
                                            <div className="text-muted-foreground text-sm">{member.role}</div>
                                        </div>
                                    </div>
                                </HoverCardContent>
                            </HoverCard>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
