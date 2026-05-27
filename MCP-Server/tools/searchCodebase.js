import fs from 'fs'
import path from 'path'

export const searchCodebase = (

    directoryPath,

    keyword

) => {

    const results = []

    function searchFiles(currentPath){

        const files =
        fs.readdirSync(currentPath)

        for(const file of files){

            const fullPath =
            path.join(currentPath, file)

            const stat =
            fs.statSync(fullPath)

            // If folder
            if(stat.isDirectory()){

                searchFiles(fullPath)
            }

            // If file
            else {

                const content =
                fs.readFileSync(
                    fullPath,
                    'utf-8'
                )

                if(
                    content.includes(keyword)
                ){

                    results.push(fullPath)
                }
            }
        }
    }

    try {

        searchFiles(directoryPath)

        return {
            content:[
                {
                    type:'text',
                    text:JSON.stringify(results)
                }
            ]
        }

    } catch(error){

        return {
            content:[
                {
                    type:'text',
                    text:`${error.message}`
                }
            ]
        }
    }
}