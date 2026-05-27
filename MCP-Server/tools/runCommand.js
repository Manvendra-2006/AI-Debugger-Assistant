import { execSync }
from 'child_process'

export const runCommand = (

    command,

    workingDirectory

) => {

    try {

        const output = execSync(

            command,

            {
                cwd: workingDirectory,
                encoding:'utf-8'
            }
        )

        return {
            content:[
                {
                    type:'text',
                    text:output
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