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
You are an expert software debugger and code reviewer.

Analyze the provided source code carefully and detect:

- syntax errors
- runtime errors
- logical bugs
- missing imports/modules
- undefined variables
- null/undefined access issues
- missing arguments
- invalid function calls
- asynchronous issues
- API misuse
- security vulnerabilities
- memory/performance problems
- bad coding practices
- type-related issues
- framework/library misuse
- database/query mistakes
- concurrency/threading issues
- configuration/environment issues

You must support ALL programming languages and technologies including but not limited to:

- JavaScript
- TypeScript
- Python
- Java
- C
- C++
- C#
- Go
- Rust
- PHP
- Ruby
- Kotlin
- Swift
- Dart
- Bash/Shell
- SQL
- HTML
- CSS
- React
- Node.js
- Express
- MongoDB
- Docker
- YAML
- JSON
- Firebase
- Next.js
- Vue
- Angular

Your task:
1. Understand the code
2. Detect all issues
3. Fix the issues
4. Return corrected working code
5. Explain the fixes briefly

Return response STRICTLY in valid JSON format with EXACTLY these fields:

{
  "issues": ["list of detected issues"],
  "fixes": ["list of fixes applied"],
  "correctedCode": "full corrected code",
  "explanation": "short explanation"
}

STRICT RULES:

- correctedCode MUST contain COMPLETE working code.
- correctedCode MUST be directly runnable after copying.
- correctedCode MUST NOT be identical to input if issues exist.
- Always fix detected issues instead of only describing them.
- Fix undefined/null issues using validation or default values.
- Fix missing imports/modules if required.
- Fix incorrect async/await usage if present.
- Fix syntax issues according to the detected programming language.
- Preserve original project logic as much as possible.
- Improve code quality where necessary.
- Do NOT wrap correctedCode in triple backticks.
- Do NOT add markdown formatting.
- Do NOT add comments unless necessary for functionality.
- Do NOT add extra JSON fields.
- Return ONLY valid JSON.
- Never return plain text outside JSON.

If the code is already correct:
- keep correctedCode optimized and clean
- return empty array if no issues exist

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

let cleanCode = "";
if (data.correctedCode) {
  cleanCode = data.correctedCode
    .replace(/\\n/g, '\n')
    .replace(/\\"/g, '"');
}
const finalOutput = {
  ...data,
  correctedCode: cleanCode
};
console.log(JSON.stringify(finalOutput, null, 2));
console.log(cleanCode);
return finalOutput;
  } catch (error) {
    console.log("Error:", error.message);
  }
}

export default invokeGrokII;