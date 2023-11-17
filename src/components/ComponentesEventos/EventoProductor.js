import { format } from "date-fns";
import { default as React, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import FiltersEventosConsumidor from "../filters/filtersEventosConsumidor";
import "./../sass/main.css";


const EventoProductor = ({ evento, recargar }) => {
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const navigate = useNavigate();

  const [isEnPreparacion, setIsEnPreparacion] = useState(false);
  const [isConfirmado, setIsConfirmado] = useState(false);
  const [isEnCurso, setIsEnCurso] = useState(false);
  const [isPausado, setIsPausado] = useState(false);
  const [isCancelado, setIsCancelado] = useState(false);
  const [isFinalizado, setIsFinalizado] = useState(false);



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
        case 'En Preparacion':
          setIsEnPreparacion(true);
          console.log("Entre aca" + setIsEnPreparacion);
          break;
        case 'Confirmado':
          setIsConfirmado(true);
          break;
        case 'En Curso':
          setIsEnCurso(true);
          break;
        case 'Pausado':
          setIsPausado(true);
          break;
        case 'Cancelado':
          setIsCancelado(true);
          break;
        case 'Finalizado':
          setIsFinalizado(true);
          break;
        default:
          break;
      }
    }
  });



  const confirmarEvento = () => {
    fetch(`http://localhost:8000/evento/cambiarEstado/${evento.id}/confirmarEvento`, {
      method: "POST",
    })
      .then((response) => response.json())
      .then(() => {
        toast.success("Evento confirmado con éxito");
        window.location.reload();
      })
      .catch((error) => toast.error("Error al confirmar evento"));
  };

  const cancelarEvento = () => {
    const headers = new Headers();
    headers.append("ConsumidorId", session.consumidorId);

    fetch(`http://localhost:8000/cambiarEstado/${evento.id}/cancelar`, {
      method: "POST",
      headers: headers,
    })
      .then((response) => {
        if (response.ok) {
          toast.success("Evento cancelado");
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

  const iniciarEvento = () => {
    const headers = new Headers();
    headers.append("ConsumidorId", session.consumidorId);

    fetch(`http://localhost:8000/cambiarEstado/${evento.id}/iniciarEvento`, {
      method: "POST",
      headers: headers,
    })
      .then((response) => {
        if (response.ok) {
          toast.success("Evento iniciado con éxito");
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

  const pausarEvento = () => {
    const headers = new Headers();
    headers.append("ConsumidorId", session.consumidorId);

    fetch(`http://localhost:8000/cambiarEstado/${evento.id}/pausarEvento`, {
      method: "POST",
      headers: headers,
    })
      .then((response) => {
        if (response.ok) {
          toast.success("Evento pausado con éxito");
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

  const finalizarEvento = () => {
    const headers = new Headers();
    headers.append("ConsumidorId", session.consumidorId);

    fetch(`http://localhost:8000/cambiarEstado/${evento.id}/finalizarEvento`, {
      method: "POST",
      headers: headers,
    })
      .then((response) => {
        if (response.ok) {
          toast.success("Evento finalizado con éxito");
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

  const reprogramarEvento = () => {
    const headers = new Headers();
    headers.append("ConsumidorId", session.consumidorId);

    fetch(`http://localhost:8000/cambiarEstado/${evento.id}/reprogramarEvento`, {
      method: "POST",
      headers: headers,
    })
      .then((response) => {
        if (response.ok) {
          toast.success("Evento reprogramado con éxito");
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
                  <p className="card-text-fecha">
                    {format(new Date(evento.fechaInicio), "dd/MM/yyyy")} -  {format(new Date(evento.fechaFin), "dd/MM/yyyy")}
                  </p>
                </div>

                <div className="mt-2 d-flex">
                  <div className="col-md-12 d-flex justify-content-center">
                    {isEnPreparacion && <button className="btn btn-success me-2" onClick={confirmarEvento}>Confirmar Evento</button>}
                    {isEnPreparacion && <button className="btn btn-danger me-2"  onClick={cancelarEvento}>Cancelar Evento</button>}
                    {isConfirmado && <button className="btn btn-success me-2"  onClick={iniciarEvento}>Iniciar Evento</button>}
                    {isConfirmado && <button className="btn btn-secondary me-2" onClick={pausarEvento}>Pausar Evento</button>}
                    {isEnCurso && <button className="btn btn-danger me-2" onClick={finalizarEvento}>Finalizar Evento</button>}
                    {isPausado && <button className="btn btn-danger me-2" onClick={reprogramarEvento}>Reprogramar Evento</button>}
                    {isPausado && <button className="btn btn-danger me-2" onClick={cancelarEvento}>Cancelar Evento</button>}

                    <button className="btn btn-secondary me-2">
                      Editar Evento
                    </button>

                  </div>
                  <p className="card-estado-productor">
                    {evento.estado}
                  </p>
                </div>


                <div>

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




