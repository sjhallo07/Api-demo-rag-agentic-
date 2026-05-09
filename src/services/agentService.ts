import { GoogleGenAI } from "@google/genai";
import { searchUniverse } from "./universeService.ts";

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

  /**
   * Simple connectivity test.
   */
  async testConnection(): Promise<boolean> {
    try {
      const apiKey = (process.env.BITA_AI_API_KEY || "").trim().replace(/^["'](.+)["']$/, '$1');
      if (!apiKey || apiKey === "MY_BITA_AI_API_KEY") return false;
      
      const ai = new GoogleGenAI({ apiKey: apiKey });
      await ai.models.generateContent({
        model: "gemini-flash-latest",
        contents: "ping",
      });
      return true;
    } catch (error) {
      console.error("BITA Orchestrator: Connection test failed.", error);
      return false;
    }
  }

  async processRequest(query: string, documents?: string[], extractionOnly: boolean = false, customSystem?: string, customTemp?: number): Promise<AgentResponse> {
    let apiKey = (process.env.BITA_AI_API_KEY || "").trim();
    // Robust parsing for quoted strings
    apiKey = apiKey.replace(/^["'](.+)["']$/, '$1').trim();

    console.log(`BITA Orchestrator: Initializing with BITA_AI_API_KEY_STATUS: ${apiKey ? "FOUND_AND_NOT_EMPTY" : "NOT_FOUND_OR_EMPTY"}`);

    if (!apiKey || apiKey === "MY_BITA_AI_API_KEY") {
      console.error("BITA Orchestrator: BITA_AI_API_KEY is missing or empty.");
      return {
        content: `ERROR: BITA_AI_API_KEY is missing. Please ensure you have added a secret named 'BITA_AI_API_KEY' in the AI Studio Settings (Secrets icon on the left).`,
        data: []
      };
    }
    // ... (rest of code)

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
    let systemInstruction = customSystem || this.systemInstruction;
    let temperature = customTemp ?? 0.5;

    if (extractionOnly) {
      if (!customSystem) {
        systemInstruction = "You are a financial entity extractor. Convert the user's natural language request into a filter JSON object. Fields: geography (string), sector (string), minEsg (number 0-100), theme (string). Respond ONLY with valid JSON.";
      }
      prompt = `USER_QUERY: ${query}\n\nRespond with JSON only.`;
      if (customTemp === undefined) temperature = 0;
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
      console.log(`BITA Orchestrator: Sending request to Gemini [Model: gemini-flash-latest, Type: ${extractionOnly ? 'Extraction' : 'Chat'}]`);
      
      const ai = new GoogleGenAI({ apiKey: apiKey });
      const response = await ai.models.generateContent({ 
        model: "gemini-flash-latest", 
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
          temperature: temperature,
        }
      });
      
      if (!response.text) {
        console.warn("BITA Orchestrator: Gemini returned empty response text.");
      }

      return {
        content: response.text || (extractionOnly ? "{}" : "No response generated by the intelligence cluster."),
        data: extractionOnly ? null : searchUniverse(query)
      };
    } catch (error: any) {
      console.error("BITA Orchestrator Error (Critical):", error);
      
      const errorMsg = error.message || "";
      const errorJson = JSON.stringify(error);
      
      if (errorMsg.includes("API key not valid") || errorJson.includes("API_KEY_INVALID") || errorMsg.includes("API key expired") || errorJson.includes("API_KEY_EXPIRED")) {
        return {
          content: "AUTHENTICATION_FAILED: The provided BITA_AI_API_KEY is invalid or has expired. Please renew your key in the 'Secrets' panel in AI Studio Settings.",
          data: []
        };
      }
      
      if (errorMsg.includes("User location is not supported") || errorJson.includes("LOCATION_NOT_SUPPORTED")) {
         return {
          content: "GEOGRAPHIC_RESTRICTION: The Gemini API is not supported in your current region. Please use a supported region or proxy.",
          data: []
        };
      }

      return {
        content: `Agentic Orchestration Error [${error.code || 'UNKNOWN_CODE'}]: ${error.message || "The cluster encountered an internal connectivity issue."}`,
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
