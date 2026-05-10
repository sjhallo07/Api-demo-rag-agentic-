import { GoogleGenAI } from "@google/genai";
import { searchUniverse } from "./universeService.ts";
import { getQuote } from "./finnhubService.ts";
import { semanticSearch } from "./vectorService.ts";
import { getKnowledgeBase } from "./knowledgeService.ts";

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
        model: "gemini-3-flash-preview",
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

    // Fallback to platform-provided GEMINI_API_KEY if custom BITA key is missing
    if (!apiKey || apiKey === "MY_BITA_AI_API_KEY") {
      apiKey = (process.env.GEMINI_API_KEY || "").trim().replace(/^["'](.+)["']$/, '$1');
    }

    console.log(`BITA Orchestrator: Initializing with API_KEY_STATUS: ${apiKey ? "FOUND" : "NOT_FOUND"}`);

    if (!apiKey) {
      console.error("BITA Orchestrator: No valid Gemini API key found.");
      return {
        content: `ERROR: Gemini API Key is missing. Please ensure you have added a secret named 'BITA_AI_API_KEY' or 'GEMINI_API_KEY' in the AI Studio Settings.`,
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
    let universeResults: any[] = [];

    if (extractionOnly) {
      if (!customSystem) {
        systemInstruction = "You are a financial entity extractor. Convert the user's natural language request into a filter JSON object. Fields: geography (string), sector (string), minEsg (number 0-100), theme (string). Respond ONLY with valid JSON.";
      }
      prompt = `USER_QUERY: ${query}\n\nRespond with JSON only.`;
      if (customTemp === undefined) temperature = 0;
    } else {
      universeResults = searchUniverse(query);
      
      // Inject real-time market data if ticker found
      let marketData = "";
      const tickerMatch = query.match(/\b([A-Z]{1,5})\b/);
      if (tickerMatch) {
        const quote = await getQuote(tickerMatch[1]);
        if (quote && quote.c > 0) {
          marketData = `REAL_TIME_DATA (${tickerMatch[1]}): Price $${quote.c}, Change $${quote.d} (${quote.dp}%).`;
        }
      }

      prompt = `
        INTERNAL PROJECT FOCUS: BITA Financial Intelligence Terminal.
        MARKET DATA: ${marketData || "None"}
        DOCUMENT CONTEXT: ${docContext || "None"}
        UNIVERSE DATA: ${JSON.stringify(universeResults)}
        USER QUERY: ${query}
        INSTRUCTIONS: Reference specific chunks and suggest tickers. Always cite the Source_Doc_X and Chunk_Y for each claim you make using the format [Source_Doc_X_Chunk_Y].
      `;
    }
    
    try {
      console.log(`BITA Orchestrator: Sending request to Gemini [Model: gemini-3-flash-preview, Type: ${extractionOnly ? 'Extraction' : 'Chat'}]`);
      
      const ai = new GoogleGenAI({ apiKey: apiKey });
      const response = await ai.models.generateContent({ 
        model: "gemini-3-flash-preview", 
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
        data: extractionOnly ? null : universeResults
      };
    } catch (error: any) {
      console.error("BITA Orchestrator Error (Critical):", error);
      
      const errorMsg = error.message || "";
      const errorJson = JSON.stringify(error);
      
      if (!extractionOnly && (errorMsg.includes("429") || errorMsg.includes("RESOURCE_EXHAUSTED") || errorJson.includes("429"))) {
        return await this.localFallback(query, documents);
      }

      if (errorMsg.includes("429") || errorMsg.includes("RESOURCE_EXHAUSTED") || errorJson.includes("429")) {
        return {
          content: "QUOTA_EXHAUSTED: You have reached the usage limit for the Gemini free tier. Please wait a few minutes, or if you are using a personal key, check your daily quota. You can also provide an O1-supported API key with higher limits in settings.",
          data: []
        };
      }

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

  /**
   * Fallback logic when Gemini LLM is unavailable
   */
  private async localFallback(query: string, documents?: string[]): Promise<AgentResponse> {
    console.log("BITA Orchestrator: Entering Local Fallback Mode (LLM unavailable)");
    
    let fallbackContent = "### [BITA_LOCAL_INTELLIGENCE_FALLBACK]\n\n";
    fallbackContent += "The primary Gemini Orchestrator is currently at capacity or unavailable. Switching to local semantic retrieval and market data telemetry.\n\n";

    // 1. Finnhub Integration (Market Data)
    const tickerMatch = query.match(/\b([A-Z]{1,5})\b/);
    if (tickerMatch) {
      const symbol = tickerMatch[1];
      const quote = await getQuote(symbol);
      if (quote && quote.c > 0) {
        fallbackContent += `**Real-time Market Telemetry (${symbol}):**\n`;
        fallbackContent += `- Current Price: $${quote.c.toFixed(2)}\n`;
        fallbackContent += `- Daily Change: ${quote.d >= 0 ? '+' : ''}${quote.d.toFixed(2)} (${quote.dp.toFixed(2)}%)\n\n`;
      }
    }

    // 2. Semantic Retrieval (Transformers.js)
    const candidates: string[] = [];
    
    try {
      // Add Knowledge Base
      const kb = getKnowledgeBase();
      kb.forEach(ins => candidates.push(`[Knowledge_Base]: ${ins.title} - ${ins.content}`));
      
      // Add uploaded Docs
      if (documents) {
        documents.forEach(doc => {
          const chunks = this.chunkText(doc, 500, 100); // smaller chunks for fallback
          chunks.slice(0, 10).forEach(c => candidates.push(`[Uploaded_Doc]: ${c}`));
        });
      }

      if (candidates.length > 0) {
        const matches = await semanticSearch(query, candidates, 3);
        if (matches.length > 0) {
          fallbackContent += "**Relevant Context Matches (Semantic Search):**\n";
          matches.forEach(m => {
            fallbackContent += `> ${m.content.substring(0, 200)}... (Match Score: ${(m.score * 100).toFixed(1)}%)\n\n`;
          });
        }
      }
    } catch (e) {
      console.warn("BITA Orchestrator: Local semantic search fallback failed.", e);
    }

    // 3. Universe Static Search
    const universeResults = searchUniverse(query);
    if (universeResults.length > 0) {
      fallbackContent += "**Universe Construction Suggestions:**\n";
      universeResults.slice(0, 3).forEach(res => {
         fallbackContent += `- ${res.name} (${res.id})\n`;
      });
    }

    fallbackContent += "\n*Note: Natural language synthesis is limited in fallback mode. Please check your Gemini API key in settings for full Orchestration.*";

    return {
      content: fallbackContent,
      data: universeResults
    };
  }
}

export const bitaAgent = new BitaAgent();
