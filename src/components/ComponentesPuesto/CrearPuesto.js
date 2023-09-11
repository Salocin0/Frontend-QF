import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import style from "../ComponentesConsumidor/ConsultarUsuario.module.css";
import Footer from "../ComponentesGenerales/Footer";
import Sidebar from "../ComponentesGenerales/Sidebar";

const CrearNuevoCarro = () => {
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

  const handleSubmit = (e) => {
    e.preventDefault();

    // Crear un objeto con los datos del formulario
    const formData = {
      numeroCarro,
      nombreCarro,
      tipoNegocio,
      pdfAfip,
      //pdfCuil,
      //pdfDNI,
      //telefonoContacto,
      //razonSocial,
      //cuit,
      telefonoCarro,
      consumidorId: session.consumidorId,
    };
    // Realizar la solicitud HTTP para enviar los datos al servidor
    fetch("http://localhost:8000/puesto", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.code);
        // Manejo de la respuesta del servidor
        if (data.code === 200) {
          toast.success("Carro de comida registrado correctamente");
          navigate("/listado-puestos");
        } else {
          toast.error("Ya existe un carro con el ID ingresado.");
        }

        // Redireccionar a la página deseada
      })
      .catch((error) => {
        // Manejo de errores
        console.error(error);
        toast.error("Error al registrar el carro de comida");
      });
  };

  return (
    <>
      <div className={`d-flex ${style.background}`}>
        <div className="col-2">
          <Sidebar tipoUsuario={session?.tipoUsuario} />
        </div>
        <div className={`flex-grow-1`}>
          <section className={`align-items-center justify-content-center col-6 offset-3 ${style.form} mt-3 mb-5 ${style.rad} `}>
            <div className={`${style.card} shadow-lg`}>
              <div className={`card-body p-3 ${style.formulario}`}>
                <h1 className="fs-5 card-title fw-bold mb-2 text-dark">
                  Registrar Carro de Comida
                </h1>
                <form onSubmit={handleSubmit} className="needs-validation">
                  <div className="row">
                    <div className="mb-3 col-md-6">
                      <label className="mb-2 text-dark" htmlFor="idCarro">
                        Numero de Carro
                      </label>
                      <input
                        type="number"
                        id="idCarro"
                        className="form-control"
                        value={numeroCarro}
                        onChange={(e) => setNumeroCarro(e.target.value)}
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
                   {/*<div className="mb-3">
                    <label
                      className="mb-2 text-dark"
                      htmlFor="telefonoContacto"
                    >
                      Teléfono de Contacto (Puesto)
                    </label>
                    <input
                      type="tel"
                      id="telefonoContacto"
                      className="form-control"
                      value={telefonoContacto}
                      onChange={(e) => setTelefonoContacto(e.target.value)}
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
                      required
                    />
                  </div>*/
                 }
                  <div className="mb-3">
                    <label className="mb-2 text-dark" htmlFor="telefonoCarro">
                      Teléfono del Carro de Comida
                    </label>
                    <input
                      type="number"
                      id="telefonoCarro"
                      className="form-control"
                      value={telefonoCarro}
                      onChange={(e) => setTelefonoCarro(e.target.value)}
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
                      required
                    />
                  </div>

                    <div className="mb-3">
                    <label className="mb-2 text-dark" htmlFor="pdfCuil">
                      Constancia de Inspección Bromatológica (PDF)
                    </label>
                    <input
                      type="file"
                      id="pdfCuil"
                      className="form-control"
                      onChange={(e) => setPdfCuil(e.target.files[0])}
                      required
                    />
                  </div>


                  {/*<div className="mb-3">
                    <label className="mb-2 text-dark" htmlFor="pdfDNI">
                      DNI (PDF)
                    </label>
                    <input
                      type="file"
                      id="pdfDNI"
                      className="form-control"
                      onChange={(e) => setPdfDNI(e.target.files[0])}
                      required
                    />
                </div>*/}
                  <div className="d-grid">
                    <button type="submit" className="btn btn-success my-1">
                      Registrar Carro de Comida
                    </button>
                  </div>
                  <Link
                    to={`/listado-puestos`}
                    className="btn btn-primary w-100 my-1"
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
      ;
    </>
  );
};

export default CrearNuevoCarro;
