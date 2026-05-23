import 'dotenv/config'
import express from 'express'
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js"
import { z } from 'zod'
import { listfiles } from './tools/listfiles.js'
import cors from 'cors'
import { readFile } from './tools/readFile.js'
import { searchCodebase } from './tools/searchCodebase.js'
import { runCommand } from './tools/runCommand.js'
import { analyzeLogs } from './tools/analyzeLogs.js'
import { writeFile } from './tools/writeFile.js'
const app = express()
app.use(cors())
const server = new McpServer({
   name: "debugger-server",
   version: "1.0.0"
})
const withTimeout = (promise, seconds = 10) => {
    return Promise.race([
        promise,
        new Promise((resolve) =>
            setTimeout(() => resolve({
                content: [{ type: 'text', text: `Tool timed out after ${seconds} seconds` }]
            }), seconds * 1000)
        )
    ])
}
server.tool(
   "listfiles",
   "List all files and folders inside a project directory",
   {
      directorypath: z.string()
   },
   async ({ directorypath }) => {
      console.log(
         "Listing files:",
         directorypath
      )
    return withTimeout(listfiles(directorypath), 10)
   }
)

server.tool(
   "readFile",
   "Read file content from project",
   {
      filepath: z.string()
   },
   async ({ filepath }) => {
      console.log(
         "Reading file:",
         filepath
      )
    return withTimeout(readFile(filepath), 10)
   }
)
server.tool(

   "searchCodebase",

   "Search keyword across project files",

   {
      directoryPath: z.string(),
      keyword: z.string()
   },

   async ({
      directoryPath,
      keyword
   }) => {

      return withTimeout(searchCodebase(directoryPath, keyword), 15)
   }
)
server.tool(

   "runCommand",

   "Run terminal commands inside project",

   {
      command: z.string(),
      workingDirectory: z.string()
   },

   async ({
      command,
      workingDirectory
   }) => {

      console.log(
         "Running command:",
         command
      )

    return withTimeout(runCommand(command, workingDirectory), 10)
   }
)
server.tool(

   "analyzeLogs",

   "Analyze runtime logs and errors",

   {
      logs: z.string()
   },

   async ({ logs }) => {

      return withTimeout(analyzeLogs(logs), 10)
   }
)
server.tool(

   "writeFile",

   "Write or update project files",

   {
      filepath: z.string(),
      content: z.string()
   },

   async ({
      filepath,
      content
   }) => {

      return withTimeout(writeFile(filepath, content), 10)
   }
)
const transports = {}
app.get("/sse", async (req, res) => {

   const transport =
      new SSEServerTransport(
         "/messages",
         res
      )

   transports[
      transport.sessionId
   ] = transport

   res.on("close", () => {

      delete transports[
         transport.sessionId
      ]
   })

   await server.connect(transport)
})
app.post(
   "/messages",

   async (req, res) => {

      const sessionId =
         req.query.sessionId

      const transport =
         transports[sessionId]

      if (transport) {

         await transport
            .handlePostMessage(
               req,
               res
            )

      } else {

         res.status(400).send(
            "No transport found"
         )
      }
   }
)
app.listen(process.env.PORT, () => {

   console.log(
      "MCP Server running on port 4000"
   )
})