import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../ComponentesGenerales/UserContext";

export default function useManagerStatistic(endpoint, puestoId = "Todos", eventoId = "Todos") {
  const { user } = useContext(UserContext);
  const consumerId = user?.consumidorId;
  const [result, setResult] = useState({ loading: true, error: false, data: null });
  useEffect(() => {
    if (!consumerId) return;
    const controller = new AbortController();
    setResult({ loading: true, error: false, data: null });
    (async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACK_URL}estadisticas/${endpoint}/${consumerId}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ idPuesto: puestoId, idEvento: eventoId }), signal: controller.signal });
        if (!response.ok) throw new Error("No se pudo cargar la estadística");
        const data = await response.json();
        if (data.status === "error") throw new Error("No se pudo cargar la estadística");
        if (!controller.signal.aborted) setResult({ loading: false, error: false, data: data.data ?? null });
      } catch (err) { if (!controller.signal.aborted) setResult({ loading: false, error: true, data: null }); }
    })();
    return () => controller.abort();
  }, [consumerId, endpoint, puestoId, eventoId]);
  return result;
}
