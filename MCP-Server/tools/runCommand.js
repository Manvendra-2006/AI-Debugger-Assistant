import { exec } from 'child_process'

export const runCommand = (command, workingDirectory) => {
    return new Promise((resolve) => {
        exec(command, {
            cwd: workingDirectory,
            timeout: 8000,
            encoding: 'utf-8',
            maxBuffer: 1024 * 512
        }, (error, stdout, stderr) => {
            
         
            const rawOutput = stdout || stderr || error?.message || 'No output'
            const filteredOutput = rawOutput
                .split('\n')
                .filter(line => !line.includes('node_modules'))
                .filter(line => !line.includes('package-lock.json'))
                .filter(line => !line.includes('.git'))
                .join('\n')

            resolve({
                content: [{
                    type: 'text',
                    text: filteredOutput
                }]
            })
        })
    })
}