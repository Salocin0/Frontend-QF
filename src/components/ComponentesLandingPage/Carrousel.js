// Carrousel.js
import React, { useEffect, useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import Logo from "../img/adaptive-icon.png";
import { formatDateAR } from "../ComponentesGenerales/Utils/formatDate";

const MAX_EVENTOS = 5;

// Next events first; finished ones, already-ended ones and events without a date are dropped.
// "Already ended" matters because an event can stay in EnCurso/Confirmado after its last
// day passed, and the landing must not advertise it as upcoming.
export const pickUpcomingEvents = (eventos, now = new Date()) =>
  (Array.isArray(eventos) ? eventos : [])
    .map((evento) => {
      const dias = Array.isArray(evento?.diaEventos) ? evento.diaEventos : [];
      const start = dias.length
        ? Math.min(...dias.map((d) => new Date(d.fechaHoraInicioDiaEvento).getTime()))
        : new Date(evento?.fechaHoraInicio).getTime();
      const end = dias.length
        ? Math.max(...dias.map((d) => new Date(d.fechaHoraFinDiaEvento).getTime()))
        : new Date(evento?.fechaHoraFin).getTime();
      return { evento, start, end };
    })
    .filter(({ evento, start, end }) => {
      if (!evento || evento.estado === "Finalizado") return false;
      if (Number.isNaN(start)) return false;
      // Sin fecha de fin conocida se mantiene: es mejor mostrarlo que ocultarlo.
      if (!Number.isNaN(end) && end < now.getTime()) return false;
      return true;
    })
    .sort((a, b) => a.start - b.start)
    .slice(0, MAX_EVENTOS)
    .map(({ evento, start }) => ({ ...evento, fechaInicioMostrada: new Date(start).toISOString() }));

const slideStyles = {
  // 16:9 matches the generated covers, so `cover` no longer crops the title away.
  container: { aspectRatio: "16 / 9", width: "100%", maxHeight: "min(520px, 62vw)", position: "relative", overflow: "hidden", backgroundColor: "var(--qf-bg-main)" },
  image: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  neutral: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    color: "var(--qf-text-primary)",
  },
  logo: { height: "90px", width: "auto" },
  caption: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: "0.75rem 1rem",
    textAlign: "center",
    color: "#fff",
    background: "linear-gradient(transparent, rgba(0,0,0,0.75))",
  },
};

const EventSlide = ({ evento }) => (
  <div style={slideStyles.container}>
    {evento.img ? (
      <img src={evento.img} alt={evento.nombre} style={slideStyles.image} />
    ) : (
      <div style={slideStyles.neutral}>
        <img src={Logo} alt="QuickFood" style={slideStyles.logo} />
      </div>
    )}
    {/* The generated covers already carry the event name, so only the date is overlaid. */}
    <div style={slideStyles.caption}>
      {!evento.img && <strong>{evento.nombre}</strong>}
      <div>{formatDateAR(evento.fechaInicioMostrada)}</div>
    </div>
  </div>
);

const Carrousel = () => {
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    const base = process.env?.REACT_APP_BACK_URL;
    const load = (estado) =>
      fetch(`${base}evento/enEstado/${estado}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((json) => (Array.isArray(json?.data) ? json.data : []))
        .catch(() => []);

    let cancelled = false;
    Promise.all([load("Confirmado"), load("EnCurso")]).then(([confirmados, enCurso]) => {
      if (!cancelled) setEventos(pickUpcomingEvents([...enCurso, ...confirmados]));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="carousel-container">
      <Carousel className="carousel" interval={eventos.length > 1 ? 5000 : null}>
        {eventos.length > 0 ? (
          eventos.map((evento) => (
            <Carousel.Item key={evento.id}>
              <EventSlide evento={evento} />
            </Carousel.Item>
          ))
        ) : (
          <Carousel.Item>
            <div style={slideStyles.container}>
              <div style={slideStyles.neutral}>
                <img src={Logo} alt="QuickFood" style={slideStyles.logo} />
                <strong>Muy pronto vas a ver acá los próximos eventos</strong>
              </div>
            </div>
          </Carousel.Item>
        )}
      </Carousel>
    </div>
  );
};

export default Carrousel;
