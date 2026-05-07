/**
 * Finnhub Data Provider Service
 * Handles REST and WebSocket communication with Finnhub.io
 */

const FINNHUB_KEY = "d7uadupr01qnv95msgrgd7uadupr01qnv95msgs0";
const REST_URL = "https://finnhub.io/api/v1";
const WS_URL = "wss://ws.finnhub.io";

export interface Quote {
  c: number; // Current price
  d: number; // Change
  dp: number; // Percent change
  h: number; // High price of the day
  l: number; // Low price of the day
  o: number; // Open price of the day
  pc: number; // Previous close price
  t: number; // Timestamp
}

export interface CandleData {
  c: number[]; // Close prices
  h: number[]; // High prices
  l: number[]; // Low prices
  o: number[]; // Open prices
  s: string;   // Status
  t: number[]; // Timestamps
  v: number[]; // Volume
}

/**
 * Fetch current quote for a symbol
 */
export async function getQuote(symbol: string): Promise<Quote | null> {
  try {
    const response = await fetch(`${REST_URL}/quote?symbol=${symbol}&token=${FINNHUB_KEY}`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error(`Finnhub Error (Quote):`, error);
    return null;
  }
}

/**
 * Fetch historical candles for a symbol
 * resolution: 1, 5, 15, 30, 60, D, W, M
 */
export async function getCandles(symbol: string, resolution: string = 'D', from: number, to: number): Promise<CandleData | null> {
  try {
    const response = await fetch(`${REST_URL}/stock/candle?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${to}&token=${FINNHUB_KEY}`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error(`Finnhub Error (Candles):`, error);
    return null;
  }
}

/**
 * Real-time WebSocket logic
 */
export class FinnhubWS {
  private socket: WebSocket | null = null;
  private onMessageCallback: (data: any) => void;

  constructor(onMessage: (data: any) => void) {
    this.onMessageCallback = onMessage;
  }

  connect() {
    this.socket = new WebSocket(`${WS_URL}?token=${FINNHUB_KEY}`);

    this.socket.onopen = () => {
      console.log('Finnhub WS Connected');
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.onMessageCallback(data);
    };

    this.socket.onerror = (error) => {
      console.error('Finnhub WS Error:', error);
    };

    this.socket.onclose = () => {
      console.log('Finnhub WS Closed');
    };
  }

  subscribe(symbol: string) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type: 'subscribe', symbol }));
    }
  }

  unsubscribe(symbol: string) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type: 'unsubscribe', symbol }));
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
    }
  }
}

/**
 * Learn from data for predictions (Simulated with AI logic)
 */
export async function predictPriceTrend(symbol: string, historicalData: number[]) {
  // This would ideally call a backend endpoint that uses Gemini to analyze the series
  // For now, we simulate the 'learning' process
  const trend = historicalData[historicalData.length - 1] > historicalData[0] ? 'BULLISH' : 'BEARISH';
  const confidence = Math.random() * 0.4 + 0.5;
  return { trend, confidence, symbol };
}
