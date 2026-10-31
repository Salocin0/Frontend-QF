import { useEffect, useContext, useState } from "react";
import { UserContext } from "../../ComponentesGenerales/UserContext";
import CardGenericaEstadistica from "./CardGenericaEstadistica";
import "./Perfil.css";

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

const numeric = (value) => Math.max(0, Number(value) || 0);

export const buildActivity = (role, data) => {
  const d = data || {};
  if (role === "repartidor") return [
    { label: "Pedidos entregados", value: numeric(d.pedidos_entregados) },
    { label: "Eventos trabajados", value: numeric(d.eventos_participados) },
  ];
  if (role === "productor") return [{ label: "Eventos creados", value: numeric(d.total_eventos) }];
  return [
    { label: "Pedidos realizados", value: numeric(d.total_pedidos) },
    { label: "Eventos participados", value: numeric(d.total_eventos) },
  ];
};

export const ActivityChart = ({ rows, money = false }) => {
  const max = Math.max(1, ...rows.map((row) => row.value));
  if (!rows.some((row) => row.value > 0)) return (
    <p className="qf-profile-empty">Todavía no hay actividad para graficar. Tus estadísticas aparecerán acá cuando empieces.</p>
  );
  return (
    <ul className={`qf-profile-bars${!money && rows.length > 1 ? " qf-profile-bars--activity" : ""}`} aria-label={money ? "Recaudación por puesto" : "Actividad acumulada"}>
      {rows.map((row, index) => (
        <li key={`${row.label}-${index}`}>
          <div className="qf-profile-bar-label"><span>{row.label}</span><strong>{money ? formatMoney(row.value) : row.value.toLocaleString("es-AR")}</strong></div>
          <div className="qf-profile-bar-track" aria-hidden="true">
            <div className={`qf-profile-bar-fill qf-profile-bar-fill--${index % 3}`} style={{ width: `${row.value / max * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
};

const EstadisticasPerfil = () => {
  const { user } = useContext(UserContext);
  const role = user?.tipoUsuario;
  const consumerId = user?.consumidorId;
  const [state, setState] = useState({ loading: true, data: null, error: false, rows: [], chartError: false });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const rawBase = process.env?.REACT_APP_BACK_URL || "";
    const base = rawBase.endsWith("/") ? rawBase : `${rawBase}/`;
    const get = async (path, body) => {
      const response = await fetch(`${base}estadisticas/${path}/${consumerId}`, {
        signal: controller.signal,
        ...(body ? { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) } : {}),
      });
      if (!response.ok) throw new Error("No se pudieron cargar las estadísticas");
      const json = await response.json();
      return json?.data;
    };
    const load = async () => {
      setState({ loading: true, data: null, error: false, rows: [], chartError: false });
      try {
        const filters = { idPuesto: "Todos", idEvento: "Todos" };
        const result = role === "encargado"
          ? { total_recaudado: await get("total-recaudado-puesto-evento", filters) }
          : await get(["productor", "repartidor"].includes(role) ? role : "consumidor");
        let rows = buildActivity(role, result);
        let chartError = false;
        if (role === "encargado") {
          try {
            const puestos = await get("puestos-con-pedidos");
            if (!Array.isArray(puestos)) throw new Error("Respuesta inválida");
            rows = await Promise.all(puestos.map(async (puesto) => ({
              label: puesto.nombreCarro || `Puesto ${puesto.numeroCarro || puesto.id}`,
              value: numeric(await get("total-recaudado-puesto-evento", { idPuesto: puesto.id, idEvento: "Todos" })),
            })));
            rows.sort((a, b) => b.value - a.value);
          } catch (error) {
            if (controller.signal.aborted) return;
            rows = [];
            chartError = true;
          }
        }
        if (!controller.signal.aborted) setState({ loading: false, data: result, error: false, rows, chartError });
      } catch (error) {
        if (!controller.signal.aborted) setState({ loading: false, data: null, error: true, rows: [], chartError: false });
      }
    };
    if (consumerId != null) load();
    else setState({ loading: false, data: null, error: true, rows: [], chartError: false });
    return () => controller.abort();
  }, [role, consumerId, attempt]);

  return (
    <section className="qf-profile-stats" aria-labelledby="profile-stats-title" aria-busy={state.loading}>
      <header className="qf-profile-stats-heading">
        <div><span className="qf-profile-eyebrow">TU ACTIVIDAD</span><h2 id="profile-stats-title">Estadísticas de tu perfil</h2></div>
        <span className="qf-profile-period">Total acumulado</span>
      </header>
      {state.loading ? <p role="status" className="qf-profile-empty">Cargando estadísticas…</p> : state.error ? (
        <div role="alert" className="qf-profile-empty"><p>No pudimos cargar tus estadísticas.</p><button className="qf-btn qf-btn--primary" onClick={() => setAttempt((value) => value + 1)}>Reintentar</button></div>
      ) : <>
        <div className="qf-profile-metrics">
          {buildMetrics(role, state.data).map((metric) => (
            <CardGenericaEstadistica key={metric.titulo} {...metric} />
          ))}
        </div>
        <div className="qf-profile-chart">
          <div className="qf-profile-chart-heading">
          <h3>{role === "encargado" ? "Recaudación por puesto" : "Tu actividad en números"}</h3>
          <p className="qf-profile-chart-caption">{role === "encargado" ? "Ingresos acumulados de tus puestos con pedidos entregados o valorados." : "Cantidad acumulada de pedidos y eventos según tu rol."}</p>
          </div>
          {state.chartError ? <p role="status">No pudimos cargar el detalle por puesto.</p> : <ActivityChart rows={state.rows} money={role === "encargado"} />}
        </div>
      </>}
    </section>
  );
};

export default EstadisticasPerfil;
