import { useContext } from "react";
import { AuthContext } from "../state/auth.context";
import { login, logout, register } from "../services/auth.api";

export function useAuth() {
    const context = useContext(AuthContext)
    const { user, setuser, loading, setloading } = context

    async function handleLogin({ email, password }) {
        setloading(true)
        try {
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