import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "../ComponentesGenerales/Footer";
import Sidebar from "../ComponentesGenerales/Sidebar";
import style from "../ComponentesConsumidor/ConsultarUsuario.module.css";
import "./asociarAEventos.css";

const VerAsociacionesR = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [nuevoRol, setNuevorol] = useState(false);
  const [asociaciones, setAsociaciones] = useState([]);
  const [recargar, setRecargar] = useState(0);
  const [rows, setRows] = useState([]);

  const recargarComponente = () => {
    setRecargar(+1);
  };

  function eventoAsociado(eventoId, asociaciones) {
    return (
      Array.isArray(asociaciones) &&
      asociaciones.some((asociacion) => asociacion.eventoId === eventoId)
    );
  }

  useEffect(() => {
    const sessionId = localStorage.getItem("sessionId");

    if (sessionId) {
      fetch("http://localhost:8000/user/session", {
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
  }, [nuevoRol,recargar]);

  useEffect(() => {
    if (session) {
      const headers = new Headers();
      headers.append("ConsumidorId", session.consumidorId);

      fetch("http://localhost:8000/asociacion/", {
        method: "GET",
        headers: headers,
      })
        .then((response) => response.json())
        .then((data) => {
          setAsociaciones(data.data);
        })
        .catch((error) => console.log("No existen asociaciones.", error));

      fetch("http://localhost:8000/asocioacion/", {
        method: "GET",
        headers: headers,
      })
        .then((response) => response.json())
        .then((data) => {
          setAsociaciones(data.data);
        })
        .catch((error) => console.log("No existen carritos.", error));
    }
  }, [session,recargar]);

  const handleTieneRestriciones = async (ideventoseleccionado) => {
    try {
      const headers = new Headers();
      headers.append("ConsumidorId", session?.consumidorId);
      headers.append("Content-Type", "application/json");

      const response = await fetch(
        `http://localhost:8000/restriccion/evento/${ideventoseleccionado}`,
        {
          method: "GET",
          headers: headers,
        }
      );

      if (response.ok) {
        handleCrearForm(ideventoseleccionado);
      } else {
        handleAsociar(ideventoseleccionado);
      }
      recargarComponente()
    } catch (error) {
      console.error(error);
      toast.error("Error al crear el formulario");
    }
  };

  const handleCrearForm = (ideventoseleccionado) => {
    const url = `/restriccionesEvento/${ideventoseleccionado}`;
    navigate(url);
  };

  const handleAsociar = (ideventoseleccionado) => {
    const headers = new Headers();
    headers.append("ConsumidorId", session?.consumidorId);
    headers.append("Content-Type", "application/json");

    fetch(
      `http://localhost:8000/asocioacion/evento/${ideventoseleccionado}/asociarSimple/0/${session.consumidorId}`,
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
    <div className={`${style.background} d-flex`}>
      <div className="col-2">
        <Sidebar tipoUsuario={session?.tipoUsuario} />
      </div>
      <div className="col-10 grid-container p-3">
        <div className="h-100 header d-flex flex-column justify-content-center align-items-center text-center">
          <h2 className="text-white">Asociate a un evento</h2>
          <div className="text-center mt-3">
            <h2 className="text-white">BUSCADOR</h2>
            <div className="d-flex">
              <input
                type="text"
                placeholder="Buscar"
                className="form-control"
              />
              <button className="btn btn-primary ml-2 mx-2">Buscar</button>
            </div>
          </div>
        </div>
        <div className="filters">
          <h2>FILTROS</h2>
          <hr />
          <div>
            <label>
              <input type="checkbox" /> Filtro 1
            </label>
          </div>
          <div>
            <label>
              <input type="checkbox" /> Filtro 2
            </label>
          </div>
          <div>
            <label>
              <input type="checkbox" /> Filtro 3
            </label>
          </div>
        </div>
        <div className="content">
          {Array.isArray(asociaciones) && asociaciones.length > 0 ? (
            asociaciones.map((evento, index) => (
              <div
                className={`card mx-2 mb-2 `}
                key={index}
              >
                <div className="row">
                  <div className="col-3 mb-1" style={{ borderRadius: "10px" }}>
                    <img
                      src={evento.img}
                      alt={evento.titulo}
                      className="img-fluid w-100 h-100"
                    />
                  </div>
                  <div className="col-9 col-md-3">
                    <h3>{evento.titulo}</h3>
                    <p>{evento.descripcion}</p>
                    <p>Localidad: {evento.localidad}</p>
                    <p>Distancia: {evento.distancia} km</p>
                    <p>Fecha: {evento.fecha}</p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 col-md-4 text-end w-100 pe-4 pb-2">
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        handleTieneRestriciones(evento.id);
                      }}
                      disabled={eventoAsociado(evento.id, asociaciones)}
                    >
                      Asociarse a evento
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <h2>No hay eventos disponibles</h2>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerAsociacionesR;
