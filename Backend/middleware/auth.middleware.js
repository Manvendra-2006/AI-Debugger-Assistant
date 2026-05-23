import blackList from "../models/blackList.js"
import jwt from 'jsonwebtoken'
export async  function authUser(req,resp,next){
    // Support token from cookie OR Authorization header (Bearer <token>)
    let token = req.cookies?.token
    if(!token){
        const authHeader = req.headers?.authorization || ''
        if(authHeader.startsWith('Bearer ')){
            token = authHeader.split(' ')[1]
        }
    }

    if(!token){
        return resp.status(401).json({message:"Token not provided"})
    }

    const blackListData = await blackList.findOne({token})
    if(blackListData){
        return resp.status(401).json({message:"Token is invalid"})
    }
    try{
        const decoded = await jwt.verify(token,process.env.JWT_TOKEN)
        req.user = decoded
        next()
    }
    catch(error){
        return resp.status(500).json({message:"Internal Server Error",error})
    }
}