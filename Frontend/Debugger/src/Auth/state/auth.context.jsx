import { createContext, useEffect, useState } from "react"
import { getMe } from "../services/auth.api"
export const AuthContext = createContext()
export function AuthProvider({ children }) {
    const [user, setuser] = useState(null)
    const [loading, setloading] = useState(true)
    useEffect(() => {
        async function getAndsetUser() {
            try {
                const data = await getMe()
                setuser(data?.userData || null)
                console.log(data.userData)
            } catch (error) {
                setuser(null)
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