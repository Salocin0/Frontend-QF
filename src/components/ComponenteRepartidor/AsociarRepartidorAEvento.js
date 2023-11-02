import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "../ComponentesGenerales/Footer";
import Sidebar from "../ComponentesGenerales/Sidebar";
import style from "../ComponentesConsumidor/ConsultarUsuario.module.css";
import "./asociarAEventos.css";

const AsociarRepartidorAEvento = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [nuevoRol, setNuevorol] = useState(false);
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
          console.log(data.data);
        })
        .catch((error) => console.error("Error fetching session:", error));
    }
  }, [nuevoRol]);

  useEffect(() => {
    if (session) {
      const headers = new Headers();
      headers.append("ConsumidorId", session.consumidorId);

      fetch("http://localhost:8000/evento/enEstado/enPreparacion", {
        method: "GET",
        headers: headers,
      })
        .then((response) => response.json())
        .then((data) => {
          setEventos(data.data);
          const totalEventos = Math.ceil(data.data.length / 4) * 4;
          const eventosConNulos = [
            ...data.data,
            ...Array(totalEventos - data.data.length).fill(null),
          ];

          const generatedRows = [];
          for (let i = 0; i < eventosConNulos.length; i += 4) {
            const row = eventosConNulos.slice(i, i + 4);
            generatedRows.push(row);
          }
          setRows(generatedRows);
        })
        .catch((error) => console.log("No existen carritos.", error));
    }
  }, [session, recargar]);

  return (
    <div className={`${style.background} d-flex`}>
      <div className="col-2">
        <Sidebar tipoUsuario={session?.tipoUsuario} />
      </div>
      <div className="col-10 grid-container p-3">
        <div className="w-100 h-100 header">
          <h2 className="text-center " style={{ color: "white" }}>
            Asociate a un evento
          </h2>
          <div className="text-center">
            <h2 style={{ color: "white" }}>BUSCADOR</h2>
            <input type="text" placeholder="Buscar" />
            <button>Buscar</button>
          </div>
        </div>
        <div className="filters">
          <h2>FILTROS</h2>
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
          {eventos.map((evento, index) => (
            <div className="card" key={index}>
              <img src={evento.imagen} alt={evento.titulo} />
              <h3>{evento.titulo}</h3>
              <p>{evento.descripcion}</p>
              <p>Localidad: {evento.localidad}</p>
              <p>Distancia: {evento.distancia} km</p>
              <p>Fecha: {evento.fecha}</p>
              <button>Asociarse a evento</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AsociarRepartidorAEvento;
