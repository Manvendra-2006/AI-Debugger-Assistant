import agentLoop from "../agent/agent.js"
import unzipProject from "../utils/unzipProject.js"
import path from "path"
import fs from 'fs'

export async function fileController(req, resp) {

    let extractPath = ""

    try {

        const { prompt } = req.body

        if (!prompt) {
            return resp.status(400).json({
                message: "Prompt is not there"
            })
        }

        if (!req.file) {
            return resp.status(400).json({
                message: "ZIP file is required"
            })
        }

        console.log("helllo")
        console.log(req.file)

        // current project folder
        extractPath = `extracted-projects/${req.file.filename}`

        // unzip project
        await unzipProject(
            req.file.path,
            extractPath
        )

        console.log(
            "Extracted Files:",
            fs.readdirSync(extractPath)
        )

        const absolutePath = path.resolve(extractPath)

        console.log(
            "Extract complete, path:",
            absolutePath
        )

        const aiResponse = await agentLoop(
            prompt,
            absolutePath
        )

        console.log("heeloooooo---------")
        console.log(aiResponse)
        console.log("heeloooooo---------")

        if (!aiResponse) {

            return resp.status(400).json({
                message: "AI did not respond anything"
            })
        }


        // delete ONLY current extracted project
        await fs.promises.rm(extractPath, {
            recursive: true,
            force: true
        })

        // delete ONLY uploaded zip
        await fs.promises.rm(req.file.path, {
            force: true
        })

        return resp.json({
            message: 'ZIP extracted successfully',
            aiResponse
        })

    } catch (error) {

        console.log(error.message)

    
        try {

            // delete ONLY current extracted project
            if (extractPath) {

                await fs.promises.rm(extractPath, {
                    recursive: true,
                    force: true
                })
            }

            // delete ONLY uploaded zip
            if (req?.file?.path) {

                await fs.promises.rm(req.file.path, {
                    force: true
                })
            }

        } catch (cleanupError) {

            console.log(
                "Cleanup Error:",
                cleanupError.message
            )
        }

        return resp.status(500).json({
            message: "Internal Server Error",
            error: error.message
        })
    }
}
