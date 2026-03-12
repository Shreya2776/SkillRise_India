// src/utils/textChunker.ts
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
export const chunkResumeText = async (text: string) => {

    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 500,
        chunkOverlap: 100
    });

    const chunks = await splitter.createDocuments([text]);

    return chunks;
};