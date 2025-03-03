import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Sidebar from "../ComponentesGenerales/Sidebar";
import { UserContext } from "../ComponentesGenerales/UserContext";
import useDynamicColors from "../../UseDinamicColors";
import Footer from "../ComponentesGenerales/Footer";
import Breadcrumb from "../ComponentesGenerales/Breadcrumb";

const VerSolicitudesEvento = () => {
  const { evento } = useParams();
  const [eventos, setEventos] = useState([]);
  const [asociaciones, setAsociaciones] = useState([]);
  const { user } = useContext(UserContext);
  const Colors = useDynamicColors();
  const [recargar, setRecargar] = useState(0);

  const recargarComponente = () => {
    setRecargar((prev) => prev + 1);
  };

  useEffect(() => {
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
      });
  }, [asociaciones.length, evento, recargar]);

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
    fetch(
      `${process.env?.REACT_APP_BACK_URL}asociacion/cambiarEstado/${asociacionId}/aceptar`,
      {
        method: "POST",
      }
    )
      .then((response) => response.json())
      .then(() => {
        toast.success("Asociacion Aceptada con éxito");
      })
      .catch((error) => toast.error("Error al Asociar Puesto"))
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
      .catch((error) => toast.error("Error al Asociar Puesto"))
      .finally(() => {
        recargarComponente();
      });
  };

  const cancelarSolicitud = (asociacionId) => {
    console.log(asociacionId);
    fetch(
      `${process.env?.REACT_APP_BACK_URL}asociacion/cambiarEstado/${asociacionId}/cancelar`,
      {
        method: "POST",
      }
    )
      .then((response) => response.json())
      .then(() => {
        toast.success("Asociacion Cancelada con éxito");
      })
      .catch((error) => toast.error("Error al Cancelar Puesto"))
      .finally(() => {
        recargarComponente();
      });
  };

  const styles = {
    mainFormEventos: {
      margin: 0,
      backgroundColor: Colors.GrisAzuladoOscuro,
      width: "100%",
      overflow: "hidden", // Oculta la barra de scroll
    },
    contentContainer: {
      paddingTop: "2rem",
      paddingBottom: "4rem",
      height: "100vh", // Ocupar toda la altura de la ventana
      width: "100%",
      marginLeft: "20%",
      overflowY: "scroll", // Permite el scroll vertical
      scrollbarWidth: "none", // Oculta la barra de scroll en Firefox
      msOverflowStyle: "none", // Oculta la barra en IE y Edge
    },
    // Estilo para navegadores basados en WebKit (Chrome, Safari, Edge moderno)
    "@global": {
      "*::-webkit-scrollbar": {
        display: "none", // Oculta la barra de scroll
      },
    },
    tituloSeccion: {
      textAlign: "center",
      marginBottom: "1.5rem",
      color: Colors.Blanco,
      width: "100%",
    },
    hrStyle: {
      color: Colors.Naranja,
    },
    card: {
      marginBottom: "1rem",
      marginLeft: "20px",
      marginRight: "20px",
      position: "relative",
    },
    cardBody: {
      display: "flex",
      flexDirection: "column",
      backgroundColor: Colors.GrisAzuladoClaro,
      borderRadius: "10px",
      border: `1px solid ${Colors.Naranja}`,
      width: "100%",
      paddingBottom: "20px",
    },
    cardTitle: {
      fontSize: "2rem",
      fontWeight: "bold",
      color: Colors.Naranja,
    },
    cardDescripcion: {
      fontSize: "1rem",
      marginBottom: "0.5rem",
      color: Colors.Blanco,
      width: "100%",
      margin: "0 auto",
    },
    cardText: {
      fontSize: "1rem",
      color: Colors.Blanco,
      margin: "0 auto",
    },
    cardEstadoProductor: {
      fontSize: "1rem",
      color: Colors.Blanco,
      position: "absolute",
      top: "20px",
      right: "20px",
      backgroundColor: Colors.Verde,
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
    },
    linkAgregarEvento: {
      textDecoration: "none",
    },
    breadcrumbWrapper: {
      width: "100%",
      margin: "0",
      padding: "0",
      paddingTop: "10px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
  };

  const breadcrumbItems = [
    { title: "Inicio", url: "/inicio" },
    { title: "Mis Eventos", url: "/listado-eventos-productor" },
    { title: "Ver Solicitudes", url: "/listado-eventos-productor" },
  ];

  return (
    <div className="row" style={styles.mainFormEventos}>
      <Sidebar tipoUsuario={user?.tipoUsuario} />

      <div className="d-flex align-items-center justify-content-center">
        <div style={styles.contentContainer}>
          {asociaciones.length > 0 ? (
            <>
              <div style={styles.tituloSeccion}>
                <h1>Mis Solicitudes para {eventos.nombre}</h1>
              </div>
              <hr style={styles.hrStyle} />
              <div style={styles.breadcrumbWrapper}>
                <Breadcrumb
                  items={breadcrumbItems}
                  style={{
                    width: "Calc(100% - 40px)",
                    marginLeft: "Calc(20px)",
                  }}
                />
              </div>
              {asociaciones.map((asociacion, index) => (
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
                        <p style={styles.cardDescripcion}>
                          {asociacion?.puesto?.id
                            ? `ID de Carro: ${asociacion?.puesto?.id}`
                            : `ID de Repartidor: ${asociacion?.repartidor?.id}`}
                        </p>
                        <p style={styles.cardText}>
                          {asociacion?.puesto?.telefonoCarro
                            ? `Teléfono de Carro: ${asociacion?.puesto?.telefonoCarro}`
                            : `Teléfono de Repartidor: ${asociacion?.repartidor?.telefono}`}
                        </p>
                        <p style={styles.cardText}>
                          {asociacion?.puesto?.id
                            ? `${asociacion?.puesto?.tipoNegocio}`
                            : ``}
                        </p>
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
                          disabled
                        >
                          Info
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div style={styles.contenedorGrid}>
              <div style={styles.tituloSeccion}>
                <h2>Solicitudes</h2>
              </div>
              <div>
                <p>
                  Este evento no tiene solicitudes pendientes. Invita a tus
                  puestos favoritos a unirse.
                </p>
              </div>
              <Link
                to={`/inicio`}
                style={styles.linkAgregarEvento}
                className="LinkAgregarEvento"
              >
                Enviar Invitación
              </Link>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default VerSolicitudesEvento;
