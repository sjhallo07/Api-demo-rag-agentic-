
import { Security, INSTRUMENTS } from './universeService.ts';

export interface PortfolioPosition extends Security {
  weight: number;
  unrealizedPL: number;
  returnHistory: { date: string; value: number }[];
  purchasedAt: string;
  quantity: number;
}

const STORAGE_KEY = 'bita_portfolio_v1';

export function getPortfolio(): PortfolioPosition[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    // Initial default portfolio
    const initial = INSTRUMENTS.slice(0, 3).map(s => ({
      ...s,
      weight: 0.33,
      unrealizedPL: (Math.random() * 10) - 2,
      quantity: 100,
      purchasedAt: new Date().toISOString(),
      returnHistory: Array.from({ length: 30 }, (_, i) => ({
        date: `2024-04-${i + 1}`,
        value: 100 + (Math.random() * 10) + (i * 0.2)
      }))
    }));
    savePortfolio(initial as PortfolioPosition[]);
    return initial as PortfolioPosition[];
  }
  return JSON.parse(stored);
}

export function savePortfolio(portfolio: PortfolioPosition[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(portfolio));
}

export function addAssetToPortfolio(security: Security, quantity: number) {
  const portfolio = getPortfolio();
  const existingIndex = portfolio.findIndex(p => p.id === security.id);
  
  if (existingIndex > -1) {
    portfolio[existingIndex].quantity += quantity;
  } else {
    portfolio.push({
      ...security,
      weight: 0, // Will be rebalanced or set manually
      quantity,
      unrealizedPL: 0,
      purchasedAt: new Date().toISOString(),
      returnHistory: Array.from({ length: 30 }, (_, i) => ({
        date: `2024-04-${i + 1}`,
        value: 100 + (i * 0.1)
      }))
    });
  }
  
  // Simple rebalance for demonstration: set equal weights for all
  const newTotal = portfolio.length;
  portfolio.forEach(p => p.weight = 1 / newTotal);
  
  savePortfolio(portfolio);
  return portfolio;
}

export function removeAssetFromPortfolio(id: string) {
  let portfolio = getPortfolio();
  portfolio = portfolio.filter(p => p.id !== id);
  
  // Re-normalize weights
  const totalWeight = portfolio.reduce((sum, p) => sum + p.weight, 0);
  if (totalWeight > 0) {
    portfolio.forEach(p => p.weight = p.weight / totalWeight);
  }
  
  savePortfolio(portfolio);
  return portfolio;
}

export function updatePositionWeight(id: string, weight: number) {
  const portfolio = getPortfolio();
  const index = portfolio.findIndex(p => p.id === id);
  if (index > -1) {
    portfolio[index].weight = weight;
    savePortfolio(portfolio);
  }
  return portfolio;
}
