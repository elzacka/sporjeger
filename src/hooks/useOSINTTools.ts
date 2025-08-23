import { useState, useEffect } from 'react';
import type { OSINTTool } from '../types';
import { fetchOSINTTools } from '../services/googleSheets';

export function useOSINTTools() {
  const [tools, setTools] = useState<OSINTTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTools() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchOSINTTools();
        setTools(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ukjent feil');
      } finally {
        setLoading(false);
      }
    }

    loadTools();
  }, []);

  return { tools, loading, error, refetch: () => loadTools() };
}