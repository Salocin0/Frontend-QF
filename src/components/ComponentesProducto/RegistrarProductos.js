import React, { useEffect, useState } from "react";
import Footer from "../ComponentesGenerales/Footer";
import Sidebar from "../ComponentesGenerales/Sidebar";
import style from "../ComponentesProducto/RegistrarProducto.module.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

const RegistrarProductos = () => {
  const [nombre, setNombre] = useState("");
  const [imagen, setImagen] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [aderezos, setAderezos] = useState("");
  const [stock, setStock] = useState(10);
  const [precio, setPrecio] = useState(10);
  const [estado, setEstado] = useState("Standby");
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      nombre,
      imagen,
      descripcion,
      aderezos,
      estado,
      puestoId: id,
      stock,
      precio,
    };
    // Realizar la solicitud HTTP para enviar los datos al servidor
    fetch("http://localhost:8000/producto", {
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
        if (data.ok) {
          toast.success("producto registrado correctamente");
          navigate(`/listado-productos/${id}`);
        } else {
          toast.error("error al registrar el producto");
        }
      })
      .catch((error) => {
        // Manejo de errores
        console.error(error);
        toast.error("Error al registrar el producto");
      });
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-2">
          <Sidebar />
        </div>
        <div className={`col ${style.background}`}>
          <div className="fondo">
            <div className="containerRegistrar d-flex justify-content-center align-items-center">
              <section
                className={`align-items-center col-6 ${style.form} mt-3 mb-5 ${style.rad}`}
              >
                <div className="cardRegistrar-body p-2 formularioRegistrar">
                  <div className={`card-body p-3 ${style.formulario}`}>
                    <h1 className="fs-4 cardRegistrar-title fw-bold mb-4 text-black">
                      Registrar Producto
                    </h1>
                    <form onSubmit={handleSubmit} className="needs-validation">
                      <div className="mb-3">
                        <label className="mb-2 text-black" htmlFor="nombre">
                          Nombre del Producto
                        </label>
                        <input
                          type="text"
                          id="nombre"
                          className="form-control"
                          value={nombre}
                          onChange={(e) => setNombre(e.target.value)}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label className="mb-2 text-black" htmlFor="imagen">
                          Imagen
                        </label>
                        <input
                          type="file"
                          id="imagen"
                          className="form-control"
                          accept="image/*"
                          onChange={(e) => setImagen(e.target.files[0])}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label
                          className="mb-2 text-black"
                          htmlFor="descripcion"
                        >
                          Descripción
                        </label>
                        <textarea
                          id="descripcion"
                          className="form-control"
                          value={descripcion}
                          onChange={(e) => setDescripcion(e.target.value)}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label className="mb-2 text-black" htmlFor="aderezos">
                          Aderezos
                        </label>
                        <textarea
                          id="aderezos"
                          className="form-control"
                          value={aderezos}
                          onChange={(e) => setAderezos(e.target.value)}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label className="mb-2 text-black" htmlFor="estado">
                          Estado
                        </label>
                        <select
                          id="estado"
                          className="form-select"
                          value={estado}
                          onChange={(e) => setEstado(e.target.value)}
                          required
                        >
                          <option value={false}>Standby</option>
                          <option value={true}>
                            Listo para la venta
                          </option>
                        </select>
                      </div>

                      <div className="d-grid">
                        <button type="submit" className="btn btn-success">
                          Registrar
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
      <Footer className="footer" />
    </div>
  );
};

export default RegistrarProductos;
