import "bootstrap/dist/css/bootstrap.min.css"; // Importar Bootstrap si no lo tienes
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Sidebar from "../ComponentesGenerales/Sidebar";
import "./../sass/main.scss";

const RegistrarEvento4 = () => {
  const { diferenciaDiasEvento } = useParams();
  const navigate = useNavigate();
  const [horasPorDia, setHorasPorDia] = useState([]);
  const [evento, setEvento] = useState(null);
  const [session, setSession] = useState(null);
  const [eventoId, setEventoId] = useState(null);
  const [tienePreventa, setTienePreventa] = useState(false);
  const location = useLocation();
  const [mostrarCartel, setMostrarCartel] = useState(false); // Estado para mostrar el cartel

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
      .then((response) => response.json())
      .then((data) => {
        setSession(data.data);
        console.log(data.data.tipoUsuario);
      })
      .catch((error) => console.error("Error fetching session:", error));
  }, []);

  useEffect(() => {
    const storedEvent = JSON.parse(localStorage.getItem('eventoDatos'));
    if (storedEvent) {
        setEvento(storedEvent);
        setTienePreventa(storedEvent.tienePreventa);

        const fechaInicio = new Date(storedEvent.fechaInicio);
        const fechaFin = new Date(storedEvent.fechaFin);

        const dias = Array.from({ length: diferenciaDiasEvento }, (_, index) => {
            const currentDay = new Date(fechaInicio);
            currentDay.setDate(fechaInicio.getDate() + index);

            // Formatear las fechas en el formato correcto
            const formattedDate = `${currentDay.getFullYear()}-${String(currentDay.getMonth() + 1).padStart(2, '0')}-${String(currentDay.getDate()).padStart(2, '0')}`;
            const horaInicio = index === 0 ? `${formattedDate}T${String(fechaInicio.getHours()).padStart(2, '0')}:${String(fechaInicio.getMinutes()).padStart(2, '0')}` : `${formattedDate}T00:00`;
            const horaFin = index === (diferenciaDiasEvento - 1) ? `${formattedDate}T${String(fechaFin.getHours()).padStart(2, '0')}:${String(fechaFin.getMinutes()).padStart(2, '0')}` : `${formattedDate}T23:59`;

            return {
                dia: index + 1,
                horaInicio,
                horaFin,
                tienePreventa: storedEvent.tienePreventa,
            };
        });

        setHorasPorDia(dias);
    } else {
        toast.error("No se encontraron datos del evento.");
        navigate('/registrar-evento3');
    }
}, [diferenciaDiasEvento, navigate]);


  const handleInputChange = (dia, campo, value) => {
    setHorasPorDia((horasAnteriores) =>
      horasAnteriores.map((hora) =>
        hora.dia === dia ? { ...hora, [campo]: value } : hora
      )
    );
  };

  useEffect(() => {
    if (location.state && location.state.eventoId) {
      setEventoId(location.state.eventoId);
    }
  }, [location.state]);

  const handleSiguienteClick = async (e) => {
    e.preventDefault();

    const datosHoras = horasPorDia.map((hora) => ({
      dia: hora.dia,
      horaInicio: hora.horaInicio,
      horaFin: hora.horaFin,
      tienePreventa: tienePreventa,
    }));

    const eventoDatos = {
      diferenciaDiasEvento,
      diasEvento: datosHoras,
    };

    try {
      const updateResponse = await fetch(`${process.env.REACT_APP_BACK_URL}evento/preparacion/${eventoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.token}`,
        },
        body: JSON.stringify(eventoDatos),
      });

      const updateData = await updateResponse.json();

      if (updateResponse.ok) {
        setMostrarCartel(true); // Mostrar el cartel
        setTimeout(() => {
          navigate(`/listado-eventos-productor`);
        }, 3000); // Espera 5 segundos antes de redirigir
      } else {
        toast.error(updateData.message || "Error al registrar el evento");
      }
    } catch (error) {
      console.error("Error al registrar el evento:", error);
      toast.error("Error al registrar el evento");
    }
  };

  const handleVolver = (e) => {
    navigate(`/registrar-evento3`, { state: { eventoId } });
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
                        Fecha y Hora de Inicio - Día {hora.dia}*
                      </label>
                      <input
                        className="form-input"
                        type="datetime-local"
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
                        Fecha y Hora de Fin - Día {hora.dia}*
                      </label>
                      <input
                        type="datetime-local"
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
                  className="btn btn-primary me-2"
                  onClick={handleVolver}
                >
                  Volver
                </button>
                <button
                  className="siguiente-button ms-auto"
                  onClick={handleSiguienteClick}
                >
                  Finalizar Registro
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {mostrarCartel && (
  <div
    className="position-fixed top-50 start-50 translate-middle bg-success text-white p-4 rounded shadow-lg"
    style={{
      zIndex: 1050,
      maxWidth: "400px",  // Ancho más reducido
      width: "100%", // Asegura que sea responsivo
      textAlign: "center", // Centra el contenido del texto
    }}
  >
    <h5 className="mb-2">¡Registro Exitoso!</h5>
    <p>El registro fue exitoso. Ahora dirígete a la app móvil para finalizar el registro de tu evento.</p>
  </div>
)}

    </div>
  );
};

export default RegistrarEvento4;
