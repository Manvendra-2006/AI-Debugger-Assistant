import fs from 'fs'

export const writeFile = (

    filepath,

    content

) => {

    try {

        fs.writeFileSync(
            filepath,
            content,
            'utf-8'
        )

        return {
            content:[
                {
                    type:'text',
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