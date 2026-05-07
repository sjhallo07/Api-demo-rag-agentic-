import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

/**
 * Generates an embedding for a piece of text.
 */
export async function getEmbedding(text: string): Promise<number[]> {
  try {
    const result = await ai.models.embedContent({
      model: "gemini-embedding-2-preview",
      content: { parts: [{ text }] },
    });
    return result.embedding.values || [];
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

const AGENT_SYSTEM_INSTRUCTION = `You are the BITA Strategic RAG Agent. 
YOUR FIRST TASK: You must profile the user. Ask about:
1. Sectors of interest.
2. Investment horizon (Short-term vs Long-term).
3. Risk appetite (Aggressive vs Passive/Conservative).

Once you have this context, use it to filter the Investment Universe and plan a strategy. 
The user can also use the "Strategy Builder" module in the UI for a guided configuration.
Always suggest specific actions (tickers) that match their profile.
If the user has not provided these details, politely ask for them to refine the strategy.

You are a financial assistance, professional, data-centric, and concise.`;

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
      
      CONTEXTO TÉCNICO (VERDAD ABSOLUTA):
      ${docContext || "No specific technical context provided for this query."}
      
      INVESTMENT UNIVERSE SNAPSHOT: 
      ${JSON.stringify(universeContext)}
      
      INSTRUCCIONES DE RESPUESTA:
      1. Responde de forma amable y conversacional pero profesional.
      2. USA ÚNICAMENTE el contexto técnico y los datos del universo proporcionados arriba. 
      3. Si la respuesta no se puede derivar del contexto, di educadamente que no tienes esa información específica en el terminal.
      4. PROHIBIDO inventar datos financieros o especulaciones fuera del contexto inyectado.
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
