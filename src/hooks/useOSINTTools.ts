import { useState, useEffect } from 'react';
import type { OSINTTool } from '../types';
import { fetchOSINTTools } from '../services/googleSheets';

export function useOSINTTools() {
  const [tools, setTools] = useState<OSINTTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadTools = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchOSINTTools();
        if (mounted) {
          setTools(data);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Ukjent feil');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadTools();

    return () => {
      mounted = false;
    };
  }, []);

  return { tools, loading, error };
}