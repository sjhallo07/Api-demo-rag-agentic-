# BITA Intelligence API Documentation [v1.0]

This document outlines the available endpoints for the BITA Financial Intelligence Terminal. All requests should be sent with `Content-Type: application/json`.

---

## 1. Universe Search Engine
**Endpoint:** `POST /api/universe/search`  
**Description:** Filters the 30k+ instrument universe based on quantitative factors and semantic themes.

### Request Body
```json
{
  "query": "High momentum tech stocks",
  "filters": {
    "sector": "Technology",
    "geography": "North America",
    "minEsg": 80
  }
}
```

### Response Schema
```json
{
  "status": "success",
  "query": "string",
  "results": [
    {
      "id": "AAPL",
      "name": "Apple Inc.",
      "score": 0.98,
      "esg": "AA",
      "momentum": 0.75,
      "theme": "Consumer Tech"
    }
  ]
}
```

---

## 2. RAG Agent Orchestrator
**Endpoint:** `POST /api/agent/chat`  
**Description:** The primary interface for the Strategic RAG Agent. It handles conversational logic, document ingestion (chunking/splitting), and semantic retrieval.

### Request Body
```json
{
  "query": "What is the best strategy for the semiconductor sector in the long term?",
  "documents": ["base64_doc_data_1", "base64_doc_data_2"]
}
```

### Ingestion Logic (RAG)
1. **Document Splitter**: If `documents` are provided, they are split into 1000-character chunks.
2. **Context Retrieval**: The agent performs an internal semantic query against the Universe Engine.
3. **Augmentation**: The LLM (Gemini 1.5 Flash) is grounded with both the uploaded document chunks and the retrieved universe data.

### Response Schema
```json
{
  "content": "Markdown string containing the agent's response.",
  "data": [
    { "id": "NVDA", "reason": "AI/GPU dominant theme" }
  ]
}
```

---

## Technical Specifications
- **Authentication**: Managed via Environment Variables (`BITA_AI_API_KEY`).
- **Environment**: Node.js (Express) + Vite (React).
- **Styling**: Tailwind CSS + Framer Motion.
