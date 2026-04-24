import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, signInWithPopup, setPersistence, browserLocalPersistence } from 'firebase/auth'
import { auth, db, googleProvider } from '@/lib/firebase'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'

const AuthContext = createContext(null)

setPersistence(auth, browserLocalPersistence).catch(err => console.error('Persistence error:', err))

export function AuthProvider({ children }) {
    const [user, setUser] = useState(undefined)
    const [userProfile, setUserProfile] = useState(null)
    const [role, setRole] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let mounted = true

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            console.log('Auth state changed:', firebaseUser?.email)
            if (!mounted) return

            if (firebaseUser) {
                setUser(firebaseUser)
                setLoading(true)

                try {
                    const userDocRef = doc(db, 'users', firebaseUser.uid)
                    const userDocSnap = await getDoc(userDocRef)

                    if (userDocSnap.exists()) {
                        const userData = userDocSnap.data()
                        console.log('User doc found:', userData)
                        setUserProfile(userData)
                        setRole(userData.role)
                    } else {
                        console.log('User doc not found, creating...')
                        const newUserData = {
                            name: firebaseUser.displayName || firebaseUser.email,
                            email: firebaseUser.email,
                            role: 'employee',
                            teamId: null,
                            createdAt: serverTimestamp(),
                        }
                        await setDoc(userDocRef, newUserData)
                        setUserProfile(newUserData)
                        setRole('employee')
                    }
                } catch (error) {
                    console.error('Error fetching user profile:', error)
                    setUserProfile(null)
                    setRole(null)
                } finally {
                    setLoading(false)
                }
            } else {
                console.log('User signed out')
                setUser(null)
                setUserProfile(null)
                setRole(null)
                setLoading(false)
            }
        })

        return () => {
            mounted = false
            unsubscribe()
        }
    }, [])

    const signInWithGoogle = async () => {
        console.log('signInWithGoogle called, opening popup...')
        try {
            console.log('Calling signInWithPopup...')
            const result = await signInWithPopup(auth, googleProvider)
            console.log('Google sign-in successful:', result.user.email)
            return result.user
        } catch (error) {
            console.error('Error signing in with Google:', error)
            console.error('Error code:', error.code)
            console.error('Error message:', error.message)
            throw error
        }
    }

    return (
        <AuthContext.Provider value={{ user, role, userProfile, loading, signInWithGoogle }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}
