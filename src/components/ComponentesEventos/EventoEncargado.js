import { format } from "date-fns";
import { default as React, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "./../sass/main.css";

import FiltrosEventosEncargado from "../filters/filtersEventosEncargado";

const EventoEncargado = ({ evento, puestoId, recargar }) => {
    const { id } = useParams();
    const [session, setSession] = useState(null);
    const navigate = useNavigate();
    const [isEnPreparacion, setIsEnPreparacion] = useState(false);


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

        if (evento) {
          switch (evento.estado) {
            case 'EnPreparacion':
              setIsEnPreparacion(true);
              break;
            default:
              break;
          }
        }
      });


    const asociarmeAEvento = () => {
        const headers = new Headers();
        headers.append("ConsumidorId", session?.consumidorId);
        headers.append("Content-Type", "application/json");

        console.log(evento.id);
        console.log(puestoId);

        fetch(
          `http://localhost:8000/asociacion/evento/${evento.id}/asociarSimple/${puestoId}/0`,
          {
            method: "POST",
            headers: headers,
          }
        )
          .then((response) => response.json())
          .then((data) => {
            if (data.code === 200) {
              toast.success("Asociacion Guardada");
             //window.location.reload();
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
          headers.append("ConsumidorId", session?.consumidorId);
          headers.append("Content-Type", "application/json");

          const response = await fetch(
            `http://localhost:8000/restriccion/evento/${evento.id}`,
            {
              method: "GET",
              headers: headers,
            }
          );
          if (response.ok) {
            const responseData = await response.json();
            console.log(responseData.code);
            if (responseData.code === 200) {
              handleCrearForm();
            } else {
              asociarmeAEvento(evento.id);
            }
            //window.location.reload();
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
        console.log("Entre a CrearForm")
        console.log(evento.id);
        const url = `/restriccionesEvento/${evento.id}`;
        navigate(url);
      };



    return (
        <div>
            <div className="container-fluid">

                    <div className="card">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-3">
                                    <img
                                        src={evento.img}
                                        alt="Logo del Evento"
                                        className="img-fluid"
                                    />
                                </div>
                                <div className="col-md-8 position-relative">
                                    <h5 className="card-title">{evento.nombre}</h5>
                                    <p className="card-descripcion">{evento.descripcion}</p>
                                    <p className="card-text">{evento.ubicacion} - {evento.localidad}, {evento.provincia}</p>
                                    <p className="card-estado">
                                        {evento.estado}
                                    </p>
                                    <p className="card-text-fecha">
                                        {format(new Date(evento.fechaInicio), "dd/MM/yyyy")} -  {format(new Date(evento.fechaFin), "dd/MM/yyyy")}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-2 d-flex">
                                <div className="col-md-12 d-flex justify-content-center">
                                    {isEnPreparacion && <button className="btn btn-success me-2" onClick={handleTieneRestriciones}>Asociarme a Evento</button>}

                                </div>
                                <p className={`card-estado-productor}`}>
                                    {evento.estado}
                                </p>
                            </div>
                        </div>
                    </div>

            </div>

            <div className="filtrosBuscador">
                <input
                    type="text"
                    placeholder="Buscar"
                    className="buscador"
                />
                <button className="btn btn-primary mx-2 buscarButton">Buscar</button>

            </div>

            <div className="filtrosEventoEncargado">

                <FiltrosEventosEncargado />

            </div>
        </div>

    );
};

export default EventoEncargado;
