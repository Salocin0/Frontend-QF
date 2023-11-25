import { default as React, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import FiltersPuestosEncargado from "../filters/filtersPuestosEncargado";
import "./../sass/main.css";


const PuestoEncargado = ({ carrito, recargar }) => {
    const { id } = useParams();
    const [session, setSession] = useState(null);
    const navigate = useNavigate();

    const [isCreado, setIsCreado] = useState(false);
    const [isDeshabilitado, setIsDeshabilitado] = useState(false);
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
            })
            .catch((error) => console.error("Error fetching session:", error));
    }, []);

    useEffect(() => {
        if (carrito) {
            switch (carrito.estado) {
                case 'Creado':
                    setIsCreado(true);
                    break;
                case 'Deshabilitado':
                    setIsDeshabilitado(true);
                    break;
                default:
                    break;
            }
        }


    });

    const suscribirPuesto = () => {
        navigate(`/asociarPuestoAEvento/${carrito.id}`);
    };

    const habilitarPuesto = () => {
        fetch(`http://localhost:8000/puesto/cambiarEstado/${carrito.id}/habilitar`, {
            method: "POST",
        })
            .then((response) => response.json())
            .then(() => {
                toast.success("Puesto habilitado con éxito");
                window.location.reload();
            })
            .catch((error) => toast.error("Error al habilitar puesto"));
    };

    const deshabilitarPuesto = () => {
        fetch(`http://localhost:8000/puesto/cambiarEstado/${carrito.id}/deshabilitar`, {
            method: "POST",
        })
            .then((response) => response.json())
            .then(() => {
                toast.success("Puesto deshabilitado con éxito");
                window.location.reload();
            })
            .catch((error) => toast.error("Error al deshabilitar puesto"));
    };

    const agregarProducto = () => {
        navigate(`/listado-productos/${carrito.id}`);
    };

    const agregarNuevo = () => {
        navigate(`/crear-puesto`);

    };

    return (
        <div>
            <div className="container-fluid">
                <div className={`card`}>
                    <div className="card-body ">
                        <div className="row">
                            <div className="col-md-3">
                                <img
                                    src={carrito.img}
                                    alt="Logo del Evento"
                                    className="img-fluid"
                                />
                            </div>
                            <div className="col-md-8 position-relative">
                                <h5 className="card-title">{carrito.nombreCarro}</h5>
                                <p className="card-descripcion">Id de Puesto: {carrito.numeroCarro}</p>
                                <p className="card-descripcion"> Telefono:  {carrito.telefonoCarro}</p>
                            </div>

                            <div className="mt-2 d-flex">
                                <div className="col-md-12 d-flex justify-content-center">
                                    {isCreado && <button className="btn btn-success me-2" onClick={suscribirPuesto}>Suscribir Puesto a Evento</button>}
                                    {isDeshabilitado && <button className="btn btn-success me-2" onClick={habilitarPuesto}>Habilitar Puesto</button>}
                                    <button className="btn btn-success me-2" onClick={agregarProducto}>Agregar Productos</button>

                                    <button className="btn btn-secondary me-2">
                                        Editar Puesto
                                    </button>

                                    {isCreado && <button className="btn btn-danger me-2" onClick={deshabilitarPuesto}>Deshabilitar Puesto</button>}

                                </div>
                                <p className={`card-estado-productor`}>
                                    {carrito.estado}
                                </p>
                            </div>


                            <div>

                            </div>

                        </div>
                    </div>
                </div>



            </div>
            <button onClick={agregarNuevo} className="agregarPuestoButton">
                Agregar Puesto
            </button>
            <div className="filtrosCarritoEncargado">
                <FiltersPuestosEncargado />
            </div>




        </div>


    );
};

export default PuestoEncargado;

//                  <p className={`card-estado-productor ${getColorClass(evento.estado)}`}>




