import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Sidebar from "../ComponentesGenerales/Sidebar";
import "./../sass/main.scss";

const ConsultarPuestoSolicitud = () => {
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const [cargarDatos, setCargarDatos] = useState(null);
  const [carrito, setCarrito] = useState();
  const [editMode, setEditMode] = useState(false);
  const [numeroCarro, setNumeroCarro] = useState("");
  const [nombreCarro, setNombreCarro] = useState("");
  const [tipoNegocio, setTipoNegocio] = useState("");
  const [telefonoContacto, setTelefonoContacto] = useState("");
  const [razonSocial, setRazonSocial] = useState("");
  const [cuit, setCuit] = useState("");
  const [telefonoCarro, setTelefonoCarro] = useState("");
  const [pdfAfip, setPdfAfip] = useState(null);
  const [pdfCuil, setPdfCuil] = useState(null);
  const [pdfDNI, setPdfDNI] = useState(null);

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
    const puesto = {
      numeroCarro: numeroCarro,
      nombreCarro: nombreCarro,
      tipoNegocio: tipoNegocio,
      pdfAfip: pdfAfip,
      pdfCuil: pdfCuil,
      pdfDNI: pdfDNI,
      telefonoContacto: telefonoContacto,
      razonSocial: razonSocial,
      cuit: cuit,
      telefonoCarro: telefonoCarro,
      consumidorId: session.consumidorId,
    };
    fetch(`http://localhost:8000/puesto/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ puesto: puesto }),
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

        return fetch(`http://localhost:8000/puesto/consultar/${id}`, {
          method: "GET",
          headers: headers,
        });
      })
      .then((response) => response.json())
      .then((data) => {
        setCarrito(data.data);
        setNumeroCarro(data.data.numeroCarro);
        setNombreCarro(data.data.nombreCarro);
        setTipoNegocio(data.data.tipoNegocio);
        setTelefonoContacto(data.data.telefonoContacto);
        setRazonSocial(data.data.razonSocial);
        setCuit(data.data.cuit);
        setTelefonoCarro(data.data.telefonoCarro);
      })
      .catch((error) => console.error("Error:", error));
  }, [id]);

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

  return (
    <div className={`d-flex mainFormEventos`}>
      <div className="col-2 p-0">
        <Sidebar tipoUsuario={session?.tipoUsuario} />
      </div>
      <div className={`col-10`}>
      <div className="d-flex justify-content-center mb-3 tituloSeccion">
                    <h1 className="pt-2">Info Puesto</h1>
                  </div>
                  <hr style={{ color: "#F7B813" }} />

        <div className="d-flex align-items-center justify-content-center">

          <div className={`card-info`}>
            <div className={`card-body p-3 formulario-info`}>
              <form onSubmit={handleSaveChanges} className="needs-validation">
                <div className="row">
                  <div className="mb-3 col-md-6">
                    <label className="mb-2 text-qf " htmlFor="idCarro">
                      N° ID Carro
                    </label>
                    <input
                      type="number"
                      id="idCarro"
                      className="form-control"
                      value={numeroCarro}
                      onChange={(e) => setNumeroCarro(e.target.value)}
                      disabled={!editMode}
                      required
                    />
                  </div>
                  <div className="mb-3 col-md-6">
                    <label className="mb-2 text-qf" htmlFor="nombreCarro">
                      Nombre Carro
                    </label>
                    <input
                      type="text"
                      id="nombreCarro"
                      className="form-control"
                      value={nombreCarro}
                      onChange={(e) => setNombreCarro(e.target.value)}
                      disabled={!editMode}
                      required
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="mb-2 text-qf" htmlFor="tipoNegocio">
                    Tipo de Negocio
                  </label>
                  <select
                    id="tipoNegocio"
                    className="form-control"
                    value={tipoNegocio}
                    onChange={(e) => setTipoNegocio(e.target.value)}
                    disabled={!editMode}
                    required
                  >
                    <option value="" disabled>
                      Seleccione un tipo de negocio
                    </option>
                    <option value="Tipo de Negocio 1">Tipo de Negocio 1</option>
                    <option value="Tipo de Negocio 2">Tipo de Negocio 2</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="mb-2 text-qf" htmlFor="telefonoCarro">
                    Teléfono del Carro de Comida
                  </label>
                  <input
                    type="tel"
                    id="telefonoCarro"
                    className="form-control"
                    value={telefonoCarro}
                    onChange={(e) => setTelefonoCarro(e.target.value)}
                    disabled={!editMode}
                    required //To be implemented
                  />
                </div>
                <div className="mb-3">
                  <label className="mb-2 text-qf" htmlFor="pdfAfip">
                    Constancia de inscripción a AFIP (PDF)
                  </label>
                  <div className="d-flex align-items-center">
                    <p className="me-3 text-file">Constancia.pdf</p> {/* Nombre simulado */}
                    <button
                      className="btn btn-secondary"
                    >
                      Descargar
                    </button>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="mb-2 text-qf" htmlFor="pdfCuil">
                    Constancia de Inspección Bromatológica (PDF)
                  </label>
                  <div className="d-flex align-items-center">
                    <p className="me-3 text-file">Inspección.pdf</p> {/* Otro nombre simulado */}
                    <button
                      className="btn btn-secondary"
                    >
                      Descargar
                    </button>
                  </div>
                </div>

                <Link
                  to={`/listado-eventos-productor`}
                  className="btn btn-primary w-100 my-1"
                >
                  Volver
                </Link>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultarPuestoSolicitud;
