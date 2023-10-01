import React, { useEffect, useState } from "react";
import Footer from "../ComponentesGenerales/Footer";
import Sidebar from "../ComponentesGenerales/Sidebar";
import style from "../ComponentesProducto/RegistrarProducto.module.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { fileToBase64 } from "../ComponentesGenerales/Utils/base64";

const RegistrarEvento = () => {
  const [nombre, setNombre] = useState("");
  const [imagen, setImagen] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [tieneButacas, setTieneButacas]=useState(false);
  const [fecha, setFecha]=useState("")
  const [hora, setHora]=useState("")
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
    <div className="container-fluid">
      <div className="row">
        <div className="col-2 p-0">
          <Sidebar tipoUsuario={session?.tipoUsuario} />
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
                      Registrar Evento
                    </h1>
                    <form onSubmit={handleSubmit} className="needs-validation">
                      <div className="mb-3">
                        <label className="mb-2 text-black" htmlFor="nombre">
                          Nombre del Evento
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
                        <label className="mb-2 text-black" htmlFor="nombre">
                          link Venta Entradas
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
                        <label className="mb-2 text-black" htmlFor="nombre">
                          ubicacion
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
                        <label className="mb-2 text-black" htmlFor="nombre">
                          Descripcion
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
                        <label className="mb-2 text-black" htmlFor="nombre">
                          Cantidad Puestos
                        </label>
                        <input
                          type="number"
                          id="nombre"
                          className="form-control"
                          value={nombre}
                          onChange={(e) => setNombre(e.target.value)}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label className="mb-2 text-black" htmlFor="nombre">
                          Cantidad repartidores
                        </label>
                        <input
                          type="number"
                          id="nombre"
                          className="form-control"
                          value={nombre}
                          onChange={(e) => setNombre(e.target.value)}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label className="mb-2 text-black" htmlFor="nombre">
                          Capacidad maxima
                        </label>
                        <input
                          type="number"
                          id="nombre"
                          className="form-control"
                          value={nombre}
                          onChange={(e) => setNombre(e.target.value)}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label className="mb-2 text-black" htmlFor="nombre">
                          plazo cancelacion preventa
                        </label>
                        <input
                          type="number"
                          id="nombre"
                          className="form-control"
                          value={nombre}
                          onChange={(e) => setNombre(e.target.value)}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label
                          className="mb-2 text-black"
                          htmlFor="tieneButacas"
                        >
                          ¿Tiene Butacas?
                        </label>
                        <input
                          type="checkbox"
                          id="tieneButacas"
                          checked={tieneButacas}
                          onChange={(e) => setTieneButacas(e.target.checked)}
                        />
                      </div>

                      <div className="mb-3">
                        <label
                          className="mb-2 text-black"
                          htmlFor="tieneButacas"
                        >
                          ¿Tiene Repartidores?
                        </label>
                        <input
                          type="checkbox"
                          id="tieneButacas"
                          checked={tieneButacas}
                          onChange={(e) => setTieneButacas(e.target.checked)}
                        />
                      </div>

                      <div className="mb-3">
                        <label
                          className="mb-2 text-black"
                          htmlFor="tieneButacas"
                        >
                          ¿Tiene preventa?
                        </label>
                        <input
                          type="checkbox"
                          id="tieneButacas"
                          checked={tieneButacas}
                          onChange={(e) => setTieneButacas(e.target.checked)}
                        />
                      </div>

                      <div className="mb-3">
                        <label className="mb-2 text-black" htmlFor="fecha">
                          Fecha inicio evento
                        </label>
                        <input
                          type="date"
                          id="fecha"
                          className="form-control"
                          value={fecha}
                          onChange={(e) => setFecha(e.target.value)}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label className="mb-2 text-black" htmlFor="hora">
                          Hora inicio evento
                        </label>
                        <input
                          type="time"
                          id="hora"
                          className="form-control"
                          value={hora}
                          onChange={(e) => setHora(e.target.value)}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label className="mb-2 text-black" htmlFor="fecha">
                          Fecha fin evento
                        </label>
                        <input
                          type="date"
                          id="fecha"
                          className="form-control"
                          value={fecha}
                          onChange={(e) => setFecha(e.target.value)}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label className="mb-2 text-black" htmlFor="estado">
                          Tipo Evento
                        </label>
                        <select
                          id="estado"
                          className="form-select"
                          value={estado}
                          onChange={(e) => setEstado(e.target.value)}
                          required
                        >
                          <option value={1}>Cine</option>
                          <option value={2}>Festival</option>
                          <option value={3}>Deporte</option>
                        </select>
                      </div>

                      <div className="mb-3">
                        <label className="mb-2 text-black" htmlFor="fecha">
                          Fecha inicio preventa
                        </label>
                        <input
                          type="date"
                          id="fecha"
                          className="form-control"
                          value={fecha}
                          onChange={(e) => setFecha(e.target.value)}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label className="mb-2 text-black" htmlFor="fecha">
                          Fecha fin preventa
                        </label>
                        <input
                          type="date"
                          id="fecha"
                          className="form-control"
                          value={fecha}
                          onChange={(e) => setFecha(e.target.value)}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label className="mb-2 text-black" htmlFor="estado">
                          Tipo Preventa
                        </label>
                        <select
                          id="estado"
                          className="form-select"
                          value={estado}
                          onChange={(e) => setEstado(e.target.value)}
                          required
                        >
                          <option value={1}>Tipo 1</option>
                          <option value={2}>Tipo 2</option>
                          <option value={3}>Tipo 3</option>
                        </select>
                      </div>

                      <div className="mb-3">
                        <label className="mb-2 text-black" htmlFor="estado">
                          Tipo Pago
                        </label>
                        <select
                          id="estado"
                          className="form-select"
                          value={estado}
                          onChange={(e) => setEstado(e.target.value)}
                          required
                        >
                          <option value={1}>Pago</option>
                          <option value={2}>Gratuito</option>
                        </select>
                      </div>

                      <div className="mb-3">
                        <label className="mb-2 text-black" htmlFor="estado">
                          Localidad
                        </label>
                        <select
                          id="estado"
                          className="form-select"
                          value={estado}
                          onChange={(e) => setEstado(e.target.value)}
                          required
                        >
                          <option value={1}>Tipo 1</option>
                          <option value={2}>Tipo 2</option>
                          <option value={3}>Tipo 3</option>
                        </select>
                      </div>

                      <div className="mb-3">
                        <label className="mb-2 text-black" htmlFor="estado">
                          Provincia
                        </label>
                        <select
                          id="estado"
                          className="form-select"
                          value={estado}
                          onChange={(e) => setEstado(e.target.value)}
                          required
                        >
                          <option value={1}>Pago</option>
                          <option value={2}>Gratuito</option>
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

export default RegistrarEvento;
