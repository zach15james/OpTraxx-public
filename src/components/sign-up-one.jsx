import { useState, useEffect } from 'react'
import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export default function SignUpOne() {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const { signUpWithEmail, user, role, loading } = useAuth()

    useEffect(() => {
        if (loading === false && user) {
            if (role === null) {
                navigate('/role-selection')
            } else if (role) {
                const redirectUrl = role === 'supervisor' ? '/dashboard/1' : '/tasks'
                navigate(redirectUrl)
            }
        }
    }, [user, role, loading, navigate])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (!firstName.trim() || !lastName.trim()) {
            setError('Full name is required.')
            return
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.')
            return
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters.')
            return
        }

        setIsLoading(true)
        try {
            const fullName = `${firstName} ${lastName}`
            await signUpWithEmail(email, password, fullName)
        } catch (err) {
            if (err.code === 'auth/email-already-in-use') {
                setError('An account with this email already exists.')
            } else if (err.code === 'auth/weak-password') {
                setError('Password must be at least 6 characters.')
            } else if (err.code === 'auth/invalid-email') {
                setError('Invalid email address.')
            } else {
                setError(err.message || 'Failed to create account.')
            }
            setIsLoading(false)
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
                            <div className="relative">
                                <Input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    name="password"
                                    id="password"
                                    placeholder="Create a password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="ring-foreground/15 border-transparent ring-1 pr-10" />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}>
                                    {showPassword ? '👁️' : '👁️‍🗨️'}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirm-password" className="block text-sm">Confirm Password</Label>
                            <div className="relative">
                                <Input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    required
                                    name="confirm-password"
                                    id="confirm-password"
                                    placeholder="Confirm your password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="ring-foreground/15 border-transparent ring-1 pr-10" />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}>
                                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                                </button>
                            </div>
                        </div>

                        {error && <p className="text-sm text-red-500">{error}</p>}

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full text-white"
                            size="default"
                            style={{ backgroundColor: 'var(--color-primary)' }}>
                            {isLoading ? 'Creating account...' : 'Create Account'}
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
