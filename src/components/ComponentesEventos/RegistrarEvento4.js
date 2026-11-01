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
import { FaArrowLeft, FaArrowRight, FaCheck, FaCalendarAlt } from "react-icons/fa";
import "./RegistrarEvento.css";

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

    const toUtcIso = (value) => {
      const date = new Date(value);
      return Number.isNaN(date.getTime()) ? value : date.toISOString();
    };

    const datosHoras = horasPorDia.map((hora) => ({
      dia: hora.dia,
      // datetime-local values are wall-clock times in the browser timezone: send them as UTC ISO strings.
      horaInicio: toUtcIso(hora.horaInicio),
      horaFin: toUtcIso(hora.horaFin),
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

  const dayLabel = (value) => {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "Configurá los horarios de este día" : date.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  };
  return (
    <PageLayout sidebarProps={{ tipoUsuario: user?.tipoUsuario }}>
      <main className="qf-event-registration-page">
        <Breadcrumb items={[{ title: "Inicio", url: "/inicio" }, { title: "Mis eventos", url: "/listado-eventos-productor" }, { title: "Crear un evento · Días", url: `/registrar-evento4/${diferenciaDiasEvento}` }]} />
        <header className="qf-event-registration-heading"><h1>Crear un Evento</h1><p>Revisá las fechas y los horarios de cada día antes de continuar.</p></header>
        <ol className="qf-event-registration-steps" aria-label="Progreso del registro">{["Información", "Configuración", "Días del evento", "Puntos de encuentro"].map((step, index) => <li key={step} aria-current={index === 2 ? "step" : undefined} className={index < 2 ? "qf-event-step-completed" : ""}><span>{index < 2 ? <FaCheck aria-hidden="true" /> : index + 1}</span><div><small>Paso {index + 1}</small><strong>{step}</strong></div></li>)}</ol>
        <form className="qf-event-registration-form qf-event-days-form" onSubmit={handleSiguienteClick} noValidate>
          <div className="qf-event-days-heading"><div><h2><FaCalendarAlt aria-hidden="true" /> Días del evento</h2><p>Podés ajustar los horarios de cada jornada.</p></div><span>{horasPorDia.length} {horasPorDia.length === 1 ? "día" : "días"}</span></div>
          <fieldset disabled={isSubmitting}><legend className="qf-event-registration-sr">Horarios por día</legend>
            <div className="qf-event-days-list">{horasPorDia.map((hora) => <section key={hora.dia} className="qf-event-day-card" aria-labelledby={`event-day-title-${hora.dia}`}>
              <header><span className="qf-event-day-index">{String(hora.dia).padStart(2, "0")}</span><div><h3 id={`event-day-title-${hora.dia}`}>Día {hora.dia}</h3><p>{dayLabel(hora.horaInicio)}</p></div></header>
              <div className="qf-event-configuration-fields"><label htmlFor={`day-start-${hora.dia}`}>Fecha y Hora de Inicio - Día {hora.dia}*<input id={`day-start-${hora.dia}`} type="datetime-local" value={hora.horaInicio} onChange={(event) => handleInputChange(hora.dia, "horaInicio", event.target.value)} /></label><label htmlFor={`day-end-${hora.dia}`}>Fecha y Hora de Fin - Día {hora.dia}*<input id={`day-end-${hora.dia}`} type="datetime-local" value={hora.horaFin} onChange={(event) => handleInputChange(hora.dia, "horaFin", event.target.value)} /></label></div>
            </section>)}</div>
          </fieldset>
          <footer className="qf-event-registration-footer"><span>Paso 3 de 4 · Tu avance se guarda al continuar.</span><div><button type="button" className="qf-event-registration-button" onClick={handleVolver} disabled={isSubmitting}><FaArrowLeft aria-hidden="true" /> Volver</button><button type="submit" className="qf-event-registration-button qf-event-registration-button--primary" disabled={isSubmitting}>{isSubmitting ? <><CircularProgress size={18} style={{ color: "inherit" }} /> Guardando...</> : <>Siguiente <FaArrowRight aria-hidden="true" /></>}</button></div></footer>
        </form>
      </main><Footer />
    </PageLayout>
  );
};
export default RegistrarEvento4;
