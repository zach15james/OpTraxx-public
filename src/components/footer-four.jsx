import { Logo } from '@/components/logo'
import { Link } from 'react-router-dom'

const links = [
    { title: 'Home', href: '/' },
    { title: 'Features', href: '/features' },
    { title: 'About', href: '/about' },
    { title: 'Pricing', href: '/pricing' },
    { title: "FAQ's", href: '/faq' },
    { title: 'Contact Us', href: '/contact' },
]

export default function FooterFour() {
    return (
        <footer className="border-t border-slate-200 bg-white py-10 dark:border-white/10 dark:bg-slate-950">
            <div className="mx-auto max-w-6xl px-6 lg:px-8">
                <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <Link to="/" aria-label="go home" className="inline-flex items-center rounded-lg bg-white px-2 py-1 shadow-sm dark:bg-slate-100">
                            <Logo className="h-9" />
                        </Link>
                        <span className="block text-sm text-slate-500 dark:text-slate-400">
                            © {new Date().getFullYear()} OpTraxx. All rights reserved.
                        </span>
                    </div>

                    <div className="flex flex-wrap gap-x-6 gap-y-3">
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                to={link.href}
                                className="block text-sm font-medium text-slate-600 duration-150 hover:text-[#2563eb] dark:text-slate-300 dark:hover:text-blue-400">
                                <span>{link.title}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    )
}
