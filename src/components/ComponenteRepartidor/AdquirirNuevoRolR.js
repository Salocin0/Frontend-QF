import "bootstrap/dist/css/bootstrap.min.css";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../ComponentesEPC/AdquirirNuevoRolEPC.css";
import Footer from "../ComponentesGenerales/Footer";
import Sidebar from "../ComponentesGenerales/Sidebar";
import { UserContext } from "../ComponentesGenerales/UserContext";
import '../ComponentesConsumidor/ConsultarUsuario.css'

const AdquirirNuevoRolR = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [consumidor, setConsumidor] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [dni, setDni] = useState("");
  const [cuit, setCuit] = useState("");
  const [razonSocial, setRazonSocial] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [fechaBromatologica, setFechaBromatologica] = useState("");
  const [documentos, setDocumentos] = useState([]);

  const [session, setSession] = useState(null);

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
      const repartidor = {
        repartidor: {
          cuit: cuit,
        },
      };

      const response = await fetch("http://localhost:8000/repartidor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(repartidor),
      });

      if (response.ok) {
        const data = await response.json();
        consumidor.repartidorId = data.data.id;
        const consumidornuevo = consumidor;
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
          navigate(`/home`);
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

  async function fetchData() {
    if (user) {
      await cargarDatos(user);
    }
  }

  useEffect(() => {
    

    fetchData();
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

  return (
    <>
      <div className="d-flex background">
        <div className="col-2">
          <Sidebar tipoUsuario={session?.tipoUsuario} />
        </div>
        <div className="flex-grow-1">
          <section className="align-items-center justify-content-center">
            <div className=" ">
              <div className="card-body p-3 formularioAdquirirNuevoRolEPC col-6 offset-3">
                <h1 className="fs-4 card-title fw-bold mb-2 text-dark">
                  Adquirir Nuevo Rol - Repartidor
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
                      Solicitar Nuevo Rol - Repartidor
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

export default AdquirirNuevoRolR;
