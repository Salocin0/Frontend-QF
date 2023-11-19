import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Sidebar from "../ComponentesGenerales/Sidebar";
import FiltersPuestosEncargado from "../filters/filtersPuestosEncargado";
import "./../sass/main.css";


const AsociacionesEPC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [session, setSession] = useState(null);
    const [eventos, setEventos] = useState([]);

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
            console.log("wachin")
            console.log(session)

            fetch(`http://localhost:8000/asociacion/buscar/${session.consumidorId}`,
            {
                method: "GET",
                headers: headers,
            })
        .then((response) => response.json())
        .then((data) => {
            setEventos(data.data);
        })
        .catch((error) => console.log("No existen eventos.", error));
}
    }, [session]);

const agregarNuevo = () => {
    navigate(`/crear-puesto`);
};


const cancelarAsociacion = (id) => {
    fetch(`http://localhost:8000/asociacion/cancelar/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => response.json())
        .then((data) => {
            toast.success("Asociacion Cancelada");
        })
        .catch((error) => console.error("Error fetching session:", error));
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
                                {eventos.map((evento, index) => (
                                    <div className={`card`} key={index}>
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
                                                </div>
                                                <div className="mt-2 d-flex">
                                                    <div className="col-md-12 d-flex justify-content-center">
                                                        <button className="btn btn-danger me-2" onClick={() => cancelarAsociacion()}
                                                        >
                                                            Cancelar Asociacion
                                                        </button>
                                                    </div>
                                                    <p className={`card-estado-productor`}>
                                                        {evento.estado}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </>
                        ) : (
                            <div className="contenedor-grid">
                                <div className="tituloSeccion">
                                    <h2>Mis Asociaciones</h2>
                                </div>
                                <div className="descripcion">
                                    <p>
                                        Con Quickfood, asocia tu evento para hacerlo mejor. Descubre nuestras
                                        increíbles características y ofrece una experiencia única a tus
                                        consumidores.
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
        <div className="filtrosCarritoEncargado">
            <FiltersPuestosEncargado />
        </div>
    </div>
);

};

export default AsociacionesEPC;
