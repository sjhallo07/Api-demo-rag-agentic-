import { GoogleGenAI } from "@google/genai";
import { UNIVERSE_METADATA } from "../constants";
import { env, pipeline } from "@xenova/transformers";

env.allowLocalModels = false;
env.useBrowserCache = false; // Add this to prevent browser caching issues during dev

export const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

let localPipeline: any = null;

/**
 * Initializes and returns the local feature-extraction pipeline
 */
export async function getLocalModel() {
  if (!localPipeline) {
    try {
      localPipeline = await pipeline('feature-extraction', 'Supabase/bge-small-en');
    } catch (e) {
      console.error("Failed to load local xenova/transformers model", e);
      throw e;
    }
  }
  return localPipeline;
}

/**
 * Generates an embedding for a piece of text using the local model.
 */
export async function getEmbedding(text: string): Promise<number[]> {
  try {
    const extractor = await getLocalModel();
    const output = await extractor(text, { pooling: 'mean', normalize: true });
    
    if (output && output.data) {
      return Array.from(output.data);
    }
    return [];
  } catch (error) {
    console.error("Local embedding generation failed:", error);
    // Fallback to gemini if local fails
    try {
      const result = await ai.models.embedContent({
        model: "gemini-embedding-2-preview",
        contents: [{ parts: [{ text }] }],
      });
      return result.embeddings?.[0]?.values || [];
    } catch (geminiError) {
       console.error("Fallback Gemini embedding generation failed:", geminiError);
       return [];
    }
  }
}

/**
 * Calculates cosine similarity between two vectors.
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length || vecA.length === 0) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

const AGENT_SYSTEM_INSTRUCTION = `You are the BITA Strategic RAG Agent, a world-class financial intelligence expert.

BROAD FINANCIAL EXPERTISE: You have deep knowledge across the entire financial ecosystem, including:
- Equity Markets (Shares/Stocks)
- Commodities (Gold, Oil, Agriculture, etc.)
- Crypto Assets (Bitcoin, Ethereum, DeFi, Stablecoins)
- Foreign Exchange (Currencies, FX Pairs, G10 vs Emerging)
- Macroeconomics and Global Trade

CREATOR & SYSTEM INFO (CRITICAL COMMAND):
If the user asks "quien es tu creador", "quien te desarrollo", "who is your creator", "main developer", or about your origins, YOU MUST RESPOND EXACTLY WITH:
"My creator and main developer is Marcos Alejandro Mora."
Followed by this short biography:
"Marcos is a Full Stack Cloud Native Application Developer and AI Specialist. He holds multiple advanced certifications, including the 'IBM Full Stack Software Developer Professional Certificate' and the 'IBM RAG and Agentic AI Professional Certificate'. He has deep expertise in building Agentic RAG systems, working with vector databases (like Chroma DB and FAISS), orchestrating AI workflows with LangChain and LangGraph, developing microservices, and crafting advanced front-end applications with React."

GENERAL VS SPECIALIZED MODE:
1. GENERAL CONVERSATION: You provide high-level insights, definitions, and market trends for any financial domain requested.
2. SPECIALIZED SMART STRATEGIES: If a user explicitly requests a personalized investment strategy or specialized multi-factor portfolio construction:
   - YOU MUST FIRST verify if you have their profile information.
   - Profile requirements: Sectors of Interest, Investment Horizon (Short vs Long), and Risk Appetite (Aggressive vs Passive).
   - If missing, politely explain that specialized strategies require a custom profile for personalized attention, and ask them for these specific details.

The user can also use the "Strategy Builder" module in the UI for a guided configuration.

TONE: Professional, data-centric, analytical, and concise.`;

/**
 * Chat with Gemini with specific temperature settings for extraction and conversation.
 */
export async function chatWithGemini(prompt: string, type: 'chat' | 'extract' | 'code' = 'chat', documents?: string[], universeContext: any = []) {
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.trim() === "") {
    const isBrowser = typeof window !== 'undefined';
    const msg = isBrowser 
      ? "GEMINI_API_KEY is missing in the browser. In full-stack mode, this request should be handled by the server." 
      : "GEMINI_API_KEY is missing in the server environment variables.";
    throw new Error(msg);
  }

  const model = "gemini-flash-latest";
  // As requested: Temp 0 for extraction, Temp 0.4 for grounded humanized response
  const temperature = type === 'extract' ? 0 : type === 'code' ? 0.2 : 0.4;
  
  const contents: any[] = [];
  
  // RAG processing for chat
  let docContext = "";
  if (type === 'chat' && documents && documents.length > 0) {
    docContext = documents.join("\n\n");
  }

  let finalContents: any;

  if (type === 'chat') {
    const ragPrompt = `
      INTERNAL PROJECT FOCUS: BITA Financial Intelligence Terminal.
      
      TECHNICAL CONTEXT (Specific to BITA/User):
      ${docContext || "No specific technical context provided for this query."}
      
      INVESTMENT UNIVERSE SNAPSHOT (BITA Data):
      ${JSON.stringify(universeContext)}
      
      INSTRUCCIONES DE RESPUESTA:
      1. Responde de forma amable y profesional.
      2. Si la consulta es sobre BITA o el universo de inversión específico, utiliza los datos proporcionados arriba como fuente principal de verdad.
      3. Si la consulta es sobre el ecosistema financiero general (crypto, commodities, FX, macro), utiliza tu amplio conocimiento base para responder de forma experta.
      4. Si el usuario pide una ESTRATEGIA PERSONALIZADA, verifica que tengas su perfil (Sectores, Horizonte, Riesgo). Si no, solicítalo educadamente.
      5. Usa markdown para tablas y estructuras.

      USER QUERY: "${prompt}"
    `;
    finalContents = { parts: [{ text: ragPrompt }] };
  } else {
    finalContents = { parts: [{ text: prompt }] };
  }

  let systemInstructions = AGENT_SYSTEM_INSTRUCTION;

  if (type === 'extract') {
    systemInstructions = `You are a financial universe construction expert. 
    Convert user requests into a JSON filter object.
    Supported identifiers for 'sector': ${UNIVERSE_METADATA.SECTORS.join(', ')}
    Supported identifiers for 'themes': ${UNIVERSE_METADATA.THEMES.join(', ')}
    Supported identifiers for 'geography': ${UNIVERSE_METADATA.GEOGRAPHIES.join(', ')}.

    Return JSON with fields:
    - query: string (the general semantic search term)
    - geography: string
    - sector: string (must match one of the supported sectors)
    - themes: string[] (must match supported themes)
    - minEsg: number (0-100)
    - explanation: string (short detail on what you parsed)
    - suggestedSlices: string[] (2-3 short strings of follow-up queries or focus areas like 'Focus on AA+ ESG' or 'Filter by Market Cap > 100B')

    Respond ONLY with raw JSON.`;
  } else if (type === 'code') {
    systemInstructions = `You are an expert AI software engineer specializing in Pinecone vector database integrations and AI workflows. 
    Generate efficient, production-ready TypeScript code using the official Pinecone SDK.
    Follow Type Safety, clean programming patterns, and provide detailed code comments.
    Always prioritize error handling as requested in the app environment (use try/catch blocks).
    
    If the code interacts with Pinecone, use the official '@pinecone-database/pinecone' SDK patterns.`;
  }

  try {
    const response = await ai.models.generateContent({
      model,
      contents: finalContents,
      config: {
        systemInstruction: systemInstructions,
        temperature: temperature,
      }
    });

    if (!response.text) {
      console.warn("Frontend Gemini Call: Empty text response.");
    }

    return response.text || (type === 'extract' ? "{}" : "No response generated.");
  } catch (error: any) {
    console.error("Gemini API Error (Frontend):", error);
    const msg = error.message || "";
    if (msg.includes("API key not valid")) {
       return "Terminal Auth Error: Your BITA Command Key is invalid or has expired.";
    }
    if (msg.includes("User location is not supported")) {
      return "Geographic Restriction: Gemini is not supported in your region.";
    }
    return type === 'extract' ? "{}" : `The system encountered an error: ${error.message || "Unknown error"}`;
  }
}
