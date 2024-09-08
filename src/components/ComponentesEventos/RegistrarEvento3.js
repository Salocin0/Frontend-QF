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
  const [fechaHoraInicioEvento, setFechaInicioEvento] = useState("");
  const [fechaHoraFinEvento, setFechaFinEvento] = useState("");
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
  const [tienePreventaDias, setTienePreventaDias] = useState("");
  const [selectedOptionPreventaDias, setSelectedOptionPreventaDias] = useState(1);
  const [restricciones, setRestricciones] = useState([]);
  const [eventoId, setEventoId] = useState(null);

  console.log("Evento ID recibido:", eventoId);

  const [nuevaColumna, setNuevaColumna] = useState({
    titulo: "",
    tipo: "",
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
          console.log(data.data);
        })
        .catch((error) => console.error("Error fetching session:", error));
    }
  }, []);


useEffect(() => {
  if (location.state && location.state.eventoId) {
    setEventoId(location.state.eventoId);
  }
}, [location.state]);

  function calcularDiferenciaDias(fechaInicioEvento, fechaFinEvento) {
    const inicio = new Date(fechaInicioEvento);
    const fin = new Date(fechaFinEvento);
    const diferenciaTiempo = fin.getTime() - inicio.getTime();
    const diferenciaDias = diferenciaTiempo / (1000 * 3600 * 24);
    console.log(diferenciaDias);
    return diferenciaDias;
  }

  const agregarColumna = () => {
    if (!nuevaColumna.titulo.trim()) {
      toast.error("El titulo no puede estar vacio");
      return;
    }

        if (!nuevaColumna.descripcion.trim()) {
      toast.error("Descripcion no puede estar vacio");
      return;
    }

    if (!nuevaColumna.tipo.trim()) {
      toast.error("El tipo no puede estar vacio");
      return;
    }

    if (nuevaColumna.tipo === "Select" && !nuevaColumna.opciones?.trim()) {
      toast.error("Opciones no puede estar vacio");
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

  const eliminarfila = (indice) => {
    const nuevasRestricciones = [...restricciones];
    nuevasRestricciones.splice(indice, 1); // Elimina la restricción en el índice especificado
    setRestricciones(nuevasRestricciones);
  };

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


  const handleSiguienteClick = async (e) => {
    e.preventDefault();

    // Validaciones
    if (!fechaHoraInicioEvento.trim() || !fechaHoraFinEvento.trim()) {
      toast.error("Seleccione fecha y hora de inicio y fin del evento");
      return;
    }

    if (!eventoId) {
      toast.error("ID del evento no encontrado");
      return;
    }

    // Convertir fechas a formato ISO
    const fechaInicioEvento = new Date(fechaHoraInicioEvento).toISOString();
    const fechaFinEvento = new Date(fechaHoraFinEvento).toISOString();

    // Calcular diferencia en días
    const diferenciaDiasEvento = Math.ceil((new Date(fechaFinEvento) - new Date(fechaInicioEvento)) / (1000 * 60 * 60 * 24));

    // Crear el objeto evento con los datos necesarios
    const eventoDatos = {
      fechaInicio: fechaInicioEvento,
      fechaFin: fechaFinEvento,
      tienePreventa,
      horasAntesInicioEvento,
      cantidadPuestos,
      restricciones,
      // Incluye otros campos si es necesario
    };

    console.log(eventoDatos);
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
        navigate(`/registrar-evento4/${diferenciaDiasEvento}`, { state: { eventoId } });
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
    setTienePreventaDias(option === 1);
    setSelectedOptionPreventaDias(option);
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
                      ¿Cuando inciará la preventa?*
                    </label>
                    <input
                      type="datetime-local"
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
                  Capacidad Máxima (VER SI LO DEJAMOS POR DATA)
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

              <h4>Restricciones personalizadas</h4>
                      <form>
                        <div className="d-flex">
                          <div className="col-3 px-1">
                            <label style={{ color: "black" }}>Título</label>
                            <input
                              className="w-100 form-control"
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
                          <div className="col-3 px-1">
                            <label style={{ color: "black" }}>Descripcion</label>
                            <input
                              className="w-100 form-control"
                              list="restricciones-titulo"
                              value={nuevaColumna.descripcion}
                              onChange={(e) =>
                                setNuevaColumna({
                                  ...nuevaColumna,
                                  descripcion: e.target.value,
                                })
                              }
                            />
                            <datalist id="restricciones-titulo">

                            </datalist>
                          </div>
                          <br/>
                          <div className="col-2 px-1">
                            <label style={{ color: "black" }}>Tipo</label>
                            <select
                              name=""
                              id=""
                              className="w-100 form-control"
                              value={nuevaColumna.tipo}
                              onChange={(e) =>
                                setNuevaColumna({
                                  ...nuevaColumna,
                                  tipo: e.target.value,
                                })
                              }
                            >
                              <option value="" disabled selected>
                                Selecciona un tipo
                              </option>
                              <option value="PDF">PDF</option>
                              <option value="Cadena de texto">
                                Cadena de texto
                              </option>
                              <option value="Numerico">Numerico</option>
                              <option value="Imagen">Imagen</option>
                              <option value="Opciones">Opciones</option>
                            </select>
                          </div>

                          <div className="col-2 px-1">
                            <label style={{ color: "black" }}>Opciones</label>
                            <input
                              className="w-100 form-control"
                              list="restricciones-opciones"
                              value={nuevaColumna.opciones}
                              onChange={(e) =>
                                setNuevaColumna({
                                  ...nuevaColumna,
                                  opciones: e.target.value,
                                })
                              }
                            />

                          </div>

                          <div className="col-2 px-1">
                            <label style={{ color: "black" }}>Usuario</label>
                            <select
                              name=""
                              id=""
                              className="w-100 form-control"
                              value={nuevaColumna.usuario}
                              onChange={(e) =>
                                setNuevaColumna({
                                  ...nuevaColumna,
                                  usuario: e.target.value,
                                })
                              }
                            >
                              <option value="" disabled selected>
                                Selecciona un Usuario
                              </option>
                              <option value="Ambos">Ambos</option>
                              <option value="Repartidor">Repartidor</option>
                              <option value="Encargado de puesto">
                                Encargado de puesto
                              </option>
                            </select>
                          </div>
                        </div>
                        <div className="d-flex justify-content-end p-1">
                          <button
                            type="button"
                            className="btn btn-success"
                            onClick={agregarColumna}
                          >
                            Agregar Restriccion
                          </button>
                        </div>
                      </form>
                      <div className="d-flex justify-content-center aling-content-center">
                        <table className="w-100 mx-auto text-center table table-striped table-bordered">
                          <thead>
                            <tr>
                              <th>Título</th>
                              <th>Tipo</th>
                              <th>Descripcion</th>

                              <th>Opciones</th>
                              <th>Usuario</th>
                              <th>Acciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {restricciones.map((restriccion, index) => (
                              <tr key={index}>
                                <td>{restriccion.titulo}</td>
                                <td>{restriccion.tipo}</td>
                                <td>{restriccion.descripcion}</td>

                                <td>{restriccion.opciones}</td>
                                <td>{restriccion.usuario}</td>
                                <td>
                                  <button
                                    type="button"
                                    onClick={() => eliminarfila(index)}
                                    className="btn btn-danger"
                                  >
                                    Eliminar
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <hr />


              <div className="form-group">
                <button type="submit" className="btn btn-primary" onClick={handleSiguienteClick}>
                  Siguiente
                </button>
              </div>
            </form>
          </div>
        </div >
      </div >
    </div >
  );
};

export default RegistrarEvento3;
