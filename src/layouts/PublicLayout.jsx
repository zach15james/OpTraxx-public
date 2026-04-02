import { Outlet } from 'react-router-dom'
import { HeroHeader } from '@/components/header'

export default function PublicLayout() {
    return (
        <>
            <HeroHeader />
            <Outlet />
        </>
    )
}
