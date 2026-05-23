import React, { useContext } from 'react'
import { AuthContext } from '../services/auth.context'
import { login, logout, register } from '../services/auth.api'

export const useAuth = () => {
    const context = useContext(AuthContext)
    const { User, setUser, loading, setloading } = context
    async function handleLogin({ email, password }) {
        setloading(true)
        try {
            const data = await login({ email, password })
            setUser(data.user)
        }
        catch (error) {
            console.log(error)
        } finally {
            setloading(false)
        }
    }
    async function handleRegister({ name, email, password }) {
        setloading(true)
        try {
            const data = await register({ name, email, password })
            setUser(data.user)
        }
        catch (error) {
            console.log(error)
        }
        finally {
            setloading(false)
        }


    }
    async function handleLogOut() {
        setloading(true)
        try {
            const data = await logout()
            setUser(null)
        }
        catch (error) {
            console.log(error)
        }
        finally {
            setloading(false)
        }

    }
    return { User, loading, handleRegister, handleLogOut, handleLogin }
}

