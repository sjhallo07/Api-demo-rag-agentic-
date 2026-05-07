import "dotenv/config";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { bitaAgent } from "./src/services/agentService";
import { searchUniverse } from "./src/services/universeService";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Search API
  app.post("/api/universe/search", (req, res) => {
    const { query, filters } = req.body;
    const results = searchUniverse(query, filters);
    res.json({
      status: "success",
      query,
      results
    });
  });

  // RAG Orchestrator Endpoint
  app.post("/api/agent/chat", async (req, res) => {
    const { query, documents } = req.body;
    try {
      const response = await bitaAgent.processRequest(query, documents);
      res.json(response);
    } catch (error) {
      console.error("Agent Error:", error);
      res.status(500).json({ error: "Agentic Orchestration Failed" });
    }
  });

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", service: "BITA-Agent-Hub" });
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`BITA Command Server running on http://localhost:${PORT}`);
  });
}

startServer();
