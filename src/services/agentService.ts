import { GoogleGenAI } from "@google/genai";
import { searchUniverse } from "./universeService";

export interface AgentResponse {
  content: string;
  toolCalls?: any[];
  data?: any;
}

export class BitaAgent {
  private systemInstruction = `You are the BITA Strategic RAG Agent, a world-class financial intelligence expert.

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

  async processRequest(query: string, documents?: string[], extractionOnly: boolean = false): Promise<AgentResponse> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return {
        content: "Error: GEMINI_API_KEY is not configured in the environment.",
        data: []
      };
    }

    // 1. Document Processing (Advanced Chunking) - skip if extractionOnly
    let docContext = "";
    if (!extractionOnly && documents && documents.length > 0) {
      const allChunks: string[] = [];
      documents.forEach((doc, docIdx) => {
        const chunks = this.chunkText(doc, 1000, 200);
        chunks.forEach((chunk, chunkIdx) => {
          allChunks.push(`[Source_Doc_${docIdx}_Chunk_${chunkIdx}]: ${chunk}`);
        });
      });
      docContext = allChunks.slice(0, 10).join("\n\n");
    }

    // 2. Build Prompt
    let prompt = "";
    let systemInstruction = this.systemInstruction;
    let temperature = 0.5;

    if (extractionOnly) {
      systemInstruction = "You are a financial entity extractor. Convert the user's natural language request into a filter JSON object. Fields: geography (string), sector (string), minEsg (number 0-100), theme (string). Respond ONLY with valid JSON.";
      prompt = `USER_QUERY: ${query}\n\nRespond with JSON only.`;
      temperature = 0;
    } else {
      const universeContext = searchUniverse(query);
      prompt = `
        INTERNAL PROJECT FOCUS: BITA Financial Intelligence Terminal.
        DOCUMENT CONTEXT: ${docContext || "None"}
        UNIVERSE DATA: ${JSON.stringify(universeContext)}
        USER QUERY: ${query}
        INSTRUCTIONS: Reference specific chunks and suggest tickers.
      `;
    }
    
    try {
      const ai = new GoogleGenAI({ apiKey: apiKey });
      const response = await ai.models.generateContent({ 
        model: "gemini-3-flash-preview", 
        contents: { parts: [{ text: prompt }] },
        config: {
          systemInstruction: systemInstruction,
          temperature: temperature,
        }
      });
      
      return {
        content: response.text || (extractionOnly ? "{}" : "No response generated."),
        data: extractionOnly ? null : searchUniverse(query)
      };
    } catch (error: any) {
      console.error("AI Agent Error (Backend):", error);
      // Fallback for environment constraints: indicate that frontend should be used
      if (error.message?.includes("API key not valid")) {
        return {
          content: "The backend orchestration requires a verified Command Key. Falling back to local intelligence...",
          data: []
        };
      }
      return {
        content: `Agentic Orchestration Error: ${error.message || "Unknown error"}`,
        data: []
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
