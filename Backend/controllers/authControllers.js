import User from "../models/User.js"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import blackList from "../models/blackList.js"
export async function SignUp(req,resp){
    try{
        const {name , email , password} = req.body
        if(!name||!email||!password){
            return resp.status(400).json({message:"All fields are required"})
        }
        const user = await User.findOne({email})
        if(user){
            return resp.status(404).json({message:"User is already exists"})
        }
        const hashPassword = await bcrypt.hash(password,10)
        if(!hashPassword){
            return resp.status(404).json({message:"Password is not hashed"})
        }
        const userData = await User.create({
            name,
            email,
            password:hashPassword
        })
        return resp.status(201).json({message:"User registered Successfully",userData})
    }
    catch(error){
        return resp.status(500).json({message:"Internal Server Error",error})
    }
}

export async function Login(req,resp){
    try{
        const {email,password} = req.body
        if(!email || !password){
            return resp.status(404).json({message:"All fields are required"})
        }
        const userExists = await User.findOne({email})
        if(!userExists){
            return resp.status(404).json({message:"User is not registered"})
        }
        const ishashPassword = await bcrypt.compare(password,userExists.password)
        if(!ishashPassword){
            return resp.status(404).json({message:"Password is not matched"})
        }
        const token = await jwt.sign(
            {id:userExists._id,name:userExists.name},
            process.env.JWT_TOKEN,
            {expiresIn:'7d'}
        )
        resp.cookie("token",token)
        return  resp.status(201).json({message:"Login Sucessfully",token,userExists})
    }
    catch(error){
        return resp.status(500).json({message:"Internal Server Error",error})
    }
}

export async function LogoutController(req,resp){
    try{
        const token = req.cookies.token
        if(!token){
            return resp.status(404).json({message:"token required"})
        }
        const blacklistData = await blackList.create({token})        
        if(blackListData){
            resp.clearCookie("token")
            return resp.status(500).json({message:"Token is blacklisted"})
        }
    }
    catch(error){
        return resp.status(505).json({message:"Internal Server Error",error})
    }
}

export async function getMe(req,resp){
    try{
        const userData = await User.findById(req.user.id)
        return resp.status(201).json({message:"Data is fetched Successfully",userData})
    }
    catch(error){
        return resp.status(500).json("Internal Server Error",error)
    }
}