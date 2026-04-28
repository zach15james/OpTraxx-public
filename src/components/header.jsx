import { Link } from 'react-router-dom'
import { Logo } from '@/components/logo'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import React from 'react'
import { cn } from '@/lib/utils'

const menuItems = [
    { name: 'Features', href: '/features' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'About', href: '/about' },
    { name: "FAQ's", href: '/faq' },
    { name: 'Contact Us', href: '/contact' },
]

export const HeroHeader = () => {
    const [menuState, setMenuState] = React.useState(false)
    const [isScrolled, setIsScrolled] = React.useState(false)

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    React.useEffect(() => {
        if (!menuState) return undefined

        const closeMenu = () => setMenuState(false)
        window.addEventListener('resize', closeMenu)
        return () => window.removeEventListener('resize', closeMenu)
    }, [menuState])

    return (
        <header className="sticky top-0 z-40">
            <nav
                data-state={menuState && 'active'}
                className={cn(
                    'fixed inset-x-0 top-0 z-40 transition-all duration-300',
                    isScrolled
                        ? 'border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-950/95'
                        : 'bg-white/90 backdrop-blur dark:bg-slate-950/88'
                )}>
                <div className="mx-auto max-w-6xl px-6 lg:px-8">
                    <div className="relative flex items-center justify-between gap-6 py-4">
                        <div className="flex items-center gap-8">
                            <Link to="/" aria-label="home" className="flex items-center">
                                <Logo className="h-9" />
                            </Link>

                            <button
                                onClick={() => setMenuState(!menuState)}
                                aria-label={menuState === true ? 'Close Menu' : 'Open Menu'}
                                className="relative z-20 -mr-2 block cursor-pointer rounded-lg p-2 text-slate-700 dark:text-slate-200 lg:hidden">
                                <Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                                <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
                            </button>

                            <div className="hidden lg:block">
                                <ul className="flex items-center gap-1.5">
                                    {menuItems.map((item) => (
                                        <li key={item.href}>
                                            <Button asChild variant="ghost" size="sm" className="h-9 px-3 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-200 dark:hover:bg-white/8 dark:hover:text-white">
                                                <Link to={item.href}>
                                                    <span>{item.name}</span>
                                                </Link>
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="in-data-[state=active]:block absolute left-0 right-0 top-full mt-2 hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-white/10 dark:bg-slate-900 lg:static lg:mt-0 lg:flex lg:w-auto lg:items-center lg:justify-end lg:gap-3 lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
                            <div className="lg:hidden">
                                <ul className="space-y-2 text-base">
                                    {menuItems.map((item) => (
                                        <li key={item.href}>
                                            <Link
                                                to={item.href}
                                                onClick={() => setMenuState(false)}
                                                className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-950 dark:text-slate-200 dark:hover:bg-white/8 dark:hover:text-white">
                                                <span>{item.name}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="mt-5 flex w-full flex-col gap-3 lg:mt-0 lg:w-auto lg:flex-row">
                                <Button asChild variant="ghost" size="sm" className="h-10 px-4 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-200 dark:hover:bg-white/8 dark:hover:text-white">
                                    <Link to="/login" onClick={() => setMenuState(false)}>
                                        <span>Login</span>
                                    </Link>
                                </Button>
                                <Button asChild size="sm" className="h-10 bg-[#2563eb] px-4 text-sm font-semibold text-white hover:bg-[#1d4ed8]">
                                    <Link to="/signup" onClick={() => setMenuState(false)}>
                                        <span>Start Free</span>
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    )
}
