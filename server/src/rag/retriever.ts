import { MemoryVectorStore } from "@langchain/community/vectorstores/memory";

export const getRetriever = (vectorStore: MemoryVectorStore) => {
  return vectorStore.asRetriever({
    k: 5,
  });
};