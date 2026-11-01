import { default as React, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UserContext } from "../ComponentesGenerales/UserContext";
import ConfirmDialog from "../ComponentesGenerales/ConfirmDialog";
import imgDefault from "../img/qf-new-logo-transparent.png";
import { FaMapMarkerAlt, FaLink, FaClock } from "react-icons/fa";
import "../ComponentesPuesto/AsociacionesPuesto.css";
import { formatUbicacion } from "../ComponentesGenerales/Utils/formatUbicacion";

const ESTADOS_ASOCIABLES = ["EnPreparacion", "EnPreparacion1", "EnPreparacion2", "EnPreparacion3", "Confirmado"];

const EventoEncargado = ({ evento, puestoId, recargar }) => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [isEnPreparacion, setIsEnPreparacion] = useState(false);
  const [tieneAsociacionPendiente, setTieneAsociacionPendiente] =
    useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const formatEstado = (str) => {
    if (!str) return "";
    return str.replace(/\d+$/, "").replace(/([A-Z])/g, " $1").trim();
  };

  useEffect(() => {
    if (evento) {
      setIsEnPreparacion(ESTADOS_ASOCIABLES.includes(evento.estado));
    }
  }, [evento]);

  const asociarmeAEvento = () => {
    const headers = new Headers();
    headers.append("ConsumidorId", user?.consumidorId);
    headers.append("Content-Type", "application/json");


    fetch(
      `${process.env?.REACT_APP_BACK_URL}asociacion/evento/${evento.id}/asociarSimple/${puestoId}/0`,
      {
        method: "POST",
        headers: headers,
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 200) {
          toast.success("Asociacion Guardada");
          recargar();
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error("Error al asociar");
      });
  };

  const handleTieneRestriciones = async () => {
    try {
      const headers = new Headers();
      headers.append("ConsumidorId", user?.consumidorId);
      headers.append("Content-Type", "application/json");

      const response = await fetch(
        `${process.env?.REACT_APP_BACK_URL}restriccion/evento/${evento.id}`,
        {
          method: "GET",
          headers: headers,
        }
      );
      if (response.status === 404) {
        asociarmeAEvento(evento.id);
      } else if (response.status === 200) {
        await response.json();
        handleCrearForm();
      } else {
        console.error(`Error: ${response.status}`);
        toast.error("Error al comunicarse con el servidor");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error al crear el formulario");
    }
  };

  const handleCrearForm = () => {
    const url = `/restriccionesEvento/${evento.id}`;
    navigate(url);
  };

  useEffect(() => {
    const handleTieneAsociacionPendiente = async () => {
      try {
        const headers = new Headers();
        headers.append("ConsumidorId", user?.consumidorId);
        headers.append("Content-Type", "application/json");
        const response = await fetch(
          `${process.env?.REACT_APP_BACK_URL}asociacion/evento/${evento.id}/asociarSimple/${puestoId}/0`,
          {
            method: "GET",
            headers: headers,
          }
        );
        if (response.status === 400) {
          setTieneAsociacionPendiente(true);
        } else if (response.status === 200) {
        }
      } catch (error) {
        console.error(error);
        toast.error("Error al verificar la asociación");
      }
    };

    if (isEnPreparacion) {
      handleTieneAsociacionPendiente();
    }
  }, [evento, puestoId, user, isEnPreparacion]);

  return (
    <article className="qf-association-event">
      <div className="qf-association-event-image"><img src={evento?.img && !String(evento.img).includes("vendimia.mendoza.gov.ar") ? evento.img : imgDefault} alt={evento.nombre} onError={(event) => { if (event.currentTarget.getAttribute("src") !== imgDefault) event.currentTarget.src = imgDefault; }} /></div>
      <div className="qf-association-event-body">
        <div className="qf-association-event-heading"><h2>{evento.nombre}</h2><span className="qf-association-event-status">{formatEstado(evento.estado)}</span></div>
        <p className="qf-association-event-description">{evento.descripcion}</p>
        <p className="qf-association-event-location"><FaMapMarkerAlt aria-hidden="true" />{formatUbicacion(evento)}</p>
        <div className="qf-association-event-footer">
          {!tieneAsociacionPendiente && isEnPreparacion && <button type="button" className="qf-associations-button qf-associations-button--primary" onClick={() => setShowConfirm(true)}><FaLink aria-hidden="true" /> Asociarme a Evento</button>}
          {tieneAsociacionPendiente && <p className="qf-association-pending" role="status"><FaClock aria-hidden="true" /><span>Tiene una asociación pendiente</span></p>}
        </div>
      </div>
      <ConfirmDialog open={showConfirm} title="Asociarse a Evento" message={`¿Estás seguro de que querés asociarte al evento "${evento?.nombre}"?`} onConfirm={() => { setShowConfirm(false); handleTieneRestriciones(); }} onCancel={() => setShowConfirm(false)} />
    </article>
  );
};

export default EventoEncargado;
