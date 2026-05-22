import { useEffect, useState } from "react";
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
import useBreakpoint from "../../useBreakpoint";

const AsociacionesEPC = () => {
  const { isMobile } = useBreakpoint();
  const { user } = useContext(UserContext);
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
    colContent: {
      marginLeft: isMobile ? "0" : "20%",
      width: "calc(100% - 20%)",
      height: "100%", // Asegura que el contenedor de contenido ocupe toda la altura disponible
      overflowY: "auto", // Permite el desplazamiento solo si es necesario
      msOverflowStyle: "none", // IE and Edge
      scrollbarWidth: "none", // Firefox
      WebkitScrollbar: { display: "none" }, // Hide scrollbar for Chrome, Safari, and Opera
    },
    container: {
      paddingBottom: "60px",
      paddingLeft: "20px",
      paddingRight: "20px",
      width: "100%",
      flexDirection: "column", // Asegura que el contenido esté alineado de arriba hacia abajo
    },
    sectionTitle: {
      display: "flex",
      justifyContent: "center",
      marginBottom: "1rem",
      paddingTop: "2rem",
      width: "100%",
      color: "var(--qf-naranja)",
    },
    card: {
      border: `1px solid var(--qf-naranja)`,
      borderRadius: "10px",
      marginBottom: "1rem",
      backgroundColor: "var(--qf-bg-secondary)",
      marginLeft: "0px",
      marginRight: "0px",
      display: "flex",
      flexDirection: "Column",
      position: "relative",
    },
    cardBody: {
      padding: "10px",
      width: "100%",
      display: "flex",
      flexDirection: "row",
    },
    rowInner: {
      display: "flex",
      flexDirection: "Column",
      width: "100%",
    },
    imgContainer: {
      width: "20%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    img: {
      width: isMobile ? "100%" : "80%",
      height: "200px",
      objectFit: "cover",
      borderRadius: "10px",
    },
    textContainer: {
      width: "60%",
      display: "flex",
      flexDirection: "Column",
      justifyContent: "center",
      alignItems: "center",
    },
    title: {
      fontSize: "2rem",
      fontWeight: "bold",
      marginBottom: "0.5rem",
      color: "var(--qf-naranja)",
      textAlign: "center",
      width: "100%",
    },
    description: {
      color: "var(--qf-blanco-puro)",
      width: "100%",
    },
    locationText: {
      color: "var(--qf-blanco-puro)",
      width: "100%",
    },
    actionContainer: {
      display: "flex",
      width: "100%",
    },
    buttonContainer: {
      width: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "Column",
      padding: "10px",
    },
    button: {
      backgroundColor: "var(--qf-rojo)",
      color: "var(--qf-blanco-puro)",
      padding: "0.5rem 1rem",
      border: "none",
      cursor: "pointer",
      borderRadius: "10px",
      width: "200px",
    },
    estadoText: {
      fontWeight: "bold",
      backgroundColor: "var(--qf-green)",
      color: "var(--qf-blanco-puro)",
      borderRadius: "10px",
      padding: "5px 10px",
      marginLeft: "1rem",
      position: "absolute",
      top: "20px",
      right: "20px",
    },
    noAsociacionesContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      width: "100%",
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
    breadcrumbWrapper: {
      width: "Calc(100%)",
      paddingTop: "10px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
    filtersContainer: {
      width: "320px",
      minWidth: "320px",
      alignSelf: "flex-start",
      height: "auto",
      borderRadius: "8px",
      padding: "20px",
      paddingTop: "10px",
      marginLeft: "20px",
      marginRight: "20px",
      marginTop: "0",
      backgroundColor: "var(--qf-bg-secondary)",
      border: `1px solid var(--qf-naranja)`,
    },
    searchFilterContainer: {
      display: "flex",
      flexDirection: "column",
      gap: "20px",
      flex: "none",
      maxWidth: "100%",
      marginTop: "0",
      width: "100%",
    },
  };

  const breadcrumbItems = [
    { title: "Inicio", url: "/inicio" },
    { title: "Mis asociaciones", url: "/misAsociacionesEPC" },
  ];

  return (
    <PageLayout sidebarProps={{ tipoUsuario: user?.tipoUsuario }}>
      <div style={styles.colContent}>
          <div style={styles.sectionTitle}>
            <h1>Mis Asociaciones</h1>
          </div>
          <hr style={{ color: "var(--qf-naranja)" }} />
          {/* main content with sidebar filters */}
          <div style={{ display: 'flex', width: 'calc(100% - 40px)', alignItems: 'flex-start', marginRight: '20px' }}>
            <div style={{ flex: '0 0 calc(70% - 0px)', width: 'calc(70% - 0px)' }}>
            <div style={styles.breadcrumbWrapper}>
              <Breadcrumb
                items={breadcrumbItems}
                style={{
                  width: "Calc(100% - 40px)",
                  marginLeft: "Calc(20px)",
                }}
              />
            </div>
          <div style={{...styles.container}}>
              {isLoading ? (
                <div style={{ display: "flex", justifyContent: "center", marginTop: "3rem" }}>
                  <CircularProgress style={{ color: "var(--qf-naranja)" }} />
                </div>
              ) : filteredEventos.length > 0 ? (
                <div style={styles.rowInner}>
                  {filteredEventos.map((evento, index) => {
                    const asociacion = asociaciones.find(
                      (asoc) => asoc.eventoId === evento.id
                    );
                    return (
                      <div style={styles.card} key={index}>
                        <div style={styles.cardBody}>
                          <div style={styles.imgContainer}>
                            <img
                              src={
                                evento?.img && !String(evento.img).includes("vendimia.mendoza.gov.ar")
                                  ? evento.img
                                  : imgDefault
                              }
                              alt="Logo del Evento"
                              style={styles.img}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = imgDefault;
                              }}
                            />
                          </div>
                          <div style={styles.textContainer}>
                            <h5 style={styles.title}>{evento.nombre}</h5>
                            <p style={styles.description}>
                              {evento.descripcion}
                            </p>
                            <p style={styles.locationText}>
                              {evento.ubicacion} - {evento.localidad},{" "}
                              {evento.provincia}
                            </p>
                          </div>
                        </div>
                        <div style={styles.actionContainer}>
                          {asociacion.estado === "PendienteDeAceptacion" && (
                            <div style={{ width: "100%" }}>
                              <hr style={{ color: "var(--qf-naranja)" }} />
                              <div style={styles.buttonContainer}>
                                <button
                                  style={styles.button}
                                  onClick={() =>
                                    cancelarAsociacion(asociacion.id)
                                  }
                                >
                                  Cancelar Asociacion
                                </button>
                              </div>
                            </div>
                          )}
                          <p style={styles.estadoText}>
                            {(() => {
                              const formatEstado = (s) =>
                                s ? s.replace(/([A-Z])/g, " $1").trim() : "";
                              if (asociacion.estado === "PendienteDeAceptacion") {
                                return "Pendiente de Aceptacion";
                              }
                              return formatEstado(asociacion.estado);
                            })()}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
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
            </div>
            {/* sidebar */}
            <div style={{...styles.filtersContainer, flex:'0 0 calc(30% - 0px)', width: 'calc(30% - 0px)',paddingTop:"10px"}}>
              <div style={{...styles.searchFilterContainer, marginTop: '10px'}}>
                <Buscador
                  placeholder="Buscar eventos..."
                  onBuscar={setSearchTerm}
                  style={{ display: 'flex', width: '100%' }}
                />
                <Filtros
                  gruposFiltros={[estadoGroup]}
                  onFiltrar={(f) => setFilterState(f.estado || '')}
                  titulo="ESTADOS"
                />
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

export default AsociacionesEPC;
