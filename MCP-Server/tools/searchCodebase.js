import fs from 'fs'
import path from 'path'

// ✅ Yeh folders kabhi search mat karo
const IGNORE_FOLDERS = ['node_modules', '.git', 'dist', 'build', '.next', '.cache']

export const searchCodebase = (directoryPath, keyword) => {
    const results = []
    
    function searchFiles(currentPath) {
        const files = fs.readdirSync(currentPath)
        
        for (const file of files) {
            // ✅ Yeh check add karo - ignored folders skip karo
            if (IGNORE_FOLDERS.includes(file)) continue
            
            const fullPath = path.join(currentPath, file)
            const stat = fs.statSync(fullPath)
            
            if (stat.isDirectory()) {
                searchFiles(fullPath)
            } else {
                try {
                    const content = fs.readFileSync(fullPath, 'utf-8')
                    if (content.includes(keyword)) {
                        results.push(fullPath)
                    }
                } catch (e) {
                    // binary files skip ho jayengi
                }
            }
        }
    }
    
    try {
        searchFiles(directoryPath)
        return {
            content: [{
                type: 'text',
                text: JSON.stringify(results)
            }]
        }
    } catch (error) {
        return {
            content: [{
                type: 'text',
                text: error.message
            }]
        }
    }
}