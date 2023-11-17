import { format } from "date-fns";
import { default as React, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import FiltersEventosConsumidor from "../filters/filtersEventosConsumidor";
import "./../sass/main.css";
import imgdefault from "./img/villa maria.png";


const EventoProductor = ({ evento, recargar }) => {
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const navigate = useNavigate();

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

  const handleDelete = () => {
    const headers = new Headers();
    headers.append("ConsumidorId", session.consumidorId);

    fetch(`http://localhost:8000/evento/${evento.id}}`, {
      method: "DELETE",
      headers: headers,
    })
      .then((response) => {
        if (response.ok) {
          toast.success("Evento deshabilitado correctamente");
          navigate(`/listado-eventos`);
          recargar();
        } else {
          response.json().then((errorData) => {
            const errorMessage = errorData.message || "Ha ocurrido un error";
            toast.error(errorMessage);
          });
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  return (
    <div>
    <div className="container-fluid">
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-md-3">
                  <img
                    src={imgdefault}
                    alt="Logo del Evento"
                    className="img-fluid"
                  />
                </div>
                <div className="col-md-8 position-relative">
                  <h5 className="card-title">{evento.nombre}</h5>
                  <p className="card-text">{evento.ciudad}</p>
                  <p className="card-distance">
                    A {evento.distancia} de distancia{" "}
                  </p>
                  <p className="card-text">
                    {format(new Date(evento.fechaInicio), "dd/MM/yyyy")}
                    {format(new Date(evento.fechaFin), "dd/MM/yyyy")}
                  </p>
                </div>
              </div>

              <div className="mt-2 d-flex">
                <div className="col-md-12 d-flex justify-content-center">
                  <button className="btn btn-success me-2">
                    Confirmar Evento
                  </button>
                  <button className="btn btn-secondary me-2">
                    Editar Evento
                  </button>
                  <button className="btn btn-danger me-2" onClick={handleDelete}>
                    Cancelar Evento
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="filtrosEventosConsumidor">
          <FiltersEventosConsumidor />
        </div>
      </div>

  );
};

export default EventoProductor;
