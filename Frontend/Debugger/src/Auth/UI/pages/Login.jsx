import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { toast } from 'react-toastify'
import { useFirebase } from '../../../Firebase/FireBaseProvider'

const Login = () => {
    const navigate = useNavigate()
    const { user, loading, handleLogin, handleGoogleLogin } = useAuth()
    const firebase = useFirebase()
    const [formData, setformData] = useState({
        email: "",
        password: ""
    })
    const [error, setError] = useState('')

    function handleChange(e) {
        const { name, value } = e.target
        setformData((prev) => ({ ...prev, [name]: value }))
        if (error) setError('')
    }

    const signupwithgoogle = async () => {
        try {
            const result = await firebase.googleAuth()
            const user = result.user
            const authenticatedUser = await handleGoogleLogin({
                uid: user.uid,
                name: user.displayName,
                email: user.email,
                photoURL: user.photoURL
            })
            if (!authenticatedUser) {
                throw new Error('Google login did not return a valid user.')
            }
            toast.success("Google login successful")
            navigate("/")
        } catch (error) {
            console.log("Error occured", error)
            toast.error("Google login failed")
        }
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setError('')
        if (!formData.email.trim() || !formData.password.trim()) {
            setError('Please fill in all fields')
            return
        }
        try {
            await handleLogin({
                email: formData.email,
                password: formData.password
            })
            toast.success('Welcome back! You are now logged in.')
            navigate("/")
        } catch (err) {
            setError('Login failed. Please check your credentials.')
        }
    }

    useEffect(() => {
        if (!loading && user) {
            navigate('/')
        }
    }, [user, loading, navigate])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#020617]">
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-sky-400/30 border-t-sky-400 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-sky-400 font-semibold text-lg tracking-wide">Signing you in...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center px-4 py-12 relative overflow-hidden">

            {/* Background glow blobs */}
            <div className="absolute top-[-120px] left-[-80px] w-[420px] h-[420px] bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-[-100px] right-[-60px] w-[380px] h-[380px] bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative w-full max-w-md">

                {/* Top accent line */}
                <div className="h-[3px] w-full rounded-t-2xl bg-gradient-to-r from-sky-400 via-violet-500 to-fuchsia-500" />

                <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 border-t-0 rounded-b-2xl px-8 py-10 shadow-2xl shadow-black/50">

                    {/* Header */}
                    <div className="mb-8 text-center">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500/20 to-violet-600/20 border border-sky-500/20 mb-4">
                            <svg className="w-7 h-7 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">Welcome Back</h1>
                        <p className="text-slate-400 text-sm mt-1">Sign in to your AI Debugger account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Email */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
                                    <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                                    </svg>
                                </span>
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/70 border border-slate-700/60 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/40 transition-all duration-200"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
                                    <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                                    </svg>
                                </span>
                                <input
                                    type="password"
                                    placeholder="Enter your password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/70 border border-slate-700/60 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/40 transition-all duration-200"
                                />
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20">
                                <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                                </svg>
                                <span className="text-red-400 text-sm">{error}</span>
                            </div>
                        )}

                        {/* Sign In Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-xl font-bold text-sm text-slate-900 bg-gradient-to-r from-sky-400 to-violet-500 hover:from-sky-300 hover:to-violet-400 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-sky-500/20 disabled:opacity-60 disabled:cursor-not-allowed mt-2 tracking-wide"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                                    Signing In...
                                </span>
                            ) : (
                                'Sign In'
                            )}
                        </button>

                        {/* Divider */}
                        <div className="flex items-center gap-3">
                            <div className="flex-1 h-px bg-slate-700/60" />
                            <span className="text-xs text-slate-500 font-medium">or continue with</span>
                            <div className="flex-1 h-px bg-slate-700/60" />
                        </div>

                        {/* Google Button */}
                        <button
                            type="button"
                            onClick={signupwithgoogle}
                            className="w-full py-3 rounded-xl font-semibold text-sm text-slate-800 bg-white hover:bg-slate-100 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2.5 shadow-md"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Sign in with Google
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-7 pt-6 border-t border-slate-700/40 text-center">
                        <p className="text-slate-500 text-sm">
                            Don't have an account?{' '}
                            <Link
                                to="/signup"
                                className="text-sky-400 hover:text-sky-300 font-semibold transition-colors duration-200"
                            >
                                Sign up here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login