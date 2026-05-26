import fs from 'fs'
import path from 'path'
const IGNORE_FOLDERS = [
    'node_modules',
    '.git',
    'dist',
    'build',
    '.next',
    '.cache'
]
const IGNORE_EXTENSIONS = [
    '.png',
    '.jpg',
    '.jpeg',
    '.gif',
    '.webp',
    '.mp4',
    '.zip',
    '.exe',
    '.pdf'
]

export const searchCodebase = (directoryPath, keyword) => {
    const results = []
    function searchFiles(currentPath) {
        if (!fs.existsSync(currentPath)) return
        const files = fs.readdirSync(currentPath)
        for (const file of files) {
            if (IGNORE_FOLDERS.includes(file)) continue
            const fullPath = path.join(currentPath, file)
            let stat
            try {
                stat = fs.statSync(fullPath)
            } catch {
                continue
            }
            if (stat.isDirectory()) {
                searchFiles(fullPath)
            } else {
                const ext = path.extname(fullPath).toLowerCase()
                if (IGNORE_EXTENSIONS.includes(ext)) continue
                try {
                    if (stat.size > 1024 * 1024) continue
                    const content = fs.readFileSync(fullPath, 'utf-8')
                    if (content.includes(keyword)) {
                        results.push(fullPath)
                        if (results.length >= 20) break
                    }
                } catch (e) {
                }
            }
        }
    }
    try {
        searchFiles(directoryPath)
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(results.slice(0, 20))
                }
            ]
        }

    } catch (error) {

        return {
            content: [
                {
                    type: 'text',
                    text: error.message
                }
            ]
        }
    }
}
