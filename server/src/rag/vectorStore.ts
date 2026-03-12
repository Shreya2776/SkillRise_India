import { MemoryVectorStore } from "@langchain/community/vectorstores";
import { embeddings } from "./embeddings";
import { Document } from "@langchain/core/documents";

export const createVectorStore = async (docs: Document[]) => {
  const vectorStore = await MemoryVectorStore.fromDocuments(
    docs,
    embeddings
  );

  return vectorStore;
};