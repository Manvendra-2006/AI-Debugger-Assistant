import blackList from "../models/blackList.js"
import jwt from 'jsonwebtoken'
export async  function authUser(req,resp,next){
    const token = req.cookies.token
    if(!token){
        return resp.status(404).json("Token not provided")
    }
    const blackListData = await blackList.findOne({token})
    if(blackListData){
        return resp.status(404).json("Token is invlaid")
    }
    try{
        const decoded = await jwt.verify(token,process.env.JWT_TOKEN)
        req.user = decoded
        next()
    }
    catch(error){
        return resp.status(505).json({message:"Internal Server Error",error})
    }
}