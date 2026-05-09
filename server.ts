import "dotenv/config";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { bitaAgent } from "./src/services/agentService.ts";
import { searchUniverse } from "./src/services/universeService.ts";

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

  // Analytics API
  app.get("/api/analytics/portfolio", (req, res) => {
    // In a real app, this would be tied to a user session
    res.json({
      status: "success",
      data: searchUniverse().slice(0, 5).map(s => ({
        ...s,
        weight: 0.2,
        performance_1y: (Math.random() * 30 - 5).toFixed(2)
      }))
    });
  });

  // Factsheets API
  app.get("/api/factsheets/:id", (req, res) => {
    const { id } = req.params;
    res.json({
      status: "success",
      instrument_id: id,
      factsheet_url: `https://bita.io/factsheets/${id}.pdf`,
      last_updated: new Date().toISOString()
    });
  });

  // Backtesting API
  app.post("/api/backtest", (req, res) => {
    const { portfolio, start_date, end_date } = req.body;
    res.json({
      status: "success",
      results: {
        total_return: "14.2%",
        sharpe_ratio: "1.24",
        drawdown: "-8.5%",
        data_points: 120
      }
    });
  });

  // Thematics API
  app.get("/api/thematics", (req, res) => {
    res.json({
      status: "success",
      themes: [
        { id: "ai", name: "Artificial Intelligence", exposure: 0.85 },
        { id: "energy", name: "Clean Energy", exposure: 0.62 },
        { id: "health", name: "Genomics", exposure: 0.44 }
      ]
    });
  });

  // Bash Execution API (Security Sandbox: Whitelist Only)
  app.post("/api/run-bash", (req, res) => {
    const { command } = req.body;
    
    // Whitelist for security
    const allowedCommands: { [key: string]: string } = {
      "whoami": "whoami",
      "ls": "ls -la",
      "date": "date",
      "echo": "echo 'Hello from BITA Sandbox'"
    };
    
    if (!allowedCommands[command]) {
      return res.status(403).json({ status: "error", message: "Command not authorized" });
    }
    
    const { exec } = require('child_process');
    exec(allowedCommands[command], (error: any, stdout: any, stderr: any) => {
      if (error) {
        return res.status(500).json({ status: "error", message: error.message });
      }
      res.json({ status: "success", output: stdout || stderr });
    });
  });

  // RAG Orchestrator Endpoint
  app.post("/api/agent/chat", async (req, res) => {
    const { query, documents, extractionOnly, systemInstruction, temperature } = req.body;
    try {
      const response = await bitaAgent.processRequest(query, documents, extractionOnly, systemInstruction, temperature);
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
    const key = process.env.GEMINI_API_KEY || "";
    const keyStatus = key ? "FOUND (First 4: " + key.trim().substring(0, 4) + "...)" : "MISSING";
    
    if (!key) {
      const fs = require('fs');
      const envPath = path.join(process.cwd(), '.env');
      const envExists = fs.existsSync(envPath);
      console.warn(`BITA Warning: GEMINI_API_KEY is missing from environment. .env file exists: ${envExists}`);
    }

    console.log(`BITA Command Server running on http://localhost:${PORT}`);
    console.log(`GEMINI_API_KEY Status: ${keyStatus}`);
  });
}

startServer();
