import { exec } from "child_process"

export default async function runCommand(
    command,
    workingDirectory
) {

    const blockedCommands = [
        "rm -rf",
        "sudo",
        "shutdown",
        "reboot",
        "mkfs"
    ]

    for (const blocked of blockedCommands) {

        if (
            command.includes(blocked)
        ) {

            return "Blocked dangerous command"
        }
    }

    return new Promise((resolve) => {

        exec(
            command,
            {
                cwd: workingDirectory,
                timeout: 20000
            },
            (error, stdout, stderr) => {

                if (error) {

                    resolve(
                        error.message
                    )

                    return
                }

                resolve(
                    stdout || stderr
                )
            }
        )
    })
}
