import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Sidebar from "../ComponentesGenerales/Sidebar";
import { fileToBase64 } from "../ComponentesGenerales/Utils/base64";
import "./../sass/main.scss";

const RegistrarEvento2 = () => {
  const [nombre, setNombre] = useState("");
  const [imagenEvento, setImagenEvento] = useState(null);
  const [croquis, setCroquis] = useState(null);
  const [descripcion, setDescripcion] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [provincia, setProvincia] = useState("");
  const [tipoEvento, setTipoEvento] = useState("");
  const [tipoPago, setTipoPago] = useState("");
  const [provincias, setProvincias] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [localidades, setLocalidades] = useState([]);
  const [selectedLocalidad, setSelectedLocalidad] = useState("");
  const [selectedOptionEvento, setSelectedOptionEvento] = useState(null);
  const [selectedOptionPago, setSelectedOptionPago] = useState(null);
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const sessionId = localStorage.getItem("sessionId");

    if (sessionId) {
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

  const handleSiguienteClick = (e) => {
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
      tipoPago,
    };

    console.log(evento.tipoEvento)
    console.log(evento.tipoPago)

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

    /*if (!tipoEvento.trim()) {
      toast.error("Selecione el tipo de evento");
      return;
    }*/

    /*if (!tipoPago.trim()) {
      toast.error("Selecione tipo de pago");
      return;
    }*/

    navigate('/registrar-evento3');

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

  const handleOptionClickEvento = (e) => {
    setSelectedOptionEvento(e.target.value);
    setTipoEvento(e.target.value);
  };

  const handleOptionClickPago = (e) => {
    setSelectedOptionPago(e.target.value);
    setTipoPago(e.target.value);
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
      <div className="row formEvento">
        <div className="col-md-4 p-0 ">
          <Sidebar tipoUsuario={session?.tipoUsuario} />
        </div>
        <div className="col-md-6 p-0 ">
        <div className="dark-form-wrapper mx-auto">
          <form action="#" method="POST" className="row g-3">
            <h3 className="tituloSeccion">Datos del Evento</h3>
            <div className="col-md-12">
              <div className="form-group">
                <label htmlFor="text-input" className="form-label">
                  Nombre Del Evento*
                </label>
                <input
                  type="text"
                  id="nombre"
                  className="form-input"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>
            </div>

            <div className="col-md-12">
              <div className="form-group">
                <label htmlFor="text-area" className="form-label">
                  Descripcion Del Evento*
                </label>
                <textarea
                  id="text-area"
                  className="form-input"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  rows={1}
                  style={{ resize: 'none' }}
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="options" className="form-label">
                  Tipo de Evento*
                </label>
                <div className="option-container-evento">
                  <div
                    className={`opcionesEvento ${selectedOptionEvento === 1 ? 'selected' : ''}`}
                    onClick={() => handleOptionClickEvento(1)}
                  >
                    Cine
                  </div>
                  <div
                    className={`opcionesEvento ${selectedOptionEvento === 2 ? 'selected' : ''}`}
                    onClick={() => handleOptionClickEvento(2)}
                  >
                    Festival
                  </div>
                  <div
                    className={`opcionesEvento ${selectedOptionEvento === 3 ? 'selected' : ''}`}
                    onClick={() => handleOptionClickEvento(3)}
                  >
                    Deporte
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="options" className="form-label">
                  Tipo de Pago*
                </label>
                <div className="option-container-pago">
                  <div
                    className={`opcionesPago ${selectedOptionPago === 1 ? 'selected' : ''}`}
                    onClick={() => handleOptionClickPago(1)}
                  >
                    Pago
                  </div>
                  <div
                    className={`opcionesPago ${selectedOptionPago === 2 ? 'selected' : ''}`}
                    onClick={() => handleOptionClickPago(2)}
                  >
                    Gratuito
                  </div>
                </div>
              </div>
            </div>


            <div className="col-md-12">
              <div className="form-group">
                <label htmlFor="text-area" className="form-label">
                  Ubicacion Del Evento*
                </label>
                <input
                  id="nombre"
                  className="form-input"
                  value={ubicacion}
                  onChange={(e) => setUbicacion(e.target.value)}
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="logo-input" className="form-label">
                  Logo del Evento*
                </label>
                <input
                  type="file"
                  id="imagenEvento"
                  accept="image/*"
                  className="form-input logoSubida"
                  onChange={(e) => handleImagenEventoChange(e)}
                  required
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="croquis-input" className="form-label">
                  Croquis del Evento*
                </label>
                <input
                  type="file"
                  id="croquis"
                  accept="image/*"
                  className="form-input croquis"
                  onChange={(e) => handleCroquisChange(e)}
                  required
                />
              </div>
            </div>






            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="provincia-input" className="form-label">
                  Provincia*
                </label>
                <select
                  id="provincia"
                  data-testid="provincia"
                  className="form-input"
                  value={selectedProvince}
                  onChange={handleProvinceChange}
                  required
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
            </div>

            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="localidad-input" className="form-label">
                  Localidad*
                </label>
                <select
                  className="form-input"
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
            </div>








            <div className="col-12 d-flex justify-content-end">
              <button
                className="siguiente-button ms-auto"
                onClick={handleSiguienteClick}
                style={{ backgroundColor: '#tu-color-amarillo-QF', color: '#1a1a1a' }}
              >
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

export default RegistrarEvento2;
