import { createContext, useEffect, useState } from "react"
import { getMe } from "../services/auth.api"
export const AuthContext = createContext()
export function AuthProvider({ children }) {
    const [user, setuser] = useState(() => {
        try {
            const storedUser = window.localStorage.getItem('auth-user')
            return storedUser ? JSON.parse(storedUser) : null
        } catch (error) {
            return null
        }
    })
    const [loading, setloading] = useState(true)
    useEffect(() => {
        async function getAndsetUser() {
            try {
                const data = await getMe()
                const freshUser = data?.userData || null
                setuser(freshUser)
                if (freshUser) {
                    window.localStorage.setItem('auth-user', JSON.stringify(freshUser))
                }
            } catch (error) {
                // Keep local user if token request fails temporarily.
                const hasToken = !!window.localStorage.getItem('auth-token')
                if (!hasToken) {
                    setuser(null)
                    window.localStorage.removeItem('auth-user')
                }
            } finally {
                setloading(false)
            }
        }
        
        getAndsetUser()
    }, [])

    return (
        <AuthContext.Provider value={{ user, setuser, loading, setloading }}>
            {children}
        </AuthContext.Provider>
    )
}