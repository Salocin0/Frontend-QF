import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Sidebar from "../ComponentesGenerales/Sidebar";
import "./../sass/main.scss";

const RegistrarEvento3 = () => {
  const location = useLocation();
  const evento = location.state || {};  // Recuperar los datos del evento

  // Extraer datos del evento
  const { nombre, descripcion, imagenEvento, ubicacion, localidad, provincia, tipoEvento, tipoPago, latitud, longitud } = evento;

  const [tieneButacas, setTieneButacas] = useState(false);
  const [estado, setEstado] = useState("Standby");
  const [fechaInicioEvento, setFechaInicioEvento] = useState("");
  const [fechaFinEvento, setFechaFinEvento] = useState("");
  const [tienePreventa, setTienePreventa] = useState(false);
  const [diasAntesInicioPreventa, setDiasAntesInicioPreventa] = useState(""); // Asegúrate de definir esto correctamente
  const [horasAntesInicioEvento, setHorasAntesInicioEvento] = useState("");
  const [todosLosDiasPreventa, setTodosLosDiasPreventa] = useState("");
  const [cantidadPuestos, setCantidadPuestos] = useState("");
  const [tieneRepartidores, setTieneRepartidores] = useState(false);
  const [cantidadRepartidores, setCantidadRepartidores] = useState("");
  const [capacidadMaxima, setCapacidadMaxima] = useState("");
  const [linkVentaEntradas, setLinkVentaEntradas] = useState("");
  const [selectedOptionPreventa, setSelectedOptionPreventa] = useState(2);
  const [selectedOptionRepartidores, setSelectedOptionRepartidores] = useState(2);
  const [selectedOptionButacas, setSelectedOptionButacas] = useState(2);
  const [seccionPreventaBloqueada, setSeccionPreventaBloqueada] = useState(true); // Estado para bloquear la sección

  const { id } = useParams();
  const [session, setSession] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const sessionId = localStorage.getItem("sessionId");

    if (sessionId) {
      fetch(`${process.env.REACT_APP_BACK_URL}user/session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionID: sessionId }),
      })
        .then((response) => response.json())
        .then((data) => {
          setSession(data.data);
          console.log(data.data);
        })
        .catch((error) => console.error("Error fetching session:", error));
    }
  }, []);

  function calcularDiferenciaDias(fechaInicioEvento, fechaFinEvento) {
    const inicio = new Date(fechaInicioEvento);
    const fin = new Date(fechaFinEvento);
    const diferenciaTiempo = fin.getTime() - inicio.getTime();
    const diferenciaDias = diferenciaTiempo / (1000 * 3600 * 24);
    console.log(diferenciaDias);
    return diferenciaDias;
  }

  function calcularFechasPreventa(fechaInicioEvento, diasAntesInicioPreventa, horasAntesInicioEvento) {
    const inicioEvento = new Date(fechaInicioEvento);
    // Calcular la fecha de inicio de la preventa en base a los días antes del evento
    const fechaInicioPreventa = new Date(inicioEvento.getTime() - diasAntesInicioPreventa * 24 * 60 * 60 * 1000);
    // Calcular la hora de inicio de la preventa en base a las horas antes del evento
    const horaInicioPreventa = new Date(fechaInicioPreventa.getTime() - horasAntesInicioEvento * 60 * 60 * 1000);

    // La hora de fin de la preventa puede ser igual a la hora de inicio de la preventa en este caso.
    const horaFinPreventa = new Date(horaInicioPreventa.getTime());

    return { horaInicioPreventa, horaFinPreventa };
}


const handleSiguienteClick = (e) => {
  e.preventDefault();
  const diferenciaDiasEvento = calcularDiferenciaDias(fechaInicioEvento, fechaFinEvento);

  if (!fechaInicioEvento.trim()) {
      toast.error("Seleccione una fecha de inicio de evento");
      return;
  }

  if (!fechaFinEvento.trim()) {
      toast.error("Seleccione una fecha de fin de evento");
      return;
  }

  let horaInicioPreventa = null;
  let horaFinPreventa = null;

  if (tienePreventa) {
      if (!diasAntesInicioPreventa.trim()) {
          toast.error("Ingrese los días antes del inicio que desea iniciar la preventa");
          return;
      }

      if (!horasAntesInicioEvento.trim()) {
          toast.error("Ingrese las horas antes del inicio del evento que desea que arranque la preventa");
          return;
      }

      const fechasPreventa = calcularFechasPreventa(fechaInicioEvento, diasAntesInicioPreventa, horasAntesInicioEvento);
      horaInicioPreventa = fechasPreventa.horaInicioPreventa;
      horaFinPreventa = fechasPreventa.horaFinPreventa;
  }

  const eventoDatos = {
      nombre,
      descripcion,
      imagenEvento,
      ubicacion,
      localidad,
      provincia,
      tipoEvento,
      tipoPago,
      latitud,
      longitud,
      fechaInicioEvento,
      fechaFinEvento,
      diferenciaDiasEvento,
      tienePreventa,
      diasAntesInicioPreventa,
      horasAntesInicioEvento,
      todosLosDiasPreventa,
      cantidadPuestos,
      tieneRepartidores,
      cantidadRepartidores,
      capacidadMaxima,
      tieneButacas,
      linkVentaEntradas,
      estado,
      horaInicioPreventa,
      horaFinPreventa, // Incluir las fechas calculadas
  };

  localStorage.setItem('eventoDatos', JSON.stringify(eventoDatos));
  navigate(`/registrar-evento4/${diferenciaDiasEvento}`, { state: eventoDatos });
};


  const handleOptionClickPreventa = (option) => {
    setTienePreventa(option === 1);
    setSelectedOptionPreventa(option);
  };

  const handleOptionClickRepartidores = (option) => {
    setTieneRepartidores(option === 1);
    setSelectedOptionRepartidores(option);
  };

  const handleOptionClickButacas = (option) => {
    setTieneButacas(option === 1);
    setSelectedOptionButacas(option);
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
              <h3 className="tituloSeccion">Datos del Evento</h3>
              <div className="col-md-12">
                <div className="form-group">
                  <label htmlFor="fechaInicioEvento" className="form-label">
                    Fecha Inicio Evento*
                  </label>
                  <input
                    type="date"
                    id="fechaInicioEvento"
                    className="form-input"
                    value={fechaInicioEvento}
                    onChange={(e) => setFechaInicioEvento(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="fechaFinEvento" className="form-label">
                  Fecha Fin Evento*
                </label>
                <input
                  type="date"
                  id="fechaFinEvento"
                  className="form-input"
                  value={fechaFinEvento}
                  onChange={(e) => setFechaFinEvento(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="preventa" className="form-label">
                  Preventa*
                </label>
                <div className="option-container-evento">
                  <div
                    className={`opcionesEvento ${selectedOptionPreventa === 1 ? 'selected' : ''}`}
                    onClick={() => handleOptionClickPreventa(1)}
                  >
                    Sí
                  </div>
                  <div
                    className={`opcionesEvento ${selectedOptionPreventa === 2 ? 'selected' : ''}`}
                    onClick={() => handleOptionClickPreventa(2)}
                  >
                    No
                  </div>
                </div>
              </div>

              {tienePreventa && (
                <>
                <div className="form-group">
                  <label htmlFor="diasAntesInicioPreventa" className="form-label">
                    ¿Cuántos días antes del inicio quieres iniciar la preventa?*
                  </label>
                  <input
                    type="number"
                    id="diasAntesInicioPreventa"
                    className="form-input"
                    value={diasAntesInicioPreventa}
                    onChange={(e) => setDiasAntesInicioPreventa(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="horasAntesInicioEvento" className="form-label">
                    ¿Cuántas horas antes del inicio del evento quieres que arranque la preventa?*
                  </label>
                  <input
                    type="number"
                    id="horasAntesInicioEvento"
                    className="form-input"
                    value={horasAntesInicioEvento}
                    onChange={(e) => setHorasAntesInicioEvento(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="todosLosDiasPreventa" className="form-label">
                    ¿La preventa será todos los días?*
                  </label>
                  <input
                    type="text"
                    id="todosLosDiasPreventa"
                    className="form-input"
                    value={todosLosDiasPreventa}
                    onChange={(e) => setTodosLosDiasPreventa(e.target.value)}
                  />
                </div>
                </>
              )}

              <div className="form-group">
                <label htmlFor="butacas" className="form-label">
                  ¿El evento tiene butacas?*
                </label>
                <div className="option-container-evento">
                  <div
                    className={`opcionesEvento ${selectedOptionButacas === 1 ? 'selected' : ''}`}
                    onClick={() => handleOptionClickButacas(1)}
                  >
                    Sí
                  </div>
                  <div
                    className={`opcionesEvento ${selectedOptionButacas === 2 ? 'selected' : ''}`}
                    onClick={() => handleOptionClickButacas(2)}
                  >
                    No
                  </div>
                </div>
              </div>

              {tieneButacas && (
                <div className="form-group">
                  <label htmlFor="cantidadPuestos" className="form-label">
                    Cantidad de Puestos
                  </label>
                  <input
                    type="number"
                    id="cantidadPuestos"
                    className="form-input"
                    value={cantidadPuestos}
                    onChange={(e) => setCantidadPuestos(e.target.value)}
                  />
                </div>
              )}

              <div className="form-group">
                <label htmlFor="repartidores" className="form-label">
                  ¿El evento tiene repartidores?*
                </label>
                <div className="option-container-evento">
                  <div
                    className={`opcionesEvento ${selectedOptionRepartidores === 1 ? 'selected' : ''}`}
                    onClick={() => handleOptionClickRepartidores(1)}
                  >
                    Sí
                  </div>
                  <div
                    className={`opcionesEvento ${selectedOptionRepartidores === 2 ? 'selected' : ''}`}
                    onClick={() => handleOptionClickRepartidores(2)}
                  >
                    No
                  </div>
                </div>
              </div>

              {tieneRepartidores && (
                <div className="form-group">
                  <label htmlFor="cantidadRepartidores" className="form-label">
                    Cantidad de Repartidores
                  </label>
                  <input
                    type="number"
                    id="cantidadRepartidores"
                    className="form-input"
                    value={cantidadRepartidores}
                    onChange={(e) => setCantidadRepartidores(e.target.value)}
                  />
                </div>
              )}

              <div className="form-group">
                <label htmlFor="capacidadMaxima" className="form-label">
                  Capacidad Máxima
                </label>
                <input
                  type="number"
                  id="capacidadMaxima"
                  className="form-input"
                  value={capacidadMaxima}
                  onChange={(e) => setCapacidadMaxima(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="linkVentaEntradas" className="form-label">
                  Link Venta Entradas
                </label>
                <input
                  type="text"
                  id="linkVentaEntradas"
                  className="form-input"
                  value={linkVentaEntradas}
                  onChange={(e) => setLinkVentaEntradas(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="estado" className="form-label">
                  Estado
                </label>
                <input
                  type="text"
                  id="estado"
                  className="form-input"
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                />
              </div>

              <div className="form-group">
                <button type="submit" className="btn btn-primary" onClick={handleSiguienteClick}>
                  Siguiente
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrarEvento3;
