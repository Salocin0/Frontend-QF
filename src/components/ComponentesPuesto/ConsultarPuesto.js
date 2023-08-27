import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "../ComponentesGenerales/Footer";
import Sidebar from "../ComponentesGenerales/Sidebar";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

const ConsultarPuesto = () => {
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
    // Aquí puedes realizar las validaciones y el envío de datos al servidor
    // según tu lógica de manejo de formularios y almacenamiento de archivos.
    // Ejemplo:
    const formData = new FormData();
    formData.append("numeroCarro", numeroCarro);
    formData.append("nombreCarro", nombreCarro);
    formData.append("tipoNegocio", tipoNegocio);
    formData.append("pdfAfip", pdfAfip);
    formData.append("pdfCuil", pdfCuil);
    formData.append("pdfDNI", pdfDNI);

    // Realizar la solicitud HTTP para enviar los datos al servidor
    fetch("URL_DEL_ENDPOINT", {
      method: "POST",
      body: formData,
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
  
        return fetch(`http://localhost:8000/puesto/${id}`, {
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
  

  return (
    <>
      <div className="d-flex">
        <div className="col-2">
          <Sidebar />
        </div>
        <div className="flex-grow-1 background">
          <section className="align-items-center justify-content-center col-6 offset-3 form">
            <div className="card shadow-lg">
              <div className="card-body p-3 formulario">
                <h1 className="fs-5 card-title fw-bold mb-2 text-dark">
                  Consultar Puesto
                </h1>
                <form onSubmit={handleSaveChanges} className="needs-validation">
                  <div className="row">
                    <div className="mb-3 col-md-6">
                      <label className="mb-2 text-dark" htmlFor="idCarro">
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
                      <label className="mb-2 text-dark" htmlFor="nombreCarro">
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
                    <label className="mb-2 text-dark" htmlFor="tipoNegocio">
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
                      <option value="Tipo de Negocio 1">
                        Tipo de Negocio 1
                      </option>
                      <option value="Tipo de Negocio 2">
                        Tipo de Negocio 2
                      </option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label
                      className="mb-2 text-dark"
                      htmlFor="telefonoContacto"
                    >
                      Teléfono de Contacto
                    </label>
                    <input
                      type="tel"
                      id="telefonoContacto"
                      className="form-control"
                      value={telefonoContacto}
                      onChange={(e) => setTelefonoContacto(e.target.value)}
                      disabled={!editMode}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="mb-2 text-dark" htmlFor="razonSocial">
                      Razón Social
                    </label>
                    <input
                      type="text"
                      id="razonSocial"
                      className="form-control"
                      value={razonSocial}
                      onChange={(e) => setRazonSocial(e.target.value)}
                      disabled={!editMode}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="mb-2 text-dark" htmlFor="cuit">
                      CUIT
                    </label>
                    <input
                      type="text"
                      id="cuit"
                      className="form-control"
                      value={cuit}
                      onChange={(e) => setCuit(e.target.value)}
                      disabled={!editMode}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="mb-2 text-dark" htmlFor="telefonoCarro">
                      Teléfono del Carro de Comida
                    </label>
                    <input
                      type="tel"
                      id="telefonoCarro"
                      className="form-control"
                      value={telefonoCarro}
                      onChange={(e) => setTelefonoCarro(e.target.value)}
                      disabled={!editMode}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="mb-2 text-dark" htmlFor="pdfAfip">
                      Constancia de inscripción a AFIP (PDF)
                    </label>
                    <input
                      type="file"
                      id="pdfAfip"
                      className="form-control"
                      onChange={(e) => setPdfAfip(e.target.files[0])}
                      disabled={!editMode}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="mb-2 text-dark" htmlFor="pdfCuil">
                      Constancia de CUIL (PDF)
                    </label>
                    <input
                      type="file"
                      id="pdfCuil"
                      className="form-control"
                      onChange={(e) => setPdfCuil(e.target.files[0])}
                      disabled={!editMode}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="mb-2 text-dark" htmlFor="pdfDNI">
                      DNI (PDF)
                    </label>
                    <input
                      type="file"
                      id="pdfDNI"
                      className="form-control"
                      onChange={(e) => setPdfDNI(e.target.files[0])}
                      disabled={!editMode}
                      required
                    />
                  </div>
                  <div className="d-grid">
                    {!editMode && (
                      <>
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={handleEditModeToggle}
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger deshabilitar"
                          onClick={handleDelete}
                        >
                          Deshabilitar
                        </button>
                      </>
                    )}
                    {editMode && (
                      <button type="submit" className="btn btn-success">
                        Guardar Cambios
                      </button>
                    )}
                  </div>
                  <Link
                    to={`/listado-puestos`}
                    className="btn btn-primary w-100"
                  >
                    Volver
                  </Link>
                </form>
              </div>
            </div>
          </section>
          <Footer className="footer" />
        </div>
      </div>
    </>
  );
};

export default ConsultarPuesto;
