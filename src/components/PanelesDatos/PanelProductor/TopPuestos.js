import React from "react";
import TablaPuestos from "./TablaPuestos";
import GraficaTortaProductos from "../GraficaTortaProductos";
import useProducerStatistic from "./useProducerStatistic";
import LoadingSpinner from "../../ComponentesGenerales/LoadingSpinner";
const TopPuestos = ({ eventoId }) => {
  const { data, loading, error } = useProducerStatistic("total-recaudado-por-puesto-en-evento", eventoId);
  const stands = Array.isArray(data) ? data : [];
  return <section className="qf-manager-chart-card"><h2>Recaudación por puesto</h2><p>Compará los pedidos y la participación de cada puesto.</p>{loading ? <div className="qf-manager-chart-message" role="status"><LoadingSpinner label=<LoadingSpinner label="Cargando puestos…" /> /></div> : error ? <div className="qf-manager-chart-message" role="status">No pudimos cargar los puestos.</div> : !stands.length ? <div className="qf-manager-chart-message">Todavía no hay ventas para esta selección.</div> : <><TablaPuestos data={stands} /><GraficaTortaProductos height={320} productos={stands.map((stand) => ({ nombre: stand.nombre, dinero: Number(stand.total) || 0 }))} /></>}</section>;
};
export default TopPuestos;
