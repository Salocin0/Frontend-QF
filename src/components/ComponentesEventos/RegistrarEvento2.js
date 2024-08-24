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
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
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
        })
        .catch((error) => console.error("Error fetching session:", error));
    }
  }, []);

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

  const handleSiguienteClick = async (e) => {
    e.preventDefault();

    if (!nombre.trim()) {
      toast.error("El nombre no puede estar vacío");
      return;
    }

    if (!descripcion.trim()) {
      toast.error("La descripción no puede estar vacía");
      return;
    }

    if (!ubicacion.trim()) {
      toast.error("La ubicación no puede estar vacía");
      return;
    }

    try {
      const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${ubicacion}&key=d429bb29929940e38622b06b1ad6c59b`);
      const data = await response.json();

      if (data.results.length > 0) {
        const result = data.results[0];
        const addressComponents = result.components;

        const prov = addressComponents.state;
        const loc = addressComponents.city || addressComponents.town || addressComponents.village;

        const lat = result.geometry.lat;
        const lng = result.geometry.lng;

        console.log(lat);
        console.log(lng);

        setProvincia(prov || '');
        setLocalidad(loc || '');

        const evento = {
          nombre,
          descripcion,
          imagenEvento,
          ubicacion,
          localidad: loc || selectedLocalidad,
          provincia: prov || selectedProvince,
          tipoEvento,
          tipoPago,
          latitud: lat,
          longitud: lng,
        };

        navigate("/registrar-evento3", { state: evento });
      } else {
        toast.error("No se pudo obtener información de la ubicación.");
      }
    } catch (error) {
      console.error("Error fetching location data:", error);
      toast.error("Error al obtener la información de la ubicación.");
    }
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

  const handleOptionClickEvento = (value) => {
    setSelectedOptionEvento(value);
    setTipoEvento(value);
  };

  const handleOptionClickPago = (value) => {
    setSelectedOptionPago(value);
    setTipoPago(value);
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

  const handleUbicacionChange = (e) => {
    const value = e.target.value;
    setUbicacion(value);

    if (value.length > 2) {
      fetch(`https://api.opencagedata.com/geocode/v1/json?q=${value}&key=d429bb29929940e38622b06b1ad6c59b`)
        .then((response) => response.json())
        .then((data) => {
          if (data.results) {
            setSuggestions(data.results.map(result => result.formatted));
            setShowSuggestions(true);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setUbicacion(suggestion);
    setSuggestions([]);
    setShowSuggestions(false);
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
                    Descripción Del Evento*
                  </label>
                  <textarea
                    id="text-area"
                    className="form-input"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    rows={1}
                    style={{ resize: "none" }}
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
                      className={`opcionesEvento ${selectedOptionEvento === 1 ? "selected" : ""}`}
                      onClick={() => handleOptionClickEvento(1)}
                    >
                      Cines
                    </div>
                    <div
                      className={`opcionesEvento ${selectedOptionEvento === 2 ? "selected" : ""}`}
                      onClick={() => handleOptionClickEvento(2)}
                    >
                      Festival
                    </div>
                    <div
                      className={`opcionesEvento ${selectedOptionEvento === 3 ? "selected" : ""}`}
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
                      className={`opcionesPago ${selectedOptionPago === 1 ? "selected" : ""}`}
                      onClick={() => handleOptionClickPago(1)}
                    >
                      Pago
                    </div>
                    <div
                      className={`opcionesPago ${selectedOptionPago === 2 ? "selected" : ""}`}
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
                    Ubicación Del Evento*
                  </label>
                  <input
                    id="ubicacion"
                    className="form-input"
                    value={ubicacion}
                    onChange={handleUbicacionChange}
                  />
                  {showSuggestions && (
                    <ul className="suggestions-list">
                      {suggestions.map((suggestion, index) => (
                        <li
                          key={index}
                          className="suggestion-item"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>


              <div className="col-md-12">
                <div className="form-group">
                  <label htmlFor="file-input" className="form-label">
                    Imagen del Evento
                  </label>
                  <input
                    type="file"
                    id="file-input"
                    accept="image/*"
                    onChange={handleImagenEventoChange}
                    className="form-input"
                  />
                </div>
              </div>



              <div className="col-md-12">
                <button type="button" className="btn btn-primary" onClick={handleSiguienteClick}>
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
