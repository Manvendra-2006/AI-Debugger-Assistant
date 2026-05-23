import fs from 'fs'
export const readFile = (filepath) =>{
    try{
        const fileContent = fs.readFileSync(filepath,'utf-8')
        return{
            content:[
                {
                    type:"text",
                    text:fileContent
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
// this tool is used to read a file 