/* eslint-disable no-unused-vars */
import "bootstrap/dist/css/bootstrap.min.css"; // Importar Bootstrap si no lo tienes
import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Sidebar from "../ComponentesGenerales/Sidebar";
import "./../sass/main.scss";
import { UserContext } from "../ComponentesGenerales/UserContext";
import useDynamicColors from "../../UseDinamicColors";
import Footer from "../ComponentesGenerales/Footer";
import Breadcrumb from "../ComponentesGenerales/Breadcrumb";

const RegistrarEvento4 = () => {
  const { diferenciaDiasEvento } = useParams();
  const navigate = useNavigate();
  const [horasPorDia, setHorasPorDia] = useState([]);
  const [evento, setEvento] = useState(null);
  const [eventoId, setEventoId] = useState(null);
  const [tienePreventa, setTienePreventa] = useState(false);
  const location = useLocation();
  const [mostrarCartel, setMostrarCartel] = useState(false); // Estado para mostrar el cartel
  const { user } = useContext(UserContext);
  const Colors = useDynamicColors();

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
    }
  }, [location.state]);

  const handleSiguienteClick = async (e) => {
    e.preventDefault();

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
        setMostrarCartel(true); // Mostrar el cartel
        setTimeout(() => {
          navigate(`/listado-eventos-productor`);
        }, 3000); // Espera 5 segundos antes de redirigir
      } else {
        toast.error(updateData.message || "Error al registrar el evento");
      }
    } catch (error) {
      console.error("Error al registrar el evento:", error);
      toast.error("Error al registrar el evento");
    }
  };

  const handleVolver = (e) => {
    navigate(`/registrar-evento3`, { state: { eventoId } });
  };

  const styles = {
    containerFluid: {
      width: "100%",
      padding: "0",
      backgroundColor: Colors.GrisAzuladoOscuro,
      minHeight: "100vh",
    },
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
      color: Colors.Blanco,
      padding: "2rem",
      width: "100%",
      border: `1px solid ${Colors.Naranja}`,
      borderRadius: "10px",
      backgroundColor: Colors.GrisAzuladoClaro,
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
      color: Colors.NegroEnNegro,
    },
    buttonContainer: {
      display: "flex",
      justifyContent: "end",
      gap: "0.5rem",
    },
    button: {
      backgroundColor: Colors.Azul,
      color: Colors.Blanco,
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      width: "100%",
      padding: "0.75rem",
      fontSize: "1rem",
      fontWeight: "bold",
    },
    buttonSecondary: {
      backgroundColor: Colors.GrisOscuro,
    },
    cartelExito: {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: Colors.Verde,
      color: Colors.Blanco,
      padding: "1.5rem",
      borderRadius: "8px",
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      textAlign: "center",
      zIndex: 1050,
      maxWidth: "400px",
      width: "100%",
    },
    tituloSeccion: {
      display: "flex",
      justifyContent: "center",
      marginTop: "20px",
      fontSize: "24px",
      marginLeft: "20%",
      color: Colors.Blanco,
      width: "80%",
    },
    separator: {
      border: "none",
      marginBottom: "5px",
      marginTop: "0px",
      borderTop: `1px solid ${Colors.Naranja}`,
    },
    breadcrumbWrapper: {
      marginLeft: "20%",
      width: "80%",
      paddingTop: "10px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
    hr: {
      color: Colors.Naranja,
      border: `1px solid ${Colors.Naranja}`,
      width: "100%",
    },
  };

  const breadcrumbItems = [
    { title: "Inicio", url: "/inicio" },
    { title: "Mis Eventos", url: "/listado-eventos-productor" },
    { title: "Crear un Evento (3/3)", url: "registrar-evento4" },
  ];

  return (
    <div style={styles.containerFluid}>
      <div style={styles.rowFormEvento}>
        <Sidebar tipoUsuario={user?.tipoUsuario} />
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
                  style={{ ...styles.button, ...styles.buttonSecondary }}
                  onClick={handleVolver}
                >
                  Volver
                </button>
                <button
                  type="button"
                  style={styles.button}
                  onClick={handleSiguienteClick}
                >
                  Finalizar Registro
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {mostrarCartel && (
        <div style={styles.cartelExito}>
          <h5>¡Registro Exitoso!</h5>
          <p>
            El registro fue exitoso. Ahora dirígete a la app móvil para
            finalizar el registro de tu evento.
          </p>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default RegistrarEvento4;
