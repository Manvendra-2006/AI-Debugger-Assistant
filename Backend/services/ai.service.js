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
Analyze the following JavaScript code and identify bugs or issues.

Return response strictly in JSON format with EXACTLY these fields:
{
  "issues": ["list of bugs/errors"],
  "fixes": ["list of fixes"],
  "correctedCode": "full corrected code",
  "explanation": "short explanation"
}

Rules:
- correctedCode must be COMPLETE working JavaScript code.
- Keep correctedCode properly formatted with indentation.
- Do NOT use string concatenation like '...' + '...'.
- Do NOT wrap code in triple backticks.
- Do NOT add markdown formatting.
- Keep output clean and readable.
- Do not add extra fields.

Important:
- correctedCode should be valid JavaScript that can run directly after copying.
- Ensure proper error handling and best practices.

Code:
${typeof code === "string" ? code : JSON.stringify(code)}
`;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    });

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