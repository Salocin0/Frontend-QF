import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../ComponentesGenerales/Sidebar";
import "./../sass/main.css";
import EventoProductor from "./EventoProductor";

const ListadoEventosProductor = () => {
  const [rows, setRows] = useState([]);
  const [session, setSession] = useState(null);
  const [eventos, setEventos] = useState([]);
  const [recargar, setRecargar] = useState(0);
  const [editProductId, setEditProductId] = useState(null);
  const [editedValues, setEditedValues] = useState({
    nombre: "",
    descripcion: "",
    tipoEvento: "",
    tipoPago: "",
    fechaInicio: Date.now(),
    horaInicio: Date.now(),
    fechaFin: Date.now(),
    cantidadPuestos: 0,
    cantidadRepartidores: 0,
    capacidadMaxima: 0,
    conButaca: false,
    conRepartidor: false,
    conPreventa: false,
    tipoPreventa: 0,
    fechaInicioPreventa: Date.now(),
    fechaFinPreventa: Date.now(),
    plazoCancelacionPreventa: 0,
    linkVentaEntradas: "",
    ubicacion: "",
    consumidorId: 0,
  });

  const recargarComponente = () => {
    setRecargar(+1);
  };

  useEffect(() => {
    const sessionId = localStorage.getItem("sessionId");

    if (!sessionId) {
      console.error("No session ID found.");
      return;
    }

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
        console.log(data.data.tipoUsuario);
      })
      .catch((error) => console.error("Error fetching session:", error));
  }, []);

  useEffect(() => {
    if (session) {
      const headers = new Headers();
      headers.append("ConsumidorId", session.consumidorId);

      fetch("http://localhost:8000/evento/all", {
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
    <div>
      <div className={`row m-0 mainFormEventos`}>
        <div className="col-2 p-0">
          <Sidebar tipoUsuario={session?.tipoUsuario} />
        </div>
        <div className={`col-10`}>
          <div className="d-flex align-items-center justify-content-center">
            <div className="pt-2 pb-4 h-100 w-100">
              {Array.isArray(eventos) && eventos.length > 0 ? (
                <React.Fragment>
                  <div className="d-flex justify-content-center mb-3 tituloSeccion">
                    <h1 className="pt-2">Eventos</h1>
                  </div>
                  <hr style={{ color: "#F7B813" }} />
                  {rows.length > 0 &&
                    rows.map((row, rowIndex) => (
                      <div key={rowIndex}>
                        {row.map((evento, index) => (
                          <div key={index}>
                            {evento !== null ? (
                              <EventoProductor
                                evento={evento}
                                session={session}
                                recargar={recargarComponente}
                              />
                            ) : null}
                          </div>
                        ))}
                      </div>
                    ))}
                </React.Fragment>
              ) : (
                <div className="contenedor-grid">
                  <div className="tituloSeccion">
                    <h2>Eventos</h2>
                  </div>
                  <div className="descripcion">
                    <p>
                      Con Quickfood, crea tu evento para hacerlo mejor. Descubre nuestras
                      increíbles características y ofrece una experiencia única a tus
                      consumidores.
                    </p>
                  </div>
                  <Link to={`/registrar-evento`} className="LinkAgregarEvento">
                    Crear Evento
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

};

export default ListadoEventosProductor;
