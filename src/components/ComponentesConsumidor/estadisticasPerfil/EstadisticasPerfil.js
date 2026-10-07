import { useEffect, useContext, useState } from "react";
import { UserContext } from "../../ComponentesGenerales/UserContext";
import CardGenericaEstadistica from "./CardGenericaEstadistica";

const formatMoney = (value) => `$ ${Math.round(Number(value) || 0).toLocaleString("es-AR")}`;

// Metrics shown per role; consumer metrics only make sense for the consumidor role.
export const buildMetrics = (tipoUsuario, data) => {
  const d = data && typeof data === "object" && !Array.isArray(data) ? data : {};
  switch (tipoUsuario) {
    case "productor":
      return [
        { titulo: "Eventos Creados", valor: d.total_eventos ?? 0 },
        { titulo: "Total Generado", valor: formatMoney(d.total_recaudado) },
      ];
    case "repartidor":
      return [
        { titulo: "Eventos Trabajados", valor: d.eventos_participados ?? 0 },
        { titulo: "Pedidos Entregados", valor: d.pedidos_entregados ?? 0 },
      ];
    case "encargado":
      return [{ titulo: "Total Recaudado", valor: formatMoney(d.total_recaudado) }];
    default:
      return [
        { titulo: "Total Gastado", valor: formatMoney(d.total_gastado) },
        { titulo: "Pedidos Realizados", valor: d.total_pedidos ?? 0 },
        { titulo: "Eventos Participados", valor: d.total_eventos ?? 0 },
      ];
  }
};

const EstadisticasPerfil = () => {
  const { user } = useContext(UserContext);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const base = process.env?.REACT_APP_BACK_URL;
    const request = () => {
      switch (user.tipoUsuario) {
        case "productor":
          return fetch(`${base}estadisticas/productor/${user.consumidorId}`);
        case "repartidor":
          return fetch(`${base}estadisticas/repartidor/${user.consumidorId}`);
        case "encargado":
          return fetch(`${base}estadisticas/total-recaudado-puesto-evento/${user.consumidorId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idPuesto: "Todos", idEvento: "Todos" }),
          }).then(async (res) => {
            if (!res.ok) return res;
            const json = await res.json();
            return { ok: true, json: async () => ({ data: { total_recaudado: json.data } }) };
          });
        default:
          return fetch(`${base}estadisticas/consumidor/${user.consumidorId}`);
      }
    };

    const load = async () => {
      try {
        const response = await request();
        if (!response.ok) throw new Error("Error en la API de estadísticas");
        const json = await response.json();
        setData(json?.data || null);
      } catch (error) {
        console.error("Error al obtener estadísticas:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) load();
  }, [user]);

  if (isLoading) return <p>Cargando estadísticas...</p>;

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {buildMetrics(user?.tipoUsuario, data).map((metric) => (
        <CardGenericaEstadistica key={metric.titulo} titulo={metric.titulo} valor={metric.valor} />
      ))}
    </div>
  );
};

export default EstadisticasPerfil;
