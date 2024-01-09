import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import EventoEncargado from "../ComponentesEventos/EventoEncargado";
import Sidebar from "../ComponentesGenerales/Sidebar";
import "./../sass/main.css";

const AsociarPuestoAEvento = () => {
  const { puestoId  } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [nuevoRol, setNuevorol] = useState(false);
  const [eventos, setEventos] = useState([]);
  const [asociaciones, setAsociaciones] = useState([]);
  const [recargar, setRecargar] = useState(0);
  const [esAsociacionSimple, setEsAsociacionSimple] = useState();
  const [rows, setRows] = useState([]);

  const recargarComponente = () => {
    setRecargar(+1);
  };

  function eventoAsociado(eventoId, asociaciones) {
    return (
      Array.isArray(asociaciones) &&
      asociaciones.some(
        (asociacion) =>
          asociacion.eventoId === eventoId && asociacion.estado === "pendiente"
      )
    );
  }

  useEffect(() => {
    const sessionId = localStorage.getItem("sessionId");

    if (sessionId) {
      fetch(`${process.env?.REACT_APP_BACK_URL}user/session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionID: sessionId }),
      })
        .then((response) => response.json())
        .then((data) => {
          setSession(data.data);
        })
        .catch((error) => console.error("Error fetching session:", error));
    }
  }, [nuevoRol, recargar]);

  useEffect(() => {
    if (session) {
      const headers = new Headers();
      headers.append("ConsumidorId", session.consumidorId);

      fetch(`${process.env?.REACT_APP_BACK_URL}evento/enEstado/EnPreparacion`, {
        method: "GET",
        headers: headers,
      })
        .then((response) => response.json())
        .then((data) => {
          setEventos(data.data);
        })
        .catch((error) => console.log("No existen carritos.", error));

      fetch(`${process.env?.REACT_APP_BACK_URL}asociacion/`, {
        method: "GET",
        headers: headers,
      })
        .then((response) => response.json())
        .then((data) => {
          setAsociaciones(data.data);
        })
        .catch((error) => console.log("No existen carritos.", error));
    }
  }, [session, recargar]);


  const handleCrearForm = (ideventoseleccionado) => {
    const url = `/restriccionesEvento/${ideventoseleccionado}`;
    navigate(url);
  };

  const handleAsociar = (ideventoseleccionado) => {
    const headers = new Headers();
    headers.append("ConsumidorId", session?.consumidorId);
    headers.append("Content-Type", "application/json");

    fetch(
      `${process.env?.REACT_APP_BACK_URL}asociacion/evento/${ideventoseleccionado}/asociarSimple/${puestoId}/0`,
      {
        method: "POST",
        headers: headers,
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 200) {
          toast.success("Asociacion Guardada");
          recargarComponente()
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error("Error al asociar");
      });
  };

  return (
    <div className={`row m-0 mainFormEventos`}>
      <div className="col-2 p-0">
        <Sidebar tipoUsuario={session?.tipoUsuario} />
      </div>
      <div className={`col-10`}>
        <div className="d-flex justify-content-center mb-3 tituloSeccion">
          <h1 className="pt-2">Asociate a un Evento</h1>
        </div>
        <hr style={{ color: "#F7B813" }} />
        <div className="d-flex align-items-center justify-content-center">
          <div className="pt-2 pb-4 h-100 w-100">
            {Array.isArray(eventos) && eventos.length > 0 ? (
              <div>
                {eventos.map((evento, index) => (
                  <div key={index}>
                    <EventoEncargado
                      evento={evento}
                      puestoId={puestoId}
                      session={session}
                      recargar={recargarComponente}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <h2 className={"tituloSeccionNegativo"}>
                No hay eventos activos en este momento.
              </h2>
            )}
          </div>
        </div>
      </div>
    </div>
  );

};

export default AsociarPuestoAEvento;

