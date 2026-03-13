import { createRequire } from "module";
import mammoth from "mammoth";

const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

export async function parseResume(file) {

  if (file.mimetype === "application/pdf") {
    const data = await pdf(file.buffer);
    return data.text;
  }

  if (file.mimetype.includes("word")) {
    const result = await mammoth.extractRawText({ buffer: file.buffer });
    return result.value;
  }

  return file.buffer.toString();
}