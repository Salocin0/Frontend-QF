import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import PageLayout from "../ComponentesGenerales/PageLayout";
import { useContext } from "react";
import { UserContext } from "../ComponentesGenerales/UserContext";
import imgDefault from "../img/logoevento.webp";
import Footer from "../ComponentesGenerales/Footer";
import Breadcrumb from "../ComponentesGenerales/Breadcrumb";
import useBreakpoint from "../../useBreakpoint";

const AsociacionesR = () => {
  const { isMobile } = useBreakpoint();
  const { user } = useContext(UserContext);
  const [eventos, setEventos] = useState([]);
  const [asociaciones, setAsociaciones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const headers = new Headers();
      headers.append("ConsumidorId", user.consumidorId);

      setIsLoading(true);
      fetch(
        `${process.env?.REACT_APP_BACK_URL}asociacion/buscarR/${user.consumidorId}`,
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
    cardTextContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      width: "100%",
      marginRight: "150px",
    },
    contentColumn: {
      marginLeft: isMobile ? "0" : "20%",
    },
    tituloSeccion: {
      textAlign: "center",
      marginBottom: "20px",
      color: "var(--qf-naranja)",
      paddingTop: "20px",
    },
    card: {
      margin: "20px 20px",
      border: `1px solid var(--qf-naranja)`,
      borderRadius: "8px",
      backgroundColor: "var(--qf-bg-secondary)",
    },
    cardBody: {
      padding: "20px",
      flexDirection: "row",
      display: "flex",
      justifyContent: "space-between",
    },
    cardImage: {
      width: "auto",
      height: "150px",
      borderRadius: "8px",
      display: "flex",
      justifyContent: "center",
      alingItems: "center",
    },
    cardTitle: {
      fontSize: "28px",
      fontWeight: "bold",
      color: "var(--qf-naranja)",
      textAlign: "center",
    },
    cardText: { fontSize: "20px", margin: "5px 0", color: "var(--qf-text-white)" },
    button: {
      margin: "10px",
      padding: "10px 20px",
      cursor: "pointer",
      width: "200px",
      borderRadius: "10px",
      border: "none",
      backgroundColor: "var(--qf-rojo)",
      color: "var(--qf-text-white)",
    },
    buttonContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: "10px",
    },
    noEventosContainer: { paddingBottom: "50px" },
    breadcrumbWrapper: {
      width: "Calc(100%)",
      paddingTop: "10px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
  };

  const breadcrumbItems = [
    { title: "Inicio", url: "/inicio" },
    { title: "Mis asociaciones", url: "/misAsociacionesR" },
  ];

  return (
    <PageLayout sidebarProps={{ tipoUsuario: user?.tipoUsuario }}>
      <div style={styles.contentColumn}>
          <div>
            <div style={styles.tituloSeccion}>
              <h1>Mis Asociaciones</h1>
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
            <div style={styles.noEventosContainer}>
              {isLoading ? (
                <div style={{ display: "flex", justifyContent: "center", marginTop: "3rem" }}>
                  <CircularProgress style={{ color: "var(--qf-naranja)" }} />
                </div>
              ) : eventos.length > 0 ? (
                <>
                  {eventos.map((evento, index) => {
                    const asociacion = asociaciones.find(
                      (asoc) => asoc.eventoId === evento.id
                    );
                    return (
                      <div style={styles.card} key={index}>
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <div style={styles.cardBody}>
                            <img
                              src={
                                evento?.img && !String(evento.img).includes("vendimia.mendoza.gov.ar")
                                  ? evento.img
                                  : imgDefault
                              }
                              alt="Logo del Evento"
                              style={styles.cardImage}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = imgDefault;
                              }}
                            />
                            <div style={styles.cardTextContainer}>
                              <h5 style={styles.cardTitle}>{evento.nombre}</h5>
                              <p style={styles.cardText}>
                                {evento.descripcion}
                              </p>
                              <p style={styles.cardText}>
                                {evento.ubicacion} - {evento.localidad},{" "}
                                {evento.provincia}
                              </p>
                            </div>
                          </div>

                          {asociacion.estado === "PendienteDeAceptacion" && (
                            <>
                              <hr style={{ color: "var(--qf-naranja)" }} />
                              <div style={styles.buttonContainer}>
                                <button
                                  style={{
                                    ...styles.button,
                                  }}
                                  onClick={() =>
                                    cancelarAsociacion(asociacion.id)
                                  }
                                >
                                  Cancelar Asociacion
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </>
              ) : (
                <div style={styles.noEventosContainer}>
                  <h2>Mis Asociaciones</h2>
                  <p>
                    Con Quickfood, asocia tu evento para hacerlo mejor. Descubre
                    nuestras increíbles características y ofrece una experiencia
                    única a tus consumidores.
                  </p>
                  <Link
                    to={`/registrar-evento`}
                    style={styles.linkAgregarEvento}
                  >
                    Asociarme a Evento
                  </Link>
                </div>
              )}
            </div>
          </div>
      </div>
      <Footer />
    </PageLayout>
  );
};

export default AsociacionesR;
