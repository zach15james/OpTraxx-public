import { Logo } from '@/components/logo'
import { Link } from 'react-router-dom'

const links = [
    { title: 'Home',       href: '/' },
    { title: 'Features',   href: '/features' },
    { title: 'About',      href: '/about' },
    { title: 'Pricing',    href: '/pricing' },
    { title: "FAQ's",      href: '/faq' },
    { title: 'Contact Us', href: '/contact' },
]

export default function FooterFour() {
    return (
        <footer className="border-t py-12" style={{ backgroundColor: 'var(--color-background)' }}>
            <div className="mx-auto max-w-5xl px-6">
                <div className="flex flex-wrap justify-between gap-12">
                    <div className="order-last flex items-center gap-3 md:order-first">
                        <Link to="/" aria-label="go home">
                            <Logo className="h-8" />
                        </Link>
                        <span className="text-muted-foreground block text-center text-sm">
                            © {new Date().getFullYear()} OpTraxx. All rights reserved.
                        </span>
                    </div>

                    <div className="order-first flex flex-wrap gap-x-6 gap-y-4 md:order-last">
                        {links.map((link, index) => (
                            <Link
                                key={index}
                                to={link.href}
                                className="text-muted-foreground hover:text-[#2563eb] block duration-150">
                                <span>{link.title}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    )
}
