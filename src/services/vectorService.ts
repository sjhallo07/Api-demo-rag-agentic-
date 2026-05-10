import { pipeline } from '@xenova/transformers';

/**
 * Local Vector Intelligence Service
 * Uses Transformers.js for semantic embeddings to enable RAG fallback.
 */

let embeddingPipeline: any = null;

export async function getEmbedding(text: string): Promise<number[]> {
  try {
    if (!embeddingPipeline) {
      // Using a small, fast model for embeddings
      embeddingPipeline = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    }
    
    const output = await embeddingPipeline(text, { pooling: 'mean', normalize: true });
    return Array.from(output.data);
  } catch (error) {
    console.error("Local Vector Embedding Error (likely rate-limited), returning fallback:", error);
    // Return zeroed vector as fallback to avoid crashing; MiniLM-L6-v2 dimension is 384
    return new Array(384).fill(0);
  }
}

export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  let dotProduct = 0;
  let mA = 0;
  let mB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    mA += vecA[i] * vecA[i];
    mB += vecB[i] * vecB[i];
  }
  mA = Math.sqrt(mA);
  mB = Math.sqrt(mB);
  return dotProduct / (mA * mB);
}

export interface VectorMatch {
  content: string;
  score: number;
  metadata?: any;
}

/**
 * Searches a list of strings for semantic relevance
 */
export async function semanticSearch(query: string, candidates: string[], topK = 3): Promise<VectorMatch[]> {
  try {
    const queryVec = await getEmbedding(query);
    const matches: VectorMatch[] = [];

    for (const cand of candidates) {
      const candVec = await getEmbedding(cand);
      const score = cosineSimilarity(queryVec, candVec);
      matches.push({ content: cand, score });
    }

    return matches.sort((a, b) => b.score - a.score).slice(0, topK);
  } catch (error) {
    console.error("Local Vector Search Error:", error);
    return [];
  }
}
