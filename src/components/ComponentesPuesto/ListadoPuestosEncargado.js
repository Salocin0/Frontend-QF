import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaPlus, FaStore, FaEyeSlash } from "react-icons/fa";
import PageLayout from "../ComponentesGenerales/PageLayout";
import PuestoEncargado from "./PuestoEncargado";
import { UserContext } from "../ComponentesGenerales/UserContext";
import Footer from "../ComponentesGenerales/Footer";
import Breadcrumb from "../ComponentesGenerales/Breadcrumb";
import "../ComponentesGenerales/ListFilters.css";
import "./MisPuestos.css";

export const formatStandStatus = (value) => String(value || "Sin estado").replace(/([a-záéíóú])([A-Z])/g, "$1 $2");
export const filterOwnedStands = (stands, search, status) => {
  const query = search.trim().toLocaleLowerCase("es");
  return stands.filter((stand) => (!status || stand.estado === status) &&
    [stand.nombreCarro, stand.numeroCarro, stand.telefonoCarro].some((value) => String(value ?? "").toLocaleLowerCase("es").includes(query)));
};

const ListadoPuestosEncargado = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [puestos, setPuestos] = useState([]);
  const [attempt, setAttempt] = useState(0);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const consumerId = user?.consumidorId ?? user?.id;

  useEffect(() => {
    if (!consumerId) return;
    const controller = new AbortController();
    setLoading(true);
    setError(false);
    (async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACK_URL}puesto/creados`, {
          headers: { ConsumidorId: consumerId, "Content-Type": "application/json" },
          signal: controller.signal,
        });
        // The existing API returns 404 when this owner has no stands.
        if (response.status === 404) { setPuestos([]); return; }
        if (!response.ok) throw new Error("No se pudieron cargar los puestos");
        const data = await response.json();
        setPuestos(Array.isArray(data.data) ? data.data : []);
      } catch (err) {
        if (!controller.signal.aborted) setError(true);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    })();
    return () => controller.abort();
  }, [consumerId, attempt]);

  const filtered = filterOwnedStands(puestos, search, status);
  const resetFilters = () => { setSearch(""); setStatus(""); };

  return (
    <PageLayout sidebarProps={{ tipoUsuario: user?.tipoUsuario }}>
      <main className="qf-owned-stands-page">
        <Breadcrumb items={[{ title: "Inicio", url: "/inicio" }, { title: "Mis puestos", url: "/listado-puestos-encargado" }]} />
        <header className="qf-owned-stands-heading">
          <div><h1>Mis puestos</h1><p>Administrá tus productos, pedidos y participación en eventos.</p></div>
          <div className="qf-owned-stands-heading-actions"><Link to="/puestos-deshabilitados"><FaEyeSlash aria-hidden="true" /> Puestos deshabilitados</Link><button className="qf-owned-primary" type="button" onClick={() => navigate("/crear-puesto")}><FaPlus aria-hidden="true" /> Agregar puesto</button></div>
        </header>
        <section className="qf-list-filters qf-owned-stands-filters" aria-label="Filtros de mis puestos">
          <label htmlFor="owned-stand-search">Buscar puesto<input id="owned-stand-search" type="search" placeholder="Nombre, número o teléfono" value={search} onChange={(event) => setSearch(event.target.value)} /></label>
          <label htmlFor="owned-stand-status">Estado<select id="owned-stand-status" value={status} onChange={(event) => setStatus(event.target.value)}><option value="">Todos los estados</option>{[...new Set(puestos.map((stand) => stand.estado).filter(Boolean))].map((state) => <option key={state} value={state}>{formatStandStatus(state)}</option>)}</select></label>
        </section>
        {loading || !consumerId ? <div className="qf-owned-stands-empty" role="status">Cargando tus puestos…</div> : error ? (
          <div className="qf-owned-stands-empty" role="alert"><h2>No pudimos cargar tus puestos</h2><p>Intentá nuevamente en unos instantes.</p><button type="button" onClick={() => setAttempt((value) => value + 1)}>Reintentar</button></div>
        ) : <>
          <p className="qf-owned-stands-count" aria-live="polite">{filtered.length} {filtered.length === 1 ? "puesto" : "puestos"}{search || status ? ` de ${puestos.length}` : ""}</p>
          {filtered.length ? <div className="qf-owned-stands-list">{filtered.map((stand) => <PuestoEncargado key={stand.id} carrito={stand} actualizarListado={() => setAttempt((value) => value + 1)} />)}</div> : (
            <div className="qf-owned-stands-empty"><FaStore aria-hidden="true" /><h2>{puestos.length ? "No encontramos puestos con esos filtros" : "Tu próximo puesto empieza acá"}</h2><p>{puestos.length ? "Probá otro nombre o seleccioná un estado diferente." : "Creá tu puesto para cargar productos y participar en eventos."}</p><button type="button" onClick={puestos.length ? resetFilters : () => navigate("/crear-puesto")}>{puestos.length ? "Limpiar filtros" : "Crear mi primer puesto"}</button></div>
          )}
        </>}
      </main>
      <Footer />
    </PageLayout>
  );
};
export default ListadoPuestosEncargado;
