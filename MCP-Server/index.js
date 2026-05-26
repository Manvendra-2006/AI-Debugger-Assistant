import express from "express"

import { McpServer }
from "@modelcontextprotocol/sdk/server/mcp.js"

import { SSEServerTransport }
from "@modelcontextprotocol/sdk/server/sse.js"

import fs from "fs"
import path from "path"

import { z } from "zod"

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
    async ({ directorypath }) => {

        try {

            const files =
                fs.readdirSync(directorypath)

            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(
                            files,
                            null,
                            2
                        )
                    }
                ]
            }

        } catch (err) {

            return {
                content: [
                    {
                        type: "text",
                        text: err.message
                    }
                ]
            }
        }
    }
)



server.tool(
    "readFile",
    "Read file content",
    {
        filepath: z.string()
    },
    async ({ filepath }) => {

        try {

            const content =
                fs.readFileSync(
                    filepath,
                    "utf-8"
                )

            return {
                content: [
                    {
                        type: "text",
                        text: content
                    }
                ]
            }

        } catch (err) {

            return {
                content: [
                    {
                        type: "text",
                        text: err.message
                    }
                ]
            }
        }
    }
)



app.get("/sse", async (req, res) => {

    const transport =
        new SSEServerTransport(
            "/messages",
            res
        )

    await server.connect(transport)
})



app.post("/messages", async (req, res) => {
    res.sendStatus(200)
})



app.listen(4000, () => {
    console.log(
        "MCP SERVER RUNNING ON 4000"
    )
})
