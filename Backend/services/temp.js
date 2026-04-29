export const code = `
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

async function analyzeUI(data) {
  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: data
        }
      ],
      response_format: { type: "json_object" } 
    });

    const result = response.choices.message.content; 
    return JSON.parse(result) 

  } catch (error) {
    console.log("Error:", error.message)
  }
}

export default analyzeUI;
`