export type Sector = "Technology" | "Semiconductors" | "Automotive" | "Communication Services" | "Healthcare" | "Energy" | "Finance";

export interface Security {
  id: string;
  name: string;
  sector: string;
  geography: string;
  score: number;
  esg: string;
  momentum: number;
  pe: number;
  marketCap: string;
  theme: string;
}

export interface AttachmentMetadata {
  id: string; // Unique ID for reordering
  data: string;
  name: string;
  type: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  attachments?: AttachmentMetadata[]; // Detailed metadata for thumbnails/icons
}

export type ModuleId = "universe" | "analytics" | "backtesting" | "thematics" | "factsheets" | "data" | "strategy" | "mobile_preview" | "docs" | "admin";

export interface UniverseQueryResponse {
  status: string;
  results: Security[];
  query?: string;
}
