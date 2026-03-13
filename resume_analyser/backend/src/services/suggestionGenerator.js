import OpenAI from "openai";

const openai = new OpenAI({
 apiKey:process.env.OPENAI_API_KEY
});

export async function generateSuggestions(resume,job){

 const prompt = `
 Analyze resume 

 Resume:
 ${resume}

 Suggest improvements to increase ATS score.
 `;

 const res = await openai.chat.completions.create({
   model:"gpt-4o-mini",
   messages:[{role:"user",content:prompt}]
 });

 return res.choices[0].message.content;
}