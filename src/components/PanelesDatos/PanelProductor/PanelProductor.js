import React, { useContext, useEffect, useState, useRef } from "react";
import PageLayout from "../../ComponentesGenerales/PageLayout";
import Footer from "../../ComponentesGenerales/Footer";
import TopPuestos from "./TopPuestos";
import GraficaBarras from "../GraficaBarras";
import { UserContext } from "../../ComponentesGenerales/UserContext";
import TotalQuickFood from "./TotalGenerado";
import ValoracionPromedio from "./ValoracionPromedio";
import Breadcrumb from "../../ComponentesGenerales/Breadcrumb";
import BotonDescargaPDF from "../BotonDescargaPDF";
import "../../ComponentesGenerales/ListFilters.css";
import "../PanelEncargado/PanelEncargado.css";
import "./PanelProductor.css";

const PanelProductor = () => {
  const { user } = useContext(UserContext);
  const consumerId = user?.consumidorId ?? user?.id;
  const [events, setEvents] = useState([]);
  const [selected, setSelected] = useState("Todos");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const dashboardRef = useRef(null);
  useEffect(() => {
    if (!consumerId) return;
    const controller = new AbortController();
    setLoading(true); setError(false);
    (async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACK_URL}evento/all`, { headers: { "Content-Type": "application/json", consumidorId: consumerId }, signal: controller.signal });
        if (!response.ok) throw new Error("No se pudieron cargar los eventos");
        const data = await response.json();
        const startOf = (event) => { const time = new Date(event.fechaHoraInicio).getTime(); return Number.isNaN(time) ? Number.MAX_SAFE_INTEGER : time; };
        const list = Array.isArray(data.data) ? [...data.data].sort((a, b) => startOf(a) - startOf(b)) : [];
        if (!controller.signal.aborted) setEvents(list); // The dashboard starts on "Todos los eventos"; the list only feeds the filter.
      } catch (err) { if (!controller.signal.aborted) setError(true); }
      finally { if (!controller.signal.aborted) setLoading(false); }
    })();
    return () => controller.abort();
  }, [consumerId, attempt]);
  const selectedName = events.find((event) => String(event.id) === String(selected))?.nombre || "Todos los eventos";
  return <PageLayout sidebarProps={{ tipoUsuario: user?.tipoUsuario }}>
    <main className="qf-manager-dashboard qf-producer-dashboard">
      <Breadcrumb items={[{ title: "Inicio", url: "/inicio" }, { title: "Estadísticas", url: "/grafica-productor" }]} />
      <header className="qf-manager-dashboard-heading"><h1>Estadísticas de mis eventos</h1><p>Consultá la recaudación, las valoraciones y el rendimiento de los puestos.</p></header>
      <div className="qf-manager-dashboard-toolbar"><section className="qf-list-filters qf-manager-dashboard-filters" aria-label="Filtros de estadísticas"><label htmlFor="producer-dashboard-event">Evento<select id="producer-dashboard-event" value={selected} onChange={(event) => setSelected(event.target.value)} disabled={loading}><option value="Todos">Todos los eventos</option>{events.map((event) => <option key={event.id} value={event.id}>{event.nombre}</option>)}</select></label></section><BotonDescargaPDF dashboardRef={dashboardRef} tipo="productor" idConsumidor={consumerId} idEvento={selected || "Todos"} nombreEvento={selectedName} /></div>
      {error && <div className="qf-producer-dashboard-error" role="alert"><p>No pudimos cargar los eventos para filtrar.</p><button type="button" onClick={() => setAttempt((value) => value + 1)}>Reintentar</button></div>}
      <div ref={dashboardRef} className="qf-manager-dashboard-content">
        <section className="qf-manager-metrics" aria-label="Indicadores del evento"><TotalQuickFood eventId={selected} /><ValoracionPromedio eventoId={selected} /></section>
        <div className="qf-manager-charts"><section className="qf-manager-chart-card"><h2>Evolución de la recaudación</h2><p>Total recaudado por puesto y día para la selección actual.</p><div className="qf-producer-revenue-chart"><GraficaBarras eventId={selected} /></div></section><TopPuestos eventoId={selected} /></div>
      </div>
    </main><Footer />
  </PageLayout>;
};
export default PanelProductor;
