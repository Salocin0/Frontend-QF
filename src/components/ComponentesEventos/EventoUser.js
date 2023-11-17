import { format } from "date-fns";
import { default as React, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import FiltersEventosConsumidor from "../filters/filtersEventosConsumidor";
import "./../sass/main.css";


const EventoUser = ({ evento, recargar }) => {
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
                    src={evento.img}
                    alt="Logo del Evento"
                    className="img-fluid"
                  />
                </div>
                <div className="col-md-8 position-relative">
                  <h5 className="card-title">{evento.nombre}</h5>
                  <p className="card-descripcion">{evento.descripcion}</p>
                  <p className="card-text">{evento.ubicacion} - {evento.localidad}, {evento.provincia}</p>
                  <p className="card-distance">
                    A 1km de distancia{" "}
                  </p>
                  <p className="card-estado">
                     {evento.estado}
                  </p>
                  <p className="card-text-fecha">
                    {format(new Date(evento.fechaInicio), "dd/MM/yyyy")} -  {format(new Date(evento.fechaFin), "dd/MM/yyyy")}
                  </p>
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

export default EventoUser;
