import debugData from "../models/Debug.js"
import invokeGrokII from "../services/ai.service.js"
export default  async function debugController(req,resp){
try{
    const {code} = req.body
    if(!code){
        return resp.status(400).json({message:"Code not given"})
    }
    const debugCodeByAi = await invokeGrokII(code)
    if(!debugCodeByAi){
        return resp.status(400).json({message:"Code is not debug by ai"})
    }
    const debugDataReport = await debugData.create({
    IncorrectCode:code  ,   
      code : debugCodeByAi
    })
    return resp.status(201).json({message:"Code debug Successfully",debugDataReport})
}
catch(error){
    return resp.status(500).json({message:"Internal Server Error",error})
}
}