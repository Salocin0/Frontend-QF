import React, { useEffect, useState, useContext, useCallback, useRef } from "react";
import { FaChevronDown } from "react-icons/fa";
import PageLayout from "../ComponentesGenerales/PageLayout";
import EventoUser from "./EventoUser";
import LoandingComponent from "../ComponentesGenerales/LoandingComponent";
import { UserContext } from "../ComponentesGenerales/UserContext";
import Footer from "../ComponentesGenerales/Footer";
import FiltersEventosConsumidor from "../Filtros y Buscadores/filtersEventosConsumidor";
import Buscador from "../Filtros y Buscadores/BuscadorEventosConsumidor";
import Breadcrumb from "../ComponentesGenerales/Breadcrumb";

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

const ListadoEventosUsers = () => {
  const [loanding, setLoanding] = useState(false);
  const [rows, setRows] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [filteredEventos, setFilteredEventos] = useState([]);
  const { user } = useContext(UserContext);
  const [userLocation, setUserLocation] = useState(null);

  const contentRef = useRef(null);
  const [contentWidth, setContentWidth] = useState(999);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const isNarrowLayout = contentWidth <= 780;

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setContentWidth(entry.contentRect.width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const [distancia, setDistancia] = useState(null);
  const [nombre, setNombre] = useState("");
  const [preventa, setPreventa] = useState({ conPreventa: true, sinPreventa: true });

  // Obtener ubicación del navegador
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          console.warn("No se pudo obtener la ubicación:", error.message);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  }, []);

  // Calcular distancia para cada evento cuando cambia userLocation o eventos
  const calcularDistancias = useCallback((eventosList) => {
    if (!userLocation) return eventosList;
    return eventosList.map((evento) => {
      if (evento.latitud && evento.longitud) {
        const distancia = haversineDistance(
          userLocation.lat,
          userLocation.lon,
          parseFloat(evento.latitud),
          parseFloat(evento.longitud)
        );
        return { ...evento, distanciaCalculada: distancia };
      }
      return { ...evento, distanciaCalculada: null };
    });
  }, [userLocation]);
  const breadcrumbItems = [
    { title: "Inicio", url: "/inicio" },
    { title: "Eventos", url: "/Listado-eventos" },
  ];

  useEffect(() => {
    if (user) {
      setLoanding(false);
      const headers = new Headers();
      headers.append("ConsumidorId", user.consumidorId);
      fetch(`${process.env?.REACT_APP_BACK_URL}evento/enEstado/EnCurso`, {
        method: "GET",
        headers: headers,
      })
        .then((response) => response.json())
        .then((data) => {
          const eventosData = Array.isArray(data.data) ? data.data : [];
          const eventosSinFinalizados = filtrarFinalizados(eventosData);
          const eventosConDistancia = calcularDistancias(eventosSinFinalizados);
          setEventos(eventosConDistancia);
          setFilteredEventos(eventosConDistancia);
          generateRows(eventosConDistancia);
          return fetch(
            `${process.env?.REACT_APP_BACK_URL}evento/enEstado/Confirmado`,
            {
              method: "GET",
              headers: headers,
            }
          );
        })
        .then((response) => response.json())
        .then((confirmadoData) => {
          const confirmadoEventos = Array.isArray(confirmadoData.data) ? confirmadoData.data : [];
          const confirmadoSinFinalizados = filtrarFinalizados(confirmadoEventos);
          const confirmadoConDistancia = calcularDistancias(confirmadoSinFinalizados);
          setEventos((prev) => {
            const allEventos = [...prev, ...confirmadoConDistancia];
            generateRows(allEventos);
            return allEventos;
          });
          setLoanding(true);
        })
        .catch((error) => {
          console.log("Error fetching eventos.", error);
          setLoanding(true);
        });
    }
  }, [user]);

  // Recalcular distancias cuando se obtiene la ubicación y ya hay eventos
  useEffect(() => {
    if (userLocation && eventos.length > 0) {
      const eventosConDistancia = calcularDistancias(eventos);
      setEventos(eventosConDistancia);
      setFilteredEventos((prev) => {
        const filteredIds = new Set(prev.map((e) => e.id));
        return eventosConDistancia.filter((e) => filteredIds.has(e.id));
      });
      generateRows(eventosConDistancia);
    }
  }, [userLocation]);

  const generateRows = (eventosList) => {
    const list = Array.isArray(eventosList) ? eventosList : [];
    const totalEventos = Math.ceil(list.length / 4) * 4;
    const eventosConNulos = [
      ...list,
      ...Array(totalEventos - list.length).fill(null),
    ];

    const generatedRows = [];
    for (let i = 0; i < eventosConNulos.length; i += 4) {
      const row = eventosConNulos.slice(i, i + 4);
      generatedRows.push(row);
    }
    setRows(generatedRows);
  };

  useEffect(() => {
    const applyFilters = () => {
      let filtered = Array.isArray(eventos) ? eventos : [];

      // Filtrar eventos finalizados
      filtered = filtrarFinalizados(filtered);

      if (distancia) {
        filtered = filtered.filter(
          (evento) =>
            evento.distanciaCalculada === null ||
            evento.distanciaCalculada === undefined ||
            evento.distanciaCalculada <= distancia
        );
      }
      if (nombre) {
        filtered = filtered.filter((evento) =>
          evento.nombre.toLowerCase().includes(nombre.toLowerCase())
        );
      }
      if (preventa) {
        filtered = filtered.filter(
          (evento) =>
            (evento.tienePreventa && preventa.conPreventa) ||
            (!evento.tienePreventa && preventa.sinPreventa)
        );
      }

      setFilteredEventos(filtered);
      generateRows(filtered);
    };

    applyFilters();
  }, [distancia, nombre, preventa, eventos]);

  return (
    <PageLayout sidebarProps={{ tipoUsuario: user?.tipoUsuario }}>
      <div style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        flex: 1,
        minHeight: 0,
        boxSizing: "border-box",
      }}>
        {/* Header: título centrado + línea divisoria */}
        <div className="qf-page-header qf-page-header--full" style={{ textAlign: "center" }}>
          <h1 className="qf-page-title" style={{ textAlign: "center", fontSize: "1.75rem" }}>
            Eventos
          </h1>
          <hr className="qf-separator qf-separator--spaced" />
        </div>

        {/* Dos columnas: izquierda (breadcrumb + listado) | derecha (buscador + filtros) */}
        <div ref={contentRef} className={`qf-page-content ${isNarrowLayout ? "qf-page-content--narrow" : ""}`} style={{ flex: 1, minHeight: 0 }}>
          {/* Columna izquierda */}
          <div className="qf-page-content__main">
            <Breadcrumb items={breadcrumbItems} style={{
              margin: '0px auto 8px',
              backgroundColor: 'var(--qf-bg-secondary)',
              width: '98%',
              paddingRight: '16px',
              padding: '8px',
              paddingLeft: '16px',
              borderRadius: '10px',
              border: '1px solid var(--qf-naranja)',
              boxSizing: 'border-box',
            }} />

            {/* En modo angosto: buscador + filtros colapsables antes del listado */}
            {isNarrowLayout && (
              <div className="qf-narrow-filters" style={{ width: "98%", margin: "0 auto 0 auto" }}>
                <div className="qf-search-box" style={{ marginBottom: "8px" }}>
                  <Buscador setNombre={setNombre} />
                </div>
                <div className="qf-filter-box" style={{ margin: 0 }}>
                  <div
                    className="qf-collapsible-header"
                    onClick={() => setFiltersOpen((prev) => !prev)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && setFiltersOpen((prev) => !prev)}
                  >
                    <span className="qf-collapsible-title">FILTROS</span>
                    <FaChevronDown className={`qf-collapsible-icon ${filtersOpen ? "qf-collapsible-icon--open" : ""}`} />
                  </div>
                  {filtersOpen && (
                    <div className="qf-collapsible-body">
                      <FiltersEventosConsumidor
                        distancia={distancia}
                        setDistancia={setDistancia}
                        setPreventa={setPreventa}
                        hideTitle
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="qf-scrollable" style={{ paddingTop: "8px" }}>
              {!loanding ? (
                <LoandingComponent />
              ) : Array.isArray(filteredEventos) && filteredEventos.length > 0 ? (
                rows.length > 0 &&
                rows.map((row, rowIndex) => (
                  <div key={rowIndex} style={{ width: "100%" }}>
                    {row.map((evento, index) => (
                      <div
                        key={evento?.id ?? `empty-${rowIndex}-${index}`}
                        style={{ marginBottom: "10px", width: "100%" }}
                      >
                        {evento !== null ? (
                          <EventoUser evento={evento} />
                        ) : null}
                      </div>
                    ))}
                  </div>
                ))
              ) : (
                <h2 className="qf-no-results">
                  No hay eventos activos en este momento.
                </h2>
              )}
            </div>
          </div>

          {/* Columna derecha: buscador + filtros */}
          {!isNarrowLayout && (
            <aside className="qf-page-content__aside">
              <div className="qf-search-box">
                <Buscador setNombre={setNombre} />
              </div>
              <div className="qf-filter-box">
                <FiltersEventosConsumidor
                  distancia={distancia}
                  setDistancia={setDistancia}
                  setPreventa={setPreventa}
                />
              </div>
            </aside>
          )}
        </div>
      </div>

      <Footer />
    </PageLayout>
  );
};

export default ListadoEventosUsers;
