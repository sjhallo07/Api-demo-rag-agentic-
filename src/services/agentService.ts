import { GoogleGenAI } from "@google/genai";
import { searchUniverse } from "./universeService";

export interface AgentResponse {
  content: string;
  toolCalls?: any[];
  data?: any;
}

export class BitaAgent {
  private systemInstruction = `You are the BITA Strategic RAG Agent. 
    YOUR FIRST TASK: You must profile the user. Ask about:
    1. Sectors of interest.
    2. Investment horizon (Short-term vs Long-term).
    3. Risk appetite (Aggressive vs Passive/Conservative).
    
    Once you have this context, use it to filter the Investment Universe and plan a strategy. 
    The user can also use the "Strategy Builder" module in the UI for a guided configuration.
    Always suggest specific actions (tickers) that match their profile.
    If the user has not provided these details, politely ask for them to refine the strategy.`;

  async processRequest(query: string, documents?: string[]): Promise<AgentResponse> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return {
        content: "Error: GEMINI_API_KEY is not configured in the environment.",
        data: []
      };
    }

    // 1. Document Processing (Advanced Chunking)
    let docContext = "";
    if (documents && documents.length > 0) {
      const allChunks: string[] = [];
      documents.forEach((doc, docIdx) => {
        const chunks = this.chunkText(doc, 1000, 200);
        chunks.forEach((chunk, chunkIdx) => {
          allChunks.push(`[Source_Doc_${docIdx}_Chunk_${chunkIdx}]: ${chunk}`);
        });
      });
      // Limit to top 10 chunks to stay within a reasonable context window for Flash
      docContext = allChunks.slice(0, 10).join("\n\n");
    }

    // 2. Semantic Retrieval (Universe Data) - DIRECT CALL
    const universeContext = searchUniverse(query);
    
    // 3. Generate Augmented Response
    const prompt = `
      INTERNAL PROJECT FOCUS: BITA Financial Intelligence Terminal.
      DOCUMENT CONTEXT (Semantic Chunks): 
      ${docContext || "No document context provided."}

      UNIVERSE DATA: ${JSON.stringify(universeContext)}
      
      USER QUERY: ${query}
      
      INSTRUCTIONS:
      - Use markdown for readability (tables, bullets).
      - If user asks for visuals, generate a mock table or ASCII chart.
      - Reference specific chunks (e.g., [Source_Doc_0_Chunk_1]) if you use information from them.
    `;
    
    try {
      const ai = new GoogleGenAI({ apiKey: apiKey });
      const response = await ai.models.generateContent({ 
        model: "gemini-3-flash-preview", 
        contents: { parts: [{ text: prompt }] },
        config: {
          systemInstruction: this.systemInstruction,
          temperature: 0.5,
        }
      });
      
      return {
        content: response.text || "No response generated.",
        data: universeContext
      };
    } catch (error: any) {
      console.error("AI Agent Error (Backend):", error);
      // Fallback for environment constraints: indicate that frontend should be used
      if (error.message?.includes("API key not valid")) {
        return {
          content: "The backend orchestration requires a verified Command Key. Falling back to local intelligence...",
          data: universeContext
        };
      }
      return {
        content: `Agentic Orchestration Error: ${error.message || "Unknown error"}`,
        data: universeContext
      };
    }
  }

  /**
   * Splits text into overlapping chunks for better RAG context
   */
  private chunkText(text: string, size: number, overlap: number): string[] {
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
}

export const bitaAgent = new BitaAgent();
