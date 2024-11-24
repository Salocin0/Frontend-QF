import React, { useContext, useEffect, useState } from "react";
import Footer from "../ComponentesGenerales/Footer";
import Sidebar from "../ComponentesGenerales/Sidebar";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { fileToBase64 } from "../ComponentesGenerales/Utils/base64";
import { UserContext } from "../ComponentesGenerales/UserContext";
import useDynamicColors from "../../UseDinamicColors";

const RegistrarProductos = () => {
  const [nombre, setNombre] = useState("");
  const [imagen, setImagen] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [aderezos, setAderezos] = useState("");
  const [precio, setPrecio] = useState(10);
  const [estado, setEstado] = useState("Standby");
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const Colors = useDynamicColors();

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

    fetch(`${process.env?.REACT_APP_BACK_URL}producto`, {
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

  const styles = {
    mainFormEventos: {
      padding: "0",
      height: "100vh",
      backgroundColor: Colors.GrisAzuladoOscuro,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    cardBody: {
      padding: "20px",
      borderRadius: "10px",
      flexDirection: "column",
      backgroundColor: Colors.GrisAzuladoClaro,
      marginLeft: "20%",
      width: "400px",
      height: "630px",
      border: `1px solid ${Colors.Naranja}`,
    },
    formTitle: {
      fontSize: "1.25rem",
      fontWeight: "bold",
      marginBottom: "1rem",
      color: Colors.Naranja,
      textAlign: "center",
    },
    formLabel: {
      margin: "0rem",
      color: Colors.BlancoEnBlanco,
    },
    formControl: {
      width: "100%",
      padding: "0.375rem 0.75rem",
      fontSize: "1rem",
      lineHeight: "1",
      borderRadius: "0.375rem",
      border: "1px solid #ccc",
      marginBottom: "0.25rem",
    },
    formSelect: {
      width: "100%",
      padding: "0.375rem 0.75rem",
      fontSize: "1rem",
      lineHeight: "1",
      borderRadius: "0.375rem",
      border: "1px solid #ccc",
      marginBottom: "0.25rem",
    },
    formTextArea: {
      width: "100%",
      padding: "0.375rem 0.75rem",
      fontSize: "1rem",
      lineHeight: "1",
      borderRadius: "0.375rem",
      border: "1px solid #ccc",
      marginBottom: "0.25rem",
    },
    submitButton: {
      backgroundColor: Colors.Verde,
      color: Colors.BlancoEnBlanco,
      padding: "0.5rem 1rem",
      fontSize: "1rem",
      fontWeight: "bold",
      borderRadius: "0.375rem",
      border: "none",
      cursor: "pointer",
    },
  };

  return (
    <>
      <Sidebar tipoUsuario={user?.tipoUsuario} />
      <div style={styles.mainFormEventos}>
        <div style={styles.cardBody}>
          <h1 style={styles.formTitle}>Registrar Producto</h1>
          <form onSubmit={handleSubmit} className="needs-validation">
            <div className="mb-3">
              <label style={styles.formLabel} htmlFor="nombre">
                Nombre del Producto
              </label>
              <input
                type="text"
                id="nombre"
                style={styles.formControl}
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label style={styles.formLabel} htmlFor="imagen">
                Imagen
              </label>
              <input
                type="file"
                id="imagen"
                style={styles.formControl}
                accept="image/*"
                onChange={handleImgChange}
                required
              />
            </div>

            <div className="mb-3">
              <label style={styles.formLabel} htmlFor="precio">
                Precio
              </label>
              <input
                id="precio"
                style={styles.formControl}
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label style={styles.formLabel} htmlFor="descripcion">
                Descripción
              </label>
              <textarea
                id="descripcion"
                style={styles.formTextArea}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label style={styles.formLabel} htmlFor="aderezos">
                Aderezos
              </label>
              <textarea
                id="aderezos"
                style={styles.formTextArea}
                value={aderezos}
                onChange={(e) => setAderezos(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label style={styles.formLabel} htmlFor="estado">
                Estado
              </label>
              <select
                id="estado"
                style={styles.formSelect}
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                required
              >
                <option value={false}>Standby</option>
                <option value={true}>Listo para la venta</option>
              </select>
            </div>

            <div className="d-grid">
              <button type="submit" style={styles.submitButton}>
                Registrar
              </button>
            </div>
          </form>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default RegistrarProductos;
