import { exec } from 'child_process'

export const runCommand = (command, workingDirectory) => {
    return new Promise((resolve) => {
        exec(command, {
            cwd: workingDirectory,
            timeout: 30000,
            encoding: 'utf-8',
            maxBuffer: 1024 * 1024,
            env: { ...process.env }
        }, (error, stdout, stderr) => {
            const output = [
                stdout && `STDOUT:\n${stdout}`,
                stderr && `STDERR:\n${stderr}`,
                error && `ERROR:\n${error.message}`
            ].filter(Boolean).join('\n\n')

            resolve({
                content: [{
                    type: 'text',
                    text: output || 'No output received'
                }]
            })
        })
    })
}