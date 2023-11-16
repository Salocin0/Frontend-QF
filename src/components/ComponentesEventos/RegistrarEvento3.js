import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Sidebar from "../ComponentesGenerales/Sidebar";
import "./../sass/main.scss";

const RegistrarEvento2 = () => {
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
  const [selectedOptionPreventa, setSelectedOptionPreventa] = useState(2);
  const [selectedOptionRepartidores, setSelectedOptionRepartidores] = useState(2);
  const [selectedOptionButacas, setSelectedOptionButacas] = useState(2);

  const { id } = useParams();
  const [session, setSession] = useState(null);
  const navigate = useNavigate();


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


  function tieneNumeros(cadena) {
    const pattern = /\d/;
    return pattern.test(cadena);
  }

  function tieneLetras(cadena) {
    const regex = /[a-zA-Z]/;
    return regex.test(cadena);
  }

  function calcularDiferenciaDias(fechaInicioEvento, fechaFinEvento) {
    const inicio = new Date(fechaInicioEvento);
    const fin = new Date(fechaFinEvento);
    const diferenciaTiempo = fin.getTime() - inicio.getTime();
    const diferenciaDias = diferenciaTiempo / (1000 * 3600 * 24);
    console.log(diferenciaDias);
    return diferenciaDias;
  };


  const handleSiguienteClick = (e) => {
    e.preventDefault();
    const diferenciaDiasEvento = calcularDiferenciaDias(fechaInicioEvento, fechaFinEvento);

    const evento = {

      fechaInicioEvento,
      fechaFinEvento,
      diferenciaDiasEvento,
      tienePreventa,
      fechaInicioPreventa,
      fechaFinPreventa,
      plazoCancelacionPreventa,
      cantidadPuestos,
      tieneRepartidores,
      cantidadRepartidores,
      capacidadMaxima,
      tieneButacas,
      tipoPago,

      linkVentaEntradas,
      estado,
    };

    if (!fechaInicioEvento.trim()) {
      toast.error("Selecione una fecha de inicio de evento");
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

    navigate(`/registrar-evento4/${diferenciaDiasEvento}`);


  };




  const handleOptionClickPreventa = (option) => {
    if (option === 1) {
      setTienePreventa(true);
      setSelectedOptionPreventa(option);
    } else {
      setTienePreventa(false);
      setSelectedOptionPreventa(option);
    }
  };


  const handleOptionClickRepartidores = (option) => {
    if (option === 1) {
      setSelectedOptionRepartidores(option);
      setTieneRepartidores(true);
    } else {
      setSelectedOptionRepartidores(option);
      setTieneRepartidores(false);
    }
  };

  const handleOptionClickButacas = (option) => {
    if (option === 1) {
      setSelectedOptionButacas(option);
      setTieneButacas(true);
    } else {
      setSelectedOptionButacas(option);
      setTieneButacas(false);
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
                    Fecha Inicio Evento*
                  </label>
                  <input
                    type="date"
                    id="fecha"
                    className="form-input"
                    value={fechaInicioEvento}
                    onChange={(e) => setFechaInicioEvento(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="text-input" className="form-label">
                  Fecha Fin Evento*
                </label>
                <input
                  type="date"
                  id="fecha"
                  className="form-input"
                  value={fechaFinEvento}
                  onChange={(e) => setFechaFinEvento(e.target.value)}
                />
              </div>

              <div className="form-group">
                    <label htmlFor="text-input" className="form-label">
                      Cantidad de Puestos de Comida*
                    </label>
                    <input
                      type="number"
                      id="fecha"
                      className="form-input"
                      value={cantidadPuestos}
                      onChange={(e) => setCantidadPuestos(e.target.value)}
                    />
                </div>

              <div className="form-group">
                <label htmlFor="options" className="form-label">
                  Preventa*
                </label>
                <div className="option-container-evento">
                  <div
                    className={`opcionesEvento ${selectedOptionPreventa === 1 ? 'selected' : ''}`}
                    onClick={() => handleOptionClickPreventa(1)}
                  >
                    Si
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
                <div>
                  <div className="form-group">
                    <label htmlFor="text-input" className="form-label">
                      Fecha Inicio Preventa*
                    </label>
                    <input
                      type="date"
                      id="fecha"
                      className="form-input"
                      value={fechaInicioPreventa}
                      onChange={(e) => setFechaInicioPreventa(e.target.value)}
                    />
                  </div>

                  <br></br>
                  <div className="form-group">
                    <label htmlFor="text-input" className="form-label">
                      Fecha Fin Preventa*
                    </label>
                    <input
                      type="date"
                      id="fecha"
                      className="form-input"
                      value={fechaFinPreventa}
                      onChange={(e) => setFechaFinPreventa(e.target.value)}
                    />
                  </div>

                  <br></br>

                  <div className="form-group">
                    <label htmlFor="text-input" className="form-label">
                      Plazo de cancelacion (Dias)*
                    </label>
                    <input
                      type="number"
                      id="fecha"
                      className="form-input"
                      value={plazoCancelacionPreventa}
                      onChange={(e) => setPlazoCancelacionPreventa(e.target.value)}
                    />
                  </div>
                </div>
              )}



              <div className="form-group">
                <label htmlFor="options" className="form-label">
                  Repartidores*
                </label>
                <div className="option-container-evento">
                  <div
                    className={`opcionesEvento ${selectedOptionRepartidores === 1 ? 'selected' : ''}`}
                    onClick={() => handleOptionClickRepartidores(1)}
                  >
                    Si
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
                <div>

                  <div className="form-group">
                    <label htmlFor="text-input" className="form-label">
                      Cantidad de Repartidores*
                    </label>
                    <input
                      type="number"
                      id="fecha"
                      className="form-input"
                      value={cantidadRepartidores}
                      onChange={(e) => setCantidadRepartidores(e.target.value)
                      }
                    />
                  </div>
                </div>
              )}


              <div className="form-group">
                <label htmlFor="options" className="form-label">
                  Butacas*
                </label>
                <div className="option-container-evento">
                  <div
                    className={`opcionesEvento ${selectedOptionButacas === 1 ? 'selected' : ''}`}
                    onClick={() => handleOptionClickButacas(1)}
                  >
                    Si
                  </div>
                  <div
                    className={`opcionesEvento ${selectedOptionButacas === 2 ? 'selected' : ''}`}
                    onClick={() => handleOptionClickButacas(2)}
                  >
                    No
                  </div>
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

      </div >
    </div >
  );




};

export default RegistrarEvento2;
