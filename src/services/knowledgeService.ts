
export interface FinancialInsight {
  id: string;
  title: string;
  content: string;
  source: string;
  category: 'market' | 'macro' | 'technical' | 'unstructured';
  timestamp: string;
  impactScore: number;
}

const STORAGE_KEY = 'bita_knowledge_base_v1';

const INITIAL_INSIGHTS: FinancialInsight[] = [
  {
    id: 'INS_001',
    title: 'NVDA Q1 Earnings Outlook',
    content: 'NVIDIA is expected to show significant growth in data center segment due to H100 demand. Semantic indicators suggest extreme bullish sentiment among hyperscalers.',
    source: 'Institutional Research',
    category: 'market',
    timestamp: new Date().toISOString(),
    impactScore: 0.95
  },
  {
    id: 'INS_002',
    title: 'European ECB Policy Shift',
    content: 'ECB hints at earlier rate cuts than Fed if inflation stays below 2.5%. Eurozone technology sector could see re-rating.',
    source: 'Macro Desk',
    category: 'macro',
    timestamp: new Date().toISOString(),
    impactScore: 0.82
  }
];

export function getKnowledgeBase(): FinancialInsight[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_INSIGHTS));
    return INITIAL_INSIGHTS;
  }
  return JSON.parse(stored);
}

export function addInsight(insight: Omit<FinancialInsight, 'id' | 'timestamp'>) {
  const kb = getKnowledgeBase();
  const newInsight: FinancialInsight = {
    ...insight,
    id: `INS_${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    timestamp: new Date().toISOString()
  };
  kb.push(newInsight);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(kb));
  return newInsight;
}

export function searchKnowledge(query: string): FinancialInsight[] {
  const kb = getKnowledgeBase();
  const q = query.toLowerCase();
  return kb.filter(i => 
    i.title.toLowerCase().includes(q) || 
    i.content.toLowerCase().includes(q) ||
    i.category.toLowerCase().includes(q)
  );
}
