/* eslint-disable no-unused-vars */
import "bootstrap/dist/css/bootstrap.min.css"; // Importar Bootstrap si no lo tienes
import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import PageLayout from "../ComponentesGenerales/PageLayout";
import "./../sass/main.scss";
import { UserContext } from "../ComponentesGenerales/UserContext";
import Footer from "../ComponentesGenerales/Footer";
import Breadcrumb from "../ComponentesGenerales/Breadcrumb";
import CircularProgress from "@mui/material/CircularProgress";

const RegistrarEvento4 = () => {
  const EVENTO_CREACION_ID_KEY = "eventoCreacionId";
  const { diferenciaDiasEvento } = useParams();
  const navigate = useNavigate();
  const [horasPorDia, setHorasPorDia] = useState([]);
  const [evento, setEvento] = useState(null);
  const [eventoId, setEventoId] = useState(null);
  const [tienePreventa, setTienePreventa] = useState(false);
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const storedEvent = JSON.parse(localStorage.getItem("eventoDatos"));
    if (storedEvent) {
      setEvento(storedEvent);
      setTienePreventa(storedEvent.tienePreventa);

      const fechaInicio = new Date(storedEvent.fechaInicio);
      const fechaFin = new Date(storedEvent.fechaFin);

      const dias = Array.from({ length: diferenciaDiasEvento }, (_, index) => {
        const currentDay = new Date(fechaInicio);
        currentDay.setDate(fechaInicio.getDate() + index);

        // Formatear las fechas en el formato correcto
        const formattedDate = `${currentDay.getFullYear()}-${String(
          currentDay.getMonth() + 1
        ).padStart(2, "0")}-${String(currentDay.getDate()).padStart(2, "0")}`;
        const horaInicio =
          index === 0
            ? `${formattedDate}T${String(fechaInicio.getHours()).padStart(
                2,
                "0"
              )}:${String(fechaInicio.getMinutes()).padStart(2, "0")}`
            : `${formattedDate}T00:00`;
        const horaFin =
          index === diferenciaDiasEvento - 1
            ? `${formattedDate}T${String(fechaFin.getHours()).padStart(
                2,
                "0"
              )}:${String(fechaFin.getMinutes()).padStart(2, "0")}`
            : `${formattedDate}T23:59`;

        return {
          dia: index + 1,
          horaInicio,
          horaFin,
          tienePreventa: storedEvent.tienePreventa,
        };
      });

      setHorasPorDia(dias);
    } else {
      toast.error("No se encontraron datos del evento.");
      navigate("/registrar-evento3");
    }
  }, [diferenciaDiasEvento, navigate]);

  const handleInputChange = (dia, campo, value) => {
    setHorasPorDia((horasAnteriores) =>
      horasAnteriores.map((hora) =>
        hora.dia === dia ? { ...hora, [campo]: value } : hora
      )
    );
  };

  useEffect(() => {
    if (location.state && location.state.eventoId) {
      setEventoId(location.state.eventoId);
      localStorage.setItem(EVENTO_CREACION_ID_KEY, String(location.state.eventoId));
      return;
    }

    const storedEventoId = localStorage.getItem(EVENTO_CREACION_ID_KEY);
    if (storedEventoId) {
      setEventoId(storedEventoId);
    }
  }, [location.state]);

  const handleSiguienteClick = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;
    if (!eventoId) {
      toast.error("No se encontró el borrador del evento. Volvé al paso 1.");
      navigate("/registrar-evento2");
      return;
    }

    const datosHoras = horasPorDia.map((hora) => ({
      dia: hora.dia,
      horaInicio: hora.horaInicio,
      horaFin: hora.horaFin,
      tienePreventa: tienePreventa,
    }));

    const eventoDatos = {
      diferenciaDiasEvento,
      diasEvento: datosHoras,
    };

    try {
      setIsSubmitting(true);

      const updateResponse = await fetch(
        `${process.env.REACT_APP_BACK_URL}evento/preparacion/${eventoId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify(eventoDatos),
        }
      );

      const updateData = await updateResponse.json();

      if (updateResponse.ok) {
        navigate(`/registrar-evento5/${eventoId}/${diferenciaDiasEvento}`);
      } else {
        toast.error(updateData.message || "Error al registrar el evento");
      }
    } catch (error) {
      console.error("Error al registrar el evento:", error);
      toast.error("Error al registrar el evento");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVolver = (e) => {
    navigate(`/registrar-evento3`, { state: { eventoId } });
  };

  const styles = {
    rowFormEvento: {
      display: "flex",
      flexWrap: "wrap",
    },
    colForm: {
      height: "Calc(75% - 60px)",
      padding: 0,
      display: "flex",
      width: "Calc(100% - 20%)",
      marginLeft: "20%",
      marginBottom: "70px",
    },
    formWrapper: {
      color: "var(--qf-text-primary)",
      padding: "2rem",
      width: "100%",
      border: `1px solid var(--qf-naranja)`,
      borderRadius: "10px",
      backgroundColor: "var(--qf-bg-secondary)",
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      margin: "0 20px",
    },
    formGroup: {
      marginBottom: "1rem",
    },
    formLabel: {
      display: "block",
      marginBottom: "0.5rem",
      fontWeight: "bold",
    },
    formInput: {
      width: "100%",
      padding: "0.5rem",
      fontSize: "1rem",
      borderRadius: "10px",
      color: "var(--qf-negro-puro)",
    },
    buttonContainer: {
      display: "flex",
      justifyContent: "end",
      gap: "0.5rem",
    },
    button: {
      backgroundColor: "var(--qf-blue)",
      color: "var(--qf-text-primary)",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      width: "100%",
      padding: "0.75rem",
      fontSize: "1rem",
      fontWeight: "bold",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "10px",
    },
    buttonSecondary: {
      backgroundColor: "var(--qf-text-secondary)",
    },
    buttonDisabled: {
      opacity: 0.7,
      cursor: "not-allowed",
    },
    tituloSeccion: {
      display: "flex",
      justifyContent: "center",
      marginTop: "20px",
      fontSize: "24px",
      marginLeft: "20%",
      color: "var(--qf-text-primary)",
      width: "80%",
    },
    separator: {
      border: "none",
      marginBottom: "5px",
      marginTop: "0px",
      borderTop: `1px solid var(--qf-naranja)`,
    },
    breadcrumbWrapper: {
      marginLeft: "20%",
      width: "80%",
      paddingTop: "10px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
    hr: {
      color: "var(--qf-naranja)",
      border: `1px solid var(--qf-naranja)`,
      width: "100%",
    },
  };

  const breadcrumbItems = [
    { title: "Inicio", url: "/inicio" },
    { title: "Mis Eventos", url: "/listado-eventos-productor" },
    { title: "Crear un Evento (3/4)", url: "registrar-evento4" },
  ];

  return (
    <PageLayout sidebarProps={{ tipoUsuario: user?.tipoUsuario }}>
        <div style={styles.tituloSeccion}>
          <h1 style={{ textAlign: "center" }}>Crear un Evento</h1>
        </div>
        <hr style={styles.hr} />
        <div style={styles.breadcrumbWrapper}>
          <Breadcrumb
            items={breadcrumbItems}
            style={{ width: "Calc(100% - 40px)", marginLeft: "20px" }}
          />
        </div>
        <div style={styles.colForm}>
          <div style={styles.formWrapper}>
            <form action="#" method="POST">
              {horasPorDia.map((hora) => (
                <div key={hora.dia} style={styles.rowFormEvento}>
                  <div style={{ width: "50%", paddingRight: "1rem" }}>
                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>
                        Fecha y Hora de Inicio - Día {hora.dia}*
                      </label>
                      <input
                        style={styles.formInput}
                        type="datetime-local"
                        value={hora.horaInicio}
                        onChange={(e) =>
                          handleInputChange(
                            hora.dia,
                            "horaInicio",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                  <div style={{ width: "50%", paddingLeft: "1rem" }}>
                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>
                        Fecha y Hora de Fin - Día {hora.dia}*
                      </label>
                      <input
                        style={styles.formInput}
                        type="datetime-local"
                        value={hora.horaFin}
                        onChange={(e) =>
                          handleInputChange(hora.dia, "horaFin", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}

              <div style={styles.buttonContainer}>
                <button
                  type="button"
                  style={{
                    ...styles.button,
                    ...styles.buttonSecondary,
                    ...(isSubmitting ? styles.buttonDisabled : {}),
                  }}
                  onClick={handleVolver}
                  disabled={isSubmitting}
                >
                  Volver
                </button>
                <button
                  type="button"
                  style={{
                    ...styles.button,
                    ...(isSubmitting ? styles.buttonDisabled : {}),
                  }}
                  onClick={handleSiguienteClick}
                  disabled={isSubmitting}
                >
                  {isSubmitting && (
                    <CircularProgress size={18} style={{ color: "var(--qf-text-primary)" }} />
                  )}
                  {isSubmitting ? "Guardando..." : "Siguiente"}
                </button>
              </div>
            </form>
          </div>
        </div>
      <Footer />
    </PageLayout>
  );
};

export default RegistrarEvento4;
