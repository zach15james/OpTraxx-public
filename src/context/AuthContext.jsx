import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, signInWithPopup, setPersistence, browserLocalPersistence, createUserWithEmailAndPassword } from 'firebase/auth'
import { auth, db, googleProvider } from '@/lib/firebase'
import { doc, getDoc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore'

const AuthContext = createContext(null)

setPersistence(auth, browserLocalPersistence).catch(err => console.error('Persistence error:', err))

export function AuthProvider({ children }) {
    const [user, setUser] = useState(undefined)
    const [userProfile, setUserProfile] = useState(null)
    const [role, setRole] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let mounted = true
        let unsubProfile = null

        const unsubAuth = onAuthStateChanged(auth, async (firebaseUser) => {
            console.log('Auth state changed:', firebaseUser?.email)

            if (unsubProfile) {
                unsubProfile()
                unsubProfile = null
            }

            if (!mounted) return

            if (firebaseUser) {
                setUser(firebaseUser)
                setLoading(true)

                const userDocRef = doc(db, 'users', firebaseUser.uid)

                try {
                    const snap = await getDoc(userDocRef)
                    if (!snap.exists()) {
                        console.log('User doc not found, creating without role (first-time user)...')
                        await setDoc(userDocRef, {
                            name: firebaseUser.displayName || firebaseUser.email,
                            email: firebaseUser.email,
                            role: null,
                            teamId: null,
                            createdAt: serverTimestamp(),
                        })
                    }
                } catch (err) {
                    console.error('Error ensuring user doc:', err)
                }

                unsubProfile = onSnapshot(
                    userDocRef,
                    (snap) => {
                        if (!mounted) return
                        if (snap.exists()) {
                            const data = snap.data()
                            console.log('User profile updated:', data)
                            setUserProfile(data)
                            setRole(data.role)
                        } else {
                            setUserProfile(null)
                            setRole(null)
                        }
                        setLoading(false)
                    },
                    (err) => {
                        console.error('User profile snapshot error:', err)
                        setUserProfile(null)
                        setRole(null)
                        setLoading(false)
                    }
                )
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
            if (unsubProfile) unsubProfile()
            unsubAuth()
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

    const signUpWithEmail = async (email, password, name) => {
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password)
            const firebaseUser = result.user

            const newUserData = {
                name: name || firebaseUser.email,
                email: firebaseUser.email,
                role: null,
                teamId: null,
                createdAt: serverTimestamp(),
            }
            await setDoc(doc(db, 'users', firebaseUser.uid), newUserData)

            return firebaseUser
        } catch (error) {
            console.error('Error signing up:', error)
            throw error
        }
    }

    return (
        <AuthContext.Provider value={{ user, role, userProfile, loading, signInWithGoogle, signUpWithEmail }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}
