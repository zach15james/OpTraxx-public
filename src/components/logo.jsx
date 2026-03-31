import { cn } from '../lib/utils'
import logoWithText from '@/assets/OpTraxx_Logo_withText.png'
import logoNoText from '@/assets/OpTraxx_Logo_NO-TEXT.png'

export const Logo = ({ className }) => {
    return (
        <img
            src={logoWithText}
            alt="OpTraxx"
            className={cn('h-8', className)}
        />
    );
}

export const LogoIcon = ({ className }) => {
    return (
        <img
            src={logoNoText}
            alt="OpTraxx"
            className={cn('h-6', className)}
        />
    );
}
