export const fetchAnalyticsData = async (timeframe: string, portfolioId: string) => {
  // Simulate API call
  return {
    performance: Array.from({ length: 30 }, (_, i) => ({ date: `2024-04-${i + 1}`, value: 100 + Math.random() * 50 })),
    countryBreakdown: [
      { name: 'US', value: 50 },
      { name: 'Europe', value: 30 },
      { name: 'Asia', value: 20 },
    ],
    sectorBreakdown: [
      { name: 'Tech', value: 40 },
      { name: 'Finance', value: 30 },
      { name: 'Energy', value: 20 },
      { name: 'Consumer', value: 10 },
    ],
    esgMetrics: {
      avgScore: 78,
      controversies: 'low',
      carbonIntensity: 150
    }
  };
};
