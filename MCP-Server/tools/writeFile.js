import fs from 'fs'

export const writeFile = (filepath,content) => {
    try {

        fs.writeFileSync( //  ye code main new content ko update karega 
            filepath,content,'utf-8'
        )
        return {  // har tool ka return format structured response object hota hain 
            content:[
                {
                    type:'text', // ye tool textual format main response return karta hain 
                    text:
                    `File updated successfully`
                }
            ]
        }

    } catch(error){

        return {
            content:[
                {
                    type:'text',
                    text:error.message
                }
            ]
        }
    }
}

// This tool is used for writing updated code in a file 