import express from "express"

import {
    McpServer
} from "@modelcontextprotocol/sdk/server/mcp.js"

import {
    SSEServerTransport
} from "@modelcontextprotocol/sdk/server/sse.js"

import { z } from "zod"

import listFiles
from "./tools/listFiles.js"

import readFile
from "./tools/readFile.js"

import writeFile
from "./tools/writeFile.js"

import searchCodebase
from "./tools/searchCodebase.js"

import runCommand
from "./tools/runCommand.js"

import analyzeLogs
from "./tools/analyzeLogs.js"



const app = express()



const server = new McpServer({
    name: "debug-mcp-server",
    version: "1.0.0"
})



server.tool(
    "listfiles",
    "List files and folders",
    {
        directorypath: z.string()
    },
    async ({ directorypath }) => ({
        content: [
            {
                type: "text",
                text: await listFiles(
                    directorypath
                )
            }
        ]
    })
)



server.tool(
    "readFile",
    "Read file content",
    {
        filepath: z.string()
    },
    async ({ filepath }) => ({
        content: [
            {
                type: "text",
                text: await readFile(
                    filepath
                )
            }
        ]
    })
)



server.tool(
    "writeFile",
    "Write/update file",
    {
        filepath: z.string(),
        content: z.string()
    },
    async ({
        filepath,
        content
    }) => ({
        content: [
            {
                type: "text",
                text: await writeFile(
                    filepath,
                    content
                )
            }
        ]
    })
)



server.tool(
    "searchCodebase",
    "Search keyword in project",
    {
        directoryPath: z.string(),
        keyword: z.string()
    },
    async ({
        directoryPath,
        keyword
    }) => ({
        content: [
            {
                type: "text",
                text:
                    await searchCodebase(
                        directoryPath,
                        keyword
                    )
            }
        ]
    })
)



server.tool(
    "runCommand",
    "Run terminal command",
    {
        command: z.string(),
        workingDirectory:
            z.string()
    },
    async ({
        command,
        workingDirectory
    }) => ({
        content: [
            {
                type: "text",
                text:
                    await runCommand(
                        command,
                        workingDirectory
                    )
            }
        ]
    })
)



server.tool(
    "analyzeLogs",
    "Analyze runtime logs",
    {
        logs: z.string()
    },
    async ({ logs }) => ({
        content: [
            {
                type: "text",
                text:
                    await analyzeLogs(
                        logs
                    )
            }
        ]
    })
)



app.get("/sse", async (req, res) => {

    const transport =
        new SSEServerTransport(
            "/messages",
            res
        )

    await server.connect(
        transport
    )
})



app.post(
    "/messages",
    async (req, res) => {
        res.sendStatus(200)
    }
)



app.listen(4000, () => {

    console.log(
        "MCP SERVER RUNNING ON 4000"
    )
})
