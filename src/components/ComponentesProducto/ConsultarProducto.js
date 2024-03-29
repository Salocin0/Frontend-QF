import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "../ComponentesGenerales/Footer";
import Sidebar from "../ComponentesGenerales/Sidebar";
import "./../sass/main.scss";

const ConsultarPuesto = () => {
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const [cargarDatos, setCargarDatos] = useState(null);
  const [producto, setProducto] = useState();
  const [editMode, setEditMode] = useState(false);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [aderezos, setAderezos] = useState("");
  const [precio, setPrecio] = useState(0);
  const [estado, setEstado] = useState("");

  const navigate = useNavigate();

  const handleEditModeToggle = () => {
    setEditMode(!editMode);
  };

  function tieneNumeros(cadena) {
    return /\d/.test(cadena);
  }

  function tieneLetras(cadena) {
    const regex = /[a-zA-Z]/;
    return regex.test(cadena);
  }

  const handleSaveChanges = (e) => {
    e.preventDefault();

    const productoguardar = producto;
    productoguardar.nombre = nombre;
    productoguardar.descripcion = descripcion;
    productoguardar.precio = precio;
    productoguardar.aderezos = aderezos;
    productoguardar.estado = estado;

    if (!productoguardar.nombre.trim()) {
      toast.error("Nombre no puede estar vacio");
      return;
    }

    if (!productoguardar.descripcion.trim()) {
      toast.error("La descripcion no puede estar vacio");
      return;
    }

    if (!productoguardar.aderezos.trim()) {
      toast.error("Los aderezos no puede estar vacio");
      return;
    }

    if (!productoguardar.precio.toString().trim()) {
      toast.error("El precio no puede estar vacio");
      return;
    }

    fetch(`${process.env?.REACT_APP_BACK_URL}producto/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ producto: productoguardar }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        toast.success("Cambios guardados correctamente");
        navigate(`/listado-productos/${producto?.puestoId}`);
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

        const headers = new Headers();
        headers.append("ConsumidorId", data.data.consumidorId);

        return fetch(`${process.env?.REACT_APP_BACK_URL}producto/${id}`, {
          method: "GET",
          headers: headers,
        });
      })
      .then((response) => response.json())
      .then((data) => {
        setProducto(data.data);
        setNombre(data.data.nombre);
        setDescripcion(data.data.descripcion);
        setAderezos(data.data.aderezos);
        setPrecio(data.data.precio);
        setEstado(data.data.estado);
      })
      .catch((error) => console.error("Error:", error));
  }, [id]);

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

  return (
    <div className={`d-flex background`}>
      <div className="col-2">
        <Sidebar tipoUsuario={session?.tipoUsuario} />
      </div>
      <div className={`d-flex align-items-center justify-content-center`}>
        <section
          className={`align-items-center justify-content-center col-6 offset-3 form mt-3 mb-5 rad`}
        >
          <div className={`card shadow-lg`}>
            <div className={`card-body p-3 formulario`}>
              <h1 className="fs-5 card-title fw-bold mb-2 text-dark">
                Consultar Producto
              </h1>
              <form onSubmit={handleSaveChanges} className="no-validate">
                <div className="row">
                  <div className="mb-3 col-md-6">
                    <label className="mb-2 text-dark" htmlFor="idCarro">
                      Nombre
                    </label>
                    <input
                      type="text"
                      id="idCarro"
                      className="form-control"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      disabled={!editMode}
                    />
                  </div>
                  <div className="mb-3 col-md-6">
                    <label className="mb-2 text-dark" htmlFor="nombreCarro">
                      Descripcion
                    </label>
                    <input
                      type="text"
                      id="nombreCarro"
                      className="form-control"
                      value={descripcion}
                      onChange={(e) => setDescripcion(e.target.value)}
                      disabled={!editMode}
                    />
                  </div>
                  <div className="mb-3 col-md-6">
                    <label className="mb-2 text-dark" htmlFor="nombreCarro">
                      Aderezos
                    </label>
                    <input
                      type="text"
                      id="nombreCarro"
                      className="form-control"
                      value={aderezos}
                      onChange={(e) => setAderezos(e.target.value)}
                      disabled={!editMode}
                    />
                  </div>
                  <div className="mb-3 col-md-6">
                    <label className="mb-2 text-dark" htmlFor="nombreCarro">
                      Precio
                    </label>
                    <input
                      type="number"
                      id="nombreCarro"
                      className="form-control"
                      value={precio}
                      onChange={(e) => setPrecio(e.target.value)}
                      disabled={!editMode}
                    />
                  </div>
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
                  >
                    <option value={false}>Standby</option>
                    <option value={true}>Listo para la venta</option>
                  </select>
                </div>
                <div className="d-grid">
                  {!editMode && (
                    <button
                      type="button"
                      className="btn btn-primary my-1"
                      onClick={handleEditModeToggle}
                    >
                      Editar
                    </button>
                  )}
                  {editMode && (
                    <button type="submit" className="btn btn-success my-1">
                      Guardar Cambios
                    </button>
                  )}
                </div>
                <Link
                  to={`/listado-productos/${producto?.puestoId}`}
                  className="btn btn-primary w-100 my-1"
                >
                  Volver
                </Link>
              </form>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </div>
  );
};

export default ConsultarPuesto;
