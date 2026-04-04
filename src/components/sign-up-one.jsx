import { useState } from 'react'
import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Link, useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth } from '@/lib/firebase'

export default function SignUpOne() {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        if (password !== confirmPassword) {
            setError('Passwords do not match.')
            return
        }
        try {
            const { user } = await createUserWithEmailAndPassword(auth, email, password)
            await updateProfile(user, { displayName: `${firstName} ${lastName}` })
            navigate('/dashboard/1')
        } catch (err) {
            if (err.code === 'auth/email-already-in-use') {
                setError('An account with this email already exists.')
            } else if (err.code === 'auth/weak-password') {
                setError('Password must be at least 6 characters.')
            } else {
                setError(err.message)
            }
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
                            <span className="text-muted-foreground">Welcome to OpTraxx!</span> Create an Account to Get Started
                        </h1>
                    </div>

                    <div className="mt-6 space-y-6">
                        <div className="flex gap-3">
                            <div className="space-y-2 flex-1">
                                <Label htmlFor="first-name" className="block text-sm">First Name</Label>
                                <Input
                                    type="text"
                                    required
                                    name="first-name"
                                    id="first-name"
                                    placeholder="First name"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="ring-foreground/15 border-transparent ring-1" />
                            </div>
                            <div className="space-y-2 flex-1">
                                <Label htmlFor="last-name" className="block text-sm">Last Name</Label>
                                <Input
                                    type="text"
                                    required
                                    name="last-name"
                                    id="last-name"
                                    placeholder="Last name"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="ring-foreground/15 border-transparent ring-1" />
                            </div>
                        </div>

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
                                placeholder="Create a password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="ring-foreground/15 border-transparent ring-1" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirm-password" className="block text-sm">Confirm Password</Label>
                            <Input
                                type="password"
                                required
                                name="confirm-password"
                                id="confirm-password"
                                placeholder="Confirm your password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="ring-foreground/15 border-transparent ring-1" />
                        </div>

                        {error && <p className="text-sm text-red-500">{error}</p>}

                        <Button
                            type="submit"
                            className="w-full text-white"
                            size="default"
                            style={{ backgroundColor: 'var(--color-primary)' }}>
                            Create Account
                        </Button>
                    </div>
                </div>

                <div className="px-6">
                    <p className="text-muted-foreground text-sm">
                        Already have an account?
                        <Button asChild variant="link" className="px-2" style={{ color: 'var(--color-primary)' }}>
                            <Link to="/login">Sign In</Link>
                        </Button>
                    </p>
                </div>
            </form>
        </section>
    )
}
