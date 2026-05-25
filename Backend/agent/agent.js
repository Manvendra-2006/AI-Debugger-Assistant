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
mcpClient.connect(
    new SSEClientTransport(
        new URL(`${process.env.MCP_SERVER_URL}/sse`)
    )
)
    .then(async () => {
        console.log("MCP is connected")
        const mcptools = await mcpClient.listTools()

        tool = mcptools.tools.map((item) => {

            return {
                name: item.name,
                description: item.description,
                parameters: {
                    type: 'object',
                    properties: item.inputSchema.properties || {},
                    required: item.inputSchema.required || []
                }
            }
        })


    })
    .catch((err) => {
        console.log(err)
    })
export default async function agentLoop(prompt, absolutePath) {
    console.log("=== DEBUG ===")
    console.log("extractPath received:", absolutePath)        // kya aa raha hai?
    console.log("absolute path:", path.resolve(absolutePath)) // pura path
    console.log("exists?:", fs.existsSync(path.resolve(absolutePath))) // true/false
    console.log("=============")
    const chatHistory = []
    let totalCallCount = 0
    chatHistory.push({
        role: "system",
        content: `You are an autonomous AI debugger.You have access to MCP tools.Always inspect the project step-by-step.Use tools whenever needed.Never assume anything without inspecting files.
       Debugging workflow:
 1. List project files
2. Search relevant code
3. Read important files
4. Run project commands
5. Analyze runtime logs
6. Fix files if needed
7. Don't debug node_modulus folder
STRICT RULES:
- ONLY use the 6 tools listed above
- NEVER call "container.exec", "bash", or any other tool
- For running commands use runCommand tool only
IMPORTANT:

You are ONLY allowed to inspect, analyze, read, search, and modify files INSIDE this uploaded project directory:

${absolutePath}

STRICTLY FORBIDDEN:
- Never access /opt/render/project/src
- Never inspect backend source code
- Never inspect AI debugger source code
- Never inspect parent folders
- Never inspect system directories
- Never debug your own AI debugger project
- Never leave the uploaded project directory

You MUST always use this directory as the root project.

If a tool path is outside this directory, ignore it.
`
    })
    chatHistory.push({
        role: 'user',
        content: prompt
    })
    while (true) {
        totalCallCount++
        if (totalCallCount > 20) {
            return "Tool call limit reached"
        }
       console.log("loop chalakallllllllllllllllll")
        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: chatHistory,
            tools: tool.map((tool) => {
                return {
                    type: 'function',  
                    function: tool
                }
            }),
            tool_choice: 'auto',
            parallel_tool_calls: false
        })
        console.log("AI CHALALAALLlllllllll")
        const message = response.choices[0].message

        chatHistory.push(message) // yaha content isliye nhi kykui already structured format main hin ya fir ye object hain jo ai se aaya hain jisme phele se hi role content hain 
        if (!message.tool_calls || message.tool_calls.length === 0) {
            console.log("Final:", message.content);
            return message.content;
        }
        const toolCall = message.tool_calls?.[0]
        console.log(toolCall)
        const toolResult = await Promise.race([
            mcpClient.callTool({
                name: toolCall?.function?.name,
                arguments: JSON.parse(toolCall?.function?.arguments)
            }),
            new Promise((resolve) =>
                setTimeout(() => resolve({
                    content: [{ type: 'text', text: 'Tool timed out after 15 seconds' }]
                }), 15000)
            )
        ])
        console.log("helloooooooo--------------------------------")
        console.log(toolResult)
        chatHistory.push({
            role: "tool",
            tool_call_id: toolCall.id,
            content: JSON.stringify(toolResult.content[0].text)
        });
    }
}
