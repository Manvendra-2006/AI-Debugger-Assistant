import { useContext } from "react";
import { AuthContext } from "../state/auth.context";
import { DebugContext } from "../../DebugAI/state/debug.context";
import { login, logout, register } from "../services/auth.api";

export function useAuth() {
    const context = useContext(AuthContext)
    const { user, setuser, loading, setloading } = context
    const debugContext = useContext(DebugContext)
    const { resetDebugState } = debugContext || {}

    const clearAppStorage = () => {
        // Clear all app-related localStorage to avoid showing old user's data
        try {
            // Clear localStorage
            window.localStorage.removeItem('ai-debugger-state')
            window.localStorage.removeItem('debug-context')
            window.localStorage.removeItem('auth-token')
            
            // Clear sessionStorage
            window.sessionStorage.clear()
            
            // Reset debug context state
            if (resetDebugState) {
                resetDebugState()
            }
            
            console.log('✅ App storage cleared successfully')
        } catch (err) {
            console.error('Error clearing storage:', err)
        }
    }

    async function handleLogin({ email, password }) {
        setloading(true)
        try {
            // Clear old data before logging in new user
            clearAppStorage()
            
            const data = await login({ email, password })
            setuser(data.userExists)
            console.log(data.userExists)
        }
        catch (error) {
            console.log(error)
        }
        finally {
            setloading(false)
        }
    }

    async function handleRegister({ name, email, password }) {
        setloading(true)
        try {
            // Clear old data before creating new account
            clearAppStorage()
            
            const data = await register({ name, email, password })
            setuser(data.userData)
        }
        catch (error) {
            console.log(error)
        }
        finally {
            setloading(false)
        }
    }

    async function handleLogout() {
        setloading(true)
        try {
            const data = await logout()
            setuser(null)
            
            // Clear all app data on logout
            clearAppStorage()
        }
        catch (error) {
            console.log(error)
        }
        finally {
            setloading(false)
        }

    }

    return { user, handleLogin, handleLogout, handleRegister, loading }
}