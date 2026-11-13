import "../ComponentesGenerales/ListFilters.css";
import React, { useEffect, useState, useContext, useMemo, useCallback } from "react";
import PageLayout from "../ComponentesGenerales/PageLayout";
import Pedido from "./Pedido";
import { UserContext } from "../ComponentesGenerales/UserContext";
import Breadcrumb from "../ComponentesGenerales/Breadcrumb";
import Footer from "../ComponentesGenerales/Footer";
import "./Pedidos.css";
import LoadingSpinner from "../ComponentesGenerales/LoadingSpinner";

export const ORDER_STATES = {
  Todos: [], Pendientes: ["Pendiente"], Aceptados: ["Aceptado", "Precomprado"],
  "En preparación": ["EnPreparacion"], "En camino": ["EnCamino"],
  Entregados: ["Entregado", "Valorado"], Cancelados: ["Cancelado"],
};
export const filterOrders = (orders, tab, search, order) => {
  const states = ORDER_STATES[tab] || [];
  const term = search.trim().toLocaleLowerCase();
  const date = (pedido) => new Date(pedido.fecha).getTime() || 0;
  return orders.filter((pedido) => (!states.length || states.includes(pedido.estado)) &&
    [pedido.id, pedido.puesto?.nombreCarro, pedido.evento?.nombre].some((value) => String(value ?? "").toLocaleLowerCase().includes(term)))
    .sort((a, b) => order === "oldest" ? date(a) - date(b) : date(b) - date(a));
};
const ListadoPedidos = () => {
  const { user } = useContext(UserContext);
  const consumerId = user?.consumidorId;
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [reload, setReload] = useState(0);
  const [tab, setTab] = useState("Todos");
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("newest");
  const refresh = useCallback(() => setReload((value) => value + 1), []);
  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      setLoading(true); setError(false);
      try {
        const raw = process.env?.REACT_APP_BACK_URL || "";
        const response = await fetch(`${raw.endsWith("/") ? raw : `${raw}/`}pedido/`, { headers: { ConsumidorId: consumerId }, signal: controller.signal });
        if (!response.ok) throw new Error("No se pudieron cargar los pedidos");
        const json = await response.json();
        if (!controller.signal.aborted) setPedidos(Array.isArray(json.data) ? json.data : []);
      } catch (err) {
        if (!controller.signal.aborted) setError(true);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    if (consumerId != null) load();
    else { setLoading(false); setError(true); }
    return () => controller.abort();
  }, [consumerId, reload]);
  const filtered = useMemo(() => filterOrders(pedidos, tab, search, order), [pedidos, tab, search, order]);
  const reset = () => { setSearch(""); setTab("Todos"); setOrder("newest"); };
  return (
    <PageLayout sidebarProps={{ tipoUsuario: user?.tipoUsuario }}>
      <main className="qf-orders-page">
        <header className="qf-page-header qf-page-header--full">
          <h1 className="qf-page-title" style={{ textAlign: "center", fontSize: "1.75rem" }}>Pedidos</h1>
          <hr className="qf-separator qf-separator--spaced" />
        </header>
        <Breadcrumb items={[{ title: "Inicio", url: "/inicio" }, { title: "Mis pedidos", url: "/pedidos" }]} style={{ width: "100%", margin: "0 0 20px" }} />
        <section className="qf-orders-filters qf-list-filters" aria-label="Buscar y filtrar pedidos">
          <div className="qf-orders-toolbar">
            <label>Buscar pedido<input type="search" placeholder="Número de pedido, puesto o evento…" value={search} onChange={(e) => setSearch(e.target.value)} /></label>
            <label>Ordenar por<select value={order} onChange={(e) => setOrder(e.target.value)}><option value="newest">Más recientes</option><option value="oldest">Más antiguos</option></select></label>
            <button type="button" className="qf-orders-clear" onClick={reset} disabled={!search && tab === "Todos" && order === "newest"}>Limpiar filtros</button>
          </div>
          <div className="qf-orders-states" role="group" aria-label="Estado del pedido">
            {Object.entries(ORDER_STATES).map(([name, states]) => <button key={name} type="button" aria-pressed={tab === name} onClick={() => setTab(name)}>{name}<span>{pedidos.filter((pedido) => !states.length || states.includes(pedido.estado)).length}</span></button>)}
          </div>
        </section>
        <p className="qf-orders-results" role="status">{!loading && !error && `${filtered.length} ${filtered.length === 1 ? "pedido encontrado" : "pedidos encontrados"}`}</p>
        {loading ? <p className="qf-orders-empty" role="status"><LoadingSpinner label=<LoadingSpinner label="Cargando pedidos…" /> /></p> : error ? <div className="qf-orders-empty" role="alert"><h2>No pudimos cargar tus pedidos</h2><button className="qf-btn qf-btn--primary" onClick={refresh}>Reintentar</button></div> : filtered.length ? (
          <div className="qf-orders-grid">{filtered.map((pedido) => <Pedido key={pedido.id} pedido={pedido} recargar={refresh} />)}</div>
        ) : <div className="qf-orders-empty"><h2>{pedidos.length ? "No encontramos pedidos con estos filtros" : "Todavía no hiciste pedidos"}</h2>{pedidos.length > 0 && <button className="qf-btn qf-btn--primary" onClick={reset}>Ver todos los pedidos</button>}</div>}
      </main>
      <Footer />
    </PageLayout>
  );
};
export default ListadoPedidos;
