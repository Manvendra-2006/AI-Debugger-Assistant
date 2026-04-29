import React, { useState } from 'react'

import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const SignUp = () => {
    const navigate = useNavigate()
    const {loading,handleRegister} = useAuth()
    const [formData, setformData] = useState({
        name: "",
        email: "",
        password: ""
    })
    function handleChange(e) {
        const { name, value } = e.target
        setformData((prev) => ({ ...prev, [name]: value }))
    }
    function handleSubmit(e) {
        e.preventDefault()
        handleRegister({
            name:formData.name,
            email:formData.email,
            password:formData.password
        })
        navigate("/login")
    }
    if(loading){
        return(
            <main><h1>Loading.....</h1></main>
        )
    }
    return (
        <div>
            <form action="" onSubmit={handleSubmit}>
                <label>Name</label>
                <input type="text" name="name" id="name" onChange={handleChange} value={formData.name} />
                <br />
                <label>Email</label>
                <input type='text' name='email' id="email" onChange={handleChange} value={formData.email} />
                <br />
                <label htmlFor="">Password</label>
                <input type='password' name='password' id="password" onChange={handleChange} value={formData.password} />
                <br />
                <button type='submit'>SignUp</button>
            </form>
        </div>
    )
}

export default SignUp