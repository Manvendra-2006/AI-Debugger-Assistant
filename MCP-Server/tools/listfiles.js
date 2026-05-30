import fs from 'fs'

export const listfiles = (directorypath) => {
    try {
        const files = fs.readdirSync(directorypath)
        
        // ✅ YEH FILTER ADD KAR
        const filteredFiles = files.filter(file => 
            !['node_modules', 'package-lock.json', '.git', 'dist', 'build'].includes(file)
        )

        return {
            content: [{
                type: "text",
                text: JSON.stringify(filteredFiles)
            }]
        }
    }
    catch (error) {
        return {
            content: [{
                type: "text",
                text: `${error.message}`
            }]
        }
    }
}