import { exec } from 'child_process'

export const runCommand = (command, workingDirectory) => {
    return new Promise((resolve) => {
        exec(command, {
            cwd: workingDirectory,
            timeout: 8000,           // ✅ 8 second mein band
            encoding: 'utf-8',
            maxBuffer: 1024 * 512    // ✅ 512KB output limit
        }, (error, stdout, stderr) => {
            resolve({
                content: [{
                    type: 'text',
                    text: stdout || stderr || error?.message || 'No output'
                }]
            })
        })
    })
}