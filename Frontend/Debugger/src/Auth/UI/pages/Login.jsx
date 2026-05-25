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
    }
    catch (error) {
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
            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(180deg, #0f172a 0%, #111827 55%, #15223c 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#f8fafc',
                fontFamily: 'Inter, system-ui, sans-serif'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        width: 40,
                        height: 40,
                        border: '4px solid rgba(56, 189, 248, 0.3)',
                        borderTop: '4px solid #38bdf8',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 16px'
                    }}></div>
                    <h2 style={{ margin: 0, color: '#38bdf8' }}>Signing you in...</h2>
                </div>
                <style>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        )
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(180deg, #0f172a 0%, #111827 55%, #15223c 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            fontFamily: 'Inter, system-ui, sans-serif'
        }}>
            <div style={{
                background: 'rgba(30, 41, 59, 0.9)',
                border: '1px solid rgba(148, 163, 184, 0.18)',
                borderRadius: 24,
                padding: 40,
                width: '100%',
                maxWidth: 400,
                boxShadow: '0 20px 40px rgba(15, 23, 42, 0.25)',
                backdropFilter: 'blur(10px)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <h1 style={{
                        margin: '0 0 8px',
                        color: '#f8fafc',
                        fontSize: '2rem',
                        fontWeight: 700
                    }}>
                        Welcome Back
                    </h1>
                    <p style={{
                        margin: 0,
                        color: '#94a3b8',
                        fontSize: '1rem'
                    }}>
                        Sign in to your AI Debugger account
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 20 }}>
                    <div>
                        <label style={{
                            display: 'block',
                            marginBottom: 8,
                            color: '#cbd5e1',
                            fontSize: '0.9rem',
                            fontWeight: 600
                        }}>
                            Email Address
                        </label>
                        <input
                            type="email"
                            placeholder='Enter your email'
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '14px 16px',
                                borderRadius: 12,
                                border: '1px solid rgba(148, 163, 184, 0.2)',
                                background: '#020617',
                                color: '#f8fafc',
                                fontSize: '1rem',
                                outline: 'none',
                                transition: 'border-color 0.2s',
                                boxSizing: 'border-box'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#38bdf8'}
                            onBlur={(e) => e.target.style.borderColor = 'rgba(148, 163, 184, 0.2)'}
                        />
                    </div>

                    <div>
                        <label style={{
                            display: 'block',
                            marginBottom: 8,
                            color: '#cbd5e1',
                            fontSize: '0.9rem',
                            fontWeight: 600
                        }}>
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder='Enter your password'
                            name='password'
                            value={formData.password}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '14px 16px',
                                borderRadius: 12,
                                border: '1px solid rgba(148, 163, 184, 0.2)',
                                background: '#020617',
                                color: '#f8fafc',
                                fontSize: '1rem',
                                outline: 'none',
                                transition: 'border-color 0.2s',
                                boxSizing: 'border-box'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#38bdf8'}
                            onBlur={(e) => e.target.style.borderColor = 'rgba(148, 163, 184, 0.2)'}
                        />
                    </div>

                    {error && (
                        <div style={{
                            padding: '12px 16px',
                            background: 'rgba(248, 113, 113, 0.1)',
                            border: '1px solid rgba(248, 113, 113, 0.2)',
                            borderRadius: 8,
                            color: '#f87171',
                            fontSize: '0.9rem'
                        }}>
                            {error}
                        </div>
                    )}

                    <button
                        type='submit'
                        disabled={loading}
                        style={{
                            padding: '14px 24px',
                            borderRadius: 12,
                            border: 'none',
                            background: 'linear-gradient(135deg, #38bdf8, #8b5cf6)',
                            color: '#0f172a',
                            fontSize: '1rem',
                            fontWeight: 700,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            boxShadow: '0 4px 12px rgba(56, 189, 248, 0.3)',
                            marginTop: 8
                        }}
                        onMouseEnter={(e) => {
                            if (!loading) {
                                e.target.style.transform = 'translateY(-2px)'
                                e.target.style.boxShadow = '0 8px 20px rgba(56, 189, 248, 0.4)'
                            }
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)'
                            e.target.style.boxShadow = '0 4px 12px rgba(56, 189, 248, 0.3)'
                        }}
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                    <button
  type="button"
  onClick={signupwithgoogle}
  style={{
    width: "100%",
    padding: "14px 24px",
    borderRadius: 12,
    border: "1px solid white",
    background: "#fff",
    color: "#111827",
    fontSize: "1rem",
    fontWeight: 700,
    cursor: "pointer"
  }}
>
  Sign in with Google
</button>
                </form>

                <div style={{
                    textAlign: 'center',
                    marginTop: 24,
                    paddingTop: 24,
                    borderTop: '1px solid rgba(148, 163, 184, 0.1)'
                }}>
                    <p style={{
                        margin: 0,
                        color: '#94a3b8',
                        fontSize: '0.9rem'
                    }}>
                        Don't have an account?{' '}
                        <Link
                            to="/signup"
                            style={{
                                color: '#38bdf8',
                                textDecoration: 'none',
                                fontWeight: 600,
                                transition: 'color 0.2s'
                            }}
                            onMouseEnter={(e) => e.target.style.color = '#7dd3fc'}
                            onMouseLeave={(e) => e.target.style.color = '#38bdf8'}
                        >
                            Sign up here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login