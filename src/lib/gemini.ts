import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

/**
 * Generates an embedding for a piece of text.
 */
export async function getEmbedding(text: string): Promise<number[]> {
  try {
    const result = await ai.models.embedContent({
      model: "gemini-embedding-2-preview",
      contents: [{ parts: [{ text }] }],
    });
    return result.embeddings?.[0]?.values || [];
  } catch (error) {
    console.error("Embedding generation failed:", error);
    return [];
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
export async function chatWithGemini(prompt: string, type: 'chat' | 'extract' = 'chat', documents?: string[], universeContext: any = []) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY not found in environment");
  }

  const model = "gemini-3-flash-preview";
  // As requested: Temp 0 for extraction, Temp 0.4 for grounded humanized response
  const temperature = type === 'extract' ? 0 : 0.4;
  
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

  const systemInstructions = type === 'extract' 
    ? "You are a financial entity extractor. Convert the user's natural language request for investment universe construction into a JSON object. Fields: geography (string), sector (string), minEsg (number 0-100), theme (string). Respond ONLY with JSON."
    : AGENT_SYSTEM_INSTRUCTION;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: finalContents,
      config: {
        systemInstruction: systemInstructions,
        temperature: temperature,
      }
    });

    return response.text || (type === 'extract' ? "{}" : "No response generated.");
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    if (error.message?.includes("API key not valid")) {
       return "Terminal Auth Error: Your BITA Command Key is invalid or has expired.";
    }
    return type === 'extract' ? "{}" : `The system encountered an error: ${error.message || "Unknown error"}`;
  }
}
