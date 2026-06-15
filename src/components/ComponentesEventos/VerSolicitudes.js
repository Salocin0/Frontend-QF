import { useContext, useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FaChevronDown } from "react-icons/fa";
import PageLayout from "../ComponentesGenerales/PageLayout";
import { UserContext } from "../ComponentesGenerales/UserContext";
import Footer from "../ComponentesGenerales/Footer";
import Breadcrumb from "../ComponentesGenerales/Breadcrumb";
import CircularProgress from "@mui/material/CircularProgress";
import Buscador from "../Filtros y Buscadores/Buscador";
import Filtros from "../Filtros y Buscadores/Filtros";
import ConfirmDialog from "../ComponentesGenerales/ConfirmDialog";

const VerSolicitudesEvento = () => {
  const { evento } = useParams();
  const [eventos, setEventos] = useState([]);
  const [asociaciones, setAsociaciones] = useState([]);
  const { user } = useContext(UserContext);
  const [recargar, setRecargar] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterState, setFilterState] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const [selectedAsociacion, setSelectedAsociacion] = useState(null);

  const contentRef = useRef(null);
  const cardAreaRef = useRef(null);
  const [contentWidth, setContentWidth] = useState(999);
  const [cardAreaWidth, setCardAreaWidth] = useState(999);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const isNarrowLayout = contentWidth <= 780;
  const isCardNarrow = cardAreaWidth <= 520;

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setContentWidth(entry.contentRect.width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = cardAreaRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setCardAreaWidth(entry.contentRect.width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const recargarComponente = () => {
    setRecargar((prev) => prev + 1);
  };

  useEffect(() => {
    setLoading(true);
    fetch(`${process.env?.REACT_APP_BACK_URL}asociacion/evento/${evento}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data.data);
        setAsociaciones(data.data);
      })
      .catch((error) => {
        console.error("Error al obtener las asociaciones:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [evento, recargar]);

  useEffect(() => {
    fetch(`${process.env?.REACT_APP_BACK_URL}evento/${evento}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data.data);
        setEventos(data.data);
      })
      .catch((error) => {
        console.error("Error al obtener el evento:", error);
      });
  }, [evento, eventos.length, recargar]);

  const aceptarSolicitud = (asociacionId) => {
    setPendingAction({
      type: 'aceptar',
      message: '¿Estás seguro de que deseas aceptar esta solicitud?',
      title: 'Aceptar Solicitud',
      asociacionId: asociacionId
    });
    setConfirmOpen(true);
  };

  const executeAceptarSolicitud = () => {
    fetch(
      `${process.env?.REACT_APP_BACK_URL}asociacion/cambiarEstado/${pendingAction.asociacionId}/aceptar`,
      {
        method: "POST",
      }
    )
      .then((response) => response.json())
      .then(() => {
        toast.success("Asociacion Aceptada con éxito");
      })
      .catch((error) => toast.error("Error al Aceptar Solicitud"))
      .finally(() => {
        recargarComponente();
      });
  };

  const rechazarSolicitud = (asociacionId) => {
    setPendingAction({
      type: 'rechazar',
      message: '¿Estás seguro de que deseas rechazar esta solicitud?',
      title: 'Rechazar Solicitud',
      asociacionId: asociacionId
    });
    setConfirmOpen(true);
  };

  const executeRechazarSolicitud = () => {
    fetch(
      `${process.env?.REACT_APP_BACK_URL}asociacion/cambiarEstado/${pendingAction.asociacionId}/rechazada`,
      {
        method: "POST",
      }
    )
      .then((response) => response.json())
      .then(() => {
        toast.success("Asociacion Rechazada con éxito");
      })
      .catch((error) => toast.error("Error al Rechazar Solicitud"))
      .finally(() => {
        recargarComponente();
      });
  };

  const cancelarSolicitud = (asociacionId) => {
    setPendingAction({
      type: 'cancelar',
      message: '¿Estás seguro de que deseas cancelar esta solicitud?',
      title: 'Cancelar Solicitud',
      asociacionId: asociacionId
    });
    setConfirmOpen(true);
  };

  const executeCancelarSolicitud = () => {
    fetch(
      `${process.env?.REACT_APP_BACK_URL}asociacion/cambiarEstado/${pendingAction.asociacionId}/cancelar`,
      {
        method: "POST",
      }
    )
      .then((response) => response.json())
      .then(() => {
        toast.success("Asociacion Cancelada con éxito");
      })
      .catch((error) => toast.error("Error al Cancelar Solicitud"))
      .finally(() => {
        recargarComponente();
      });
  };

  // helper group for estados - incluir todos los estados posibles
  const allPossibleEstados = [
    { valor: 'PendienteDeAceptacion', etiqueta: 'Pendiente de Aceptacion' },
    { valor: 'ConObservacion', etiqueta: 'Con Observacion' },
    { valor: 'Aceptada', etiqueta: 'Aceptada' },
    { valor: 'Rechazada', etiqueta: 'Rechazada' },
    { valor: 'Cancelada', etiqueta: 'Cancelada' },
  ];

  const estadoGroup = {
    nombre: 'estado',
    opciones: allPossibleEstados,
  };

  // compute filtered list
  const filteredAsociaciones = asociaciones.filter((asociacion) => {
    const matchesSearch = searchTerm
      ? (asociacion?.puesto?.nombreCarro?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         asociacion?.repartidor?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         asociacion?.repartidor?.apellido?.toLowerCase().includes(searchTerm.toLowerCase()))
      : true;
    const matchesState = filterState
      ? asociacion.estado === filterState
      : true;
    return matchesSearch && matchesState;
  });

  const infoRowStyle = {
    display: "flex",
    marginBottom: "10px",
    alignItems: "center",
  };
  const infoLabelStyle = {
    color: "var(--qf-naranja)",
    fontWeight: "bold",
    minWidth: "150px",
    fontSize: "1rem",
  };
  const infoValueStyle = {
    color: "var(--qf-text-primary)",
    fontSize: "1rem",
  };

  const handleConfirm = () => {
    if (!pendingAction) return;
    
    switch (pendingAction.type) {
      case 'aceptar':
        executeAceptarSolicitud();
        break;
      case 'rechazar':
        executeRechazarSolicitud();
        break;
      case 'cancelar':
        executeCancelarSolicitud();
        break;
      default:
        break;
    }
    
    setConfirmOpen(false);
    setPendingAction(null);
  };

  const handleCancelConfirm = () => {
    setConfirmOpen(false);
    setPendingAction(null);
  };

  const handleOpenInfo = (asociacion) => {
    setSelectedAsociacion(asociacion);
    setInfoDialogOpen(true);
  };

  const handleCloseInfo = () => {
    setInfoDialogOpen(false);
    setSelectedAsociacion(null);
  };

  const breadcrumbItems = [
    { title: "Inicio", url: "/inicio" },
    { title: "Mis Eventos", url: "/listado-eventos-productor" },
    { title: "Ver Solicitudes", url: "/listado-eventos-productor" },
  ];

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
        {/* Header full-width */}
        <div className="qf-page-header qf-page-header--full" style={{ textAlign: "center" }}>
          <h1 className="qf-page-title" style={{ textAlign: "center", fontSize: "1.75rem" }}>
            Mis Solicitudes para {eventos.nombre}
          </h1>
          <hr className="qf-separator qf-separator--spaced" />
        </div>

        {/* Contenido en dos columnas */}
        <div
          ref={contentRef}
          className={`qf-page-content ${isNarrowLayout ? "qf-page-content--narrow" : ""}`}
          style={{ flex: 1, minHeight: 0 }}
        >
          {/* Columna principal: breadcrumb + listado */}
          <div className="qf-page-content__main">
            <Breadcrumb items={breadcrumbItems} style={{
              margin: 0,
              backgroundColor: 'var(--qf-bg-secondary)',
              width: '100%',
              padding: '8px 16px',
              borderRadius: '10px',
              border: '1px solid var(--qf-naranja)',
              boxSizing: 'border-box',
            }} />

            {/* En modo angosto: buscador + filtros colapsables */}
            {isNarrowLayout && (
              <div className="qf-narrow-filters" style={{ marginBottom: "8px" }}>
                <div className="qf-search-box" style={{ marginBottom: "8px" }}>
                  <Buscador
                    placeholder="Buscar por nombre..."
                    onBuscar={setSearchTerm}
                    botonBuscar={false}
                  />
                </div>
                <div className="qf-filter-box" style={{ margin: 0 }}>
                  <div
                    className="qf-collapsible-header"
                    onClick={() => setFiltersOpen((prev) => !prev)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && setFiltersOpen((prev) => !prev)}
                  >
                    <span className="qf-collapsible-title">ESTADOS</span>
                    <FaChevronDown className={`qf-collapsible-icon ${filtersOpen ? "qf-collapsible-icon--open" : ""}`} />
                  </div>
                  {filtersOpen && (
                    <div className="qf-collapsible-body">
                      <Filtros
                        gruposFiltros={[estadoGroup]}
                        onFiltrar={(f) => setFilterState(f.estado || '')}
                        titulo="ESTADOS"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            <div ref={cardAreaRef} className="qf-scrollable" style={{ paddingTop: "8px", paddingBottom: "60px" }}>
              {loading ? (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "3rem", height: "300px" }}>
                  <CircularProgress style={{ color: "var(--qf-naranja)" }} />
                </div>
              ) : filteredAsociaciones.length > 0 ? (
                filteredAsociaciones.map((asociacion, index) => (
                  <div key={index} style={{ marginBottom: "1rem", position: "relative" }}>
                    {!isCardNarrow && (
                      <div style={{
                        fontSize: "1rem",
                        color: "var(--qf-text-primary)",
                        position: "absolute",
                        top: "20px",
                        right: "20px",
                        backgroundColor: "var(--qf-green)",
                        padding: "5px 10px",
                        borderRadius: "5px",
                        zIndex: 1,
                      }}>
                        {asociacion?.estado === "PendienteDeAceptacion"
                          ? "Pendiente de Aceptacion"
                          : asociacion?.estado === "ConObservacion"
                          ? "Con Observacion"
                          : asociacion?.estado}
                      </div>
                    )}
                    <div style={{
                      display: "flex",
                      flexDirection: "column",
                      backgroundColor: "var(--qf-bg-secondary)",
                      borderRadius: "10px",
                      border: "1px solid var(--qf-naranja)",
                      width: "100%",
                      padding: "20px",
                      boxSizing: "border-box",
                    }}>
                      <h5 style={{
                        fontSize: "2rem",
                        fontWeight: "bold",
                        color: "var(--qf-naranja)",
                        margin: "0 0 8px 0",
                        textAlign: isCardNarrow ? "center" : "left",
                      }}>
                        {asociacion?.puesto?.nombreCarro ||
                          asociacion?.repartidor?.nombre + ", " + asociacion?.repartidor?.apellido}
                      </h5>
                      <p style={{ fontSize: "1rem", color: "var(--qf-text-primary)", margin: "0 0 4px 0", textAlign: isCardNarrow ? "center" : "left" }}>
                        <strong>Teléfono:</strong>{" "}
                        {asociacion?.puesto?.telefonoCarro
                          ? asociacion?.puesto?.telefonoCarro
                          : asociacion?.repartidor?.telefono}
                      </p>
                      {asociacion?.puesto?.tipoNegocio && (
                        <p style={{ fontSize: "1rem", color: "var(--qf-text-primary)", margin: "0 0 4px 0", textAlign: isCardNarrow ? "center" : "left" }}>
                          <strong>Tipo de Negocio:</strong> {asociacion?.puesto?.tipoNegocio}
                        </p>
                      )}

                      {/* Estado como fila de datos en cards angostas */}
                      {isCardNarrow && (
                        <p style={{ fontSize: "1rem", color: "var(--qf-text-primary)", margin: "0 0 4px 0", textAlign: "center" }}>
                          <strong>Estado:</strong>{" "}
                          {asociacion?.estado === "PendienteDeAceptacion"
                            ? "Pendiente de Aceptacion"
                            : asociacion?.estado === "ConObservacion"
                            ? "Con Observacion"
                            : asociacion?.estado}
                        </p>
                      )}

                      {/* Separador entre datos y botones en cards angostas */}
                      {isCardNarrow && <hr style={{ borderColor: "var(--qf-naranja)", margin: "12px 0" }} />}

                      <div style={{
                        display: "flex",
                        flexDirection: isCardNarrow ? "column" : "row",
                        justifyContent: "center",
                        marginTop: "1rem",
                        flexWrap: "wrap",
                        gap: "8px",
                        alignItems: isCardNarrow ? "stretch" : "center",
                      }}>
                        {asociacion.estado !== "Aceptada" &&
                          asociacion.estado !== "Cancelada" &&
                          asociacion.estado !== "Rechazada" && (
                            <button
                              className="btn btn-success"
                              style={{
                                margin: 0,
                                width: isCardNarrow ? "100%" : "auto",
                                textAlign: "center",
                                padding: isCardNarrow ? "0.375rem 0" : "",
                              }}
                              onClick={() => aceptarSolicitud(asociacion.id)}
                            >
                              Aceptar Solicitud
                            </button>
                          )}
                        {asociacion.estado !== "Rechazada" &&
                          asociacion.estado !== "Cancelada" &&
                          asociacion.estado !== "Aceptada" && (
                            <button
                              className="btn btn-danger"
                              style={{
                                margin: 0,
                                width: isCardNarrow ? "100%" : "auto",
                                textAlign: "center",
                                padding: isCardNarrow ? "0.375rem 0" : "",
                              }}
                              onClick={() => rechazarSolicitud(asociacion.id)}
                            >
                              Rechazar Solicitud
                            </button>
                          )}
                        {asociacion.estado === "Aceptada" && (
                          <button
                            className="btn btn-danger"
                            style={{
                              margin: 0,
                              width: isCardNarrow ? "100%" : "auto",
                              textAlign: "center",
                              padding: isCardNarrow ? "0.375rem 0" : "",
                            }}
                            onClick={() => cancelarSolicitud(asociacion.id)}
                          >
                            Cancelar Solicitud
                          </button>
                        )}
                        <button
                          className="btn btn-secondary"
                          style={{
                            margin: 0,
                            width: isCardNarrow ? "100%" : "auto",
                            textAlign: "center",
                            padding: isCardNarrow ? "0.375rem 0" : "",
                          }}
                          onClick={() => handleOpenInfo(asociacion)}
                        >
                          Info
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: "center", padding: "40px 20px", margin: "40px" }}>
                  <div style={{ fontSize: "1.5rem", color: "var(--qf-naranja)" }}>
                    <h2 style={{ color: "var(--qf-naranja)" }}>Solicitudes</h2>
                  </div>
                  <div style={{ marginBottom: "20px", fontSize: "18px" }}>
                    <p style={{ color: "#FFFFFF", margin: "0" }}>
                      Este evento no tiene solicitudes pendientes. Invita a tus
                      puestos favoritos a unirse.
                    </p>
                  </div>
                  <Link
                    to={`/listado-eventos-productor`}
                    style={{
                      textDecoration: "none",
                      backgroundColor: "var(--qf-naranja)",
                      padding: "10px 20px",
                      color: "var(--qf-text-primary)",
                      borderRadius: "5px",
                      fontWeight: "bold",
                      fontSize: "18px",
                      transition: "background-color 0.3s",
                      display: "inline-block",
                    }}
                  >
                    Volver a mis Eventos
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Aside: buscador + filtros (solo en layout ancho) */}
          {!isNarrowLayout && (
            <aside className="qf-page-content__aside">
              <div className="qf-search-box">
                <Buscador
                  placeholder="Buscar por nombre..."
                  onBuscar={setSearchTerm}
                  botonBuscar={false}
                />
              </div>
              <div className="qf-filter-box">
                <Filtros
                  gruposFiltros={[estadoGroup]}
                  onFiltrar={(f) => setFilterState(f.estado || '')}
                  titulo="ESTADOS"
                />
              </div>
            </aside>
          )}
        </div>
      </div>

      {/* Dialog de Confirmación */}
      <ConfirmDialog
        open={confirmOpen}
        title={pendingAction?.title || 'Confirmar Acción'}
        message={pendingAction?.message || '¿Estás seguro de que deseas realizar esta acción?'}
        onConfirm={handleConfirm}
        onCancel={handleCancelConfirm}
      />

      {/* Dialog de Información */}
      {selectedAsociacion && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: infoDialogOpen ? 'flex' : 'none',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: "var(--qf-bg-secondary)",
            borderRadius: '10px',
            border: `2px solid var(--qf-naranja)`,
            padding: '30px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto',
          }}>
            <h2 style={{ color: "var(--qf-naranja)", marginBottom: '20px', textAlign: 'center' }}>Detalles de la Solicitud</h2>
            
            <div style={infoRowStyle}>
              <span style={infoLabelStyle}>Nombre:</span>
              <span style={infoValueStyle}>
                {selectedAsociacion?.puesto?.nombreCarro ||
                  `${selectedAsociacion?.repartidor?.nombre} ${selectedAsociacion?.repartidor?.apellido}`}
              </span>
            </div>

            <div style={infoRowStyle}>
              <span style={infoLabelStyle}>Estado:</span>
              <span style={infoValueStyle}>
                {selectedAsociacion?.estado === 'PendienteDeAceptacion'
                  ? 'Pendiente de Aceptación'
                  : selectedAsociacion?.estado === 'ConObservacion'
                  ? 'Con Observación'
                  : selectedAsociacion?.estado}
              </span>
            </div>

            {selectedAsociacion?.puesto && (
              <>
                <h3 style={{ color: "var(--qf-naranja)", marginTop: '20px', fontSize: '1.1rem' }}>Información del Puesto</h3>
                <div style={infoRowStyle}>
                  <span style={infoLabelStyle}>Teléfono:</span>
                  <span style={infoValueStyle}>{selectedAsociacion?.puesto?.telefonoCarro}</span>
                </div>
                <div style={infoRowStyle}>
                  <span style={infoLabelStyle}>Tipo de Negocio:</span>
                  <span style={infoValueStyle}>{selectedAsociacion?.puesto?.tipoNegocio}</span>
                </div>
              </>
            )}

            {selectedAsociacion?.repartidor && (
              <>
                <h3 style={{ color: "var(--qf-naranja)", marginTop: '20px', fontSize: '1.1rem' }}>Información del Repartidor</h3>
                <div style={infoRowStyle}>
                  <span style={infoLabelStyle}>Teléfono:</span>
                  <span style={infoValueStyle}>{selectedAsociacion?.repartidor?.telefono}</span>
                </div>
              </>
            )}

            <div style={{ display: 'flex', gap: '10px', marginTop: '30px', justifyContent: 'center' }}>
              <button
                onClick={handleCloseInfo}
                style={{
                  backgroundColor: "var(--qf-naranja)",
                  color: "var(--qf-text-primary)",
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </PageLayout>
  );
};

export default VerSolicitudesEvento;
