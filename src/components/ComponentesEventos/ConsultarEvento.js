import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "./../sass/main.scss";
import Footer from "../ComponentesGenerales/Footer";
import Sidebar from "../ComponentesGenerales/Sidebar";
import { fileToBase64 } from "../ComponentesGenerales/Utils/base64";

const ConsultarEvento = () => {
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const [cargarDatos, setCargarDatos] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [nombre, setNombre] = useState("");
  const [imagenEvento, setImagenEvento] = useState(null);
  const [croquis, setCroquis] = useState(null);
  const [descripcion, setDescripcion] = useState("");
  const [tieneButacas, setTieneButacas] = useState(false);
  const [estado, setEstado] = useState("Standby");
  const [ubicacion, setUbicacion] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [provincia, setProvincia] = useState("");
  const [tipoEvento, setTipoEvento] = useState("");
  const [fechaInicioEvento, setFechaInicioEvento] = useState("");
  const [horaInicioEvento, setHoraInicioEvento] = useState("");
  const [fechaFinEvento, setFechaFinEvento] = useState("");
  const [tienePreventa, setTienePreventa] = useState(false);
  const [fechaInicioPreventa, setFechaInicioPreventa] = useState("");
  const [fechaFinPreventa, setFechaFinPreventa] = useState("");
  const [plazoCancelacionPreventa, setPlazoCancelacionPreventa] = useState("");
  const [tipoPreventa, setTipoPreventa] = useState("");
  const [cantidadPuestos, setCantidadPuestos] = useState("");
  const [tieneRepartidores, setTieneRepartidores] = useState(false);
  const [cantidadRepartidores, setCantidadRepartidores] = useState("");
  const [capacidadMaxima, setCapacidadMaxima] = useState("");
  const [tipoPago, setTipoPago] = useState("");
  const [linkVentaEntradas, setLinkVentaEntradas] = useState("");
  const [evento, setEvento] = useState({});

  const [provincias, setProvincias] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [localidades, setLocalidades] = useState([]);
  const [selectedLocalidad, setSelectedLocalidad] = useState("");

  const [restriccionesdb, setRestriccionesdb] = useState([]);

  const [restriccionesEvento, setRestriccionesEvento] = useState([]);

  const [restricciones, setRestricciones] = useState([]);

  const [nuevaColumna, setNuevaColumna] = useState({
    titulo: "",
    tipo: "",
    opciones: "",
    usuario: "",
  });

  const navigate = useNavigate();

  const handleEditModeToggle = () => {
    setEditMode(!editMode);
  };

  const handleDelete = () => {
    const headers = new Headers();
    headers.append("ConsumidorId", session.consumidorId);

    fetch(`http://localhost:8000/puesto/${id}`, {
      method: "DELETE",
      headers: headers,
    })
      .then((response) => {
        if (response.ok) {
          // Si la respuesta es exitosa (código 200), mostramos un toast de éxito
          toast.success("Puesto deshabilitado correctamente");
          navigate(`/listado-puestos`); // Redireccionamos a la página de listado de puestos
        } else {
          // Si la respuesta tiene un código diferente a 200, mostramos un toast con el error
          response.json().then((errorData) => {
            const errorMessage = errorData.message || "Ha ocurrido un error";
            toast.error(errorMessage);
          });
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  const handleSaveChanges = (e) => {
    e.preventDefault();
    const nuevoEvento = {
      nombre: nombre,
      descripcion: descripcion,
      img: imagenEvento,
      croquis: croquis,
      ubicacion: ubicacion,
      localidad: localidad,
      provincia: provincia,
      tipoEvento: tipoEvento,
      fechaInicio: fechaInicioEvento,
      horaInicio: horaInicioEvento,
      fechaFin: fechaFinEvento,
      conPreventa: tienePreventa,
      fechaInicioPreventa: fechaInicioPreventa,
      fechaFinPreventa: fechaFinPreventa,
      plazoCancelacionPreventa: plazoCancelacionPreventa,
      tipoPreventa: tipoPreventa,
      cantidadPuestos: cantidadPuestos,
      conRepartidor: tieneRepartidores,
      cantidadRepartidores: cantidadRepartidores,
      capacidadMaxima: capacidadMaxima,
      tipoPago: tipoPago,
      linkVentaEntradas: linkVentaEntradas,
      conButaca: tieneButacas,
      habilitado: true,
      estado: estado,
      restricciones: restriccionesEvento,
      consumidorId: session.consumidorId,
    };
    console.log(evento);
    // Realizar la solicitud HTTP para enviar los datos al servidor
    fetch(`http://localhost:8000/evento/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ evento: nuevoEvento }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Manejo de la respuesta del servidor
        console.log(data);
        // Mostrar mensaje de éxito
        toast.success("Cambios guardados correctamente");
        // Desactivar el modo de edición
        setEditMode(false);
      })
      .catch((error) => {
        // Manejo de errores
        console.error(error);
        toast.error("Error al guardar los cambios");
      });
  };

  useEffect(() => {
    const sessionId = localStorage.getItem("sessionId");

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

        const headers = new Headers();
        headers.append("ConsumidorId", data.data.consumidorId);

        return fetch(`http://localhost:8000/evento/${id}`, {
          method: "GET",
          headers: headers,
        });
      })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.data);
        setEvento(data.data);
        setNombre(data.data.nombre);
        setDescripcion(data.data.descripcion);
        setImagenEvento(data.data.img);
        setCroquis(data.data.croquis);
        setUbicacion(data.data.ubicacion);
        setLocalidad(data.data.localidad);
        setProvincia(data.data.provincia);
        setTipoEvento(data.data.tipoEvento);
        setFechaInicioEvento(data.data.fechaInicioEvento);
        setHoraInicioEvento(data.data.horaInicioEvento);
        setFechaFinEvento(data.data.fechafinevento);
        setTienePreventa(data.data.conPreventa);
        setFechaInicioPreventa(data.data.fechaInicioPreventa);
        setFechaFinPreventa(data.data.fechaFinPreventa);
        setPlazoCancelacionPreventa(data.data.plazoCancelacionPreventa);
        setTipoPreventa(data.data.tipoPreventa);
        setCantidadPuestos(data.data.cantidadPuestos);
        setTieneRepartidores(data.data.tieneRepartidores);
        setCantidadRepartidores(data.data.cantidadRepartidores);
        setCapacidadMaxima(data.data.capacidadMaxima);
        setTipoPago(data.data.tipoPago);
        setLinkVentaEntradas(data.data.linkVentaEntradas);
        setEstado(data.data.estado);
      })
      .catch((error) => console.error("Error:", error));
  }, [id]);

  const handleImagenEventoChange = (e) => {
    const file = e.target.files[0];

    fileToBase64(file, (base64) => {
      setImagenEvento(base64);
    });
  };

  const handleCroquisChange = (e) => {
    const file = e.target.files[0];

    fileToBase64(file, (base64) => {
      setCroquis(base64);
    });
  };

  useEffect(() => {
    const sessionId = localStorage.getItem("sessionId");

    if (sessionId) {
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
          console.log(data.data);
        })
        .catch((error) => console.error("Error fetching session:", error));
    }
  }, []);

  const handleLocalidadChange = (e) => {
    setSelectedLocalidad(e.target.value);
    setLocalidad(e.target.value);
  };

  const handleProvinceChange = (e) => {
    setSelectedProvince(e.target.value);
    setProvincia(e.target.value);
    if (e.target.value !== "") {
      fetch(
        `https://apis.datos.gob.ar/georef/api/municipios?provincia=${e.target.value}&campos=id,nombre&max=700`
      )
        .then((response) => response.json())
        .then((data) => {
          const sortedLocalidades = data.municipios.sort((a, b) =>
            a.nombre.localeCompare(b.nombre)
          );
          setLocalidades(sortedLocalidades);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      setLocalidades([]);
    }
  };

  const agregarColumna = () => {
    setRestriccionesEvento([...restriccionesEvento, nuevaColumna]);
    setNuevaColumna({
      titulo: "",
      tipo: "",
      opciones: "",
      usuario: "",
    });
  };

  const eliminarfila = (indice) => {
    if (restriccionesEvento[indice].id !== "undefined") {
      const headers = new Headers();
      headers.append("ConsumidorId", session?.consumidorId);
      headers.append("Content-Type", "application/json");
      fetch(
        `http://localhost:8000/restriccion/${restriccionesEvento[indice].id}`,
        {
          method: "DELETE",
          headers: headers,
        }
      )
        .then((response) => response.json())
        .then((data) => {
          const nuevasRestricciones = [...restriccionesEvento];
          nuevasRestricciones.splice(indice, 1);
          setRestriccionesEvento(nuevasRestricciones);
        })
        .catch((error) => {
          console.error(error);
          toast.error("Error al registrar el evento");
        });
    }
  };

  useEffect(() => {
    const headers = new Headers();
    headers.append("ConsumidorId", session?.consumidorId);
    headers.append("Content-Type", "application/json");

    fetch("http://localhost:8000/restriccion", {
      method: "GET",
      headers: headers,
    })
      .then((response) => response.json())
      .then((data) => {
        setRestriccionesdb(data.data);
      })
      .catch((error) => {
        console.error(error);
        toast.error("Error al registrar el evento");
      });
  }, [session]);

  useEffect(() => {
    fetch(`http://localhost:8000/restriccion/evento/${id}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        setRestriccionesEvento(data.data);
      })
      .catch((error) => {
        console.error(error);
        toast.error("Error al registrar el evento");
      });
  }, [id]);

  return (
    <div className={`d-flex background`}>
      <div className="col-2">
        <Sidebar tipoUsuario={session?.tipoUsuario} />
      </div>
      <div className={`flex-grow-1`}>
        <section
          className={`align-items-center justify-content-center col-6 offset-3 form mt-3 mb-5 rad`}
        >
          <div className={`card shadow-lg`}>
            <div className={`card-body p-3 formulario`}>
              <h1 className="fs-5 card-title fw-bold mb-2 text-dark">
                Consultar Puesto
              </h1>
              <form onSubmit={handleSaveChanges} className="needs-validation">
                <div className="mb-3">
                  <label className="mb-2 text-black" htmlFor="nombre">
                    Nombre del Evento
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    className="form-control"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    disabled={!editMode}
                  />
                </div>

                <div className="mb-3">
                  <label className="mb-2 text-black" htmlFor="nombre">
                    Descripcion
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    className="form-control"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    disabled={!editMode}
                  />
                </div>

                <div className="mb-3">
                  <label className="mb-2 text-black" htmlFor="imagenEvento">
                    Imagen de evento
                  </label>
                  <input
                    type="file"
                    id="imagenEvento"
                    accept="image/*"
                    onChange={(e) => handleImagenEventoChange(e)}
                    disabled={!editMode}
                  />
                </div>

                <div className="mb-3">
                  <label className="mb-2 text-black" htmlFor="croquis">
                    Croquis
                  </label>
                  <input
                    type="file"
                    id="croquis"
                    accept="image/*"
                    onChange={(e) => handleCroquisChange(e)}
                    disabled={!editMode}
                  />
                </div>

                <div className="mb-3">
                  <label className="mb-2 text-black" htmlFor="provincia">
                    Provincia
                  </label>
                  <select
                    id="provincia"
                    name="provincia"
                    data-testid="provincia"
                    className={` form-control`}
                    value={selectedProvince}
                    onChange={handleProvinceChange}
                    disabled={!editMode}
                  >
                    <option value="" disabled>
                      Seleccione una provincia
                    </option>
                    {provincias.map((prov) => (
                      <option key={prov.nombre} value={prov.nombre}>
                        {prov.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="mb-2 text-black" htmlFor="localidad">
                    Localidad
                  </label>
                  <select
                    className={`form-control`}
                    value={selectedLocalidad}
                    onChange={handleLocalidadChange}
                    data-testid="localidad"
                    id="localidad"
                    name="localidad"
                    disabled={!editMode}
                  >
                    <option value="" disabled>
                      Seleccione una localidad
                    </option>
                    {localidades.map((loc) => (
                      <option key={loc.nombre} value={loc.nombre}>
                        {loc.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="mb-2 text-black" htmlFor="nombre">
                    ubicacion
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    className="form-control"
                    value={ubicacion}
                    onChange={(e) => setUbicacion(e.target.value)}
                    disabled={!editMode}
                  />
                </div>

                <div className="mb-3">
                  <label className="mb-2 text-black" htmlFor="estado">
                    Tipo Evento
                  </label>
                  <select
                    id="estado"
                    className="form-select"
                    value={tipoEvento}
                    onChange={(e) => setTipoEvento(e.target.value)}
                    disabled={!editMode}
                  >
                    <option value={1}>Cine</option>
                    <option value={2}>Festival</option>
                    <option value={3}>Deporte</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="mb-2 text-black" htmlFor="fecha">
                    Fecha inicio evento
                  </label>
                  <input
                    type="date"
                    id="fecha"
                    className="form-control"
                    value={fechaInicioEvento}
                    onChange={(e) => setFechaInicioEvento(e.target.value)}
                    disabled={!editMode}
                  />
                </div>

                <div className="mb-3">
                  <label className="mb-2 text-black" htmlFor="hora">
                    Hora inicio evento
                  </label>
                  <input
                    type="time"
                    id="hora"
                    className="form-control"
                    value={horaInicioEvento}
                    onChange={(e) => setHoraInicioEvento(e.target.value)}
                    disabled={!editMode}
                  />
                </div>

                <div className="mb-3">
                  <label className="mb-2 text-black" htmlFor="fecha">
                    Fecha fin evento
                  </label>
                  <input
                    type="date"
                    id="fecha"
                    className="form-control"
                    value={fechaFinEvento}
                    onChange={(e) => setFechaFinEvento(e.target.value)}
                    disabled={!editMode}
                  />
                </div>

                <div className="mb-3">
                  <label className="mb-2 text-black" htmlFor="nombre">
                    Cantidad Puestos
                  </label>
                  <input
                    type="number"
                    id="nombre"
                    className="form-control"
                    value={cantidadPuestos}
                    onChange={(e) => setCantidadPuestos(e.target.value)}
                    disabled={!editMode}
                  />
                </div>

                <div className="mb-3">
                  <label className="mb-2 text-black" htmlFor="nombre">
                    Capacidad maxima
                  </label>
                  <input
                    type="number"
                    id="nombre"
                    className="form-control"
                    value={capacidadMaxima}
                    onChange={(e) => setCapacidadMaxima(e.target.value)}
                    disabled={!editMode}
                  />
                </div>

                <div className="mb-3">
                  <label className="mb-2 text-black" htmlFor="estado">
                    Tipo Pago
                  </label>
                  <select
                    id="estado"
                    className="form-select"
                    value={tipoPago}
                    onChange={(e) => setTipoPago(e.target.value)}
                    disabled={!editMode}
                  >
                    <option value={1}>Pago</option>
                    <option value={2}>Gratuito</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="mb-2 text-black" htmlFor="nombre">
                    link Venta Entradas
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    className="form-control"
                    value={linkVentaEntradas}
                    onChange={(e) => setLinkVentaEntradas(e.target.value)}
                    disabled={!editMode}
                  />
                </div>

                <hr />
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
                        disabled={!editMode}
                      />
                      <datalist id="restricciones-titulo">
                        {restriccionesdb.map((restriccion, index) => (
                          <option key={index} value={restriccion.titulo} />
                        ))}
                      </datalist>
                    </div>

                    <div className="col-3 px-1">
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
                        <option value="PDF">PDF</option>
                        <option value="Cadena de texto">Cadena de texto</option>
                        <option value="Numerico">Numerico</option>
                        <option value="Imagen">Imagen</option>
                        <option value="Opciones">Opciones</option>
                      </select>
                    </div>

                    <div className="col-3 px-1">
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
                        disabled={!editMode}
                      />
                      <datalist id="restricciones-opciones">
                        {restriccionesdb.map((restriccion, index) => (
                          <option key={index} value={restriccion.opciones} />
                        ))}
                      </datalist>
                    </div>

                    <div className="col-3 px-1">
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
                      disabled={!editMode}
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
                        <th>Opciones</th>
                        <th>Usuario</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {restriccionesEvento.map((restriccion, index) => (
                        <tr key={index}>
                          <td>{restriccion.titulo}</td>
                          <td>{restriccion.tipo}</td>
                          <td>{restriccion.opciones}</td>
                          <td>{restriccion.usuario}</td>
                          <td>
                            <button
                              type="button"
                              onClick={() => eliminarfila(index)}
                              className="btn btn-danger"
                              disabled={!editMode}
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

                <div className="mb-3">
                  <label className="mb-2 text-black" htmlFor="tienePreventa">
                    ¿Tiene preventa?
                  </label>
                  <input
                    type="checkbox"
                    id="tienePreventa"
                    checked={tienePreventa}
                    onChange={(e) => setTienePreventa(e.target.checked)}
                    disabled={!editMode}
                  />
                </div>
                {tienePreventa && (
                  <div>
                    <div className="mb-3">
                      <label className="mb-2 text-black" htmlFor="fecha">
                        Fecha inicio preventa
                      </label>
                      <input
                        type="date"
                        id="fecha"
                        className="form-control"
                        value={fechaInicioPreventa}
                        onChange={(e) => setFechaInicioPreventa(e.target.value)}
                        disabled={!editMode}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="mb-2 text-black" htmlFor="fecha">
                        Fecha fin preventa
                      </label>
                      <input
                        type="date"
                        id="fecha"
                        className="form-control"
                        value={fechaFinPreventa}
                        onChange={(e) => setFechaFinPreventa(e.target.value)}
                        disabled={!editMode}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="mb-2 text-black" htmlFor="nombre">
                        plazo cancelacion preventa
                      </label>
                      <input
                        type="number"
                        id="nombre"
                        className="form-control"
                        value={plazoCancelacionPreventa}
                        onChange={(e) =>
                          setPlazoCancelacionPreventa(e.target.value)
                        }
                        disabled={!editMode}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="mb-2 text-black" htmlFor="estado">
                        Tipo Preventa
                      </label>
                      <select
                        id="estado"
                        className="form-select"
                        value={tipoPreventa}
                        onChange={(e) => setTipoPreventa(e.target.value)}
                        disabled={!editMode}
                      >
                        <option value={1}>Tipo 1</option>
                        <option value={2}>Tipo 2</option>
                        <option value={3}>Tipo 3</option>
                      </select>
                    </div>
                  </div>
                )}

                <div className="mb-3">
                  <label
                    className="mb-2 text-black"
                    htmlFor="tieneRepartidores"
                  >
                    ¿Tiene Repartidores?
                  </label>
                  <input
                    type="checkbox"
                    id="tieneRepartidores"
                    checked={tieneRepartidores}
                    onChange={(e) => setTieneRepartidores(e.target.checked)}
                    disabled={!editMode}
                  />
                </div>
                {tieneRepartidores && (
                  <div>
                    <div className="mb-3">
                      <label className="mb-2 text-black" htmlFor="nombre">
                        Cantidad repartidores
                      </label>
                      <input
                        type="number"
                        id="nombre"
                        className="form-control"
                        value={cantidadRepartidores}
                        onChange={(e) =>
                          setCantidadRepartidores(e.target.value)
                        }
                        disabled={!editMode}
                      />
                    </div>
                  </div>
                )}

                <div className="mb-3">
                  <label className="mb-2 text-black" htmlFor="tieneButacas">
                    ¿Tiene Butacas?
                  </label>
                  <input
                    type="checkbox"
                    id="tieneButacas"
                    checked={tieneButacas}
                    onChange={(e) => setTieneButacas(e.target.checked)}
                    disabled={!editMode}
                  />
                </div>

                <div className="d-grid">
                  {!editMode && (
                    <button
                      type="button"
                      className="btn btn-primary my-1"
                      onClick={handleEditModeToggle}
                    >
                      Editar
                    </button>
                  )}
                  {editMode && (
                    <button type="submit" className="btn btn-success my-1">
                      Guardar Cambios
                    </button>
                  )}
                </div>
                <Link
                  to={`/listado-eventos`}
                  className="btn btn-primary w-100 my-1"
                >
                  Volver
                </Link>
              </form>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </div>
  );
};

export default ConsultarEvento;
