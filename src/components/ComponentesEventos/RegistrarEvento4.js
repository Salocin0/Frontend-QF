import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Sidebar from "../ComponentesGenerales/Sidebar";
import "./../sass/main.scss";

const RegistrarEvento4 = () => {
    const { diferenciaDiasEvento } = useParams();
    const navigate = useNavigate();

    const [horasPorDia, setHorasPorDia] = useState([]);
    const [session, setSession] = useState(null);
    const [evento, setEvento] = useState(null);

    useEffect(() => {
        const storedEvent = JSON.parse(localStorage.getItem('eventoDatos'));
        if (storedEvent) {
          setEvento(storedEvent);
          const horas = Array.from({ length: diferenciaDiasEvento }, (_, index) => ({
            dia: index + 1,
            horaInicio: "",
            horaFin: "",
          }));
          setHorasPorDia(horas);
        } else {
          toast.error("No se encontraron datos del evento.");
          navigate('/registrar-evento3'); // Redirigir si no hay datos
        }
      }, [diferenciaDiasEvento, navigate]);

    const handleInputChange = (dia, campo, value) => {
        setHorasPorDia((horasAnteriores) =>
            horasAnteriores.map((hora) =>
                hora.dia === dia ? { ...hora, [campo]: value } : hora
            )
        );
    };

    const handleSiguienteClick = (e) => {
        e.preventDefault();

        const datosHoras = horasPorDia.reduce((acc, hora) => {
            acc[`horaInicioDia${hora.dia}`] = hora.horaInicio;
            acc[`horaFinDia${hora.dia}`] = hora.horaFin;
            return acc;
        }, {});

        const eventoCompleto = {
            ...evento,
            diferenciaDiasEvento,
            ...datosHoras,
        };

        fetch(`${process.env?.REACT_APP_BACK_URL}evento`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session?.token}`,  // Asumiendo que la sesión tiene un token para autenticación
            },
            body: JSON.stringify(eventoCompleto),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.code === 200) {
                    toast.success("Evento registrado correctamente");
                    navigate(`/listado-eventos-productor`);
                } else {
                    toast.error("Error al registrar el evento");
                }
            })
            .catch((error) => {
                console.error(error);
                toast.error("Error al registrar el evento");
            });
    };

    return (
        <div className="container-fluid">
            <div className="row formEvento">
                <div className="col-md-4 p-0">
                    <Sidebar tipoUsuario={session?.tipoUsuario} />
                </div>
                <div className="col-md-6 p-0">
                    <div className="dark-form-wrapper mx-auto">
                        <form action="#" method="POST" className="row g-3">
                            <h3 className="tituloSeccion">Horas del Evento</h3>

                            {horasPorDia.map((hora) => (
                                <div key={hora.dia} className="row">
                                    <div className="col-md-6">
                                        <br />
                                        <div className="form-group">
                                            <label className="form-label">
                                                Hora de Inicio - Día {hora.dia}*
                                            </label>
                                            <input
                                                type="time"
                                                className="form-input"
                                                value={hora.horaInicio}
                                                onChange={(e) =>
                                                    handleInputChange(hora.dia, "horaInicio", e.target.value)
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <br />
                                        <div className="form-group">
                                            <label className="form-label">
                                                Hora de Fin - Día {hora.dia}*
                                            </label>
                                            <input
                                                type="time"
                                                className="form-input"
                                                value={hora.horaFin}
                                                onChange={(e) =>
                                                    handleInputChange(hora.dia, "horaFin", e.target.value)
                                                }
                                            />
                                        </div>
                                        <br />
                                    </div>
                                </div>
                            ))}

                            <div className="col-12 d-flex justify-content-end">
                                <button
                                    className="siguiente-button ms-auto"
                                    onClick={handleSiguienteClick}
                                    style={{ backgroundColor: "green", color: "#1a1a1a" }}
                                >
                                    Finalizar Registro
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegistrarEvento4;
