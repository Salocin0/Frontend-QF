import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "../ComponentesGenerales/Footer";
import Sidebar from "../ComponentesGenerales/Sidebar";
import { fileToBase64 } from "../ComponentesGenerales/Utils/base64";
import "./../sass/main.scss";

const RegistrarEvento = () => {
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

  const { id } = useParams();
  const [session, setSession] = useState(null);
  const navigate = useNavigate();

  const [provincias, setProvincias] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [localidades, setLocalidades] = useState([]);
  const [selectedLocalidad, setSelectedLocalidad] = useState("");

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

  function tieneNumeros(cadena) {
    return /\d/.test(cadena);
  }

  function tieneLetras(cadena) {
    const regex = /[a-zA-Z]/;
    return regex.test(cadena);
  }

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

  function tieneNumeros(cadena) {
    const pattern = /\d/;
    return pattern.test(cadena);
  }

  function tieneLetras(cadena) {
    const regex = /[a-zA-Z]/;
    return regex.test(cadena);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const evento = {
      nombre,
      descripcion,
      imagenEvento,
      croquis,
      ubicacion,
      localidad,
      provincia,
      tipoEvento,
      fechaInicioEvento,
      horaInicioEvento,
      fechaFinEvento,
      tienePreventa,
      fechaInicioPreventa,
      fechaFinPreventa,
      plazoCancelacionPreventa,
      tipoPreventa,
      cantidadPuestos,
      tieneRepartidores,
      cantidadRepartidores,
      capacidadMaxima,
      tieneButacas,
      tipoPago,
      linkVentaEntradas,
      estado,
    };

    if (!nombre.trim()) {
      toast.error("El nombre no puede estar vacio");
      return;
    }

    if (!descripcion.trim()) {
      toast.error("La descripcion no puede estar vacio");
      return;
    }

    /*if (!imagenEvento?.trim()) {
      toast.error("Suba un logo del evento");
      return;
    }

    if (!croquis?.trim()) {
      toast.error("Suba un croquis del evento");
      return;
    }*/

    if (!ubicacion.trim()) {
      toast.error("la ubicacion no puede estar vacia");
      return;
    }

    if (!localidad.trim()) {
      toast.error("Selecione una localidad");
      return;
    }

    if (!provincia.trim()) {
      toast.error("Selecione una provincia");
      return;
    }

    if (!tipoEvento.trim()) {
      toast.error("Selecione el tipo de evento");
      return;
    }

    if (!fechaInicioEvento.trim()) {
      toast.error("Selecione una fecha de inicio de evento");
      return;
    }

    if (!horaInicioEvento.trim()) {
      toast.error("Selecione una hora de inicio de evento");
      return;
    }

    if (!fechaFinEvento.trim()) {
      toast.error("Selecione una fecha de fin de evento");
      return;
    }

    if (!fechaInicioPreventa.trim() && tienePreventa) {
      toast.error("Selecione una fecha de inicio de preventa");
      return;
    }

    if (!fechaFinPreventa.trim() && tienePreventa) {
      toast.error("Selecione una fecha de fin de preventa");
      return;
    }

    if (!plazoCancelacionPreventa.trim() && tienePreventa) {
      toast.error("Ingrese el plazo de cancelacion de preventa");
      return;
    }

    if (!tipoPreventa.trim() && tienePreventa) {
      toast.error("Selecione tipo de preventa");
      return;
    }

    if (!cantidadPuestos.trim()) {
      toast.error("Ingrese cantidad de puestos");
      return;
    }

    if (!cantidadRepartidores.trim() && tieneRepartidores) {
      toast.error("Ingrese cantidad de repartidores");
      return;
    }

    if (!cantidadRepartidores.trim() && tieneRepartidores) {
      toast.error("Ingrese cantidad de repartidores");
      return;
    }

    if (!capacidadMaxima.trim()) {
      toast.error("Ingrese capacidad maxima");
      return;
    }

    if (!tipoPago.trim()) {
      toast.error("Selecione tipo de pago");
      return;
    }

    console.log(evento);
    const headers = new Headers();
    headers.append("ConsumidorId", session.consumidorId);
    headers.append("Content-Type", "application/json");

    fetch("http://localhost:8000/evento", {
      method: "POST",
      headers: headers,
      body: JSON.stringify(evento),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 200) {
          toast.success("Evento registrado correctamente");
          navigate(`/listado-eventos`);
        } else {
          toast.error("Error al registrar el evento");
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error("Error al registrar el evento");
      });
  };

  useEffect(() => {
    fetch("https://apis.datos.gob.ar/georef/api/provincias")
      .then((response) => response.json())
      .then((data) => {
        setProvincias(data.provincias);
      })
      .catch((error) => {
        console.error(error);
      });
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

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-2 p-0">
          <Sidebar tipoUsuario={session?.tipoUsuario} />
        </div>
        <div className={`col background`}>
          <div className="fondo">
            <div className="containerRegistrar d-flex justify-content-center align-items-center">
              <section
                className={`align-items-center col-6 form mt-3 mb-5 rad`}
              >
                <div className="cardRegistrar-body p-2 formularioRegistrar">
                  <div className={`card-body p-3 formulario`}>
                    <h1 className="fs-4 cardRegistrar-title fw-bold mb-4 text-black">
                      Registrar Evento
                    </h1>
                    <form onSubmit={handleSubmit} className="needs-validation">
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
                        />
                      </div>

                      <div className="mb-3">
                        <label
                          className="mb-2 text-black"
                          htmlFor="imagenEvento"
                        >
                          Imagen de evento
                        </label>
                        <input
                          type="file"
                          id="imagenEvento"
                          accept="image/*"
                          onChange={(e) => handleImagenEventoChange(e)}
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
                        />
                      </div>

                      <div className="mb-3">
                        <label
                          className="mb-2 text-black"
                          htmlFor="tienePreventa"
                        >
                          ¿Tiene preventa?
                        </label>
                        <input
                          type="checkbox"
                          id="tienePreventa"
                          checked={tienePreventa}
                          onChange={(e) => setTienePreventa(e.target.checked)}
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
                              onChange={(e) =>
                                setFechaInicioPreventa(e.target.value)
                              }
                              required
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
                              onChange={(e) =>
                                setFechaFinPreventa(e.target.value)
                              }
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
                            >
                              <option value={1}>Tipo 1</option>
                              <option value={2}>Tipo 2</option>
                              <option value={3}>Tipo 3</option>
                            </select>
                          </div>
                        </div>
                      )}

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
                        />
                      </div>

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
                          onChange={(e) =>
                            setTieneRepartidores(e.target.checked)
                          }
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
                            />
                          </div>
                        </div>
                      )}

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
                        />
                      </div>

                      <div className="mb-3">
                        <label
                          className="mb-2 text-black"
                          htmlFor="tieneButacas"
                        >
                          ¿Tiene Butacas?
                        </label>
                        <input
                          type="checkbox"
                          id="tieneButacas"
                          checked={tieneButacas}
                          onChange={(e) => setTieneButacas(e.target.checked)}
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
                        />
                      </div>

                      <div className="d-grid">
                        <button type="submit" className="btn btn-success">
                          Registrar
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
      <Footer className="footer" />
    </div>
  );
};

export default RegistrarEvento;
