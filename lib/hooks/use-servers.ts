import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";













export function useServers() {
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const d = await api.get("/servers");
      setServers(d.servers || []);
    } catch (e) {
      console.error("[useServers]", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {load();}, [load]);

  return { servers, loading, refetch: load };
}