import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaStore } from "react-icons/fa";
import Footer from "../ComponentesGenerales/Footer";
import PageLayout from "../ComponentesGenerales/PageLayout";
import Breadcrumb from "../ComponentesGenerales/Breadcrumb";
import { UserContext } from "../ComponentesGenerales/UserContext";
import PuestoDeshabilitado from "./PuestoDeshabilitado";
import "../ComponentesGenerales/ListFilters.css";
import "./MisPuestos.css";
import "./PuestosDeshabilitados.css";
import LoadingSpinner from "../ComponentesGenerales/LoadingSpinner";

const ListadoPuestosDeshabilitados = () => {
  const { user } = useContext(UserContext);
  const [stands, setStands] = useState([]);
  const [attempt, setAttempt] = useState(0);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const consumerId = user?.consumidorId ?? user?.id;
  useEffect(() => {
    if (!consumerId) return;
    const controller = new AbortController();
    setLoading(true); setError(false);
    (async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACK_URL}puesto/deshabilitados`, { method: "GET", headers: { ConsumidorId: consumerId }, signal: controller.signal });
        if (response.status === 404) { setStands([]); return; }
        if (!response.ok) throw new Error("No se pudieron cargar los puestos");
        const data = await response.json();
        if (!controller.signal.aborted) setStands(Array.isArray(data.data) ? data.data : []);
      } catch (err) { if (!controller.signal.aborted) setError(true); }
      finally { if (!controller.signal.aborted) setLoading(false); }
    })();
    return () => controller.abort();
  }, [consumerId, attempt]);
  const query = search.trim().toLocaleLowerCase("es");
  const filtered = stands.filter((stand) => [stand.nombreCarro, stand.numeroCarro, stand.telefonoCarro].some((value) => String(value ?? "").toLocaleLowerCase("es").includes(query)));
  if (sort === "name") filtered.sort((a, b) => String(a.nombreCarro || "").localeCompare(String(b.nombreCarro || ""), "es"));
  if (sort === "number") filtered.sort((a, b) => Number(a.numeroCarro) - Number(b.numeroCarro));
  return <PageLayout sidebarProps={{ tipoUsuario: user?.tipoUsuario }}>
    <main className="qf-owned-stands-page qf-disabled-stands-page">
      <Breadcrumb items={[{ title: "Inicio", url: "/inicio" }, { title: "Mis puestos", url: "/listado-puestos-encargado" }, { title: "Puestos deshabilitados", url: "/puestos-deshabilitados" }]} />
      <header className="qf-owned-stands-heading"><div><h1>Puestos deshabilitados</h1><p>Revisá tus puestos y volvé a habilitarlos cuando quieras retomarlos.</p></div><Link className="qf-disabled-stand-link" to="/listado-puestos-encargado"><FaArrowLeft aria-hidden="true" /> Mis puestos</Link></header>
      <section className="qf-list-filters qf-owned-stands-filters" aria-label="Filtros de puestos deshabilitados"><label htmlFor="disabled-stand-search">Buscar puesto<input id="disabled-stand-search" type="search" placeholder="Nombre, número o teléfono" value={search} onChange={(event) => setSearch(event.target.value)} /></label><label htmlFor="disabled-stand-sort">Ordenar por<select id="disabled-stand-sort" value={sort} onChange={(event) => setSort(event.target.value)}><option value="default">Orden original</option><option value="name">Nombre</option><option value="number">Número de puesto</option></select></label></section>
      {loading || !consumerId ? <div className="qf-owned-stands-empty" role="status"><LoadingSpinner label="Cargando puestos deshabilitados…" /></div> : error ? <div className="qf-owned-stands-empty" role="alert"><h2>No pudimos cargar tus puestos</h2><button type="button" onClick={() => setAttempt((value) => value + 1)}>Reintentar</button></div> : <><p className="qf-owned-stands-count" aria-live="polite">{filtered.length} {filtered.length === 1 ? "puesto deshabilitado" : "puestos deshabilitados"}</p>{filtered.length ? <div className="qf-owned-stands-list">{filtered.map((stand) => <PuestoDeshabilitado key={stand.id} carrito={stand} recargar={() => setAttempt((value) => value + 1)} />)}</div> : <div className="qf-owned-stands-empty"><FaStore aria-hidden="true" /><h2>{search ? "No encontramos puestos con esa búsqueda" : "No tenés puestos deshabilitados"}</h2><p>{search ? "Probá buscar por otro nombre, número o teléfono." : "Los puestos que deshabilites aparecerán acá."}</p>{search ? <button type="button" onClick={() => setSearch("")}>Limpiar búsqueda</button> : <Link className="qf-disabled-stand-link" to="/listado-puestos-encargado">Ver mis puestos</Link>}</div>}</>}
    </main><Footer />
  </PageLayout>;
};
export default ListadoPuestosDeshabilitados;
