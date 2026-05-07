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

export type PlanType = "standard" | "premium";

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  isVerified: boolean;
  deviceId?: string;
  plan: PlanType;
  joinedAt: string;
}

export interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isLoading: boolean;
}

export type ModuleId = "universe" | "analytics" | "backtesting" | "thematics" | "factsheets" | "data" | "strategy" | "mobile_preview" | "docs" | "admin" | "payments" | "profile" | "market_mastery";

export interface StrategyTemplate {
  id: string;
  name: string;
  profile: {
    sectors: string[];
    horizon: 'short' | 'long' | null;
    risk: 'aggressive' | 'passive' | null;
  };
  createdAt: string;
}

export interface UniverseQueryResponse {
  status: string;
  results: Security[];
  query?: string;
}
