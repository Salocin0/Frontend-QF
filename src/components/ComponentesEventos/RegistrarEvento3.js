/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import PageLayout from "../ComponentesGenerales/PageLayout";
import { UserContext } from "../ComponentesGenerales/UserContext";
import { useContext } from "react";
import Breadcrumb from "../ComponentesGenerales/Breadcrumb";
import CircularProgress from "@mui/material/CircularProgress";
import { FaArrowLeft, FaArrowRight, FaCalendarAlt, FaCheck, FaTicketAlt } from "react-icons/fa";
import "./RegistrarEvento.css";
import Footer from "../ComponentesGenerales/Footer";

const RegistrarEvento3 = () => {
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
  const [tieneRepartidores, setTieneRepartidores] = useState(true); // matches the default "Sí" option
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
      conRepartidor: tieneRepartidores === true,
      cantidadRepartidores: cantidadRepartidores === "" ? undefined : cantidadRepartidores,
      conButaca: tieneButacas === true,
      capacidadMaxima: capacidadMaxima === "" ? undefined : capacidadMaxima,
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

  return (
    <PageLayout sidebarProps={{ tipoUsuario: user?.tipoUsuario }}>
      <main className="qf-event-registration-page">
        <Breadcrumb items={[{ title: "Inicio", url: "/inicio" }, { title: "Mis eventos", url: "/listado-eventos-productor" }, { title: "Crear un evento · Configuración", url: "/registrar-evento3" }]} />
        <header className="qf-event-registration-heading"><h1>Crear un Evento</h1><p>Definí las fechas, la preventa y la configuración de tu evento.</p></header>
        <ol className="qf-event-registration-steps" aria-label="Progreso del registro">{["Información", "Configuración", "Días del evento", "Puntos de encuentro"].map((step, index) => <li key={step} aria-current={index === 1 ? "step" : undefined} className={index === 0 ? "qf-event-step-completed" : ""}><span>{index === 0 ? <FaCheck aria-hidden="true" /> : index + 1}</span><div><small>Paso {index + 1}</small><strong>{step}</strong></div></li>)}</ol>
        <form className="qf-event-registration-form qf-event-configuration-form" onSubmit={handleSiguienteClick} noValidate>
          <fieldset disabled={isSubmitting} className="qf-event-configuration-sections"><legend className="qf-event-registration-sr">Configuración del evento</legend>
            <section className="qf-event-configuration-section"><h2><FaCalendarAlt aria-hidden="true" /> Fechas del evento</h2><p>Elegí cuándo empieza y termina. En el próximo paso vas a configurar cada día.</p><div className="qf-event-configuration-fields">
              <label htmlFor="fechaInicioEvento">Fecha Inicio Evento*<input type="datetime-local" id="fechaInicioEvento" value={fechaHoraInicioEvento} onChange={(event) => setFechaInicioEvento(event.target.value)} /></label>
              <label htmlFor="fechaFinEvento">Fecha Fin Evento*<input type="datetime-local" id="fechaFinEvento" value={fechaHoraFinEvento} onChange={(event) => setFechaFinEvento(event.target.value)} /></label>
            </div></section>
            <section className="qf-event-configuration-section"><h2><FaTicketAlt aria-hidden="true" /> Preventa</h2><p>Permití que los asistentes compren antes del evento y retiren allí.</p>
              <EventSettingChoice title="Preventa*" name="preventa" selected={selectedOptionPreventa} onSelect={handleOptionClickPreventa} />
              {tienePreventa && <div className="qf-event-presale-settings"><label htmlFor="horasAntesInicioEvento">¿Cuándo iniciará la preventa?*<input type="datetime-local" id="horasAntesInicioEvento" value={horasAntesInicioEvento} onChange={handleHorasAntesInicioEventoChange} aria-describedby={errorMensaje ? "event-presale-error" : undefined} aria-invalid={Boolean(errorMensaje)} /></label>{errorMensaje && <p id="event-presale-error" className="qf-event-presale-error" role="alert">{errorMensaje}</p>}<EventSettingChoice title="¿La preventa será todos los días?*" name="preventa-dias" selected={selectedOptionPreventaDias} onSelect={handleOptionClickPreventaDias} disabledOptions={[2]} /></div>}
            </section>
            <section className="qf-event-configuration-section"><h2>Configuración del evento</h2><div className="qf-event-configuration-fields qf-event-configuration-toggles"><EventSettingChoice title="¿El evento tiene butacas?*" name="butacas" selected={selectedOptionButacas} onSelect={handleOptionClickButacas} disabledOptions={[1]} /><EventSettingChoice title="¿El evento tiene repartidores?*" name="repartidores" selected={selectedOptionRepartidores} onSelect={handleOptionClickRepartidores} disabledOptions={[2]} /></div><div className="qf-event-configuration-fields">
              <label htmlFor="capacidadMaxima">Capacidad Máxima<input type="number" id="capacidadMaxima" value={capacidadMaxima} onChange={(event) => setCapacidadMaxima(event.target.value)} placeholder="Cantidad de asistentes" /></label>
              <label htmlFor="linkVentaEntradas">Link Venta Entradas<input type="text" id="linkVentaEntradas" value={linkVentaEntradas} onChange={(event) => setLinkVentaEntradas(event.target.value)} placeholder="https://…" /></label>
            </div></section>
          </fieldset>
          <footer className="qf-event-registration-footer"><span>Paso 2 de 4 · Tu avance se guarda al continuar.</span><div><button type="button" className="qf-event-registration-button" onClick={handleVolver} disabled={isSubmitting}><FaArrowLeft aria-hidden="true" /> Volver</button><button type="submit" className="qf-event-registration-button qf-event-registration-button--primary" disabled={isSubmitting}>{isSubmitting ? <><CircularProgress size={18} style={{ color: "inherit" }} /> Guardando...</> : <>Siguiente <FaArrowRight aria-hidden="true" /></>}</button></div></footer>
        </form>
      </main><Footer />
    </PageLayout>
  );
};

const EventSettingChoice = ({ title, name, selected, onSelect, disabledOptions = [] }) => <fieldset className="qf-event-setting-choice"><legend>{title}</legend><div className="qf-event-registration-options">{[{ value: 1, label: "Sí" }, { value: 2, label: "No" }].map((option) => <label key={option.value}><input type="radio" name={name} checked={selected === option.value} disabled={disabledOptions.includes(option.value)} onChange={() => onSelect(option.value)} /><span>{option.label}</span></label>)}</div></fieldset>;
export default RegistrarEvento3;
