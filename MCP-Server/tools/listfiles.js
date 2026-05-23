import fs from 'fs'
export const listfiles = (directorypath) =>{
    try{
        const files = fs.readdirSync(directorypath) // it return array 
        return {
            content:[
                {
                    type:"text",
                    text:JSON.stringify(files)
                }
            ]
        }

    }
    catch(error){
        return{
            content:[
                {
                    type:"text",
                    text:`${error.message}`
                }
            ]
        }
    }
}
// This tool collect all files and folders names and send it to the AI 