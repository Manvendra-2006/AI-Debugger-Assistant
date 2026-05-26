import 'dotenv/config'
import { Client } from "@modelcontextprotocol/sdk/client/index.js"
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js"
import Groq from 'groq-sdk'
import path from 'path'
import fs from 'fs'

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
})

const mcpClient = new Client({
    name: "debugger-version",
    version: "1.0.0"
})

let tool = []
async function connectMCP(retries = 10, delay = 5000) {

    for (let i = 0; i < retries; i++) {

        try {

            try {
                await mcpClient.close()
            } catch (_) {}

            await mcpClient.connect(
                new SSEClientTransport(
                    new URL(`${process.env.MCP_SERVER_URL}/sse`)
                )
            )

            console.log("MCP Connected ✅")

            const mcptools = await mcpClient.listTools()

            tool = mcptools.tools.map((item) => ({
             
                name: item.name,
                description: item.description,
                parameters: {
                    type: 'object',
                    properties: item.inputSchema.properties || {},
                    required: item.inputSchema.required || [],
                     additionalProperties: false
                }
            }))

            console.log("Loaded Tools:", tool.map(t => t.name))

            return

        } catch (err) {

            console.log(
                `MCP connect failed (attempt ${i + 1}/${retries}):`,
                err.message
            )

            if (i < retries - 1) {
                await new Promise(r => setTimeout(r, delay))
            }
        }
    }

    console.log("❌ MCP connection failed after all retries")
}

await connectMCP()
export default async function agentLoop(prompt, absolutePath) {

    console.log("=== DEBUG ===")
    console.log("absolute path:", absolutePath)
    console.log("exists?:", fs.existsSync(absolutePath))
    console.log("=============")

    if (!fs.existsSync(absolutePath)) {
        return "Project path does not exist"
    }

    if (tool.length === 0) {
        return "MCP tools are not connected yet. Please try again in a few seconds."
    }

    const chatHistory = []

    let totalCallCount = 0
    chatHistory.push({
        role: "system",
       content: `
You are an autonomous AI debugger.

You have access to MCP tools.

Your job is to inspect, debug, and fix uploaded projects carefully.

IMPORTANT RULES:

1. Use ONLY the provided MCP tools
2. Never invent tools
3. Never use container.exec
4. Never use bash directly
5. Never assume Docker access
6. Never access system folders
7. Never inspect parent folders
8. Never inspect backend source code
9. Never inspect extracted-projects root
10. Never leave the uploaded project directory
11. Ignore node_modules, dist, build, .git, .next folders
12. Avoid reading large unnecessary files
13. Do not repeatedly read same files
14. Do not repeatedly search same keywords
15. Stop debugging once root issue is identified

PROJECT ROOT:

${absolutePath}

You MUST treat this directory as the ONLY allowed project root.

Allowed workflow:

STEP 1:
List project files.

STEP 2:
Find actual frontend/backend root.
Look for:
- package.json
- src
- app
- pages
- main.jsx
- App.jsx
- server.js
- index.js

STEP 3:
Search only relevant files.

STEP 4:
Read only important files.

STEP 5:
Analyze issue carefully.

STEP 6:
Modify files only if necessary.

STEP 7:
Return concise debugging summary.

IMPORTANT:

- Never scan entire server filesystem
- Never search extracted-projects globally
- Never use absolute system paths manually
- Always work relative to uploaded project
- If tool fails, continue intelligently
- If file not found, inspect folder structure first
- Avoid infinite debugging loops
TOOL CALL RULES:

- Always call tools using valid JSON arguments
- Never write XML style tool calls
- Never write:
<function=toolName()>

- Always use official tool calling format
- Always provide ALL required arguments
- Never leave arguments empty
`
    })

    chatHistory.push({
        role: "user",
        content: prompt
    })
    while (true) {

        totalCallCount++

        if (totalCallCount > 20) {
            return "Tool call limit reached"
        }

        console.log("loop chalakallllllllllllllllll")
        if (chatHistory.length > 12) {
            chatHistory.splice(1, chatHistory.length - 12)
        }
    const formattedTools = []

for (const t of tool) {

    if (
        !t ||
        typeof t.name !== "string" ||
        !t.name.trim()
    ) {
        console.log("❌ INVALID TOOL:", t)
        continue
    }

   formattedTools.push({
    type: "function",
    function: {
        name: t.name.trim(),
        description: t.description || "",
        parameters: {
            type: "object",
            properties: t.parameters?.properties || {},
            required: t.parameters?.required || [],
            additionalProperties: false
        }
    }
})
}

console.log("FINAL TOOLS:")
console.log(JSON.stringify(formattedTools, null, 2))
console.log("TOOLS SENT TO AI:")
console.log(JSON.stringify(formattedTools, null, 2))
        const response = await groq.chat.completions.create({

         model: "openai/gpt-oss-120b",

            messages: chatHistory,

            tools: formattedTools,

           tool_choice: "auto",

            parallel_tool_calls: false
        })

        console.log("AI CHALALAALLlllllllll")

        const message = response.choices[0].message

        chatHistory.push(message)
        if (!message.tool_calls || message.tool_calls.length === 0) {

            console.log("Final:", message.content)

            return message.content
        }

        const toolCall = message.tool_calls?.[0]

        console.log(toolCall)

        const allowedTools = tool.map(t => t.name)
        if (!allowedTools.includes(toolCall?.function?.name)) {

            console.log(
                "❌ Invalid tool attempted:",
                toolCall?.function?.name
            )

            chatHistory.push({
                role: "tool",
                tool_call_id: toolCall.id,
                content: "Tool does not exist"
            })

            continue
        }
        let parsedArguments = {}

        try {

            parsedArguments = JSON.parse(
                toolCall?.function?.arguments || "{}"
            )

        } catch (error) {

            chatHistory.push({
                role: "tool",
                tool_call_id: toolCall.id,
                content: "Invalid tool arguments JSON"
            })

            continue
        }
        const pathFields = [
            "filepath",
            "directorypath",
            "directoryPath",
            "workingDirectory"
        ]

        let blocked = false

        for (const field of pathFields) {

            if (parsedArguments[field]) {

                const resolvedPath = path.resolve(parsedArguments[field])

                if (!resolvedPath.startsWith(path.resolve(absolutePath))) {

                    blocked = true

                    console.log("❌ BLOCKED PATH:", resolvedPath)

                    break
                }
            }
        }

        if (blocked) {

            chatHistory.push({
                role: "tool",
                tool_call_id: toolCall.id,
                content: "Access denied. Path outside project."
            })

            continue
        }
        const toolResult = await Promise.race([

            mcpClient.callTool({
                name: toolCall.function.name,
                arguments: parsedArguments
            }),

            new Promise((resolve) =>
                setTimeout(() => resolve({
                    content: [{
                        type: 'text',
                        text: 'Tool timed out after 30 seconds'
                    }]
                }), 30000)
            )
        ])

        console.log("helloooooooo--------------------------------")
        console.log(toolResult)
        chatHistory.push({
            role: "tool",
            tool_call_id: toolCall.id,
           content:
    toolResult?.content?.[0]?.text || "No tool response"
        })
    }
}
