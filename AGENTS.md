# BITA Intelligence Agent Protocols

## Project Focus
The BITA Command Agent is a specialized financial intelligence terminal. It focuses on multi-factor investment universe construction and semantic RAG (Retrieval Augmented Generation) for qualitative financial factor research.

## Agent Architecture: RAG-Agentic
- **Orchestrator**: Express-based FastAPI equivalent managing conversational state.
- **RAG Engine**: Semantic factor matching using Gemini Embeddings and Vector Search logic.
- **Toolbox (MCP)**:
  - `search_universe`: Filters instruments by quantitative factors.
  - `analyze_thematics`: Maps megatrends to specific ticker exposures.
  - `get_reference_data`: Retrieves point-in-time financial identifiers.

## Conversational Mode
- **Focus**: Quantitative finance and Investment Universe Construction.
- **Onboarding Protocol**: The agent MUST first identify the user's focus (Sectors, Short/Long term goals, Risk Appetite) before suggesting specific tickers.
- **Temperature**: calibrated at 0.5 for balanced creativity and precision.
- **Context Injection**: Every query retrieves top-K relevant instruments from the `Reference Data API` before final synthesis.
