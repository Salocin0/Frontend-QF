import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
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
    console.log(asociacionId);
    fetch(
      `${process.env?.REACT_APP_BACK_URL}asociacion/cambiarEstado/${asociacionId}/rechazada`,
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

  const styles = {
    colContent: {
      marginLeft: "20%",
      width: "calc(100% - 20%)",
      height: "100%",
      overflowY: "auto",
      msOverflowStyle: "none",
      scrollbarWidth: "none",
      WebkitScrollbar: { display: "none" },
    },
    container: {
      paddingBottom: "60px",
      marginLeft: "20px",
      marginRight: "20px",
      width: "calc(100% - 40px)",
      flexDirection: "column",
    },
    sectionTitle: {
      display: "flex",
      justifyContent: "center",
      marginBottom: "1rem",
      paddingTop: "2rem",
      width: "100%",
      color: "var(--qf-naranja)",
    },
    hrStyle: {
      color: "var(--qf-naranja)",
    },
    breadcrumbWrapper: {
      width: "Calc(100%)",
      paddingTop: "0px",
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
    card: {
      marginBottom: "1rem",
      position: "relative",
    },
    cardBody: {
      display: "flex",
      flexDirection: "column",
      backgroundColor: "var(--qf-bg-secondary)",
      borderRadius: "10px",
      border: `1px solid var(--qf-naranja)`,
      width: "100%",
      paddingBottom: "20px",
    },
    cardTitle: {
      fontSize: "2rem",
      fontWeight: "bold",
      color: "var(--qf-naranja)",
    },
    cardDescripcion: {
      fontSize: "1rem",
      marginBottom: "0.5rem",
      color: "var(--qf-text-primary)",
      width: "100%",
      margin: "0 auto",
    },
    cardText: {
      fontSize: "1rem",
      color: "var(--qf-text-primary)",
      margin: "0 auto",
    },
    cardEstadoProductor: {
      fontSize: "1rem",
      color: "var(--qf-text-primary)",
      position: "absolute",
      top: "20px",
      right: "20px",
      backgroundColor: "var(--qf-green)",
      padding: "5px 10px",
      borderRadius: "5px",
    },
    buttonContainer: {
      display: "flex",
      justifyContent: "center",
      marginTop: "1rem",
    },
    button: {
      marginRight: "0.5rem",
    },
    contenedorGrid: {
      textAlign: "center",
      padding: "40px 20px",
      margin: "40px",
    },
    descripcion: {
      marginBottom: "20px",
      fontSize: "18px",
    },
    linkAgregarEvento: {
      textDecoration: "none",
      backgroundColor: "var(--qf-naranja)",
      padding: "10px 20px",
      color: "var(--qf-text-primary)",
      borderRadius: "5px",
      fontWeight: "bold",
      fontSize: "18px",
      transition: "background-color 0.3s",
      display: "inline-block",
    },
    infoCard: {
      backgroundColor: "var(--qf-bg-secondary)",
      borderRadius: "10px",
      border: `1px solid var(--qf-naranja)`,
      padding: "20px",
      marginTop: "20px",
    },
    infoRow: {
      display: "flex",
      marginBottom: "10px",
      alignItems: "center",
    },
    infoLabel: {
      color: "var(--qf-naranja)",
      fontWeight: "bold",
      minWidth: "150px",
      fontSize: "1rem",
    },
    infoValue: {
      color: "var(--qf-text-primary)",
      fontSize: "1rem",
    },
  };

  const handleConfirm = () => {
    if (!pendingAction) return;
    
    switch (pendingAction.type) {
      case 'aceptar':
        executeAceptarSolicitud();
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
      <div style={styles.colContent}>
          <div style={styles.sectionTitle}>
            <h1>Mis Solicitudes para {eventos.nombre}</h1>
          </div>
          <hr style={styles.hrStyle} />
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
              <div style={styles.container}>
                {loading ? (
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "3rem", height: "300px" }}>
                    <CircularProgress style={{ color: "var(--qf-naranja)" }} />
                  </div>
                ) : filteredAsociaciones.length > 0 ? (
                  filteredAsociaciones.map((asociacion, index) => (
                <div style={styles.card} key={index}>
                  <div style={styles.cardEstadoProductor}>
                    {asociacion?.estado === "PendienteDeAceptacion"
                      ? "Pendiente de Aceptacion"
                      : asociacion?.estado === "ConObservacion"
                      ? "Con Observacion"
                      : asociacion?.estado}
                  </div>
                  <div className="card-body" style={styles.cardBody}>
                    <div className="row">
                      <div>
                        <h5 style={styles.cardTitle}>
                          {asociacion?.puesto?.nombreCarro ||
                            asociacion?.repartidor?.nombre +
                              ", " +
                              asociacion?.repartidor?.apellido}
                        </h5>
                        <p style={styles.cardText}>
                          <strong>Teléfono:</strong>{" "}
                          {asociacion?.puesto?.telefonoCarro
                            ? asociacion?.puesto?.telefonoCarro
                            : asociacion?.repartidor?.telefono}
                        </p>
                        {asociacion?.puesto?.tipoNegocio && (
                          <p style={styles.cardText}>
                            <strong>Tipo de Negocio:</strong> {asociacion?.puesto?.tipoNegocio}
                          </p>
                        )}
                      </div>

                      <div className="col-md-12" style={styles.buttonContainer}>
                        {asociacion.estado !== "Aceptada" &&
                          asociacion.estado !== "Cancelada" &&
                          asociacion.estado !== "Rechazada" && (
                            <button
                              className="btn btn-success"
                              style={styles.button}
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
                              style={styles.button}
                              onClick={() => rechazarSolicitud(asociacion.id)}
                            >
                              Rechazar Solicitud
                            </button>
                          )}
                        {asociacion.estado === "Aceptada" && (
                          <button
                            className="btn btn-danger"
                            style={styles.button}
                            onClick={() => cancelarSolicitud(asociacion.id)}
                          >
                            Cancelar Solicitud
                          </button>
                        )}
                        <button
                          className="btn btn-secondary"
                          style={styles.button}
                          onClick={() => handleOpenInfo(asociacion)}
                        >
                          Info
                        </button>
                      </div>
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
                      to={`/inicio`}
                      style={styles.linkAgregarEvento}
                    >
                      Enviar Invitación
                    </Link>
                  </div>
                )}
              </div>
            </div>
            {/* sidebar */}
            <div style={{ ...styles.filtersContainer, flex: '0 0 calc(30% - 0px)', width: 'calc(30% - 0px)', paddingTop: "10px" }}>
              <div style={{ ...styles.searchFilterContainer, marginTop: '10px' }}>
                <Buscador
                  placeholder="Buscar por nombre..."
                  onBuscar={setSearchTerm}
                  style={{ display: 'flex', width: '100%' }}
                />
                <Filtros
                  gruposFiltros={[estadoGroup]}
                  onFiltrar={(filters) => setFilterState(filters.estado || '')}
                  style={{ display: 'flex', width: '100%' }}
                />
              </div>
            </div>
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
            
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Nombre:</span>
              <span style={styles.infoValue}>
                {selectedAsociacion?.puesto?.nombreCarro ||
                  `${selectedAsociacion?.repartidor?.nombre} ${selectedAsociacion?.repartidor?.apellido}`}
              </span>
            </div>

            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Estado:</span>
              <span style={styles.infoValue}>
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
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Teléfono:</span>
                  <span style={styles.infoValue}>{selectedAsociacion?.puesto?.telefonoCarro}</span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Tipo de Negocio:</span>
                  <span style={styles.infoValue}>{selectedAsociacion?.puesto?.tipoNegocio}</span>
                </div>
              </>
            )}

            {selectedAsociacion?.repartidor && (
              <>
                <h3 style={{ color: "var(--qf-naranja)", marginTop: '20px', fontSize: '1.1rem' }}>Información del Repartidor</h3>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Teléfono:</span>
                  <span style={styles.infoValue}>{selectedAsociacion?.repartidor?.telefono}</span>
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
