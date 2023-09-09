import React, { useState } from "react";
import Footer from "../ComponentesGenerales/Footer";
import Sidebar from "../ComponentesGenerales/Sidebar";
import style from "../ComponentesProducto/RegistrarProducto.module.css";

const RegistrarProductos = () => {
  const [nombre, setNombre] = useState("");
  const [imagen, setImagen] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [aderezos, setAderezos] = useState("");
  const [estado, setEstado] = useState("Standby"); // Estado inicial: Standby

  const handleSubmit = (e) => {
    e.preventDefault();
    setNombre("");
    setImagen("");
    setDescripcion("");
    setAderezos("");
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
                      <label className="mb-2 text-black" htmlFor="descripcion">
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
                        <option value="Standby">Standby</option>
                        <option value="Listo para la venta">Listo para la venta</option>
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
