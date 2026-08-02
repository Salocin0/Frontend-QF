import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import PageLayout from "../ComponentesGenerales/PageLayout";
import { UserContext } from "../ComponentesGenerales/UserContext";
import { useContext } from "react";
import imgDefault from "../img/logoevento.webp";
import Footer from "../ComponentesGenerales/Footer";
import Breadcrumb from "../ComponentesGenerales/Breadcrumb";
import ConfirmDialog from "../ComponentesGenerales/ConfirmDialog";
import Buscador from "../Filtros y Buscadores/Buscador";
import Filtros from "../Filtros y Buscadores/Filtros";
import { CircularProgress } from "@mui/material";

const AsociacionesEPC = () => {
  const { user } = useContext(UserContext);
  const contentRef = useRef(null);
  const [contentWidth, setContentWidth] = useState(999);
  const isNarrowLayout = contentWidth <= 900;

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setContentWidth(entry.contentRect.width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const [eventos, setEventos] = useState([]);
  const [, setIsPendienteDeAceptacion] = useState(false);
  const [asociaciones, setAsociaciones] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterState, setFilterState] = useState('');
  // helper grupo for estados
  const estadoGroup = {
    nombre: 'estado',
    opciones: Array.from(new Set(asociaciones.map((a) => a.estado))).map((e) => ({
      valor: e,
      etiqueta: e ? e.replace(/([A-Z])/g, ' $1').trim() : e,
    })),
  };
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toCancelId, setToCancelId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const headers = new Headers();
      headers.append("ConsumidorId", user.consumidorId);

      setIsLoading(true);
      fetch(
        `${process.env?.REACT_APP_BACK_URL}asociacion/buscar/${user.consumidorId}`,
        {
          method: "GET",
          headers: headers,
        }
      )
        .then((response) => response.json())
        .then((data) => {
          setEventos(data.data.eventos);
          setAsociaciones(data.data.asociaciones);
          console.log(data.data.asociaciones);
        })
        .catch((error) => console.log("No existen eventos.", error))
        .finally(() => setIsLoading(false));
    }
  }, [user]);

  useEffect(() => {
    if (asociaciones.length > 0) {
      let pendienteDeAceptacion = false;
      asociaciones.forEach((asociacion) => {
        pendienteDeAceptacion = false;
        if (asociacion.estado === "PendienteDeAceptacion") {
          pendienteDeAceptacion = true;
        }
      });
      setIsPendienteDeAceptacion(pendienteDeAceptacion);
    }
  }, [asociaciones]);

  const cancelarAsociacion = (asociacionID) => {
    // open confirmation dialog
    setToCancelId(asociacionID);
    setConfirmOpen(true);
  };

  const doCancel = () => {
    if (!toCancelId) return;
    fetch(
      `${process.env?.REACT_APP_BACK_URL}asociacion/cambiarEstado/${toCancelId}/cancelar`,
      {
        method: "POST",
      }
    )
      .then((response) => {
        if (response.ok) {
          toast.success("Asociacion Cancelada correctamente");
          window.location.reload();
        } else {
          response.json().then((errorData) => {
            const errorMessage = errorData.message || "Ha ocurrido un error";
            toast.error(errorMessage);
          });
        }
      })
      .finally(() => {
        setConfirmOpen(false);
        setToCancelId(null);
      });
  };

  // compute filtered list
  const filteredEventos = eventos.filter((evento) => {
    const asociacion = asociaciones.find((a) => a.eventoId === evento.id);
    const matchesSearch = searchTerm
      ? evento.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    const matchesState = filterState
      ? asociacion && asociacion.estado === filterState
      : true;
    return matchesSearch && matchesState;
  });

  const styles = {
    pagina: {
      display: "flex",
      flexDirection: "column",
      gap: "20px",
    },
    tituloSeccion: {
      textAlign: "center",
      paddingTop: "1rem",
      fontSize: "2rem",
      color: "var(--qf-naranja)",
      margin: 0,
    },
    hrFull: {
      border: "none",
      borderTop: "1px solid var(--qf-naranja)",
      margin: 0,
      width: "100%",
    },
    breadcrumbWrapper: {
      width: "100%",
    },
    /* Layout principal: listado + sidebar filtros */
    mainLayout: {
      display: "flex",
      flexDirection: isNarrowLayout ? "column" : "row",
      gap: "20px",
      width: "100%",
    },
    listadoContainer: {
      flex: isNarrowLayout ? "0 0 100%" : "1",
      width: isNarrowLayout ? "100%" : "auto",
      display: "flex",
      flexDirection: "column",
      gap: "16px",
    },
    /* Sidebar de filtros (solo modo ancho) */
    filtersContainer: {
      flex: "0 0 300px",
      width: "300px",
      borderRadius: "8px",
      padding: "20px",
      paddingTop: "10px",
      backgroundColor: "var(--qf-bg-secondary)",
      border: `1px solid var(--qf-naranja)`,
      boxSizing: "border-box",
      alignSelf: "flex-start",
    },
    searchFilterContainer: {
      display: "flex",
      flexDirection: "column",
      gap: "20px",
      width: "100%",
    },
    /* Estado vacío */
    noAsociacionesContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      width: "100%",
      padding: "2rem 0",
    },
    noAsociacionesTitle: {
      fontSize: "1.5rem",
      color: "var(--qf-naranja)",
    },
    noAsociacionesDescription: {
      textAlign: "center",
    },
    linkAgregarEvento: {
      color: "var(--qf-blue)",
      textDecoration: "none",
      fontWeight: "bold",
    },
  };

  const breadcrumbItems = [
    { title: "Inicio", url: "/inicio" },
    { title: "Mis asociaciones", url: "/misAsociacionesEPC" },
  ];

  const formatEstado = (s) =>
    s ? s.replace(/([A-Z])/g, " $1").trim() : "";

  return (
    <PageLayout sidebarProps={{ tipoUsuario: user?.tipoUsuario }}>
      <div style={styles.pagina}>
        {/* Título centrado */}
        <h1 style={styles.tituloSeccion}>Mis Asociaciones</h1>

        <hr style={styles.hrFull} />

        <div className="qf-page-content">
          <div className="qf-page-content__main">
        {/* Breadcrumb a ancho completo */}
        <div style={styles.breadcrumbWrapper}>
          <Breadcrumb
            items={breadcrumbItems}
            style={{ width: "100%", margin: "8px 0" }}
          />
        </div>

        {/* Layout principal */}
        <div ref={contentRef} style={styles.mainLayout}>
          {/* Columna izquierda: listado */}
          <div style={styles.listadoContainer}>
            {/* En modo angosto: buscador + filtros colapsables antes del listado */}
            {isNarrowLayout && (
              <div style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}>
                <Buscador
                  placeholder="Buscar eventos..."
                  onBuscar={setSearchTerm}
                  botonBuscar={false}
                />
                <Filtros
                  gruposFiltros={[estadoGroup]}
                  onFiltrar={(f) => setFilterState(f.estado || '')}
                  titulo="ESTADOS"
                  collapsible={true}
                  defaultCollapsed={true}
                />
              </div>
            )}

            {isLoading ? (
              <div style={{ display: "flex", justifyContent: "center", marginTop: "3rem" }}>
                <CircularProgress style={{ color: "var(--qf-naranja)" }} />
              </div>
            ) : filteredEventos.length > 0 ? (
              filteredEventos.map((evento, index) => {
                const asociacion = asociaciones.find(
                  (asoc) => asoc.eventoId === evento.id
                );
                return (
                  <EventoCard
                    key={index}
                    evento={evento}
                    asociacion={asociacion}
                    onCancelar={cancelarAsociacion}
                    formatEstado={formatEstado}
                  />
                );
              })
            ) : (
              <div style={styles.noAsociacionesContainer}>
                <div style={styles.noAsociacionesTitle}>
                  <h2>Mis Asociaciones</h2>
                </div>
                <div style={styles.noAsociacionesDescription}>
                  <p>
                    Con Quickfood, asocia tu evento para hacerlo mejor.
                    Descubre nuestras increíbles características y ofrece una
                    experiencia única a tus consumidores.
                  </p>
                </div>
                <Link
                  to={`/asociarPuestoAEvento`}
                  style={styles.linkAgregarEvento}
                >
                  Asociarme a Evento
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar de filtros (solo en modo ancho) */}
          {!isNarrowLayout && (
            <div style={styles.filtersContainer}>
              <div style={styles.searchFilterContainer}>
                <Buscador
                  placeholder="Buscar eventos..."
                  onBuscar={setSearchTerm}
                  botonBuscar={false}
                />
                <Filtros
                  gruposFiltros={[estadoGroup]}
                  onFiltrar={(f) => setFilterState(f.estado || '')}
                  titulo="ESTADOS"
                />
              </div>
            </div>
          )}
        </div>
          </div>
        </div>
      </div>
      <ConfirmDialog
        open={confirmOpen}
        title="Confirmar cancelación"
        message="¿Está seguro que desea cancelar esta asociación?"
        onConfirm={doCancel}
        onCancel={() => setConfirmOpen(false)}
      />
      <Footer />
    </PageLayout>
  );
};

/* --- Subcomponente EventoCard con ResizeObserver --- */
const EventoCard = ({ evento, asociacion, onCancelar, formatEstado }) => {
  const cardRef = useRef(null);
  const [cardWidth, setCardWidth] = useState(0);
  const isNarrow = cardWidth > 0 && cardWidth < 550;

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setCardWidth(entry.contentRect.width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const estadoLabel = asociacion.estado === "PendienteDeAceptacion"
    ? "Pendiente de Aceptacion"
    : formatEstado(asociacion.estado);

  return (
    <div ref={cardRef} style={{
      border: "1px solid var(--qf-naranja)",
      borderRadius: "10px",
      backgroundColor: "var(--qf-bg-secondary)",
      display: "flex",
      flexDirection: "column",
      position: "relative",
      width: "100%",
      boxSizing: "border-box",
    }}>
      {/* Card body: horizontal o vertical según isNarrow */}
      <div style={{
        padding: "10px",
        width: "100%",
        display: "flex",
        flexDirection: isNarrow ? "column" : "row",
        boxSizing: "border-box",
      }}>
        {/* Imagen */}
        <div style={{
          width: isNarrow ? "100%" : "200px",
          minWidth: isNarrow ? "100%" : "200px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: isNarrow ? "10px" : "0",
        }}>
          <img
            src={
              evento?.img && !String(evento.img).includes("vendimia.mendoza.gov.ar")
                ? evento.img
                : imgDefault
            }
            alt="Logo del Evento"
            style={{
              width: "100%",
              maxHeight: "200px",
              objectFit: "cover",
              borderRadius: "10px",
              aspectRatio: isNarrow ? "16/9" : "auto",
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = imgDefault;
            }}
          />
        </div>

        {/* Texto + botón */}
        <div style={{
          flex: "1",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: isNarrow ? "0 10px" : "0 20px",
        }}>
          <h5 style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            marginBottom: "0.5rem",
            color: "var(--qf-naranja)",
            textAlign: "center",
            width: "100%",
          }}>{evento.nombre}</h5>
          <p style={{
            color: "var(--qf-blanco-puro)",
            width: "100%",
            textAlign: "center",
            margin: "0.25rem 0",
          }}>{evento.descripcion}</p>
          <p style={{
            color: "var(--qf-blanco-puro)",
            width: "100%",
            textAlign: "center",
            margin: "0.25rem 0",
          }}>{evento.ubicacion} - {evento.localidad}, {evento.provincia}</p>

          {/* Botón de cancelar debajo de los datos, centrado */}
          {asociacion.estado === "PendienteDeAceptacion" && (
            <div style={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              marginTop: "12px",
            }}>
              <button
                style={{
                  backgroundColor: "var(--qf-rojo)",
                  color: "var(--qf-blanco-puro)",
                  padding: "0.5rem 1rem",
                  border: "none",
                  cursor: "pointer",
                  borderRadius: "10px",
                }}
                onClick={() => onCancelar(asociacion.id)}
              >
                Cancelar Asociacion
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Etiqueta de estado en la parte superior derecha */}
      <span style={{
        fontWeight: "bold",
        backgroundColor: "var(--qf-green)",
        color: "var(--qf-blanco-puro)",
        borderRadius: "10px",
        padding: "5px 10px",
        fontSize: "0.9rem",
        position: "absolute",
        top: "10px",
        right: "10px",
      }}>
        {estadoLabel}
      </span>
    </div>
  );
};

export default AsociacionesEPC;
