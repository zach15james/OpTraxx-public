import { useState } from 'react'
import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Link, useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase'

export default function LoginOne() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        try {
            await signInWithEmailAndPassword(auth, email, password)
            navigate('/dashboard/1')
        } catch (err) {
            setError('Invalid email or password.')
        }
    }

    return (
        <section className="relative flex min-h-screen px-4 py-16 md:py-32" style={{ background: 'linear-gradient(to bottom, var(--color-muted, #f1f5f9), var(--color-background))' }}>
            <Button asChild size="default" className="absolute top-4 left-4 bg-[#2563eb] hover:bg-[#2563eb]/90 text-white">
                <Link to="/">← Back to landing page</Link>
            </Button>
            <form onSubmit={handleSubmit} className="max-w-92 m-auto h-fit w-full">
                <div className="p-6">
                    <div>
                        <Logo className="h-8" />
                        <h1 className="mt-6 text-balance text-xl font-semibold">
                            <span className="text-muted-foreground">Welcome back to OpTraxx!</span> Sign in to continue
                        </h1>
                    </div>

                    <div className="mt-6 space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="block text-sm">Email</Label>
                            <Input
                                type="email"
                                required
                                name="email"
                                id="email"
                                placeholder="Your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="ring-foreground/15 border-transparent ring-1" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="block text-sm">Password</Label>
                            <Input
                                type="password"
                                required
                                name="password"
                                id="password"
                                placeholder="Your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="ring-foreground/15 border-transparent ring-1" />
                        </div>

                        {error && <p className="text-sm text-red-500">{error}</p>}

                        <Button
                            type="submit"
                            className="w-full text-white"
                            size="default"
                            style={{ backgroundColor: 'var(--color-primary)' }}>
                            Sign In
                        </Button>
                    </div>
                </div>

                <div className="px-6">
                    <p className="text-muted-foreground text-sm">
                        Don't have an account?
                        <Button asChild variant="link" className="px-2" style={{ color: 'var(--color-primary)' }}>
                            <Link to="/signup">Create account</Link>
                        </Button>
                    </p>
                </div>
            </form>
        </section>
    )
}
