import { useEffect, useState, useContext, useRef } from "react";
import { CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import PageLayout from "../ComponentesGenerales/PageLayout";
import { UserContext } from "../ComponentesGenerales/UserContext";
import imgDefault from "../img/logoevento.webp";
import Footer from "../ComponentesGenerales/Footer";
import Breadcrumb from "../ComponentesGenerales/Breadcrumb";

const AsociacionesR = () => {
  const { user } = useContext(UserContext);
  const [eventos, setEventos] = useState([]);
  const [asociaciones, setAsociaciones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [asociacionToCancel, setAsociacionToCancel] = useState(null);
  const cardRef = useRef(null);
  const [isCardNarrow, setIsCardNarrow] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el || eventos.length === 0) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setIsCardNarrow(entry.contentRect.width <= 650);
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [eventos]);

  const getEstadoStyle = (estado) => {
    const base = { padding: "4px 12px", borderRadius: "10px", fontWeight: "bold", fontSize: "14px" };
    switch(estado) {
      case "Aceptada": return { ...base, backgroundColor: "var(--qf-green)", color: "white" };
      case "PendienteDeAceptacion": return { ...base, backgroundColor: "var(--qf-naranja)", color: "white" };
      case "Rechazada": return { ...base, backgroundColor: "var(--qf-rojo)", color: "white" };
      case "Cancelada": return { ...base, backgroundColor: "#666", color: "white" };
      default: return { ...base, backgroundColor: "#666", color: "white" };
    }
  };

  const getEstadoLabel = (estado) => {
    switch(estado) {
      case "Aceptada": return "Aceptada";
      case "PendienteDeAceptacion": return "Pendiente";
      case "Rechazada": return "Rechazada";
      case "Cancelada": return "Cancelada";
      default: return estado;
    }
  };

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

  const breadcrumbItems = [
    { title: "Inicio", url: "/inicio" },
    { title: "Mis asociaciones", url: "/misAsociacionesR" },
  ];

  return (
    <PageLayout sidebarProps={{ tipoUsuario: user?.tipoUsuario }}>
      <div style={{ width: "100%" }}>
        {/* Header centrado */}
        <div className="qf-page-header--full">
          <h1 style={{ color: "var(--qf-naranja)", textAlign: "center" }}>
            Mis Asociaciones
          </h1>
        </div>
        <hr className="qf-separator qf-separator--spaced" />

        {/* Breadcrumb con borde dorado */}
        <Breadcrumb
          items={breadcrumbItems}
          style={{
            border: "1px solid var(--qf-naranja)",
            margin: "0 20px",
            width: "auto",
          }}
        />

        {/* Listado de cards */}
        <div style={{ padding: "1rem 20px 2rem 20px" }}>
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
                  <div
                    key={index}
                    ref={index === 0 ? cardRef : undefined}
                    style={{
                      border: "1px solid var(--qf-naranja)",
                      borderRadius: "8px",
                      backgroundColor: "var(--qf-bg-secondary)",
                      marginBottom: "20px",
                    }}
                  >
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <div
                        style={{
                          padding: "20px",
                          display: "flex",
                          flexDirection: isCardNarrow ? "column" : "row",
                          alignItems: isCardNarrow ? "center" : "stretch",
                          justifyContent: "space-between",
                          gap: isCardNarrow ? "1rem" : "0",
                        }}
                      >
                        <img
                          src={
                            evento?.img && !String(evento.img).includes("vendimia.mendoza.gov.ar")
                              ? evento.img
                              : imgDefault
                          }
                          alt="Logo del Evento"
                          style={{
                            width: isCardNarrow ? "100%" : "auto",
                            height: isCardNarrow ? "200px" : "150px",
                            borderRadius: "8px",
                            objectFit: "cover",
                          }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = imgDefault;
                          }}
                        />
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            textAlign: "center",
                            width: "100%",
                          }}
                        >
                          <h5
                            style={{
                              fontSize: "28px",
                              fontWeight: "bold",
                              color: "var(--qf-naranja)",
                              textAlign: "center",
                            }}
                          >
                            {evento.nombre}
                          </h5>
                          <p style={{ fontSize: "20px", margin: "5px 0", color: "var(--qf-text-white)" }}>
                            {evento.descripcion}
                          </p>
                          <p style={{ fontSize: "20px", margin: "5px 0", color: "var(--qf-text-white)" }}>
                            {evento.ubicacion} - {evento.localidad},{" "}
                            {evento.provincia}
                          </p>
                          {/* Estado de la asociación siempre visible */}
                          {asociacion && (
                            <span style={{ ...getEstadoStyle(asociacion.estado), marginTop: "0.5rem" }}>
                              {getEstadoLabel(asociacion.estado)}
                            </span>
                          )}
                        </div>
                      </div>

                      {asociacion.estado === "PendienteDeAceptacion" && (
                        <>
                          <hr style={{
                            border: "none",
                            borderTop: "1px solid var(--qf-naranja)",
                            margin: 0,
                            width: "100%",
                          }} />
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              padding: "10px",
                            }}
                          >
                            <button
                              style={{
                                margin: "10px",
                                padding: "10px 20px",
                                cursor: "pointer",
                                width: "200px",
                                borderRadius: "10px",
                                border: "none",
                                backgroundColor: "var(--qf-rojo)",
                                color: "var(--qf-text-white)",
                              }}
                              onClick={() =>
                                setAsociacionToCancel({ asociacion, evento })
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
            <div style={{ textAlign: "center", paddingBottom: "50px" }}>
              <h2 style={{ color: "var(--qf-naranja)" }}>Mis Asociaciones</h2>
              <p style={{ color: "var(--qf-text-white)" }}>
                Con Quickfood, asocia tu evento para hacerlo mejor. Descubre
                nuestras increíbles características y ofrece una experiencia
                única a tus consumidores.
              </p>
              <Link
                to={`/registrar-evento`}
                style={{
                  color: "var(--qf-naranja)",
                  fontWeight: "bold",
                  textDecoration: "underline",
                }}
              >
                Asociarme a Evento
              </Link>
            </div>
          )}
        </div>
        <Footer />
      </div>

      {/* Modal de confirmación para cancelar asociación */}
      {asociacionToCancel && (
        <div style={{
          display: "flex",
          position: "fixed",
          top: "0",
          left: "0",
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: "1000",
          justifyContent: "center",
          alignItems: "center",
        }}>
          <div style={{
            backgroundColor: "var(--qf-bg-secondary)",
            padding: "20px",
            borderRadius: "10px",
            width: "80%",
            maxWidth: "400px",
            textAlign: "center",
          }}>
            <h3 style={{
              textAlign: "center",
              color: "var(--qf-naranja)",
              marginBottom: "1rem",
            }}>
              Cancelar asociación
            </h3>
            <div style={{
              backgroundColor: "var(--qf-bg-main)",
              padding: "16px",
              borderRadius: "8px",
              marginBottom: "1.5rem",
              border: "1px solid var(--qf-naranja)33",
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
                gap: "10px",
              }}>
                <span style={{
                  color: "var(--qf-naranja)",
                  fontWeight: "bold",
                  minWidth: "100px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px",
                }}>Evento:</span>
                <span style={{ color: "var(--qf-text-white)", fontSize: "15px" }}>
                  {asociacionToCancel.evento.nombre}
                </span>
              </div>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}>
                <span style={{
                  color: "var(--qf-naranja)",
                  fontWeight: "bold",
                  minWidth: "100px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px",
                }}>Ubicación:</span>
                <span style={{ color: "var(--qf-text-white)", fontSize: "15px" }}>
                  {asociacionToCancel.evento.ubicacion} - {asociacionToCancel.evento.localidad}
                </span>
              </div>
            </div>
            <div style={{
              display: "flex",
              justifyContent: "space-around",
              marginTop: "1rem",
            }}>
              <button
                style={{
                  padding: "0.5rem 1rem",
                  border: "none",
                  borderRadius: "0.2rem",
                  cursor: "pointer",
                  fontWeight: "bold",
                  backgroundColor: "var(--qf-rojo)",
                  color: "var(--qf-blanco-puro)",
                }}
                onClick={() => setAsociacionToCancel(null)}
              >
                Volver
              </button>
              <button
                style={{
                  padding: "0.5rem 1rem",
                  border: "none",
                  borderRadius: "0.2rem",
                  cursor: "pointer",
                  fontWeight: "bold",
                  backgroundColor: "var(--qf-green)",
                  color: "var(--qf-blanco-puro)",
                }}
                onClick={() => {
                  const id = asociacionToCancel.asociacion.id;
                  setAsociacionToCancel(null);
                  cancelarAsociacion(id);
                }}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export default AsociacionesR;
