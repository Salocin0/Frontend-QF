import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../ComponentesGenerales/UserContext';
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import Footer from "../ComponentesGenerales/Footer";
import Sidebar from "../ComponentesGenerales/Sidebar";
import "./AdquirirNuevoRolEPC.css";

const AdquirirNuevoRolEPC = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useContext(UserContext);
  const location = useLocation();
  const id = location.state && location.state.value;

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [dni, setDni] = useState("");
  const [cuit, setCuit] = useState("");
  const [razonSocial, setRazonSocial] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [fechaBromatologica, setFechaBromatologica] = useState("");
  const [documentos, setDocumentos] = useState([]);

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

  const handleLocalidadChange = (e) => {
    setLocalidad(e.target.value);
  };

  const handleFechaBromatologicaChange = (e) => {
    setFechaBromatologica(e.target.value);
  };

  const handleDocumentoChange = (e) => {
    const files = e.target.files;
    setDocumentos(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const encargado = {
        encargado: {
          cuit: cuit,
          razonSocial: razonSocial,
          fechaBromatologica: fechaBromatologica,
          id: user.id,
        },
      };
  
      const response = await fetch("http://localhost:8000/encargado", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(encargado),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log(data)
        if (data.code === 200) {
          toast.success("Nuevo rol adquirido correctamente");
          setTimeout(() => {
            navigate(`/home/inicio`);
          }, 1500);
        } else if (data.code === 400) {
          toast.error("Error al adquirir el nuevo rol: razon usada");
        }
      } else {
        throw new Error("Error en la respuesta HTTP");
      }
    } catch (error) {
      console.error(error);
    }
  };
  

  useEffect(() => {
    if (user) {
      cargarDatos(user);
    }
  }, [user]);

  const cargarDatos = async (user) => {
    try {
      console.log(user);
      const responseconsumidor = await fetch(
        `http://localhost:8000/consumidor/user/${user.id}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (responseconsumidor.ok) {
        const consumidor = await responseconsumidor.json();
        setApellido(consumidor.data.apellido);
        setNombre(consumidor.data.nombre);
        setDni(consumidor.data.dni);
        if (consumidor.codigo === 200) {
          toast.success("Datos cargados correctamente");
        } else if (consumidor.codigo === 400) {
          toast.error("Error al cargar los datos");
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
        <Sidebar />
        <div className="flex-grow-1">
          <section className="align-items-center justify-content-center">
            <div className="card shadow-lg">
              <div className="card-body p-3 formularioAdquirirNuevoRolEPC">
                <h1 className="fs-4 card-title fw-bold mb-2 text-dark">
                  Adquirir Nuevo Rol - Encargado de Puesto de Comida
                </h1>
                <form
                  onSubmit={handleSubmit}
                  className="needs-validation"
                  encType="multipart/form-data"
                >
                  <div className="mb-3">
                    <label className="mb-2 text-dark" htmlFor="nombre">
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
                    <label className="mb-2 text-dark" htmlFor="apellido">
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
                    <label className="mb-2 text-dark" htmlFor="dni">
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
                    <label className="mb-2 text-dark" htmlFor="cuit">
                      CUIT
                    </label>
                    <input
                      type="text"
                      id="cuit"
                      className="form-control"
                      value={cuit}
                      onChange={handleCuitChange}
                      required
                    />
                  </div>

                  <div className="mb-2">
                    <label className="mb-2 text-dark" htmlFor="razonSocial">
                      Razón Social
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
                    <label className="mb-2 text-dark" htmlFor="telefono">
                      fechaBromatologica
                    </label>
                    <input
                      type="date"
                      id="telefono"
                      className="form-control"
                      value={fechaBromatologica}
                      onChange={handleFechaBromatologicaChange}
                      required
                    />
                  </div>

                  <div className="mb-2">
                    <label className="mb-2 text-dark" htmlFor="documentos">
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
                      Solicitar Nuevo Rol - Encargado Puesto de Comida
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

export default AdquirirNuevoRolEPC;
