import { useState } from 'react'
import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Link } from 'react-router-dom'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '@/lib/firebase'

export default function ForgotPassword() {
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess(false)

        if (!email.trim()) {
            setError('Please enter your email address.')
            return
        }

        setIsLoading(true)
        try {
            await sendPasswordResetEmail(auth, email)
            setSuccess(true)
            setEmail('')
        } catch (err) {
            if (err.code === 'auth/user-not-found') {
                setError('No account found with this email address.')
            } else if (err.code === 'auth/invalid-email') {
                setError('Invalid email address.')
            } else {
                setError('Failed to send password reset email. Please try again.')
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
                            <span className="text-muted-foreground">Reset your password</span>
                        </h1>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Enter your email address and we'll send you a link to reset your password.
                        </p>
                    </div>

                    <div className="mt-6 space-y-6">
                        {success ? (
                            <div className="space-y-4">
                                <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                                    <p className="text-sm text-green-800">
                                        ✓ Password reset email sent! Check your inbox and follow the link to reset your password.
                                    </p>
                                </div>
                                <Button
                                    asChild
                                    className="w-full text-white"
                                    size="default"
                                    style={{ backgroundColor: 'var(--color-primary)' }}>
                                    <Link to="/login">Back to Sign In</Link>
                                </Button>
                            </div>
                        ) : (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="block text-sm">Email Address</Label>
                                    <Input
                                        type="email"
                                        required
                                        name="email"
                                        id="email"
                                        placeholder="Your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={isLoading}
                                        className="ring-foreground/15 border-transparent ring-1" />
                                </div>

                                {error && <p className="text-sm text-red-500">{error}</p>}

                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full text-white"
                                    size="default"
                                    style={{ backgroundColor: 'var(--color-primary)' }}>
                                    {isLoading ? 'Sending...' : 'Send Reset Link'}
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                <div className="px-6">
                    <p className="text-muted-foreground text-sm">
                        Remember your password?
                        <Button asChild variant="link" className="px-2" style={{ color: 'var(--color-primary)' }}>
                            <Link to="/login">Sign In</Link>
                        </Button>
                    </p>
                </div>
            </form>
        </section>
    )
}
