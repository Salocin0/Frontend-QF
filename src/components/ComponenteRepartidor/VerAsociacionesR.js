import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Sidebar from "../ComponentesGenerales/Sidebar";
import "./../sass/main.css";


const AsociacionesR = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [session, setSession] = useState(null);
    const [eventos, setEventos] = useState([]);
    const [isPendienteDeAceptacion, setIsPendienteDeAceptacion] = useState(false);
    const [asociaciones, setAsociaciones] = useState([]);
    const [estadosAsociaciones, setEstadosAsociaciones] = useState([]);

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

            fetch(`http://localhost:8000/asociacion/buscarR/${session.consumidorId}`,
            {
                method: "GET",
                headers: headers,
            })
        .then((response) => response.json())
        .then((data) => {
            setEventos(data.data.eventos);
            setAsociaciones(data.data.asociaciones);
            console.log(data.data.asociaciones);
        })
        .catch((error) => console.log("No existen eventos.", error));
}
    }, [session]);

    useEffect(() => {
        if (asociaciones.length > 0) {
          let pendienteDeAceptacion = false;
          asociaciones.forEach((asociacion) => {
            if (asociacion.estado === 'PendienteDeAceptacion') {
              pendienteDeAceptacion = true;
            }
          });
          setIsPendienteDeAceptacion(pendienteDeAceptacion);
        }
      }, [asociaciones]);



const agregarNuevo = () => {
    navigate(`/crear-puesto`);
};


const cancelarAsociacion = (asociacionID) => {
    fetch(`http://localhost:8000/asociacion/cambiarEstado/${asociacionID}/cancelar`, {
      method: "POST",
    })
    .then((response) => {
        if (response.ok) {
          toast.success("Asociacion Cancelada orrectamente");
          window.location.reload();
        } else {
          response.json().then((errorData) => {
            const errorMessage = errorData.message || "Ha ocurrido un error";
            toast.error(errorMessage);
          });
        }
      })
}

function generarNumeroRandom() {
  return Math.floor(Math.random() * 15) + 1;
}






return (
    <div>
      <div className={`row m-0 mainFormEventos`}>
        <div className="col-2 p-0">
          <Sidebar tipoUsuario={session?.tipoUsuario} />
        </div>
        <div className={`col-10`}>
          <div className="d-flex align-items-center justify-content-center">
            <div className="pt-2 pb-4 h-100 w-100">
              {eventos.length > 0 ? (
                <>
                  <div className="d-flex justify-content-center mb-3 tituloSeccion">
                    <h1 className="pt-2">Mis Asociaciones</h1>
                  </div>
                  <hr style={{ color: "#F7B813" }} />
                  {eventos.map((evento, index) => {
                    const asociacion = asociaciones.find(
                      (asoc) => asoc.eventoId === evento.id
                    );
                    return (
                      <div className={`card mx-auto`} key={index}>
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
                              <p className="card-descripcion">
                                {evento.descripcion}
                              </p>
                              <p className="card-text">
                                {evento.ubicacion} - {evento.localidad},{" "}
                                {evento.provincia}
                              </p>
                              <p className="card-text-yellow"> {`El evento empieza en ${generarNumeroRandom()} días`}</p>

                            </div>
                            <div className="mt-2 d-flex">
                              <div className="col-md-12 d-flex justify-content-center">
                               {isPendienteDeAceptacion &&  <button
                                  className="btn btn-danger me-2"
                                  onClick={() => cancelarAsociacion(asociacion.id)}
                                >
                                  Cancelar Asociacion
                                </button>}
                              </div>
                              <p className={`card-estado-productor`}>
                                {asociacion.estado}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </>
              ) : (
                <div className="contenedor-grid">
                  <div className="tituloSeccion">
                    <h2>Mis Asociaciones</h2>
                  </div>
                  <div className="descripcion">
                    <p>
                      Con Quickfood, asocia tu evento para hacerlo mejor.
                      Descubre nuestras increíbles características y ofrece una
                      experiencia única a tus consumidores.
                    </p>
                  </div>
                  <Link to={`/registrar-evento`} className="LinkAgregarEvento">
                    Asociarme a Evento
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

export default AsociacionesR;
