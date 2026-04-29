import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const Login = () => {
    const navigate = useNavigate()
    const { loading,handleLogin } = useAuth()
    const [formData, setformData] = useState({
        email: "",
        password: ""
    })
    function handleChange(e) {
        const { name, value } = e.target
        setformData((prev) => ({ ...prev, [name]: value }))
    }
    function handleSubmit(e) {
        e.preventDefault()
        handleLogin({
            email:formData.email,
            password:formData.password
        })
        navigate("/")
    }
    if(loading){
        return (
            <main><h1>Loading.......</h1></main>
        )
    }
    return (
        <div>
            <form action="" onSubmit={handleSubmit}>
                <label>Email</label>
                <input type="text" placeholder='Enter Email' id="email" name="email" onChange={handleChange} value={formData.email} />
                <br />
                <label htmlFor="">Password</label>
                <input type="password" placeholder='Enter Password' id="password" name='password' onChange={handleChange} value={formData.password} />
                <br />
                <button type='submit'>Login</button>
                <br />
                <a href="/signup">Register</a>
            </form>
        </div>
    )
}

export default Login