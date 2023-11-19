import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Sidebar from "../ComponentesGenerales/Sidebar";
import "./../sass/main.css";
import "./asociarAEventos.css";

const VerAsociacionesR = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [nuevoRol, setNuevorol] = useState(false);
  const [asociaciones, setAsociaciones] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [recargar, setRecargar] = useState(0);
  const [rows, setRows] = useState([]);

  const recargarComponente = () => {
    setRecargar(+1);
  };

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
  }, [nuevoRol, recargar]);

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
          console.log(data.data);

          const eventosPromises = data.data.map(async (asociacion) => {
            const response = await fetch(
              `http://localhost:8000/evento/${asociacion.eventoId}`,
              {
                method: "GET",
                headers: headers,
              }
            );
            const eventoData = await response.json();
            return eventoData.data;
          });

          Promise.all(eventosPromises)
            .then((eventosData) => {
              setEventos(eventosData);
            })
            .catch((error) => console.log("Error fetching eventos.", error));
        })
        .catch((error) => console.log("No existen asociaciones.", error));
    }
  }, [session, recargar]);

  const handleCancelar = (id)=> {
    fetch(`http://localhost:8000/asociacion/cancelar/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          toast.success("Asociacion Cancelada");
          recargarComponente()
        })
        .catch((error) => console.error("Error fetching session:", error));
  }

  return (
    <div className={`background d-flex`}>
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
            asociaciones.map((asociacion, index) => {
              const evento = eventos.find(
                (evento) => evento.idevento === asociacion.idevento
              );
              const isPendiente = asociacion.estado === "pendiente";
              return (
                <div
                  className={`card mx-2 mb-2 row`}
                  key={index}
                  style={{ height: "200px", display: "flex" }}
                >
                  {evento && evento.img && (
                    <img
                      src={evento.img}
                      alt={`Imagen de ${evento.nombre}`}
                      style={{
                        width: "33%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  )}
                  <div
                    className="align-center justify-content-center"
                    style={{
                      flex: 1,
                      marginLeft: "8px",
                      display: "flex",
                      flexDirection: "column",
                      width: "64%",
                    }}
                  >
                    <h3>{evento && evento.nombre}</h3>
                    <p>Fecha de inicio: {evento?.fechaInicio}</p>
                    <p>Estado: {asociacion.estado}</p>
                    <div className="text-end">
                    {isPendiente && (
                      <button
                        onClick={() => handleCancelar(asociacion.id)}
                        className="btn btn-danger"
                      >
                        Cancelar
                      </button>
                    )}
                    </div>

                  </div>
                </div>
              );
            })
          ) : (
            <h2>No hay eventos disponibles</h2>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerAsociacionesR;