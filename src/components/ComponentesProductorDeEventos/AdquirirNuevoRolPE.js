import "bootstrap/dist/css/bootstrap.min.css";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UserContext } from "../ComponentesGenerales/UserContext";
import "./AdquirirNuevoRolPE.css";

import Footer from "../ComponentesGenerales/Footer";
import Sidebar from "../ComponentesGenerales/Sidebar";

const AdquirirNuevoRolPE = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [consumidor, setConsumidor] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [dni, setDni] = useState("");
  const [cuit, setCuit] = useState("");
  const [telefono, setTelefono] = useState("");
  const [razonSocial, setRazonSocial] = useState("");
  const [documento, setDocumento] = useState("");

  useEffect(() => {
    if (user) {
      cargarDatos(user);
    }
  }, [user]);

  const cargarDatos = async (user) => {
    try {
      console.log(user);
      const responseconsumidor = await fetch(
        `http://localhost:8000/consumidor/${user.consumidorId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (responseconsumidor.ok) {
        const data = await responseconsumidor.json();
        console.log(data.data);
        setConsumidor(data.data);
        setApellido(data.data.apellido);
        setNombre(data.data.nombre);
        setDni(data.data.dni);
        if (data.data.codigo === 200) {
          toast.success("Datos cargados correctamente");
        } else if (data.data.codigo === 400) {
          toast.error("Error al cargar los datos");
        }
      } else {
        throw new Error("Error en la respuesta HTTP");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleNombreChange = (e) => {
    setNombre(e.target.value);
  };

  const handleApellidoChange = (e) => {
    setApellido(e.target.value);
  };

  const handleDniChange = (e) => {
    setDni(e.target.value);
  };

  const handleCuitChange = (e) => {
    setCuit(e.target.value);
  };

  const handleRazonSocialChange = (e) => {
    setRazonSocial(e.target.value);
  };

  const handleTelefonoChange = (e) => {
    setTelefono(e.target.value);
  };

  const handleDocumentoChange = (e) => {
    setDocumento(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productor = {
        productor: {
          cuit: cuit,
          razonSocial: razonSocial,
        },
      };

      const response = await fetch("http://localhost:8000/productor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productor),
      });
      console.log("llego");

      if (response.ok) {
        const data = await response.json();
        const consumidornuevo = consumidor;
        console.log(consumidornuevo);
        consumidornuevo.productorId = data.data.id;
        setConsumidor(consumidornuevo);
      } else {
        throw new Error("Error en la respuesta HTTP");
      }

      const responseGuardar = await fetch(
        `http://localhost:8000/consumidor/${consumidor.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ consumidor }),
        }
      );

      if (responseGuardar.ok) {
        const data = await responseGuardar.json();
        if (data.code === 200) {
          toast.success("Nuevo rol adquirido correctamente");
          setTimeout(() => {
            navigate(`/home`);
          }, 1500);
        } else if (data.code === 400) {
          toast.error("Error al adquirir el nuevo rol");
        }
      } else {
        throw new Error("Error en la respuesta HTTP");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="d-flex">
        <div className="col-2">
          <Sidebar />
        </div>
        <div className="flex-grow-1 imgback">
          <section className="align-items-center justify-content-center col-6 offset-3 form">
            <div className="card shadow-lg">
              <div className="card-body p-3">
                <h1 className="fs-4 card-title fw-bold mb-2">
                  Adquirir Nuevo Rol - Productor de Eventos
                </h1>
                <form onSubmit={handleSubmit} className="needs-validation">
                  <div className="mb-2">
                    <label className="form-label" htmlFor="nombre">
                      Nombre
                    </label>
                    <input
                      type="text"
                      id="nombre"
                      className="form-control"
                      value={nombre}
                      onChange={handleNombreChange}
                      disabled
                    />
                  </div>

                  <div className="mb-2">
                    <label className="form-label text-dark" htmlFor="apellido">
                      Apellido
                    </label>
                    <input
                      type="text"
                      id="apellido"
                      className="form-control"
                      value={apellido}
                      onChange={handleApellidoChange}
                      disabled
                    />
                  </div>

                  <div className="mb-2">
                    <label className="form-label text-dark" htmlFor="dni">
                      DNI
                    </label>
                    <input
                      type="text"
                      id="dni"
                      className="form-control"
                      value={dni}
                      onChange={handleDniChange}
                      disabled
                    />
                  </div>

                  <div className="mb-2">
                    <label className="form-label text-dark" htmlFor="cuit">
                      CUIT
                    </label>
                    <input
                      type="number"
                      id="cuit"
                      className="form-control"
                      value={cuit}
                      onChange={handleCuitChange}
                      required
                    />
                  </div>

                  <div className="mb-2">
                    <label
                      className="form-label text-dark"
                      htmlFor="razonSocial"
                    >
                      Razon Social
                    </label>
                    <input
                      type="text"
                      id="razonSocial"
                      className="form-control"
                      value={razonSocial}
                      onChange={handleRazonSocialChange}
                      required
                    />
                  </div>

                  <div className="mb-2">
                    <label className="form-label text-dark" htmlFor="telefono">
                      Teléfono
                    </label>
                    <input
                      type="text"
                      id="telefono"
                      className="form-control"
                      value={telefono}
                      onChange={handleTelefonoChange}
                      required
                    />
                  </div>

                  <div className="mb-2">
                    <label
                      className="form-label text-dark"
                      htmlFor="documentos"
                    >
                      Documentos
                    </label>
                    <input
                      type="file"
                      id="documentos"
                      className="form-control"
                      onChange={handleDocumentoChange}
                      multiple
                      required
                    />
                  </div>

                  <div className="d-grid">
                    <button type="submit" className="btn btn-success">
                      Solicitar Nuevo Rol - Productor de Eventos
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </section>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default AdquirirNuevoRolPE;
