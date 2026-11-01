import { useEffect, useState } from "react";
export default function useProducerStatistic(endpoint, eventId) {
  const [result, setResult] = useState({ loading: true, error: false, data: null });
  useEffect(() => {
    if (!eventId) return;
    const controller = new AbortController();
    setResult({ loading: true, error: false, data: null });
    (async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACK_URL}estadisticas/${endpoint}/${eventId}`, { signal: controller.signal });
        if (!response.ok) throw new Error("No se pudo cargar la estadística");
        const data = await response.json();
        if (data.status === "error") throw new Error("No se pudo cargar la estadística");
        if (!controller.signal.aborted) setResult({ loading: false, error: false, data: data.data ?? null });
      } catch (err) { if (!controller.signal.aborted) setResult({ loading: false, error: true, data: null }); }
    })();
    return () => controller.abort();
  }, [endpoint, eventId]);
  return result;
}
