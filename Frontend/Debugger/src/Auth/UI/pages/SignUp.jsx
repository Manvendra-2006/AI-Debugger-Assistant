// import React, { useState, useEffect } from 'react'
// import { useNavigate, Link } from 'react-router-dom'
// import { useAuth } from '../../hooks/useAuth'
// import { toast } from 'react-toastify'
// import { useFirebase } from '../../../Firebase/FireBaseProvider'
// import api from '../../../../axios'

// const SignUp = () => {
//     console.log("render")
//     const navigate = useNavigate()
//      const { user, loading, handleRegister, handleGoogleLogin } = useAuth()
//     const firebase = useFirebase()
    
//     const [formData, setformData] = useState({
//         name: "",
//         email: "",
//         password: ""
//     })
//     const [error, setError] = useState('')
//     const [confirmPassword, setConfirmPassword] = useState('')

//     function handleChange(e) {
//         const { name, value } = e.target
//         setformData((prev) => ({ ...prev, [name]: value }))
//         if (error) setError('')
//     }

//     function handleConfirmPasswordChange(e) {
//         setConfirmPassword(e.target.value)
//         if (error) setError('')
//     }
//    const signupwithgoogle = async () => {
//     try {
//         const result = await firebase.googleAuth()

//         const user = result.user

//         const authenticatedUser = await handleGoogleLogin({
//             uid: user.uid,
//             name: user.displayName,
//             email: user.email,
//             photoURL: user.photoURL
//         })

//         if (!authenticatedUser) {
//             throw new Error('Google login did not return a valid user.')
//         }

//         toast.success("Google login successful")
//         navigate("/")
//     }
//     catch (error) {
//         console.log("Error occured", error)
//         toast.error("Google login failed")
//     }
// }
//     async function handleSubmit(e) {
//         e.preventDefault()
//         setError('')

//         if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
//             setError('Please fill in all fields')
//             return
//         }

//         if (formData.password !== confirmPassword) {
//             setError('Passwords do not match')
//             return
//         }

//         if (formData.password.length < 6) {
//             setError('Password must be at least 6 characters long')
//             return
//         }

//         try {
//             await handleRegister({
//                 name: formData.name,
//                 email: formData.email,
//                 password: formData.password
//             })
//             toast.success('Account created successfully! Please log in.')
//             navigate("/login")
//         } catch (err) {
//             setError('Registration failed. Please try again.')
//         }
//     }

//     useEffect(() => {
//         if (!loading && user) {
//             navigate('/')
//         }
//     }, [user, loading, navigate])

//     if (loading) {
//         return (
//             <div style={{
//                 minHeight: '100vh',
//                 background: 'linear-gradient(180deg, #0f172a 0%, #111827 55%, #15223c 100%)',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 color: '#f8fafc',
//                 fontFamily: 'Inter, system-ui, sans-serif'
//             }}>
//                 <div style={{ textAlign: 'center' }}>
//                     <div style={{
//                         width: 40,
//                         height: 40,
//                         border: '4px solid rgba(56, 189, 248, 0.3)',
//                         borderTop: '4px solid #38bdf8',
//                         borderRadius: '50%',
//                         animation: 'spin 1s linear infinite',
//                         margin: '0 auto 16px'
//                     }}></div>
//                     <h2 style={{ margin: 0, color: '#38bdf8' }}>Creating your account...</h2>
//                 </div>
//                 <style>{`
//                     @keyframes spin {
//                         0% { transform: rotate(0deg); }
//                         100% { transform: rotate(360deg); }
//                     }
//                 `}</style>
//             </div>
//         )
//     }

//     return (
//         <div style={{
//             minHeight: '100vh',
//             background: 'linear-gradient(180deg, #0f172a 0%, #111827 55%, #15223c 100%)',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             padding: '20px',
//             fontFamily: 'Inter, system-ui, sans-serif'
//         }}>
//             <div style={{
//                 background: 'rgba(30, 41, 59, 0.9)',
//                 border: '1px solid rgba(148, 163, 184, 0.18)',
//                 borderRadius: 24,
//                 padding: 40,
//                 width: '100%',
//                 maxWidth: 400,
//                 boxShadow: '0 20px 40px rgba(15, 23, 42, 0.25)',
//                 backdropFilter: 'blur(10px)'
//             }}>
//                 <div style={{ textAlign: 'center', marginBottom: 32 }}>
//                     <h1 style={{
//                         margin: '0 0 8px',
//                         color: '#f8fafc',
//                         fontSize: '2rem',
//                         fontWeight: 700
//                     }}>
//                         Create Account
//                     </h1>
//                     <p style={{
//                         margin: 0,
//                         color: '#94a3b8',
//                         fontSize: '1rem'
//                     }}>
//                         Join AI Debugger and start fixing code
//                     </p>
//                 </div>

//                 <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 20 }}>
//                     <div>
//                         <label style={{
//                             display: 'block',
//                             marginBottom: 8,
//                             color: '#cbd5e1',
//                             fontSize: '0.9rem',
//                             fontWeight: 600
//                         }}>
//                             Full Name
//                         </label>
//                         <input
//                             type="text"
//                             placeholder='Enter your full name'
//                             name="name"
//                             value={formData.name}
//                             onChange={handleChange}
//                             style={{
//                                 width: '100%',
//                                 padding: '14px 16px',
//                                 borderRadius: 12,
//                                 border: '1px solid rgba(148, 163, 184, 0.2)',
//                                 background: '#020617',
//                                 color: '#f8fafc',
//                                 fontSize: '1rem',
//                                 outline: 'none',
//                                 transition: 'border-color 0.2s',
//                                 boxSizing: 'border-box'
//                             }}
//                             onFocus={(e) => e.target.style.borderColor = '#38bdf8'}
//                             onBlur={(e) => e.target.style.borderColor = 'rgba(148, 163, 184, 0.2)'}
//                         />
//                     </div>

//                     <div>
//                         <label style={{
//                             display: 'block',
//                             marginBottom: 8,
//                             color: '#cbd5e1',
//                             fontSize: '0.9rem',
//                             fontWeight: 600
//                         }}>
//                             Email Address
//                         </label>
//                         <input
//                             type="email"
//                             placeholder='Enter your email'
//                             name='email'
//                             value={formData.email}
//                             onChange={handleChange}
//                             style={{
//                                 width: '100%',
//                                 padding: '14px 16px',
//                                 borderRadius: 12,
//                                 border: '1px solid rgba(148, 163, 184, 0.2)',
//                                 background: '#020617',
//                                 color: '#f8fafc',
//                                 fontSize: '1rem',
//                                 outline: 'none',
//                                 transition: 'border-color 0.2s',
//                                 boxSizing: 'border-box'
//                             }}
//                             onFocus={(e) => e.target.style.borderColor = '#38bdf8'}
//                             onBlur={(e) => e.target.style.borderColor = 'rgba(148, 163, 184, 0.2)'}
//                         />
//                     </div>

//                     <div>
//                         <label style={{
//                             display: 'block',
//                             marginBottom: 8,
//                             color: '#cbd5e1',
//                             fontSize: '0.9rem',
//                             fontWeight: 600
//                         }}>
//                             Password
//                         </label>
//                         <input
//                             type='password'
//                             placeholder='Create a password (min 6 characters)'
//                             name='password'
//                             value={formData.password}
//                             onChange={handleChange}
//                             style={{
//                                 width: '100%',
//                                 padding: '14px 16px',
//                                 borderRadius: 12,
//                                 border: '1px solid rgba(148, 163, 184, 0.2)',
//                                 background: '#020617',
//                                 color: '#f8fafc',
//                                 fontSize: '1rem',
//                                 outline: 'none',
//                                 transition: 'border-color 0.2s',
//                                 boxSizing: 'border-box'
//                             }}
//                             onFocus={(e) => e.target.style.borderColor = '#38bdf8'}
//                             onBlur={(e) => e.target.style.borderColor = 'rgba(148, 163, 184, 0.2)'}
//                         />
//                     </div>

//                     <div>
//                         <label style={{
//                             display: 'block',
//                             marginBottom: 8,
//                             color: '#cbd5e1',
//                             fontSize: '0.9rem',
//                             fontWeight: 600
//                         }}>
//                             Confirm Password
//                         </label>
//                         <input
//                             type='password'
//                             placeholder='Confirm your password'
//                             value={confirmPassword}
//                             onChange={handleConfirmPasswordChange}
//                             style={{
//                                 width: '100%',
//                                 padding: '14px 16px',
//                                 borderRadius: 12,
//                                 border: '1px solid rgba(148, 163, 184, 0.2)',
//                                 background: '#020617',
//                                 color: '#f8fafc',
//                                 fontSize: '1rem',
//                                 outline: 'none',
//                                 transition: 'border-color 0.2s',
//                                 boxSizing: 'border-box'
//                             }}
//                             onFocus={(e) => e.target.style.borderColor = '#38bdf8'}
//                             onBlur={(e) => e.target.style.borderColor = 'rgba(148, 163, 184, 0.2)'}
//                         />
//                     </div>

//                     {error && (
//                         <div style={{
//                             padding: '12px 16px',
//                             background: 'rgba(248, 113, 113, 0.1)',
//                             border: '1px solid rgba(248, 113, 113, 0.2)',
//                             borderRadius: 8,
//                             color: '#f87171',
//                             fontSize: '0.9rem'
//                         }}>
//                             {error}
//                         </div>
//                     )}

//                     <button
//                         type='submit'
//                         disabled={loading}
//                         style={{
//                             padding: '14px 24px',
//                             borderRadius: 12,
//                             border: 'none',
//                             background: 'linear-gradient(135deg, #38bdf8, #8b5cf6)',
//                             color: '#0f172a',
//                             fontSize: '1rem',
//                             fontWeight: 700,
//                             cursor: loading ? 'not-allowed' : 'pointer',
//                             transition: 'transform 0.2s, box-shadow 0.2s',
//                             boxShadow: '0 4px 12px rgba(56, 189, 248, 0.3)',
//                             marginTop: 8
//                         }}
//                         onMouseEnter={(e) => {
//                             if (!loading) {
//                                 e.target.style.transform = 'translateY(-2px)'
//                                 e.target.style.boxShadow = '0 8px 20px rgba(56, 189, 248, 0.4)'
//                             }
//                         }}
//                         onMouseLeave={(e) => {
//                             e.target.style.transform = 'translateY(0)'
//                             e.target.style.boxShadow = '0 4px 12px rgba(56, 189, 248, 0.3)'
//                         }}
//                     >
//                         {loading ? 'Creating Account...' : 'Create Account'}
//                     </button>
// <button
//   type="button"
//   onClick={signupwithgoogle}
//   style={{
//     width: "100%",
//     padding: "14px 24px",
//     borderRadius: 12,
//     border: "1px solid white",
//     background: "#fff",
//     color: "#111827",
//     fontSize: "1rem",
//     fontWeight: 700,
//     cursor: "pointer"
//   }}
// >
//   Sign up with Google
// </button>
//                 </form>

//                 <div style={{
//                     textAlign: 'center',
//                     marginTop: 24,
//                     paddingTop: 24,
//                     borderTop: '1px solid rgba(148, 163, 184, 0.1)'
//                 }}>
//                     <p style={{
//                         margin: 0,
//                         color: '#94a3b8',
//                         fontSize: '0.9rem'
//                     }}>
//                         Already have an account?{' '}
//                         <Link
//                             to="/login"
//                             style={{
//                                 color: '#38bdf8',
//                                 textDecoration: 'none',
//                                 fontWeight: 600,
//                                 transition: 'color 0.2s'
//                             }}
//                             onMouseEnter={(e) => e.target.style.color = '#7dd3fc'}
//                             onMouseLeave={(e) => e.target.style.color = '#38bdf8'}
//                         >
//                             Sign in here
//                         </Link>
                       
//                     </p>

//                 </div>
//             </div>
//         </div>
//     )
// }

// export default SignUp
import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { toast } from 'react-toastify'
import { useFirebase } from '../../../Firebase/FireBaseProvider'
import api from '../../../../axios'

const SignUp = () => {
    console.log("render")
    const navigate = useNavigate()
    const { user, loading, handleRegister, handleGoogleLogin } = useAuth()
    const firebase = useFirebase()

    const [formData, setformData] = useState({
        name: "",
        email: "",
        password: ""
    })
    const [error, setError] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    function handleChange(e) {
        const { name, value } = e.target
        setformData((prev) => ({ ...prev, [name]: value }))
        if (error) setError('')
    }

    function handleConfirmPasswordChange(e) {
        setConfirmPassword(e.target.value)
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

        if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
            setError('Please fill in all fields')
            return
        }

        if (formData.password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long')
            return
        }

        try {
            await handleRegister({
                name: formData.name,
                email: formData.email,
                password: formData.password
            })
            toast.success('Account created successfully! Please log in.')
            navigate("/login")
        } catch (err) {
            setError('Registration failed. Please try again.')
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
                    <p className="text-sky-400 font-semibold text-lg tracking-wide">Creating your account...</p>
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
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM4 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 10.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">Create Account</h1>
                        <p className="text-slate-400 text-sm mt-1">Join AI Debugger and start fixing code</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Full Name */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                                Full Name
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
                                    <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                    </svg>
                                </span>
                                <input
                                    type="text"
                                    placeholder="Enter your full name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/70 border border-slate-700/60 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/40 transition-all duration-200"
                                />
                            </div>
                        </div>

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
                                    placeholder="Create a password (min 6 characters)"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/70 border border-slate-700/60 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/40 transition-all duration-200"
                                />
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
                                    <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                                    </svg>
                                </span>
                                <input
                                    type="password"
                                    placeholder="Confirm your password"
                                    value={confirmPassword}
                                    onChange={handleConfirmPasswordChange}
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

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-xl font-bold text-sm text-slate-900 bg-gradient-to-r from-sky-400 to-violet-500 hover:from-sky-300 hover:to-violet-400 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-sky-500/20 disabled:opacity-60 disabled:cursor-not-allowed mt-2 tracking-wide"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                                    Creating Account...
                                </span>
                            ) : (
                                'Create Account'
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
                            Sign up with Google
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-7 pt-6 border-t border-slate-700/40 text-center">
                        <p className="text-slate-500 text-sm">
                            Already have an account?{' '}
                            <Link
                                to="/login"
                                className="text-sky-400 hover:text-sky-300 font-semibold transition-colors duration-200"
                            >
                                Sign in here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignUp