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
        case 'EnPreparacion':
          setIsEnPreparacion(true);
          break;
        case 'Confirmado':
          setIsConfirmado(true);
          break;
        case 'EnCurso':
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

  function getColorClass(estado) {
    switch (estado) {

      case 'Finalizado':
        return 'color-finalizado';
      default:
        return '';
    }
  }

   function getCardColor(estado) {
    switch (estado) {

      case 'Finalizado':
        return 'card-finalizado';
      default:
        return '';
    }
  }


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


  const iniciarEvento = () => {
    fetch(`http://localhost:8000/evento/cambiarEstado/${evento.id}/iniciarEvento`, {
      method: "POST",
    })
      .then((response) => response.json())
      .then(() => {
        toast.success("Evento iniciado con éxito");
        window.location.reload();
      })
      .catch((error) => toast.error("Error al confirmar evento"));
  };


  const finalizarEvento = () => {
    fetch(`http://localhost:8000/evento/cambiarEstado/${evento.id}/finalizarEvento`, {
      method: "POST",
    })
      .then((response) => response.json())
      .then(() => {
        toast.success("Evento finalizado con éxito");
        window.location.reload();
      })
      .catch((error) => toast.error("Error al confirmar evento"));
  };

  const cancelarEvento = () => {
    fetch(`http://localhost:8000/evento/cambiarEstado/${evento.id}/cancelarEvento`, {
      method: "POST",
    })
      .then((response) => response.json())
      .then(() => {
        toast.success("Evento Cancelado con éxito");
        window.location.reload();
      })
      .catch((error) => toast.error("Error al confirmar evento"));
  };

  const pausarEvento = () => {
    fetch(`http://localhost:8000/evento/cambiarEstado/${evento.id}/pausarEvento`, {
      method: "POST",
    })
      .then((response) => response.json())
      .then(() => {
        toast.success("Evento Pausado con éxito");
        window.location.reload();
      })
      .catch((error) => toast.error("Error al confirmar evento"));
  };


  const reprogramarEvento = () => {
    fetch(`http://localhost:8000/evento/cambiarEstado/${evento.id}/reprogramarEvento`, {
      method: "POST",
    })
      .then((response) => response.json())
      .then(() => {
        toast.success("Evento Reprogramado con éxito");
        window.location.reload();
      })
      .catch((error) => toast.error("Error al confirmar evento"));
  };

  const agregarNuevo = () => {
    navigate(`/registrar-evento`);

  };

  return (
    <div>
      <div className="container-fluid">
      <div className={`card ${getCardColor(evento.estado)}`}>
            <div className="card-body ">
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
                  <p className="card-distance distancia-finalizado">
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
                    {isPausado && <button className="btn btn-success me-2" onClick={reprogramarEvento}>Reprogramar Evento</button>}
                    {isPausado && <button className="btn btn-danger me-2" onClick={cancelarEvento}>Cancelar Evento</button>}

                    {!isFinalizado && !isCancelado && <button className="btn btn-secondary me-2">
                      Editar Evento
                    </button>}

                  </div>
                  <p className={`card-estado-productor ${getColorClass(evento.estado)}`}>
                    {evento.estado}
                  </p>
                </div>


                <div>

                </div>

              </div>
            </div>
          </div>



      </div>
      <button  onClick={agregarNuevo} className="agregarEventoButton">
        Agregar Evento
      </button>
      <div className="filtrosEventosConsumidor">
        <FiltersEventosConsumidor />
      </div>




    </div>


  );
};

export default EventoProductor;

//                  <p className={`card-estado-productor ${getColorClass(evento.estado)}`}>




