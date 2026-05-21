import React, { useContext, useState } from "react";
import Footer from "../ComponentesGenerales/Footer";
import PageLayout from "../ComponentesGenerales/PageLayout";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { fileToBase64 } from "../ComponentesGenerales/Utils/base64";
import { UserContext } from "../ComponentesGenerales/UserContext";
import Breadcrumb from "../ComponentesGenerales/Breadcrumb";

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
    mainFormEventos: {
      padding: "0",
      backgroundColor: "var(--qf-bg-main)",
      display: "flex",
      justifyContent: "center",
      
    },
    cardBody: {
      padding: "20px",
      borderRadius: "10px",
      flexDirection: "column",
      backgroundColor: "var(--qf-bg-secondary)",
      marginLeft: "20%",
      width: "Calc(80% - 40px)",
      border: `1px solid var(--qf-naranja)`,
      height: "100%",
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
      backgroundColor: "var(--qf-green)",
      color: "var(--qf-blanco-puro)",
      padding: "0.5rem 1rem",
      fontSize: "1rem",
      fontWeight: "bold",
      borderRadius: "0.375rem",
      border: "none",
      cursor: "pointer",
    },
    breadcrumbWrapper: {
      marginLeft: "20%",
      width: "Calc(80%)",
      paddingTop: "10px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
    header: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginLeft: "20%",
      width: "80%",
      padding: "20px",
      backgroundColor: "var(--qf-bg-main)",
    },
    divider: {
      borderColor: "var(--qf-naranja)",
      width: "100%",
      margin: "10px 0",
    },
    title: {
      color: "var(--qf-naranja)",
      fontWeight: "bold",
      textAlign: "center",
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
      <div>
        <div style={styles.header}>
          <h1 style={styles.title}>Crear Producto Nuevo</h1>
        </div>
        <hr style={styles.divider} />
        <div style={styles.breadcrumbWrapper}>
          <Breadcrumb
            items={breadcrumbItems}
            style={{ width: "Calc(100% - 40px)", marginLeft: "20px" }}
          />
        </div>
      </div>

      <div style={styles.mainFormEventos}>
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
                  style={styles.formControl}
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
                  style={styles.formControl}
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
                style={styles.formControl}
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
                style={styles.formTextArea}
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
                style={styles.formTextArea}
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
    </PageLayout>
  );
};

export default RegistrarProductos;
