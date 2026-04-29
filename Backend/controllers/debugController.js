export async function debugController(req,resp){
    try{
        const {code} = req.body
        if(!code){
            return resp.status(404).json({message:"Code is required"})
        }
        
    }
    catch(error){
        return resp.status(500).json({message:"Error Ocuured",error})
    }
}