import { Outlet } from 'react-router-dom'
import { HeroHeader } from '@/components/header'
import FooterFour from '@/components/footer-four'

export default function PublicLayout() {
    return (
        <div className="flex min-h-screen flex-col">
            <HeroHeader />
            <main className="flex-1 bg-[#F8FAFC]">
                <Outlet />
            </main>
            <FooterFour />
        </div>
    )
}
