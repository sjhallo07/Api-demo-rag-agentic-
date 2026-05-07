import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

/**
 * Splits text into overlapping chunks for better RAG context
 */
function chunkText(text: string, size: number, overlap: number): string[] {
  const chunks: string[] = [];
  if (!text || size <= 0) return chunks;
  
  let start = 0;
  while (start < text.length) {
    const end = Math.min(start + size, text.length);
    chunks.push(text.substring(start, end));
    
    if (end === text.length) break;
    start += (size - overlap);
  }
  return chunks;
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
  const temperature = type === 'extract' ? 0 : 0.5;
  
  const contents: any[] = [];
  
  // RAG processing for chat
  let docContext = "";
  if (type === 'chat' && documents && documents.length > 0) {
    const allChunks: string[] = [];
    documents.forEach((doc, docIdx) => {
      const chunks = chunkText(doc, 1000, 200);
      chunks.forEach((chunk, chunkIdx) => {
        allChunks.push(`[Source_Doc_${docIdx}_Chunk_${chunkIdx}]: ${chunk}`);
      });
    });
    docContext = allChunks.slice(0, 10).join("\n\n");
  }

  let finalContents: any;

  if (type === 'chat') {
    const ragPrompt = `
      INTERNAL PROJECT FOCUS: BITA Financial Intelligence Terminal.
      DOCUMENT CONTEXT (Semantic Chunks): 
      ${docContext || "No document context provided."}

      UNIVERSE DATA: ${JSON.stringify(universeContext)}
      
      USER QUERY: ${prompt}
      
      INSTRUCTIONS:
      - Use markdown for readability (tables, bullets).
      - If user asks for visuals, generate a mock table or ASCII chart.
      - Reference specific chunks (e.g., [Source_Doc_0_Chunk_1]) if you use information from them.
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
      return "Terminal Auth Error: Your BITA Command Key is invalid or has expired. Please verify environment settings.";
    }
    return type === 'extract' ? "{}" : `The system encountered an error: ${error.message || "Unknown error"}`;
  }
}
