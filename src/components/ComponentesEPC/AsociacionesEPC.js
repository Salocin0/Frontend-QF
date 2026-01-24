import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Sidebar from "../ComponentesGenerales/Sidebar";
import { UserContext } from "../ComponentesGenerales/UserContext";
import { useContext } from "react";
import useDynamicColors from "../../UseDinamicColors";
import imgDefault from "../img/logoevento.webp";
import Footer from "../ComponentesGenerales/Footer";
import Breadcrumb from "../ComponentesGenerales/Breadcrumb";

const AsociacionesEPC = () => {
  const { user } = useContext(UserContext);
  const [eventos, setEventos] = useState([]);
  const [, setIsPendienteDeAceptacion] = useState(false);
  const [asociaciones, setAsociaciones] = useState([]);
  const Colors = useDynamicColors();

  useEffect(() => {
    if (user) {
      const headers = new Headers();
      headers.append("ConsumidorId", user.consumidorId);

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
        .catch((error) => console.log("No existen eventos.", error));
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
    fetch(
      `${process.env?.REACT_APP_BACK_URL}asociacion/cambiarEstado/${asociacionID}/cancelar`,
      {
        method: "POST",
      }
    ).then((response) => {
      if (response.ok) {
        toast.success("Asociacion Cancelada correctamente");
        window.location.reload();
      } else {
        response.json().then((errorData) => {
          const errorMessage = errorData.message || "Ha ocurrido un error";
          toast.error(errorMessage);
        });
      }
    });
  };

  const styles = {
    row: {
      margin: 0,
      display: "flex",
      flexDirection: "row",
      backgroundColor: Colors.GrisAzuladoOscuro,
      height: "100vh", // Asegura que el contenedor ocupe el 100% de la altura de la pantalla
      overflow: "hidden", // Oculta la barra de desplazamiento en el contenedor principal
      width: "100%",
    },
    colContent: {
      marginLeft: "20%",
      width: "100%",
      height: "100%", // Asegura que el contenedor de contenido ocupe toda la altura disponible
      overflowY: "auto", // Permite el desplazamiento solo si es necesario
      msOverflowStyle: "none", // IE and Edge
      scrollbarWidth: "none", // Firefox
      WebkitScrollbar: { display: "none" }, // Hide scrollbar for Chrome, Safari, and Opera
    },
    container: {
      paddingBottom: "60px",
      width: "100%",
      flexDirection: "column", // Asegura que el contenido esté alineado de arriba hacia abajo
    },
    sectionTitle: {
      display: "flex",
      justifyContent: "center",
      marginBottom: "1rem",
      paddingTop: "2rem",
      width: "100%",
      color: Colors.Naranja,
    },
    card: {
      border: `1px solid ${Colors.Naranja}`,
      borderRadius: "10px",
      marginBottom: "1rem",
      backgroundColor: Colors.GrisAzuladoClaro,
      marginLeft: "20px",
      marginRight: "20px",
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
      width: "80%",
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
      color: Colors.Naranja,
      textAlign: "center",
      width: "100%",
    },
    description: {
      color: Colors.BlancoEnBlanco,
      width: "100%",
    },
    locationText: {
      color: Colors.BlancoEnBlanco,
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
      backgroundColor: Colors.Rojo,
      color: Colors.BlancoEnBlanco,
      padding: "0.5rem 1rem",
      border: "none",
      cursor: "pointer",
      borderRadius: "10px",
      width: "200px",
    },
    estadoText: {
      fontWeight: "bold",
      backgroundColor: Colors.Verde,
      color: Colors.BlancoEnBlanco,
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
      color: Colors.Naranja,
    },
    noAsociacionesDescription: {
      textAlign: "center",
    },
    linkAgregarEvento: {
      color: Colors.Azul,
      textDecoration: "none",
      fontWeight: "bold",
    },
    breadcrumbWrapper: {
      width: "Calc(100%)",
      paddingTop: "10px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
  };

  const breadcrumbItems = [
    { title: "Inicio", url: "/inicio" },
    { title: "Mis asociaciones", url: "/misAsociacionesEPC" },
  ];

  return (
    <div>
      <div style={styles.row}>
        <Sidebar tipoUsuario={user?.tipoUsuario} />
        <div style={styles.colContent}>
          <div style={styles.sectionTitle}>
            <h1>Mis Asociaciones</h1>
          </div>
          <hr style={{ color: Colors.Naranja }} />
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
            <div>
              {eventos.length > 0 ? (
                <div style={styles.rowInner}>
                  {eventos.map((evento, index) => {
                    const asociacion = asociaciones.find(
                      (asoc) => asoc.eventoId === evento.id
                    );
                    return (
                      <div style={styles.card} key={index}>
                        <div style={styles.cardBody}>
                          <div style={styles.imgContainer}>
                            <img
                              src={evento.img || imgDefault}
                              alt="Logo del Evento"
                              style={styles.img}
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
                              <hr style={{ color: Colors.Naranja }} />
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
                            {asociacion.estado === "PendienteDeAceptacion"
                              ? "Pendiente de Aceptacion"
                              : asociacion.estado}
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
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AsociacionesEPC;
