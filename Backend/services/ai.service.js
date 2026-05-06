import Groq from "groq-sdk";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const codeSchema = z.object({
  code: z.string().describe(
    "User provided source code that may contain bugs, errors, or issues to be analyzed and fixed by the AI"
  )
});

async function invokeGrokII(code) {
  try {
const prompt = `
You are an expert JavaScript debugger.

Analyze the following JavaScript code and find:
- syntax errors
- runtime errors
- logical bugs
- missing arguments
- undefined values
- bad practices

Return response strictly in valid JSON format with EXACTLY these fields:
{
  "issues": ["list of bugs/errors"],
  "fixes": ["list of fixes"],
  "correctedCode": "full corrected JavaScript code",
  "explanation": "short explanation"
}

Strict Rules:
- correctedCode must be COMPLETE working JavaScript code.
- correctedCode must be directly runnable after copying.
- correctedCode must NOT be the same as input code if any issue exists.
- NEVER return the original code unchanged when issues are found.
- If a function parameter can become undefined, fix it using default value or validation.
- If a function is called with missing arguments, fix the function or the function call.
- Missing arguments that cause undefined values MUST be fixed.
- Do NOT wrap correctedCode in triple backticks.
- Do NOT add markdown formatting.
- Do NOT add extra fields.
- Return only JSON.

Example:
Input:
function addNumbers(a, b) {
  return a + b
}

console.log(addNumbers(5))

Correct correctedCode:
function addNumbers(a, b = 0) {
  return a + b;
}

console.log(addNumbers(5));

Now analyze this code:

${typeof code === "string" ? code : JSON.stringify(code)}
`;

   const response = await groq.chat.completions.create({
  model: "llama-3.3-70b-versatile",
  temperature: 0,
  messages: [
    {
      role: "user",
      content: prompt
    }
  ],
  response_format: { type: "json_object" }
})

const result = response.choices[0].message.content;
const data = JSON.parse(result);

// clean correctedCode
let cleanCode = "";
if (data.correctedCode) {
  cleanCode = data.correctedCode
    .replace(/\\n/g, '\n')
    .replace(/\\"/g, '"');
}

// 🔥 Final combined output
const finalOutput = {
  ...data,
  correctedCode: cleanCode
};

// pretty print sab ek saath
console.log("===== FINAL OUTPUT =====");
console.log(JSON.stringify(finalOutput, null, 2));

// agar sirf code alag dekhna ho
console.log("\n===== CLEAN CODE =====\n");
console.log(cleanCode);

// return bhi kar do (API ke liye useful)
return finalOutput;
  } catch (error) {
    console.log("Error:", error.message);
  }
}

export default invokeGrokII;