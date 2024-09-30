import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Sidebar from "../ComponentesGenerales/Sidebar";
import "./../sass/main.scss";

const RegistrarEvento3 = () => {
  const location = useLocation();
  const evento = location.state || {};  // Recuperar los datos del evento

  // Extraer datos del evento
  const {
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
  } = evento;

  const [tieneButacas, setTieneButacas] = useState(false);
  const [estado, setEstado] = useState("Standby");
  const [fechaHoraInicioEvento, setFechaInicioEvento] = useState("");
  const [fechaHoraFinEvento, setFechaFinEvento] = useState("");
  const [tienePreventa, setTienePreventa] = useState(false);
  const [diasAntesInicioPreventa, setDiasAntesInicioPreventa] = useState("");
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
  const [seccionPreventaBloqueada, setSeccionPreventaBloqueada] = useState(true);
  const [tienePreventaDias, setTienePreventaDias] = useState("");
  const [selectedOptionPreventaDias, setSelectedOptionPreventaDias] = useState(1);
  const [restricciones, setRestricciones] = useState([]);
  const [eventoId, setEventoId] = useState(null);
  const [errorMensaje, setErrorMensaje] = useState('');
  const [eventoData, setEventoData] = useState({});
  const [nuevaColumna, setNuevaColumna] = useState({  // Definir nuevaColumna
    titulo: "",
    tipo: "",
    descripcion: "",
    opciones: "",
    usuario: "",
  });

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
        })
        .catch((error) => console.error("Error fetching session:", error));
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetch(`${process.env.REACT_APP_BACK_URL}evento/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            const evento = data.evento;
            setEventoData(evento);
            setFechaInicioEvento(evento.fechaInicio || "");
            setFechaFinEvento(evento.fechaFin || "");
            setTieneButacas(evento.tieneButacas || false);
            setTienePreventa(evento.tienePreventa || false);
            setDiasAntesInicioPreventa(evento.diasAntesInicioPreventa || "");
            setHorasAntesInicioEvento(evento.horasAntesInicioEvento || "");
            setTodosLosDiasPreventa(evento.todosLosDiasPreventa || "");
            setCantidadPuestos(evento.cantidadPuestos || "");
            setTieneRepartidores(evento.tieneRepartidores || false);
            setCantidadRepartidores(evento.cantidadRepartidores || "");
            setCapacidadMaxima(evento.capacidadMaxima || "");
            setLinkVentaEntradas(evento.linkVentaEntradas || "");
            setRestricciones(evento.restricciones || []);
            setEventoId(evento._id);
          } else {
            toast.error("Error al cargar el evento");
          }
        })
        .catch((error) => {
          console.error("Error fetching event data:", error);
          toast.error("Error al cargar el evento");
        });
    }
  }, [id]);

  useEffect(() => {
    if (location.state && location.state.eventoId) {
      setEventoId(location.state.eventoId);
    }
  }, [location.state]);

  const agregarColumna = () => {
    if (!nuevaColumna.titulo.trim()) {
      toast.error("El título no puede estar vacío");
      return;
    }

    if (!nuevaColumna.descripcion.trim()) {
      toast.error("Descripción no puede estar vacía");
      return;
    }

    if (!nuevaColumna.tipo.trim()) {
      toast.error("El tipo no puede estar vacío");
      return;
    }

    if (nuevaColumna.tipo === "Select" && !nuevaColumna.opciones?.trim()) {
      toast.error("Opciones no puede estar vacío");
      return;
    }

    setRestricciones([...restricciones, nuevaColumna]);
    setNuevaColumna({
      titulo: "",
      tipo: "",
      descripcion: "",
      opciones: "",
      usuario: "",
    });
  };

  const eliminarFila = (indice) => {
    const nuevasRestricciones = [...restricciones];
    nuevasRestricciones.splice(indice, 1); // Elimina la restricción en el índice especificado
    setRestricciones(nuevasRestricciones);
  };

  const handleHorasAntesInicioEventoChange = (e) => {
    const nuevaFecha = e.target.value;
    setHorasAntesInicioEvento(nuevaFecha);

    // Convertir las fechas a objetos Date para comparar
    const fechaEvento = new Date(fechaHoraInicioEvento);
    const fechaPreventa = new Date(nuevaFecha);

    if (fechaPreventa >= fechaEvento) {
      setErrorMensaje('La fecha de inicio de la preventa debe ser anterior a la fecha de inicio del evento.');
    } else {
      setErrorMensaje(''); // Limpiar el mensaje de error si la validación es correcta
    }
  };

  const handleSiguienteClick = async (e) => {
    e.preventDefault();

    const now = new Date();
    const inicioEvento = new Date(fechaHoraInicioEvento);
    const finEvento = new Date(fechaHoraFinEvento);

    // Validaciones
    if (inicioEvento <= now) {
      toast.error("La fecha de inicio del evento debe ser posterior a la fecha actual.");
      return;
    }

    if (finEvento <= inicioEvento) {
      toast.error("La fecha de fin del evento debe ser posterior a la fecha de inicio.");
      return;
    }

    if (tienePreventa) {
      const diasAntesInicioPreventaMs = diasAntesInicioPreventa * 24 * 60 * 60 * 1000;
      const horasAntesInicioEventoMs = horasAntesInicioEvento * 60 * 60 * 1000;

      const preventaInicio = new Date(inicioEvento.getTime() - diasAntesInicioPreventaMs - horasAntesInicioEventoMs);
      if (preventaInicio >= inicioEvento) {
        toast.error("La fecha de inicio de la preventa debe ser anterior a la fecha de inicio del evento.");
        return;
      }
    }

    // Continuar con la lógica si todas las validaciones pasan...
    const eventoDatos = {
      fechaInicio: inicioEvento.toISOString(), // Esto se puede dejar así si quieres ISO
      fechaFin: finEvento.toISOString(), // Lo mismo
      tienePreventa,
      horasAntesInicioEvento,
      cantidadPuestos,
      restricciones,
      cantidadDiasEvento: Math.ceil((finEvento - inicioEvento) / (1000 * 60 * 60 * 24)),
    };

    localStorage.setItem('eventoDatos', JSON.stringify(eventoDatos));


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
        toast.success("Evento actualizado correctamente");
        navigate(`/registrar-evento4/${eventoDatos.cantidadDiasEvento}`, { state: { eventoId } });
      } else {
        toast.error(updateData.message || "Error al actualizar el evento");
      }
    } catch (error) {
      console.error("Error al actualizar el evento:", error);
      toast.error("Error al actualizar el evento");
    }
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

  const handleOptionClickPreventaDias = (option) => {
    setSelectedOptionPreventaDias(option);
    // Si es necesario, establece otras variables de estado aquí
  };

  const eliminarfila = (index) => {
    const nuevasRestricciones = restricciones.filter((_, i) => i !== index);
    setRestricciones(nuevasRestricciones);
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
                    type="datetime-local"
                    id="fechaInicioEvento"
                    className="form-input"
                    value={fechaHoraInicioEvento}
                    onChange={(e) => setFechaInicioEvento(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="fechaFinEvento" className="form-label">
                  Fecha Fin Evento*
                </label>
                <input
                  type="datetime-local"
                  id="fechaFinEvento"
                  className="form-input"
                  value={fechaHoraFinEvento}
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
                    <label htmlFor="horasAntesInicioEvento" className="form-label">
                      ¿Cuándo iniciará la preventa?*
                    </label>
                    <input
                      type="datetime-local"
                      id="horasAntesInicioEvento"
                      className="form-input"
                      value={horasAntesInicioEvento}
                      onChange={handleHorasAntesInicioEventoChange} // Usar la función de manejo de cambios
                    />
                    {errorMensaje && <div className="error-text">{errorMensaje}</div>} {/* Mostrar mensaje de error */}
                  </div>
                  <div className="form-group">
                    <label htmlFor="todosLosDiasPreventa" className="form-label">
                      ¿La preventa será todos los días?*
                    </label>
                    <div className="option-container-evento">
                      <div
                        className={`opcionesEvento ${selectedOptionPreventaDias === 1 ? 'selected' : ''}`}
                        onClick={() => handleOptionClickPreventaDias(1)}
                      >
                        Sí
                      </div>
                      <div
                        className="opcionesEvento disabled-option"
                      >
                        No
                      </div>
                    </div>
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
                    className={`opcionesEvento ${selectedOptionButacas === 2 ? 'selected' : ' '}`}
                    onClick={() => handleOptionClickButacas(2)}
                  >
                    No
                  </div>
                </div>
              </div>


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
              <div className="container-fluid">
                <br />
                <h4 className="tituloSeccion" style={{ color: "white" }}>
                  Restricciones personalizadas
                </h4>
                <form>
                  <div className="d-flex">
                    <div className="col-3 px-1">
                      <label style={{ color: "white" }}>Título</label>
                      <input
                        className="w-100 form-control"
                        style={{
                          backgroundColor: "transparent",
                          border: "1px solid yellow",
                        }}
                        list="restricciones-titulo"
                        value={nuevaColumna.titulo}
                        onChange={(e) =>
                          setNuevaColumna({
                            ...nuevaColumna,
                            titulo: e.target.value,
                          })
                        }
                      />
                    </div>
                    <br />
                    <div className="col-3 px-1">
                      <label style={{ color: "white" }}>Descripción</label>
                      <input
                        className="w-100 form-control"
                        style={{
                          backgroundColor: "transparent",
                          color: "black",
                          border: "1px solid yellow",
                        }}
                        value={nuevaColumna.descripcion}
                        onChange={(e) =>
                          setNuevaColumna({
                            ...nuevaColumna,
                            descripcion: e.target.value,
                          })
                        }
                      />
                      <datalist id="restricciones-titulo"></datalist>
                    </div>
                    <div className="col-2 px-1">
                      <label style={{ color: "white" }}>Tipo</label>
                      <select
                        className="w-100 form-control"
                        style={{
                          backgroundColor: "transparent",
                          color: "black",
                          border: "1px solid yellow",
                        }}
                        value={nuevaColumna.tipo}
                        onChange={(e) =>
                          setNuevaColumna({
                            ...nuevaColumna,
                            tipo: e.target.value,
                          })
                        }
                      >
                        <option value="">Selecciona un tipo</option>
                        <option value="PDF">PDF</option>
                        <option value="Cadena de texto">Cadena de texto</option>
                        <option value="Numerico">Numerico</option>
                        <option value="Imagen">Imagen</option>
                        <option value="Opciones">Opciones</option>
                      </select>
                    </div>

                    {/* Campo Opciones */}
                    {nuevaColumna.tipo === "Opciones" && (
                      <div className="col-2 px-1">
                        <label style={{ color: "white" }}>Opciones</label>
                        <input
                          className="w-100 form-control"
                          style={{
                            backgroundColor: "transparent",
                            color: "yellow",
                            border: "1px solid yellow",
                          }}
                          value={nuevaColumna.opciones}
                          onChange={(e) =>
                            setNuevaColumna({
                              ...nuevaColumna,
                              opciones: e.target.value,
                            })
                          }
                        />
                      </div>
                    )}

                    <div className="col-2 px-1">
                      <label style={{ color: "white" }}>Usuario</label>
                      <select
                        className="w-100 form-control"
                        style={{
                          backgroundColor: "transparent",
                          color: "black",
                          border: "1px solid yellow",
                        }}
                        value={nuevaColumna.usuario}
                        onChange={(e) =>
                          setNuevaColumna({
                            ...nuevaColumna,
                            usuario: e.target.value,
                          })
                        }
                      >
                        <option value="" disabled>
                          Selecciona un Usuario
                        </option>
                        <option value="Ambos">Ambos</option>
                        <option value="Repartidor">Repartidor</option>
                        <option value="Encargado de puesto">Encargado de puesto</option>
                      </select>
                    </div>
                  </div>
                  <div className="d-flex justify-content-end p-1">
                    <button
                      type="button"
                      className="btn btn-warning"
                      onClick={agregarColumna}
                    >
                      Agregar Restricción
                    </button>
                  </div>
                </form>
              </div>

            </form>

            {/* Mostrar tabla solo si hay restricciones */}
          {/* Mostrar tabla solo si hay restricciones */}
{restricciones.length > 0 && (
  <div className="d-flex justify-content-center align-content-center">
    <table className="w-100 mx-auto text-center table table-striped table-bordered" style={{ backgroundColor: 'grey', color: 'white', borderColor: 'black' }}>
      <thead>
        <tr style={{ backgroundColor: 'black' }}>
          <th style={{ color: 'black' }}>Título</th>
          <th style={{ color: 'black' }}>Tipo</th>
          <th style={{ color: 'black' }}>Descripción</th>
          <th style={{ color: 'black' }}>Opciones</th>
          <th style={{ color: 'black' }}>Usuario</th>
          <th style={{ color: 'black' }}>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {restricciones.map((restriccion, index) => (
          <tr key={index} style={{ backgroundColor: 'grey' }}>
            <td>{restriccion.titulo}</td>
            <td>{restriccion.tipo}</td>
            <td>{restriccion.descripcion}</td>
            <td>{restriccion.opciones}</td>
            <td>{restriccion.usuario}</td>
            <td>
              <button
                type="button"
                onClick={() => eliminarFila(index)}
                className="btn btn-danger"
                style={{ borderColor: 'black' }}
              >
                Eliminar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

            <hr />

          <div className="form-group">
            <button type="submit" className="btn btn-primary" onClick={handleSiguienteClick}>
              Siguiente
            </button>
          </div>
          </div>

        </div>
      </div >
    </div >
  );
};

export default RegistrarEvento3;
