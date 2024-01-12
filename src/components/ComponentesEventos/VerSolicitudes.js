import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Sidebar from "../ComponentesGenerales/Sidebar";
import "./../sass/main.css";

const VerSolicitudesEvento = () => {
  const { evento } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [eventos, setEventos] = useState([]);
  const [asociaciones, setAsociaciones] = useState([]);
  const [isPendienteDeAceptacion, setIsPendienteDeAceptacion] = useState(false);
  const [isAceptada, setIsAceptada] = useState(false);
  const [isRechazada, setIsRechazada] = useState(false);
  const [isCancelada, setIsCancelada] = useState(false);

  useEffect(() => {
    const sessionId = localStorage.getItem("sessionId");

    if (!sessionId) {
      console.error("No session ID found.");
      return;
    }

    fetch(`${process.env?.REACT_APP_BACK_URL}user/session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sessionID: sessionId }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setSession(data.data);
        console.log(data.data.tipoUsuario);
      })
      .catch((error) => console.error("Error fetching session:", error));
  }, []);

  useEffect(() => {
    if (!asociaciones.length && evento) {
      fetch(`${process.env?.REACT_APP_BACK_URL}asociacion/evento/${evento}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          console.log(data.data);
          setAsociaciones(data.data);
        })
        .catch((error) => {
          console.error("Error al obtener las asociaciones:", error);
        });
    }
  }, [evento, asociaciones]);

  useEffect(() => {
    if (!eventos.length) {
      fetch(`${process.env?.REACT_APP_BACK_URL}evento/${evento}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          console.log(data.data);
          setEventos(data.data);
        })
        .catch((error) => {
          console.error("Error al obtener el evento:", error);
        });
    }
  }, []);



  const infoEvento = (eventoId) => {
    navigate(`/info-puesto/${eventoId}`);
  };

  const aceptarSolicitud = (asociacionId) => {
    fetch(`${process.env?.REACT_APP_BACK_URL}asociacion/cambiarEstado/${asociacionId}/aceptar`, {
      method: "POST",
    })
      .then((response) => response.json())
      .then(() => {
        toast.success("Asociacion Aceptada con éxito");
        window.location.reload();
      })
      .catch((error) => toast.error("Error al Asociar Puesto"));
  };

  const rechazarSolicitud = (asociacionId) => {
    console.log(asociacionId);
    fetch(`${process.env?.REACT_APP_BACK_URL}asociacion/cambiarEstado/${asociacionId}/rechazada`, {
      method: "POST",
    })
      .then((response) => response.json())
      .then(() => {
        toast.success("Asociacion Rechazada con éxito");
        window.location.reload();

      })
      .catch((error) => toast.error("Error al Asociar Puesto"));
  };

  const cancelarSolicitud = (asociacionId) => {
    console.log(asociacionId);
    fetch(`${process.env?.REACT_APP_BACK_URL}asociacion/cambiarEstado/${asociacionId}/cancelar`, {
      method: "POST",
    })
      .then((response) => response.json())
      .then(() => {
        toast.success("Asociacion Cancelada con éxito");
        window.location.reload();

      })
      .catch((error) => toast.error("Error al Cancelar Puesto"));
  };


  return (
    <div>
      <div className="row m-0 mainFormEventos">
        <div className="col-2 p-0">
          <Sidebar tipoUsuario={session?.tipoUsuario} />
        </div>
        <div className="col-10">
          <div className="d-flex align-items-center justify-content-center">
            <div className="pt-2 pb-4 h-100 w-100">
              {asociaciones.length > 0 ? (
                <>
                  <div className="d-flex justify-content-center mb-3 tituloSeccion">
                    <h1 className="pt-2">Mis Solicitudes para {eventos.nombre}</h1>
                  </div>
                  <hr style={{ color: "#F7B813" }} />
                  {asociaciones.map((asociacion, index) => (
                    <div className="card mb-4 mx-auto" key={index}>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-8">
                            <h5 className="card-title">{asociacion?.puesto?.nombreCarro || asociacion?.repartidor?.nombre}</h5>
                            <p className="card-descripcion">
                              {asociacion?.puesto?.id ? `ID de Carro: ${asociacion?.puesto?.id}` : `ID de Repartidor: ${asociacion?.repartidor?.id}`}
                            </p>
                            <p className="card-text">
                              {asociacion?.puesto?.telefonoCarro ? `Teléfono de Carro: ${asociacion?.puesto?.telefonoCarro}` : `Teléfono de Repartidor: ${asociacion?.repartidor?.telefono}`}
                            </p>
                          </div>


                          <div className="mt-2 d-flex">
                            <p className="card-estado-productor">
                              {asociacion?.estado || 'Estado no disponible'}
                            </p>
                          </div>
                          <div className="col-md-12 d-flex justify-content-center">
                            {asociacion.estado !== 'Aceptada' && asociacion.estado !== 'Rechazada' && (
                              <button
                                className="btn btn-success me-2"
                                onClick={() => aceptarSolicitud(asociacion.id)}
                              >
                                Aceptar Solicitud
                              </button>
                            )}
                            {asociacion.estado !== 'Rechazada' && asociacion.estado !== 'Aceptada' && (
                              <button
                                className="btn btn-danger me-2"
                                onClick={() => rechazarSolicitud(asociacion.id)}
                              >
                                Rechazar Solicitud
                              </button>
                            )}
                            {asociacion.estado == 'Rechazada' && (
                              <button
                                className="btn btn-danger me-2"
                                onClick={() => cancelarSolicitud(asociacion.id)}
                              >
                                Cancelar Solicitud
                              </button>
                            )}
                            {asociacion.estado == 'Aceptada' && (
                              <button
                                className="btn btn-danger me-2"
                                onClick={() => cancelarSolicitud(asociacion.id)}
                              >
                                Cancelar Solicitud
                              </button>
                            )}
                            <button className="btn btn-secondary me-2" onClick={() => infoEvento(asociacion.puesto.id)}>Info</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="contenedor-grid">
                  <div className="tituloSeccion">
                    <h2>Solicitudes</h2>
                  </div>
                  <div className="descripcion">
                    <p>
                      Este evento no tiene solicitudes pendientes. Invita a tus puestos favoritos a unirse.
                    </p>
                  </div>
                  <Link to={`/`} className="LinkAgregarEvento">
                    Enviar Invitación
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




export default VerSolicitudesEvento;
