import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "../ComponentesGenerales/Footer";
import Sidebar from "../ComponentesGenerales/Sidebar";
import { fileToBase64 } from "../ComponentesGenerales/Utils/base64";
import "./../sass/main.scss";

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
  const [logoBase64, setLogoBase64] = useState(null);
  const [bannerBase64, setBannerBase64] = useState(null);



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

  const handleLogoChange = (e) => {
    const file = e.target.files[0];

    fileToBase64(file, (base64) => {
      setLogoBase64(base64);
    });
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];

    fileToBase64(file, (base64) => {
      setBannerBase64(base64);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(logoBase64);
    const formData = {
      numeroCarro,
      nombreCarro,
      tipoNegocio,
      pdfAfip,
      logo: logoBase64,
      banner: bannerBase64,
      telefonoCarro,
      consumidorId: session.consumidorId,
    };

    console.log(formData)

    if (!numeroCarro || !nombreCarro || !tipoNegocio || !telefonoCarro) {
      toast.error("Por favor rellene todos los datos");
      return;
    }

    fetch(`${process.env?.REACT_APP_BACK_URL}puesto`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 200) {
          toast.success("Carro de comida registrado correctamente");
          navigate("/listado-puestos-encargado");
        } else {
          toast.error("Ya existe un carro con el ID ingresado.");
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error("Error al registrar el carro de comida");
      });
  };


  return (
    <>
      <div className={`d-flex background`}>
        <div className="col-2">
          <Sidebar tipoUsuario={session?.tipoUsuario} />
        </div>
        <div className={`flex-grow-1`}>
          <section className={`align-items-center justify-content-center col-6 offset-3 form mt-3 mb-5 rad`}>
            <div className={`card shadow-lg`}>
              <div className={`card-body p-3 formulario`}>
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
                        min="1"
                        value={numeroCarro}
                        onChange={(e) => setNumeroCarro(e.target.value)}
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

                      />
                    </div>
                  </div>
                  <div className="mb-3">
                        <label className="mb-2 text-black" htmlFor="logo">
                          Logo
                        </label>
                        <input
                          type="file"
                          id="imagen"
                          className="form-control"
                          accept="image/*"
                          onChange={handleLogoChange}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="mb-2 text-black" htmlFor="banner">
                          Banner
                        </label>
                        <input
                          type="file"
                          id="imagen"
                          className="form-control"
                          accept="image/*"
                          onChange={handleBannerChange}
                          required
                        />
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
