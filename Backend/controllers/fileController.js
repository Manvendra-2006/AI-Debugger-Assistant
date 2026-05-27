import agentLoop from "../agent/agent.js"
import unzipProject from "../utils/unzipProject.js"
import path from "path"
export async function fileController(req,resp){
    try{
        const {prompt} = req.body
        if(!prompt){
            return resp.status(400).json({message:"Prompt is not there"})
        }
        console.log("helllo")
        console.log(req.file)
        const extractPath =
      `extracted-projects/${req.file.filename}`

     await unzipProject(
         req.file.path,
         extractPath
      )
       const absolutePath = path.resolve(extractPath)
        console.log("Extract complete, path:", absolutePath)
     const aiResponse = await agentLoop(prompt,absolutePath)
     console.log("heeloooooo---------")
     console.log(aiResponse)
          console.log("heeloooooo---------")
      if(!aiResponse){
        return resp.status(400).json({message:"Ai is not respond anything"})
      }
     return resp.json({
         message:'ZIP extracted successfully',aiResponse
      })   
    }
    catch(error){
        console.log(error.message)
        return resp.status(500).json({message:"Internal Server Error",error})
    }
}