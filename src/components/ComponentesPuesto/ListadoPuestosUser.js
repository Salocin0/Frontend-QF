import "../ComponentesGenerales/ListFilters.css";
import React, { useEffect, useState, useContext, useMemo } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Footer from "../ComponentesGenerales/Footer";
import PageLayout from "../ComponentesGenerales/PageLayout";
import PuestoUser from "./PuestoUser";
import { UserContext } from "../ComponentesGenerales/UserContext";
import Breadcrumb from "../ComponentesGenerales/Breadcrumb";
import { formatDateAR } from "../ComponentesGenerales/Utils/formatDate";
import "./PuestosListado.css";
import eventPlaceholder from "../img/qf-new-logo-transparent.png";
import LoadingSpinner from "../ComponentesGenerales/LoadingSpinner";

export const filterStands = (stands, { name, stars, time }) => stands.filter((stand) => {
  const query = name.trim().toLocaleLowerCase();
  const matchesName = [stand.nombreCarro, stand.tipoNegocio].some((text) => String(text || "").toLocaleLowerCase().includes(query));
  const rating = stand.estrellas ?? stand.estrella;
  return matchesName && (!stars || (rating != null && Number(rating) >= Number(stars))) &&
    (!time || (stand.tiempo != null && Number(stand.tiempo) > 0 && Number(stand.tiempo) <= Number(time)));
});
const ListadoPuestosUser = () => {
  const { idEvento } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const selectedDay = location.state?.selectedDay || null;
  const { user } = useContext(UserContext);
  const [stands, setStands] = useState([]);
  const [evento, setEvento] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [name, setName] = useState("");
  const [stars, setStars] = useState("");
  const [time, setTime] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      setLoading(true); setError(false);
      try {
        const raw = process.env?.REACT_APP_BACK_URL || "";
        const base = raw.endsWith("/") ? raw : `${raw}/`;
        const get = async (path) => {
          const response = await fetch(`${base}${path}/${idEvento}`, { signal: controller.signal });
          if (response.ok === false) throw new Error("Error al cargar los puestos");
          return response.json();
        };
        const [standData, eventData] = await Promise.all([get("puesto/evento"), get("evento")]);
        if (!controller.signal.aborted) {
          setStands(Array.isArray(standData?.data) ? standData.data : []);
          setEvento(eventData?.data || {});
        }
      } catch (err) {
        if (!controller.signal.aborted) setError(true);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    load();
    return () => controller.abort();
  }, [idEvento, attempt]);
  const filtered = useMemo(() => filterStands(stands, { name, stars, time }), [stands, name, stars, time]);
  const active = Boolean(name || stars || time);
  const reset = () => { setName(""); setStars(""); setTime(""); };
  return (
    <PageLayout sidebarProps={{ tipoUsuario: user?.tipoUsuario }}>
      <main className="qf-stands-page">
        <Breadcrumb items={[{ title: "Inicio", url: "/inicio" }, { title: "Eventos", url: "/Listado-eventos" }, { title: "Puestos", url: `/listado-puestos/${idEvento}` }]} style={{ width: "100%", margin: "0 0 20px" }} />
        <header className="qf-stands-event-header">
          <div className="qf-stands-event-identity">
            <img src={evento.img || eventPlaceholder} alt="" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = eventPlaceholder; }} />
            <div>
              <h1>{evento.nombre || "Puestos del evento"}</h1>
              <p>{selectedDay ? `Precompra · Retiro el ${formatDateAR(selectedDay)}` : "Elegí un puesto para ver sus productos."}</p>
            </div>
          </div>
          <button type="button" onClick={() => navigate(`/tipo-compra/${idEvento}`)}>Volver</button>
        </header>
        <section className="qf-stands-filters qf-list-filters" aria-label="Buscar y filtrar puestos">
          <label>Buscar puesto<input type="search" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre o tipo de comida…" /></label>
          <label>Valoración mínima<select value={stars} onChange={(e) => setStars(e.target.value)}><option value="">Todas</option>{[1, 2, 3, 4, 5].map((value) => <option key={value} value={value}>{value} {value === 1 ? "estrella" : "estrellas"}</option>)}</select></label>
          <label>Tiempo de entrega<select value={time} onChange={(e) => setTime(e.target.value)}><option value="">Cualquier tiempo</option><option value="15">Hasta 15 min</option><option value="30">Hasta 30 min</option><option value="60">Hasta 1 hora</option></select></label>
          <button type="button" onClick={reset} disabled={!active}>Limpiar filtros</button>
        </section>
        <p className="qf-stands-results" role="status">{!loading && !error && `${filtered.length} ${filtered.length === 1 ? "puesto disponible" : "puestos disponibles"}`}</p>
        {loading ? <p className="qf-stands-empty" role="status"><LoadingSpinner label="Cargando puestos…" /></p> : error ? <div className="qf-stands-empty" role="alert"><h2>No pudimos cargar los puestos</h2><button type="button" className="qf-btn qf-btn--primary" onClick={() => setAttempt((value) => value + 1)}>Reintentar</button></div> : filtered.length ? (
          <div className="qf-stands-grid">{filtered.map((stand) => <PuestoUser key={stand.id} carrito={stand} selectedDay={selectedDay} evento={evento} />)}</div>
        ) : <div className="qf-stands-empty"><h2>{active ? "No encontramos puestos con estos filtros" : "No hay puestos en este momento."}</h2>{active && <button type="button" className="qf-btn qf-btn--primary" onClick={reset}>Ver todos los puestos</button>}</div>}
      </main>
      <Footer />
    </PageLayout>
  );
};
export default ListadoPuestosUser;
