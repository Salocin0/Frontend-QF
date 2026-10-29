// Carrousel.js
import React, { useEffect, useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import { Link } from "react-router-dom";
import Logo from "../img/qf-new-logo-transparent.png";
import villaMariaPoster from "../img/villamaria.jpg";
import cosquinRockPoster from "../img/cosquinrock.jpeg";
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

const EventSlide = ({ evento }) => {
  const [imageFailed, setImageFailed] = useState(false);
  const normalizedName = (evento.nombre || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const isVillaMaria = normalizedName.includes("cosquin") && /villa\s*maria/.test(normalizedName);
  const eventName = isVillaMaria ? "58° Festival Internacional de Peñas — Villa María" : evento.nombre;
  const eventImage = isVillaMaria ? villaMariaPoster : evento.img;
  return (
    <div className={`qf-event-slide${isVillaMaria ? " qf-event-slide--cover" : ""}`}>
      {eventImage && !imageFailed ? (
        <img src={eventImage} alt={eventName} className="qf-event-slide__image" onError={() => setImageFailed(true)} />
      ) : (
        <div className="qf-event-slide__fallback"><img src={Logo} alt="QuickFood" /></div>
      )}
      <div className="qf-event-slide__caption">
        <span className="qf-event-slide__badge">{evento.estado === "EnCurso" ? "En curso" : "Próximamente"}</span>
        <h3>{eventName}</h3>
        <p>{formatDateAR(evento.fechaInicioMostrada)}</p>
        <Link to={`/listado-puestos/${evento.id}`}>Ver evento <span aria-hidden="true">↗</span></Link>
      </div>
    </div>
  );
};

const Carrousel = () => {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    const base = process.env?.REACT_APP_BACK_URL;
    const load = (estado) =>
      fetch(`${base}evento/enEstado/${estado}`)
        .then((res) => {
          if (res.status === 404) return null;
          if (!res.ok) throw new Error("No se pudieron cargar los eventos");
          return res.json();
        })
        .then((json) => (Array.isArray(json?.data) ? json.data : []));

    let cancelled = false;
    Promise.all([load("Confirmado"), load("EnCurso")]).then(([confirmados, enCurso]) => {
      if (!cancelled) setEventos(pickUpcomingEvents([...enCurso, ...confirmados]));
    }).catch(() => {
      if (!cancelled) setLoadFailed(true);
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="carousel-container">
      <Carousel className="carousel" controls indicators interval={5000} pause="hover" prevLabel="Evento anterior" nextLabel="Evento siguiente">
        {eventos.length > 0 ? (
          eventos.map((evento) => (
            <Carousel.Item key={evento.id}>
              <EventSlide evento={evento} />
            </Carousel.Item>
          ))
        ) : (
          <Carousel.Item>
            <div className="qf-event-empty" role="status" aria-live="polite">
              <img src={Logo} alt="QuickFood" />
              <strong>{loading ? "Buscando próximos eventos…" : loadFailed ? "No pudimos cargar los eventos" : "Lo próximo está por llegar"}</strong>
              <p>{loading ? "Un momento, estamos preparando la cartelera." : loadFailed ? "Volvé a intentar en unos minutos." : "Muy pronto vas a encontrar acá nuevas experiencias para disfrutar sin filas."}</p>
            </div>
          </Carousel.Item>
        )}
        <Carousel.Item>
          <div className="qf-event-slide qf-event-slide--cover">
            <img src={cosquinRockPoster} alt="Cosquín Rock" className="qf-event-slide__image" />
            <div className="qf-event-slide__caption">
              <span className="qf-event-slide__badge">Música y experiencias</span>
              <h3>Cosquín Rock</h3>
              <Link to="/listado-eventos">Explorar eventos <span aria-hidden="true">↗</span></Link>
            </div>
          </div>
        </Carousel.Item>
      </Carousel>
    </div>
  );
};

export default Carrousel;
