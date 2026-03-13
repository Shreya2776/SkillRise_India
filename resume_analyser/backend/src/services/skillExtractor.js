import dotenv from "dotenv";
dotenv.config();
import OpenAI from "openai";

const openai = new OpenAI({
 apiKey: process.env.OPENAI_API_KEY
});

export async function extractSkills(resumeText){

 const prompt = `
 Extract technical skills from the resume.

 Resume:
 ${resumeText}

 Return JSON:
 { "skills": [] }
 `;

 const response = await openai.chat.completions.create({
   model:"gpt-4o-mini",
   messages:[{role:"user",content:prompt}]
 });

 const result = JSON.parse(response.choices[0].message.content);

 return result.skills;
}