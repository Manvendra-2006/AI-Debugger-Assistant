import Groq from "groq-sdk"

import path from "path"

import {
    Client
} from "@modelcontextprotocol/sdk/client/index.js"

import {
    SSEClientTransport
} from "@modelcontextprotocol/sdk/client/sse.js"



const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
})



const client = new Client({
    name: "debugger-agent",
    version: "1.0.0"
})



await client.connect(
    new SSEClientTransport(
        new URL(
            "http://localhost:4000/sse"
        )
    )
)



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
                        .properties || {},

                required:
                    tool.inputSchema
                        .required || [],

                additionalProperties: false
            }
        }
    }))
