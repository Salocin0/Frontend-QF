import { format } from "date-fns";
import React from "react";
import Sidebar from "../ComponentesGenerales/Sidebar";
import "./../sass/main.scss";
import imgdefault from "./img/villa maria.png";

const EventoPrueba = ({ session }) => {
    // Supongamos que tienes información del evento
    const evento = {
        nombre: "Festival Internacional de Peñas",
        ciudad: "Villa María",
        fechainicio: new Date(),
        fechafin: new Date(),
    };

    return (
        <div className="container-fluid">
            <div className="row formEvento">
                <div className="col-md-3 p-0">
                    <Sidebar tipoUsuario={session?.tipoUsuario} />
                </div>
                <div className="col-md-7">
                    <div className="card" style={{ width: "100%" }}>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-3">
                                    <img
                                        src={imgdefault}
                                        alt="Logo del Evento"
                                        className="img-fluid"
                                    />
                                </div>

                                <div className="col-md-8">
                                    <h5 className="card-title">{evento.nombre}</h5>
                                    <p className="card-text">{evento.ciudad}</p>
                                    <p className="card-text">
                                        {format(evento.fechainicio, "dd/MM/yyyy")} - {format(evento.fechafin, "dd/MM/yyyy")}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-2 d-flex">
                                <div className="col-md-12 d-flex justify-content-center">
                                    <button className="btn btn-success me-2">Confirmar Evento</button>
                                    <button className="btn btn-secondary me-2">Editar Evento</button>
                                    <button className="btn btn-danger">Cancelar Evento</button>

                                </div>
                            </div>

                        </div>
                    </div>
                </div>


            </div>
        </div>
    );
};

export default EventoPrueba;
