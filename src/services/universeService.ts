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

export const INSTRUMENTS: Security[] = [
  { id: "AAPL", name: "Apple Inc.", sector: "Technology", geography: "North America", score: 0.98, esg: "AA", momentum: 0.75, pe: 28.5, marketCap: "2.8T", theme: "Consumer Tech" },
  { id: "SAP", name: "SAP SE", sector: "Technology", geography: "Europe", score: 0.92, esg: "AAA", momentum: 0.65, pe: 22.1, marketCap: "180B", theme: "Enterprise Software" },
  { id: "ASML", name: "ASML Holding", sector: "Semiconductors", geography: "Europe", score: 0.95, esg: "AA", momentum: 0.88, pe: 35.2, marketCap: "350B", theme: "Lithography" },
  { id: "NVDA", name: "NVIDIA Corp.", sector: "Semiconductors", geography: "North America", score: 0.94, esg: "A", momentum: 0.98, pe: 65.4, marketCap: "2.2T", theme: "AI/GPU" },
  { id: "MC.PA", name: "LVMH", sector: "Consumer", geography: "Europe", score: 0.88, esg: "A", momentum: 0.55, pe: 24.8, marketCap: "400B", theme: "Luxury" },
  { id: "VOW3", name: "Volkswagen", sector: "Automotive", geography: "Europe", score: 0.72, esg: "B", momentum: 0.42, pe: 4.5, marketCap: "70B", theme: "EV Transition" },
  { id: "HSBA.L", name: "HSBC Holdings", sector: "Finance", geography: "Europe", score: 0.65, esg: "BBB", momentum: 0.48, pe: 6.8, marketCap: "150B", theme: "Global Banking" },
  { id: "OR.PA", name: "L'Oreal", sector: "Consumer", geography: "Europe", score: 0.91, esg: "AA", momentum: 0.61, pe: 32.5, marketCap: "230B", theme: "Personal Care" },
];

export interface PortfolioPosition extends Security {
  weight: number;
  unrealizedPL: number;
  returnHistory: { date: string; value: number }[];
}

export function getPortfolioData() {
  const portfolio: PortfolioPosition[] = INSTRUMENTS.slice(0, 5).map(s => ({
    ...s,
    weight: Math.random() * 0.3 + 0.1,
    unrealizedPL: (Math.random() * 20) - 5,
    returnHistory: Array.from({ length: 30 }, (_, i) => ({
      date: `2024-04-${i + 1}`,
      value: 100 + (Math.random() * 20) + (i * 0.5)
    }))
  }));

  // Normalize weights
  const totalWeight = portfolio.reduce((sum, p) => sum + p.weight, 0);
  portfolio.forEach(p => p.weight = p.weight / totalWeight);

  return portfolio;
}

export function searchUniverse(query?: string, filters?: any) {
  let results = [...INSTRUMENTS];

  if (filters) {
    if (filters.geography) {
      results = results.filter(i => i.geography.toLowerCase() === filters.geography.toLowerCase());
    }
    if (filters.sector) {
      results = results.filter(i => i.sector.toLowerCase().includes(filters.sector.toLowerCase()));
    }
    if (filters.minEsg) {
      const esgMap: Record<string, number> = { 'AAA': 90, 'AA': 80, 'A': 70, 'BBB': 60, 'BB': 50, 'B': 40 };
      results = results.filter(i => (esgMap[i.esg] || 0) >= filters.minEsg);
    }
    if (filters.themes && Array.isArray(filters.themes) && filters.themes.length > 0) {
      results = results.filter(i => filters.themes.includes(i.theme));
    }
  }

  if (query) {
    const q = query.toLowerCase();
    // Simulate "Sentence-Transformers" by checking for semantic keyword overlap and themes
    results = results.map(i => {
      let semanticScore = 0;
      const features = [i.name, i.sector, i.theme, i.geography].join(' ').toLowerCase();
      
      // Exact matches
      if (features.includes(q)) semanticScore += 0.5;
      
      // Theme matching (simulating vector proximity)
      const themes: Record<string, string[]> = {
        'ai': ['nvidia', 'gpu', 'semiconductor', 'tech'],
        'luxury': ['lvmh', 'consumer', 'premium'],
        'green': ['esg', 'aaa', 'clean', 'ev'],
        'safety': ['hedge', 'finance', 'passive']
      };

      Object.entries(themes).forEach(([key, words]) => {
        if (q.includes(key)) {
          if (words.some(w => features.includes(w))) semanticScore += 0.4;
        }
      });

      return {
        ...i,
        score: Math.min(0.99, semanticScore + (Math.random() * 0.1))
      };
    }).sort((a, b) => b.score - a.score);
  }

  return results.slice(0, 10);
}
