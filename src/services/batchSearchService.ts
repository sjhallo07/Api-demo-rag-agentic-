
import { Security } from '../types';

interface SearchRequest {
  query?: string;
  filters?: any;
  resolve: (results: Security[]) => void;
  reject: (error: any) => void;
}

class BatchSearchService {
  private queue: SearchRequest[] = [];
  private timer: ReturnType<typeof setTimeout> | null = null;
  private BATCH_WINDOW_MS = 50;

  async search(query?: string, filters?: any): Promise<Security[]> {
    return new Promise((resolve, reject) => {
      this.queue.push({ query, filters, resolve, reject });
      
      if (!this.timer) {
        this.timer = setTimeout(() => this.processBatch(), this.BATCH_WINDOW_MS);
      }
    });
  }

  private async processBatch() {
    const currentQueue = [...this.queue];
    this.queue = [];
    this.timer = null;

    if (currentQueue.length === 0) return;

    // If only one request, we could still use the batch endpoint or fallback to search
    // But since we want efficiency for many, batch endpoint is preferred
    try {
      const response = await fetch('/api/universe/batch-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          batch: currentQueue.map(q => ({ query: q.query, filters: q.filters }))
        })
      });

      if (!response.ok) {
        throw new Error(`Batch search failed: ${response.statusText}`);
      }

      const data = await response.json();
      const results = data.results;

      currentQueue.forEach((req, index) => {
        if (results[index] && results[index].results) {
          req.resolve(results[index].results);
        } else {
          req.resolve([]);
        }
      });
    } catch (error) {
      currentQueue.forEach(req => req.reject(error));
    }
  }
}

export const batchSearchService = new BatchSearchService();
