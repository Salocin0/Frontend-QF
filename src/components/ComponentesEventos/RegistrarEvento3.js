/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import PageLayout from "../ComponentesGenerales/PageLayout";
import { UserContext } from "../ComponentesGenerales/UserContext";
import { useContext } from "react";
import Breadcrumb from "../ComponentesGenerales/Breadcrumb";
import CircularProgress from "@mui/material/CircularProgress";
import useBreakpoint from "../../useBreakpoint";

const RegistrarEvento3 = () => {
  const { isMobile } = useBreakpoint();
  const EVENTO_CREACION_ID_KEY = "eventoCreacionId";
  const location = useLocation();
  const evento = location.state || {}; // Recuperar los datos del evento
  const { user } = useContext(UserContext);

  // Extraer datos del evento
  const {
    nombre,
    descripcion,
    imagenEvento,
    ubicacion,
    localidad,
    provincia,
    tipoEvento,
    tipoPago,
    latitud,
    longitud,
  } = evento;

  const [tieneButacas, setTieneButacas] = useState(false);
  const [estado, setEstado] = useState("Standby");
  const [fechaHoraInicioEvento, setFechaInicioEvento] = useState("");
  const [fechaHoraFinEvento, setFechaFinEvento] = useState("");
  const [tienePreventa, setTienePreventa] = useState(false);
  const [diasAntesInicioPreventa, setDiasAntesInicioPreventa] = useState("");
  const [horasAntesInicioEvento, setHorasAntesInicioEvento] = useState("");
  const [todosLosDiasPreventa, setTodosLosDiasPreventa] = useState("");
  const [cantidadPuestos, setCantidadPuestos] = useState("");
  const [tieneRepartidores, setTieneRepartidores] = useState(2);
  const [cantidadRepartidores, setCantidadRepartidores] = useState("");
  const [capacidadMaxima, setCapacidadMaxima] = useState("");
  const [linkVentaEntradas, setLinkVentaEntradas] = useState("");
  const [selectedOptionPreventa, setSelectedOptionPreventa] = useState(2);
  const [selectedOptionRepartidores, setSelectedOptionRepartidores] =
    useState(1);
  const [selectedOptionButacas, setSelectedOptionButacas] = useState(2);
  const [seccionPreventaBloqueada, setSeccionPreventaBloqueada] =
    useState(true);
  const [tienePreventaDias, setTienePreventaDias] = useState("");
  const [selectedOptionPreventaDias, setSelectedOptionPreventaDias] =
    useState(1);
  const [restricciones, setRestricciones] = useState([]);
  const [eventoId, setEventoId] = useState(null);
  const [errorMensaje, setErrorMensaje] = useState("");
  const [eventoData, setEventoData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nuevaColumna, setNuevaColumna] = useState({
    // Definir nuevaColumna
    titulo: "",
    tipo: "",
    descripcion: "",
    opciones: "",
    usuario: "",
  });

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetch(`${process.env.REACT_APP_BACK_URL}evento/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            const evento = data.evento;
            setEventoData(evento);
            setFechaInicioEvento(evento.fechaInicio || "");
            setFechaFinEvento(evento.fechaFin || "");
            setTieneButacas(evento.tieneButacas || false);
            setTienePreventa(evento.tienePreventa || false);
            setDiasAntesInicioPreventa(evento.diasAntesInicioPreventa || "");
            setHorasAntesInicioEvento(evento.horasAntesInicioEvento || "");
            setTodosLosDiasPreventa(evento.todosLosDiasPreventa || "");
            setCantidadPuestos(evento.cantidadPuestos || "");
            setTieneRepartidores(evento.tieneRepartidores || true);
            setCantidadRepartidores(evento.cantidadRepartidores || "");
            setCapacidadMaxima(evento.capacidadMaxima || "");
            setLinkVentaEntradas(evento.linkVentaEntradas || "");
            setRestricciones(evento.restricciones || []);
            setEventoId(evento._id);
          } else {
            toast.error("Error al cargar el evento");
          }
        })
        .catch((error) => {
          console.error("Error fetching event data:", error);
          toast.error("Error al cargar el evento");
        });
    }
  }, [id]);

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

  const agregarColumna = () => {
    if (!nuevaColumna.titulo.trim()) {
      toast.error("El título no puede estar vacío");
      return;
    }

    if (!nuevaColumna.descripcion.trim()) {
      toast.error("Descripción no puede estar vacía");
      return;
    }

    if (!nuevaColumna.tipo.trim()) {
      toast.error("El tipo no puede estar vacío");
      return;
    }

    if (nuevaColumna.tipo === "Select" && !nuevaColumna.opciones?.trim()) {
      toast.error("Opciones no puede estar vacío");
      return;
    }

    setRestricciones([...restricciones, nuevaColumna]);
    setNuevaColumna({
      titulo: "",
      tipo: "",
      descripcion: "",
      opciones: "",
      usuario: "",
    });
  };

  const eliminarFila = (indice) => {
    const nuevasRestricciones = [...restricciones];
    nuevasRestricciones.splice(indice, 1); // Elimina la restricción en el índice especificado
    setRestricciones(nuevasRestricciones);
  };

  const handleHorasAntesInicioEventoChange = (e) => {
    const nuevaFecha = e.target.value;
    setHorasAntesInicioEvento(nuevaFecha);

    // Convertir las fechas a objetos Date para comparar
    const fechaEvento = new Date(fechaHoraInicioEvento);
    const fechaPreventa = new Date(nuevaFecha);

    if (fechaPreventa >= fechaEvento) {
      setErrorMensaje(
        "La fecha de inicio de la preventa debe ser anterior a la fecha de inicio del evento."
      );
    } else {
      setErrorMensaje(""); // Limpiar el mensaje de error si la validación es correcta
    }
  };

  const handleSiguienteClick = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;
    if (!eventoId) {
      toast.error("No se encontró el borrador del evento. Volvé al paso 1.");
      navigate("/registrar-evento2");
      return;
    }

    const now = new Date();
    const inicioEvento = new Date(fechaHoraInicioEvento);
    const finEvento = new Date(fechaHoraFinEvento);

    // Validaciones
    if (inicioEvento <= now) {
      toast.error(
        "La fecha de inicio del evento debe ser posterior a la fecha actual."
      );
      return;
    }

    if (finEvento <= inicioEvento) {
      toast.error(
        "La fecha de fin del evento debe ser posterior a la fecha de inicio."
      );
      return;
    }

    if (tienePreventa) {
      const diasAntesInicioPreventaMs =
        diasAntesInicioPreventa * 24 * 60 * 60 * 1000;
      const horasAntesInicioEventoMs = horasAntesInicioEvento * 60 * 60 * 1000;

      const preventaInicio = new Date(
        inicioEvento.getTime() -
          diasAntesInicioPreventaMs -
          horasAntesInicioEventoMs
      );
      if (preventaInicio >= inicioEvento) {
        toast.error(
          "La fecha de inicio de la preventa debe ser anterior a la fecha de inicio del evento."
        );
        return;
      }
    }

    // Continuar con la lógica si todas las validaciones pasan...
    const eventoDatos = {
      fechaInicio: inicioEvento.toISOString(), // Esto se puede dejar así si quieres ISO
      fechaFin: finEvento.toISOString(), // Lo mismo
      tienePreventa,
      horasAntesInicioEvento,
      cantidadPuestos,
      restricciones,
      cantidadDiasEvento: Math.ceil(
        (finEvento - inicioEvento) / (1000 * 60 * 60 * 24)
      ),
    };

    localStorage.setItem("eventoDatos", JSON.stringify(eventoDatos));

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
        toast.success("Evento actualizado correctamente");
        navigate(`/registrar-evento4/${eventoDatos.cantidadDiasEvento}`, {
          state: { eventoId },
        });
      } else {
        toast.error(updateData.message || "Error al actualizar el evento");
      }
    } catch (error) {
      console.error("Error al actualizar el evento:", error);
      toast.error("Error al actualizar el evento");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVolver = () => {
    navigate(`/registrar-evento2`, { state: { eventoId } });
  };

  const handleOptionClickPreventa = (option) => {
    setTienePreventa(option === 1);
    setSelectedOptionPreventa(option);
  };

  const handleOptionClickRepartidores = (option) => {
    setTieneRepartidores(option === 1);
    setSelectedOptionRepartidores(option);
  };

  const handleOptionClickButacas = (option) => {
    setTieneButacas(option === 1);
    setSelectedOptionButacas(option);
  };

  const handleOptionClickPreventaDias = (option) => {
    setSelectedOptionPreventaDias(option);
    // Si es necesario, establece otras variables de estado aquí
  };

  const eliminarfila = (index) => {
    const nuevasRestricciones = restricciones.filter((_, i) => i !== index);
    setRestricciones(nuevasRestricciones);
  };

  const styles = {
    formCol: {
      height: "Calc(75% - 60px)",
      padding: 0,
      display: "flex",
      width: "Calc(100% - 20%)",
      marginLeft: isMobile ? "0" : "20%",
      
    },
    formWrapper: {
      padding: "1rem",
      borderRadius: "10px",
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      marginLeft: "20px",
      marginRight: "20px",
      marginBottom: "20px",
      width: "100%",
      backgroundColor: "var(--qf-bg-secondary)",
      border: `1px solid var(--qf-naranja)`,
    },
    formGroup: {
      marginBottom: "1rem",
      position: "relative",
    },
    formLabel: {
      display: "block",
      marginBottom: "0",
      fontWeight: "bold",
      color: "var(--qf-text-white)",
    },
    formInput: {
      width: "100%",
      padding: "0.5rem",
      fontSize: "1rem",
      borderRadius: "10px",
      color: "var(--qf-negro-puro)",
    },
    optionContainerEvento: {
      display: "flex",
      justifyContent: "space-between",
    },
    opcionesEvento: {
      padding: "0.5rem 1rem",
      borderRadius: "4px",
      cursor: "pointer",
      backgroundColor: "var(--qf-bg-main)",
      color: "var(--qf-text-primary)",
      textAlign: "center",
      flex: 1,
      margin: "0 0.5rem",
    },
    selected: {
      backgroundColor: "var(--qf-naranja)",
      color: "#fff",
    },
    disabledOption: {
      padding: "0.5rem 1rem",
      borderRadius: "4px",
      backgroundColor: "var(--qf-bg-main)",
      color: "var(--qf-text-primary)",
      textAlign: "center",
      flex: 1,
      margin: "0 0.5rem",
      cursor: "not-allowed",
    },
    errorText: {
      color: "red",
      marginTop: "0.5rem",
    },
    submitButton: {
      width: "100%",
      padding: "0.75rem",
      fontSize: "1rem",
      fontWeight: "bold",
      backgroundColor: "var(--qf-green)",
      color: "#fff",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "10px",
    },
    submitButtonDisabled: {
      opacity: 0.7,
      cursor: "not-allowed",
    },
    buttonsRow: {
      display: "flex",
      gap: "10px",
      marginTop: "10px",
    },
    secondaryButton: {
      width: "40%",
      padding: "0.75rem",
      fontSize: "1rem",
      fontWeight: "bold",
      backgroundColor: "var(--qf-text-secondary)",
      color: "#fff",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
    },
    tituloSeccion: {
      display: "flex",
      justifyContent: "center",
      marginTop: "20px",
      fontSize: "24px",
      marginLeft: isMobile ? "0" : "20%",
      color: "var(--qf-text-primary)",
      width: isMobile ? "100%" : "80%",
    },
    separator: {
      border: "none",
      marginBottom: "5px",
      marginTop: "0px",
      borderTop: `1px solid var(--qf-naranja)`,
    },
    breadcrumbWrapper: {
      marginLeft: isMobile ? "0" : "20%",
      width: isMobile ? "100%" : "80%",
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
    { title: "Crear un Evento (2/4)", url: "registrar-evento3" },
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
        <div style={styles.formCol}>
          <div style={styles.formWrapper}>
            <form action="#" method="POST">
              <div style={styles.formGroup}>
                <label htmlFor="fechaInicioEvento" style={styles.formLabel}>
                  Fecha Inicio Evento*
                </label>
                <input
                  type="datetime-local"
                  id="fechaInicioEvento"
                  style={styles.formInput}
                  value={fechaHoraInicioEvento}
                  onChange={(e) => setFechaInicioEvento(e.target.value)}
                />
              </div>

              <div style={styles.formGroup}>
                <label htmlFor="fechaFinEvento" style={styles.formLabel}>
                  Fecha Fin Evento*
                </label>
                <input
                  type="datetime-local"
                  id="fechaFinEvento"
                  style={styles.formInput}
                  value={fechaHoraFinEvento}
                  onChange={(e) => setFechaFinEvento(e.target.value)}
                />
              </div>

              <div style={styles.formGroup}>
                <label htmlFor="preventa" style={styles.formLabel}>
                  Preventa*
                </label>
                <div style={styles.optionContainerEvento}>
                  <div
                    style={{
                      ...styles.opcionesEvento,
                      ...(selectedOptionPreventa === 1 ? styles.selected : {}),
                    }}
                    onClick={() => handleOptionClickPreventa(1)}
                  >
                    Sí
                  </div>
                  <div
                    style={{
                      ...styles.opcionesEvento,
                      ...(selectedOptionPreventa === 2 ? styles.selected : {}),
                    }}
                    onClick={() => handleOptionClickPreventa(2)}
                  >
                    No
                  </div>
                </div>
              </div>

              {tienePreventa && (
                <>
                  <div style={styles.formGroup}>
                    <label
                      htmlFor="horasAntesInicioEvento"
                      style={styles.formLabel}
                    >
                      ¿Cuándo iniciará la preventa?*
                    </label>
                    <input
                      type="datetime-local"
                      id="horasAntesInicioEvento"
                      style={styles.formInput}
                      value={horasAntesInicioEvento}
                      onChange={handleHorasAntesInicioEventoChange}
                    />
                    {errorMensaje && (
                      <div style={styles.errorText}>{errorMensaje}</div>
                    )}
                  </div>

                  <div style={styles.formGroup}>
                    <label
                      htmlFor="todosLosDiasPreventa"
                      style={styles.formLabel}
                    >
                      ¿La preventa será todos los días?*
                    </label>
                    <div style={styles.optionContainerEvento}>
                      <div
                        style={{
                          ...styles.opcionesEvento,
                          ...(selectedOptionPreventaDias === 1
                            ? styles.selected
                            : {}),
                        }}
                        onClick={() => handleOptionClickPreventaDias(1)}
                      >
                        Sí
                      </div>
                      <div style={styles.disabledOption}>No</div>
                    </div>
                  </div>
                </>
              )}

              <div style={styles.formGroup}>
                <label htmlFor="butacas" style={styles.formLabel}>
                  ¿El evento tiene butacas?*
                </label>
                <div style={styles.optionContainerEvento}>
                  <div
                    style={{
                      ...styles.disabledOption,
                      ...(selectedOptionButacas === 1 ? {} : {}),
                    }}
                    disabled
                    /*onClick={() => handleOptionClickButacas(1)}*/
                  >
                    Sí
                  </div>
                  <div
                    style={{
                      ...styles.opcionesEvento,
                      ...(selectedOptionButacas === 2 ? styles.selected : {}),
                    }}
                    onClick={() => handleOptionClickButacas(2)}
                  >
                    No
                  </div>
                </div>
              </div>

              <div style={styles.formGroup}>
                <label htmlFor="repartidores" style={styles.formLabel}>
                  ¿El evento tiene repartidores?*
                </label>
                <div style={styles.optionContainerEvento}>
                  <div
                    style={{
                      ...styles.opcionesEvento,
                      ...(selectedOptionRepartidores === 1
                        ? styles.selected
                        : {}),
                    }}
                    onClick={() => handleOptionClickRepartidores(1)}
                  >
                    Sí
                  </div>
                  <div
                    style={{
                      ...styles.disabledOption,
                      ...(selectedOptionRepartidores === 2 ? {} : {}),
                    }}
                    /*onClick={() => handleOptionClickRepartidores(2)}*/
                  >
                    No
                  </div>
                </div>
              </div>

              <div style={styles.formGroup}>
                <label htmlFor="capacidadMaxima" style={styles.formLabel}>
                  Capacidad Máxima
                </label>
                <input
                  type="number"
                  id="capacidadMaxima"
                  style={styles.formInput}
                  value={capacidadMaxima}
                  onChange={(e) => setCapacidadMaxima(e.target.value)}
                />
              </div>

              <div style={styles.formGroup}>
                <label htmlFor="linkVentaEntradas" style={styles.formLabel}>
                  Link Venta Entradas
                </label>
                <input
                  type="text"
                  id="linkVentaEntradas"
                  style={styles.formInput}
                  value={linkVentaEntradas}
                  onChange={(e) => setLinkVentaEntradas(e.target.value)}
                />
              </div>

              <div style={styles.formGroup}>
                <div style={styles.buttonsRow}>
                  <button
                    type="button"
                    style={styles.secondaryButton}
                    onClick={handleVolver}
                    disabled={isSubmitting}
                  >
                    Volver
                  </button>
                  <button
                    type="button"
                    style={{
                      ...styles.submitButton,
                      width: "60%",
                      ...(isSubmitting ? styles.submitButtonDisabled : {}),
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
              </div>
            </form>
          </div>
        </div>
    </PageLayout>
  );
};

export default RegistrarEvento3;
