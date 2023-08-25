import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
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

    const navigate = useNavigate();

    const handleSubmit = (e) => {
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
        fetch("http://localhost:8000/puesto", {
            method: "POST",
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                // Manejo de la respuesta del servidor
                console.log(data);
                // Mostrar mensaje de éxito
                toast.success("Carro de comida registrado correctamente");
                // Redireccionar a la página deseada
                setTimeout(() => {
                    navigate(`/`);
                }, 1500);
            })
            .catch((error) => {
                // Manejo de errores
                console.error(error);
                toast.error("Error al registrar el carro de comida");
            });
    };

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
                                    Registrar Carro de Comida
                                </h1>
                                <form onSubmit={handleSubmit} className="needs-validation">
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
                                            <option value="Tipo de Negocio 1">Tipo de Negocio 1</option>
                                            <option value="Tipo de Negocio 2">Tipo de Negocio 2</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="mb-2 text-dark" htmlFor="telefonoContacto">
                                            Teléfono de Contacto
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
                                            Constancia de CUIL (PDF)
                                        </label>
                                        <input
                                            type="file"
                                            id="pdfCuil"
                                            className="form-control"
                                            onChange={(e) => setPdfCuil(e.target.files[0])}
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
                                            required
                                        />
                                    </div>
                                    <div className="d-grid">
                                        <button type="submit" className="btn btn-success">
                                            Registrar Carro de Comida
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </section>
                    <Footer className="footer" />
                </div>
            </div>;

        </>
    );
};

export default CrearNuevoCarro;
