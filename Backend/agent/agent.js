import "dotenv/config"

import fs from "fs"
import path from "path"

import Groq from "groq-sdk"

import {
    Client
} from "@modelcontextprotocol/sdk/client/index.js"

import {
    SSEClientTransport
} from "@modelcontextprotocol/sdk/client/sse.js"



/* =========================
   GROQ
========================= */

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
})



/* =========================
   MCP CLIENT
========================= */

const client = new Client({
    name: "debugger-agent",
    version: "1.0.0"
})



/* =========================
   CONNECT MCP
========================= */

async function connectMCP() {

    try {

       client.connect(
    new SSEClientTransport(
        new URL(`${process.env.MCP_SERVER_URL}/sse`)
    )
)
        console.log(
            "✅ MCP CONNECTED"
        )

    } catch (err) {

        console.log(
            "❌ MCP CONNECTION FAILED"
        )

        console.log(err.message)
    }
}

await connectMCP()



/* =========================
   LOAD TOOLS
========================= */

const toolResult =
    await client.listTools()



const tools =
    toolResult.tools.map((tool) => ({

        type: "function",

        function: {

            name: tool.name,

            description:
                tool.description || "",

            parameters: {

                type: "object",

                properties:
                    tool.inputSchema
                        ?.properties || {},

                required:
                    tool.inputSchema
                        ?.required || [],

                additionalProperties: false
            }
        }
    }))



console.log(
    "✅ TOOLS LOADED:"
)

console.log(
    tools.map(
        (t) => t.function.name
    )
)



/* =========================
   AGENT LOOP
========================= */

export default async function agentLoop(
    prompt,
    absolutePath
) {

    try {

        /* =========================
           VALIDATE PROJECT
        ========================= */

        if (
            !fs.existsSync(
                absolutePath
            )
        ) {

            return "Project path does not exist"
        }



        /* =========================
           CHAT HISTORY
        ========================= */

        const messages = [

            {
                role: "system",

                content: `
You are an autonomous AI debugger.

You have access to MCP tools.

Your job:
- inspect project
- debug issue
- fix files carefully

RULES:

1. Use ONLY provided tools
2. Never invent tools
3. Never access system folders
4. Never leave project root
5. Ignore node_modules
6. Ignore .git
7. Avoid unnecessary file reads
8. Fix issues carefully

PROJECT ROOT:

${absolutePath}

WORKFLOW:

1. List files
2. Find app structure
3. Search relevant code
4. Read important files
5. Analyze issue
6. Modify if needed
7. Return concise summary
`
            },

            {
                role: "user",
                content: prompt
            }
        ]



        /* =========================
           LOOP
        ========================= */

        let totalCalls = 0

        while (true) {

            totalCalls++

            if (totalCalls > 20) {

                return `
Tool call limit reached.
`
            }



            console.log(
                `\n====================`
            )

            console.log(
                `LOOP: ${totalCalls}`
            )

            console.log(
                `====================\n`
            )



            /* =========================
               AI RESPONSE
            ========================= */

            const response =
                await groq.chat.completions.create({

                    model:
                        "llama-3.3-70b-versatile",

                    messages,

                    tools,

                    tool_choice: "auto",

                    temperature: 0.2,

                    parallel_tool_calls: false
                })



            const message =
                response.choices[0].message



            messages.push(message)



            console.log(
                "AI RESPONSE:"
            )

            console.log(message)



            /* =========================
               FINAL RESPONSE
            ========================= */

            if (
                !message.tool_calls ||
                message.tool_calls.length === 0
            ) {

                return (
                    message.content ||
                    "No response"
                )
            }



            /* =========================
               HANDLE TOOL CALLS
            ========================= */

            for (
                const toolCall of
                message.tool_calls
            ) {

                try {

                    console.log(
                        "\nTOOL CALL:"
                    )

                    console.log(toolCall)



                    const toolName =
                        toolCall.function.name



                    let args = {}



                    try {

                        args = JSON.parse(
                            toolCall.function.arguments
                        )

                    } catch {

                        messages.push({

                            role: "tool",

                            tool_call_id:
                                toolCall.id,

                            name: toolName,

                            content:
                                "Invalid JSON arguments"
                        })

                        continue
                    }



                    /* =========================
                       PATH SECURITY
                    ========================= */

                    const pathFields = [

                        "filepath",

                        "directorypath",

                        "directoryPath",

                        "workingDirectory"
                    ]



                    let blocked = false



                    for (
                        const field
                        of pathFields
                    ) {

                        if (
                            args[field]
                        ) {

                            const resolved =
                                path.resolve(
                                    absolutePath,
                                    args[field]
                                )



                            if (
                                !resolved.startsWith(
                                    path.resolve(
                                        absolutePath
                                    )
                                )
                            ) {

                                blocked = true

                                console.log(
                                    "❌ BLOCKED PATH:",
                                    resolved
                                )

                                break
                            }



                            args[field] =
                                resolved
                        }
                    }



                    if (blocked) {

                        messages.push({

                            role: "tool",

                            tool_call_id:
                                toolCall.id,

                            name: toolName,

                            content:
                                "Access denied"
                        })

                        continue
                    }



                    /* =========================
                       CALL MCP TOOL
                    ========================= */

                    const result =
                        await Promise.race([

                            client.callTool({

                                name: toolName,

                                arguments: args
                            }),

                            new Promise(
                                (resolve) =>

                                    setTimeout(
                                        () => {

                                            resolve({

                                                content: [
                                                    {
                                                        type: "text",

                                                        text: `
Tool timeout after 30 seconds
`
                                                    }
                                                ]
                                            })

                                        },

                                        30000
                                    )
                            )
                        ])



                    console.log(
                        "\nTOOL RESULT:"
                    )

                    console.log(result)



                    /* =========================
                       PUSH TOOL RESPONSE
                    ========================= */

                    messages.push({

                        role: "tool",

                        tool_call_id:
                            toolCall.id,

                        name: toolName,

                        content:
                            String(
                                result?.content?.[0]
                                    ?.text ||
                                "No tool response"
                            )
                    })

                } catch (err) {

                    console.log(
                        "❌ TOOL EXECUTION ERROR"
                    )

                    console.log(err)



                    messages.push({

                        role: "tool",

                        tool_call_id:
                            toolCall.id,

                        name:
                            toolCall.function.name,

                        content:
                            err.message
                    })
                }
            }
        }

    } catch (err) {

        console.log(
            "❌ AGENT ERROR"
        )

        console.log(err)

        return err.message
    }
}
