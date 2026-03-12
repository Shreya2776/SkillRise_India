// src/utils/resumeParser.ts
import fs from "fs";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";

export async function parseResume(filePath: string): Promise<string> {
  if (filePath.endsWith(".pdf")) {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await (pdfParse as any)(dataBuffer);
    return data.text;
  }

  if (filePath.endsWith(".docx")) {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  }

  throw new Error("Unsupported file format");
}