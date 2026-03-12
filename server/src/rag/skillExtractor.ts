import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function extractSkills(text: string) {
  const prompt = `
Extract all technical skills from the following resume.

Return JSON format:

{
  "skills": []
}

Resume:
${text}
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  const content = response.choices[0].message.content;

  return JSON.parse(content || "{}");
}