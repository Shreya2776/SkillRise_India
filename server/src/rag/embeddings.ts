import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/hf_transformers";

export const embeddings = new HuggingFaceTransformersEmbeddings({
  modelName: "Xenova/all-MiniLM-L6-v2",
});