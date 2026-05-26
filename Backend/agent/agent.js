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
                    required: item.inputSchema.required || []
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

Always inspect the project step-by-step.

IMPORTANT RULES:

1. Use ONLY MCP tools returned by listTools()
2. Never invent tools
3. Never use container.exec
4. Never use bash
5. Never assume terminal exists
6. Never access system folders
7. Never debug outside uploaded project
8. Don't inspect node_modules
9. Never search entire extracted-projects folder
10. Always stay inside this project root:

${absolutePath}

Allowed workflow:

1. List files
2. Search relevant code
3. Read files
4. Analyze issues
5. Modify files if needed

If tool unavailable, continue debugging normally.
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

        const response = await groq.chat.completions.create({

            model: "openai/gpt-oss-120b",

            messages: chatHistory,

            tools: tool.map((item) => ({
                type: 'function',
                function: item
            })),

            tool_choice: 'auto',

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
            content: JSON.stringify(
                toolResult?.content?.[0]?.text || "No tool response"
            )
        })
    }
}
