import "../ComponentesGenerales/ListFilters.css";
import React, { useEffect, useState, useContext, useMemo } from "react";
import PageLayout from "../ComponentesGenerales/PageLayout";
import EventoUser from "./EventoUser";
import { UserContext } from "../ComponentesGenerales/UserContext";
import Footer from "../ComponentesGenerales/Footer";
import Breadcrumb from "../ComponentesGenerales/Breadcrumb";
import "./ListadoEventos.css";
import LoadingSpinner from "../ComponentesGenerales/LoadingSpinner";

const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Filtra eventos cuya fecha del último día ya pasó
const filtrarFinalizados = (eventosList) => {
  const ahora = new Date();
  return eventosList.filter((evento) => {
    // Si tiene diaEventos, filtrar por la fecha del último día
    if (evento.diaEventos?.length) {
      const fechaFin = new Date(
        Math.max(...evento.diaEventos.map((d) => new Date(d.fechaHoraFinDiaEvento)))
      );
      return fechaFin > ahora;
    }
    // Sin diaEventos: dejarlo pasar, el badge se encargará
    return true;
  });
};

export const filterEvents = (events, { nombre, distancia, preventa, order }, location) => {
  let filtered = filtrarFinalizados(events).map((event) => {
    const lat = Number(event.latitud);
    const lon = Number(event.longitud);
    const valid = event.latitud != null && event.latitud !== "" && event.longitud != null && event.longitud !== "" && Number.isFinite(lat) && Number.isFinite(lon);
    return { ...event, distanciaCalculada: location && valid ? haversineDistance(location.lat, location.lon, lat, lon) : null };
  }).filter((event) =>
    String(event.nombre || "").toLocaleLowerCase().includes(nombre.trim().toLocaleLowerCase()) &&
    (!distancia || (event.distanciaCalculada != null && event.distanciaCalculada <= Number(distancia))) &&
    ((event.tienePreventa && preventa.conPreventa) || (!event.tienePreventa && preventa.sinPreventa))
  );
  const start = (event) => {
    const dates = (event.diaEventos || []).map((day) => new Date(day.fechaHoraInicioDiaEvento).getTime()).filter(Number.isFinite);
    const fallback = new Date(event.fechaHoraInicio).getTime();
    return dates.length ? Math.min(...dates) : Number.isFinite(fallback) ? fallback : Infinity;
  };
  filtered.sort((a, b) => order === "distance"
    ? (a.distanciaCalculada ?? Infinity) - (b.distanciaCalculada ?? Infinity)
    : start(a) - start(b));
  return filtered;
};

const ListadoEventosUsers = () => {
  const { user } = useContext(UserContext);
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [location, setLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState("idle");
  const [nombre, setNombre] = useState("");
  const [distancia, setDistancia] = useState("");
  const [preventa, setPreventa] = useState({ conPreventa: true, sinPreventa: true });
  const [order, setOrder] = useState("date");
  const consumerId = user?.consumidorId;

  const requestLocation = () => {
    if (!navigator.geolocation) { setLocationStatus("error"); return; }
    setLocationStatus("loading");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => { setLocation({ lat: coords.latitude, lon: coords.longitude }); setLocationStatus("ready"); },
      () => setLocationStatus("error"),
      { timeout: 10000, maximumAge: 60000 }
    );
  };

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      setLoading(true); setError(false);
      try {
        const raw = process.env?.REACT_APP_BACK_URL || "";
        const base = raw.endsWith("/") ? raw : `${raw}/`;
        const results = await Promise.all(["EnCurso", "Confirmado"].map(async (status) => {
          const response = await fetch(`${base}evento/enEstado/${status}`, {
            headers: { ConsumidorId: consumerId }, signal: controller.signal,
          });
          if (!response.ok) throw new Error("Error al cargar eventos");
          const json = await response.json();
          return Array.isArray(json.data) ? json.data : [];
        }));
        if (!controller.signal.aborted) setEventos([...new Map(results.flat().map((event) => [event.id, event])).values()]);
      } catch (err) {
        if (!controller.signal.aborted) setError(true);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    if (consumerId != null) load();
    else { setLoading(false); setError(true); }
    return () => controller.abort();
  }, [consumerId, attempt]);

  const filtered = useMemo(() => filterEvents(eventos, { nombre, distancia, preventa, order }, location), [eventos, nombre, distancia, preventa, order, location]);
  const active = Boolean(nombre || distancia || !preventa.conPreventa || !preventa.sinPreventa);
  const reset = () => { setNombre(""); setDistancia(""); setPreventa({ conPreventa: true, sinPreventa: true }); setOrder("date"); };

  return (
    <PageLayout sidebarProps={{ tipoUsuario: user?.tipoUsuario }}>
      <main className="qf-events-page">
        <header className="qf-page-header qf-page-header--full">
          <h1 className="qf-page-title" style={{ textAlign: "center", fontSize: "1.75rem" }}>Eventos</h1>
          <hr className="qf-separator qf-separator--spaced" />
        </header>
        <Breadcrumb items={[{ title: "Inicio", url: "/inicio" }, { title: "Eventos", url: "/Listado-eventos" }]} style={{ width: "100%", margin: "0 0 20px" }} />
        <section className="qf-events-filters qf-list-filters" aria-label="Buscar y filtrar eventos">
          <div className="qf-events-filter-top">
            <label className="qf-events-search">Buscar evento
              <input type="search" placeholder="Nombre del evento…" value={nombre} onChange={(e) => setNombre(e.target.value)} />
            </label>
            <label>Ordenar por
              <select value={order} onChange={(e) => setOrder(e.target.value)}>
                <option value="date">Próxima fecha</option><option value="distance" disabled={!location}>Más cercanos</option>
              </select>
            </label>
          </div>
          <div className="qf-events-filter-bottom">
            <div className="qf-events-distance">
              <label>Distancia
                <select value={distancia} disabled={!location} onChange={(e) => setDistancia(e.target.value)}>
                  <option value="">Cualquier distancia</option><option value="5">Hasta 5 km</option><option value="25">Hasta 25 km</option><option value="100">Hasta 100 km</option>
                </select>
              </label>
              {!location && <button type="button" className="qf-events-location" onClick={requestLocation} disabled={locationStatus === "loading"}>{locationStatus === "loading" ? "Buscando ubicación…" : "Usar mi ubicación"}</button>}
            </div>
            <fieldset className="qf-events-presale"><legend>Preventa</legend>
              <label><input type="checkbox" checked={preventa.conPreventa} onChange={(e) => setPreventa((prev) => ({ ...prev, conPreventa: e.target.checked }))} />Con preventa</label>
              <label><input type="checkbox" checked={preventa.sinPreventa} onChange={(e) => setPreventa((prev) => ({ ...prev, sinPreventa: e.target.checked }))} />Sin preventa</label>
            </fieldset>
            <button type="button" className="qf-events-clear" onClick={reset} disabled={!active && order === "date"}>Limpiar filtros</button>
          </div>
          {locationStatus === "error" && <p className="qf-events-location-hint" role="status">No pudimos obtener tu ubicación. Podés buscar por nombre y preventa o volver a intentarlo.</p>}
        </section>
        <div className="qf-events-results" role="status">{!loading && !error && `${filtered.length} ${filtered.length === 1 ? "evento disponible" : "eventos disponibles"}`}</div>
        {loading ? <p className="qf-events-empty" role="status"><LoadingSpinner label=<LoadingSpinner label="Cargando eventos…" /> /></p> : error ? (
          <div className="qf-events-empty" role="alert"><h2>No pudimos cargar los eventos</h2><p>Intentá nuevamente en unos momentos.</p><button className="qf-btn qf-btn--primary" onClick={() => setAttempt((value) => value + 1)}>Reintentar</button></div>
        ) : filtered.length ? (
          <div className="qf-events-grid">{filtered.map((event) => <EventoUser key={event.id} evento={event} />)}</div>
        ) : <div className="qf-events-empty"><h2>{active ? "No encontramos eventos con estos filtros" : "Todavía no hay eventos activos"}</h2><p>{active ? "Probá con otro nombre o ampliá la distancia de búsqueda." : "Volvé pronto para descubrir los próximos eventos."}</p>{active && <button className="qf-btn qf-btn--primary" onClick={reset}>Ver todos los eventos</button>}</div>}
      </main>
      <Footer />
    </PageLayout>
  );
};
export default ListadoEventosUsers;
