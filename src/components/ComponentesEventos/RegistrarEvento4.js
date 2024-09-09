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
  const [mostrarCartel, setMostrarCartel] = useState(false);

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

      // Inicializar horasPorDia con valores por defecto
      const fechaInicio = new Date(storedEvent.fechaInicio);
      const fechaFin = new Date(storedEvent.fechaFin);

      const dias = Array.from({ length: diferenciaDiasEvento }, (_, index) => {
        // Calcular la fecha actual
        const currentDay = new Date(fechaInicio);
        currentDay.setDate(fechaInicio.getDate() + index);

        return {
          dia: index + 1,
          horaInicio: index === 0 ?
            `${fechaInicio.toISOString().substring(0, 16)}` : "",
          horaFin: index === (diferenciaDiasEvento - 1) ?
            `${fechaFin.toISOString().substring(0, 16)}` : "",
          tienePreventa: storedEvent.tienePreventa, // Asegúrate de aplicar el valor aquí
        };
      });

      setHorasPorDia(dias);
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

  useEffect(() => {
    if (location.state && location.state.eventoId) {
      setEventoId(location.state.eventoId);
    }
  }, [location.state]);

  const handleSiguienteClick = async (e) => {
    e.preventDefault();

    // Crear datos del evento
    const datosHoras = horasPorDia.map((hora) => ({
      dia: hora.dia,
      horaInicio: hora.horaInicio,
      horaFin: hora.horaFin,
      tienePreventa: tienePreventa, // Incluye tienePreventa aquí
    }));

    const eventoDatos = {
      diferenciaDiasEvento,
      diasEvento: datosHoras,
    };

    try {
      // Realizar la solicitud PUT
      const updateResponse = await fetch(`${process.env.REACT_APP_BACK_URL}evento/preparacion/${eventoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.token}`,
        },
        body: JSON.stringify(eventoDatos),
      });

      // Verificar si la respuesta es exitosa
      const updateData = await updateResponse.json();

      if (updateResponse.ok) { // Verifica si la respuesta es OK (status code 200-299)
        setMostrarCartel(true); // Mostrar el cartel
        setTimeout(() => {
          navigate(`/listado-eventos-productor`);
        }, 3000); // Espera 3 segundos antes de redirigir
      } else {
        toast.error(updateData.message || "Error al registrar el evento");
      }
    } catch (error) {
      // Manejo de errores
      console.error("Error al registrar el evento:", error);
      toast.error("Error al registrar el evento");
    }
  };

  const handleVolver = async (e) => {

    navigate(`/registrar-evento3`, { state: { eventoId } });

  }


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
                  className="btn btn-primary me-2" // Estilo de botón celeste (Bootstrap primary)
                  onClick={handleVolver} // Volver a la página anterior
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
    </div>
  );
};

export default RegistrarEvento4;
