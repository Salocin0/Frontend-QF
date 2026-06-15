import React, { useContext, useState } from "react";
import Footer from "../ComponentesGenerales/Footer";
import PageLayout from "../ComponentesGenerales/PageLayout";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { fileToBase64 } from "../ComponentesGenerales/Utils/base64";
import { UserContext } from "../ComponentesGenerales/UserContext";
import Breadcrumb from "../ComponentesGenerales/Breadcrumb";
import useBreakpoint from "../../useBreakpoint";

const RegistrarProductos = () => {
  const { isMobile } = useBreakpoint();
  const [nombre, setNombre] = useState("");
  const [imagen, setImagen] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [aderezos, setAderezos] = useState("");
  const [precio, setPrecio] = useState(10);
  const [estado, setEstado] = useState("Standby");
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();


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
        if (data.code === 200) {
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
    pagina: {
      display: "flex",
      flexDirection: "column",
      gap: "20px",
    },
    tituloSeccion: {
      textAlign: "center",
      paddingTop: "1rem",
      fontSize: "2rem",
      color: "var(--qf-naranja)",
      margin: 0,
    },
    hrFull: {
      border: "none",
      borderTop: "1px solid var(--qf-naranja)",
      margin: 0,
      width: "100vw",
      marginLeft: "calc(-50vw + 50%)",
    },
    breadcrumbWrapper: {
      width: "100%",
    },
    content: {
      display: "flex",
      justifyContent: "center",
      backgroundColor: "var(--qf-bg-main)",
    },
    cardBody: {
      padding: "20px",
      borderRadius: "10px",
      flexDirection: "column",
      backgroundColor: "var(--qf-bg-secondary)",
      width: "100%",
      border: `1px solid var(--qf-naranja)`,
      boxSizing: "border-box",
    },
    formTitle: {
      fontSize: "1.25rem",
      fontWeight: "bold",
      marginBottom: "0.5rem",
      color: "var(--qf-naranja)",
      textAlign: "center",
    },
    formLabel: {
      margin: "0rem",
      color: "var(--qf-blanco-puro)",
    },
    formInput: {
      width: "100%",
      padding: "0.375rem 0.75rem",
      fontSize: "1rem",
      lineHeight: "1",
      borderRadius: "0.375rem",
      border: "1px solid #ccc",
      marginBottom: "0.25rem",
      color: "var(--qf-blanco-puro)",
      backgroundColor: "var(--qf-bg-secondary)",
      boxSizing: "border-box",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    submitButton: {
      backgroundColor: "var(--qf-naranja)",
      color: "var(--qf-blanco-puro)",
      padding: "0.5rem 1rem",
      fontSize: "1rem",
      fontWeight: "bold",
      borderRadius: "0.375rem",
      border: "none",
      cursor: "pointer",
    },
    row: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
  };

  const breadcrumbItems = [
    { title: "Inicio", url: "/inicio" },
    { title: "Mis Puestos", url: "/listado-puestos-encargado" },
    { title: "Mis Productos", url: `/listado-productos/${id}` },
    { title: "Crear Producto Nuevo", url: `/registrar-productos` },
  ];

  return (
    <PageLayout sidebarProps={{ tipoUsuario: user?.tipoUsuario }}>
      <div style={styles.pagina}>
        {/* Título centrado */}
        <h1 style={styles.tituloSeccion}>Crear Producto Nuevo</h1>

        {/* HR que ocupa el 100% del viewport */}
        <hr style={styles.hrFull} />

        {/* Breadcrumb a ancho completo */}
        <div style={styles.breadcrumbWrapper}>
          <Breadcrumb
            items={breadcrumbItems}
            style={{ width: "100%", margin: "8px 0" }}
          />
        </div>

        {/* Formulario centrado */}
        <div style={styles.content}>
          <div style={styles.cardBody}>
            <h1 style={styles.formTitle}>Registrar Producto</h1>
            <form onSubmit={handleSubmit} className="needs-validation">
              <div style={styles.row}>
                <div className="mb-3" style={{ width: "50%", marginRight: "20px" }}>
                  <label style={styles.formLabel} htmlFor="nombre">
                    Nombre del Producto
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    style={styles.formInput}
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3" style={{ width: "50%" }}>
                  <label style={styles.formLabel} htmlFor="precio">
                    Precio
                  </label>
                  <input
                    id="precio"
                    style={styles.formInput}
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label style={styles.formLabel} htmlFor="imagen">
                  Imagen
                </label>
                <input
                  type="file"
                  id="imagen"
                  style={styles.formInput}
                  accept="image/*"
                  onChange={handleImgChange}
                  required
                />
              </div>
              <div style={styles.row}>
              <div className="mb-3" style={{ width: "50%", marginRight: "20px" }}>
                <label style={styles.formLabel} htmlFor="descripcion">
                  Descripción
                </label>
                <textarea
                  id="descripcion"
                  style={styles.formInput}
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3" style={{ width: "50%" }}>
                <label style={styles.formLabel} htmlFor="aderezos">
                  Aderezos
                </label>
                <textarea
                  id="aderezos"
                  style={styles.formInput}
                  value={aderezos}
                  onChange={(e) => setAderezos(e.target.value)}
                  required
                />
              </div>
              </div>
              

              <div className="mb-3">
                <label style={styles.formLabel} htmlFor="estado">
                  Estado
                </label>
                <select
                  id="estado"
                  style={styles.formInput}
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
        </div>
      </div>
      <Footer />
    </PageLayout>
  );
};

export default RegistrarProductos;
