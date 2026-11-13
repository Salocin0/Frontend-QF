import React, { useEffect, useState, useContext } from "react";
import { FaMotorcycle } from "react-icons/fa";
import PageLayout from "../../ComponentesGenerales/PageLayout";
import PedidoRepartidor from "./PedidoRepartidor";
import { UserContext } from "../../ComponentesGenerales/UserContext";
import Breadcrumb from "../../ComponentesGenerales/Breadcrumb";
import Footer from "../../ComponentesGenerales/Footer";
import "../../ComponentesGenerales/ListFilters.css";
import "./PedidosRepartidor.css";
import LoadingSpinner from "../../ComponentesGenerales/LoadingSpinner";

export const deliveryStateLabel = (state) => String(state || "Sin estado").replace(/([a-z])([A-Z])/g, "$1 $2");
const ListadoPedidosRepartidor = () => {
  const [pedidos, setPedidos] = useState([]);
  const [recargar, setRecargar] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterState, setFilterState] = useState("");
  const { user } = useContext(UserContext);
  const consumerId = user?.consumidorId;
  const retry = () => setRecargar((value) => value + 1);
  useEffect(() => {
    if (consumerId == null) return;
    const controller = new AbortController();
    setIsLoading(true); setError(false);
    (async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACK_URL}pedido/repartidor`, { method: "GET", headers: { ConsumidorId: consumerId }, signal: controller.signal });
        if (!response.ok) throw new Error("No se pudieron cargar los pedidos");
        const data = await response.json();
        if (!controller.signal.aborted) setPedidos(Array.isArray(data.data) ? data.data : []);
      } catch (err) { if (!controller.signal.aborted) setError(true); }
      finally { if (!controller.signal.aborted) setIsLoading(false); }
    })();
    return () => controller.abort();
  }, [consumerId, recargar]);
  const query = searchTerm.trim().toLocaleLowerCase("es");
  const filtered = pedidos.filter((pedido) => (!filterState || pedido.estado === filterState) && [pedido.id, pedido.puesto?.nombreCarro, pedido.consumidore?.nombre, pedido.consumidore?.apellido, pedido.puntoEncuentro?.nombre].some((value) => String(value ?? "").toLocaleLowerCase("es").includes(query)));
  const states = Array.from(new Set(pedidos.map((pedido) => pedido.estado).filter(Boolean)));
  return <PageLayout sidebarProps={{ tipoUsuario: user?.tipoUsuario }}>
    <main className="qf-delivery-page">
      <Breadcrumb items={[{ title: "Inicio", url: "/inicio" }, { title: "Pedidos asignados", url: "/pedidos-asignados" }]} />
      <header className="qf-delivery-heading"><h1>Pedidos asignados</h1><p>Consultá los detalles, ubicá el punto de encuentro y confirmá cada entrega.</p></header>
      <section className="qf-list-filters" aria-label="Filtros de pedidos"><label htmlFor="delivery-search">Buscar pedido<input id="delivery-search" type="search" placeholder="Puesto, cliente, punto o número…" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} /></label><label htmlFor="delivery-state">Estado<select id="delivery-state" value={filterState} onChange={(event) => setFilterState(event.target.value)}><option value="">Todos los estados</option>{states.map((state) => <option key={state} value={state}>{deliveryStateLabel(state)}</option>)}</select></label></section>
      {isLoading ? <p className="qf-delivery-feedback" role="status"><LoadingSpinner label=<LoadingSpinner label="Cargando pedidos…" /> /></p> : error ? <div className="qf-delivery-feedback" role="alert"><h2>No pudimos cargar tus pedidos</h2><p>Intentá nuevamente en unos instantes.</p><button type="button" className="qf-delivery-button" onClick={retry}>Reintentar</button></div> : <><p className="qf-delivery-count" aria-live="polite">{filtered.length} {filtered.length === 1 ? "pedido" : "pedidos"}{query || filterState ? ` de ${pedidos.length}` : ""}</p>{filtered.length ? <div className="qf-delivery-list">{filtered.map((pedido) => <PedidoRepartidor key={pedido.id} pedido={pedido} recargar={retry} />)}</div> : <div className="qf-delivery-feedback"><FaMotorcycle aria-hidden="true" /><h2>{query || filterState ? "No encontramos pedidos con esos filtros" : "Todavía no tenés pedidos asignados"}</h2><p>{query || filterState ? "Probá con otra búsqueda o seleccioná otro estado." : "Cuando te asignen un pedido, vas a encontrar sus datos y el punto de entrega acá."}</p>{(query || filterState) && <button type="button" className="qf-delivery-button" onClick={() => { setSearchTerm(""); setFilterState(""); }}>Limpiar filtros</button>}</div>}</>}
    </main><Footer />
  </PageLayout>;
};
export default ListadoPedidosRepartidor;
