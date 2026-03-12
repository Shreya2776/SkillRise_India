// import { Request, Response } from "express";
// import pdf from "pdf-parse";

// export const uploadResume = async (req: Request, res: Response) => {
//     try {

//         const file = (req as any).file;

//         if (!file) {
//             return res.status(400).json({
//                 message: "No resume uploaded"
//             });
//         }

//         const data = await pdf(file.buffer);

//         const resumeText = data.text;

//         return res.status(200).json({
//             message: "Resume parsed successfully",
//             text: resumeText.substring(0, 500) // preview first 500 chars
//         });

//     } catch (error) {
//         return res.status(500).json({
//             message: "Error parsing resume",
//             error
//         });
//     }
// };

import { parseResume } from "../utils/resumeParser";
import { chunkResumeText } from "../utils/textChunker";
import { createVectorStore } from "../rag/vectorStore";
import { getRetriever } from "../rag/retriever";
import { extractSkills} from "../rag/skillExtractor";
import { Request, Response } from "express";
export const analyzeResume = async (req: Request, res:Response) => {

  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  // 1️⃣ Parse resume
  const text = await parseResume(file.path);

  // 2️⃣ Chunk text
  const docs = await chunkResumeText(text);

  // 3️⃣ Create vector store
  const vectorStore = await createVectorStore(docs);

  // 4️⃣ Create retriever
  const retriever: any = getRetriever(vectorStore);

  // 5️⃣ Retrieve relevant context
  const results = await retriever.invoke(
    "skills technologies programming languages"
  );

  const context = results.map((r: any) => r.pageContent).join("\n");

  // 6️⃣ Extract skills
  const skills = await extractSkills(context);

  res.json({
    skills
  });

};