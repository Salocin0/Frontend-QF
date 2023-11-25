import React, { useEffect, useState } from "react";
import Footer from "../ComponentesGenerales/Footer";
import Sidebar from "../ComponentesGenerales/Sidebar";
import "./../sass/main.scss";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { fileToBase64 } from "../ComponentesGenerales/Utils/base64";

const RegistrarProductos = () => {
  const [nombre, setNombre] = useState("");
  const [imagen, setImagen] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [aderezos, setAderezos] = useState("");
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

  function tieneNumeros(cadena) {
    return /\d/.test(cadena);
  }

  function tieneLetras(cadena) {
    const regex = /[a-zA-Z]/;
    return regex.test(cadena);
  }

  const handleImgChange = (e) => {
    const file = e.target.files[0];

    fileToBase64(file, (base64) => {
      setImagen(base64);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const producto = {
      nombre: nombre,
      imagen: imagen,
      descripcion: descripcion,
      aderezos: aderezos,
      estado: Boolean(estado),
      puestoId: Number(id),
      precio: precio,
    };

    if (!producto.nombre.trim()) {
      toast.error("Nombre no puede estar vacio");
      return;
    }

    if (!producto.descripcion.trim()) {
      toast.error("La descripcion no puede estar vacio");
      return;
    }

    if (!producto.aderezos.trim()) {
      toast.error("Los aderezos no puede estar vacio");
      return;
    }


    if (!producto.precio.toString().trim()) {
      toast.error("El precio no puede estar vacio");
      return;
    }

    if (tieneLetras(producto.precio)) {
      toast.error("El precio no puede contener letras");
      return;
    }

    fetch("http://localhost:8000/producto", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(producto),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.code == 200) {
          toast.success("producto registrado correctamente");
          navigate(`/listado-productos/${id}`);
        } else {
          toast.error("error al registrar el producto");
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error("Error al registrar el producto");
      });
  };

  return (
    <div className="container-fluid mainFormEventos">
      <div className="row">
        <div className="col-2 p-0">
          <Sidebar tipoUsuario={session?.tipoUsuario} />
        </div>
        <div className={`col`}>
          <div>
            <div className="containerRegistrar d-flex justify-content-center align-items-center pt-5">
              <section
                className={`align-items-center col-6 form mt-3 mb-5 rad`}
              >
                <div className="cardRegistrar-body p-2 formularioRegistrar">
                  <div className={`card-body p-3 formulario`}>
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
                          onChange={handleImgChange}
                          //onChange={(e) => setImagen(e.target.files[0])}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label className="mb-2 text-black" htmlFor="precio">
                          Precio
                        </label>
                        <input
                          id="precio"
                          className="form-control"
                          value={precio}
                          onChange={(e) => setPrecio(e.target.value)}
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
                          <option value={true}>Listo para la venta</option>
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
