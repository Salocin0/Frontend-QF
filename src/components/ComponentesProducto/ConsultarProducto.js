import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "../ComponentesGenerales/Footer";
import Sidebar from "../ComponentesGenerales/Sidebar";
import useDynamicColors from "../../UseDinamicColors";
import Breadcrumb from "../ComponentesGenerales/Breadcrumb";

const ConsultarProducto = () => {
  const { id } = useParams();
  const Colors = useDynamicColors();
  const [session, setSession] = useState(null);
  const [producto, setProducto] = useState();
  const [editMode, setEditMode] = useState(false);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [aderezos, setAderezos] = useState("");
  const [precio, setPrecio] = useState(0);
  const [estado, setEstado] = useState("");

  const navigate = useNavigate();

  const handleEditModeToggle = () => setEditMode(!editMode);

  const handleSaveChanges = (e) => {
    e.preventDefault();
    const productoguardar = {
      ...producto,
      nombre,
      descripcion,
      precio,
      aderezos,
      estado,
    };

    if (
      !nombre.trim() ||
      !descripcion.trim() ||
      !aderezos.trim() ||
      !precio.toString().trim()
    ) {
      toast.error("Todos los campos son obligatorios");
      return;
    }

    fetch(`${process.env?.REACT_APP_BACK_URL}producto/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ producto: productoguardar }),
    })
      .then((response) => response.json())
      .then(() => {
        toast.success("Cambios guardados correctamente");
        navigate(`/listado-productos/${producto?.puestoId}`);
        setEditMode(false);
      })
      .catch(() => toast.error("Error al guardar los cambios"));
  };

  useEffect(() => {
    fetch(`${process.env?.REACT_APP_BACK_URL}producto/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setProducto(data.data);
        setNombre(data.data.nombre);
        setDescripcion(data.data.descripcion);
        setAderezos(data.data.aderezos);
        setPrecio(data.data.precio);
        setEstado(data.data.estado);
      })
      .catch(console.error);
  }, [id]);

  const styles = {
    container: {
      display: "flex",
      background: Colors.GrisAzuladoOscuro,
      height: "100vh",
      width: "100%",
      flexDirection: "column",
    },
    content: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      width: "80%",
      marginLeft: "20%",
    },
    card: {
      backgroundColor: Colors.GrisAzuladoClaro,
      borderRadius: "10px",
      color: Colors.Blanco,
      width: "Calc(100% - 40px)",
      padding: "20px",
      border: `1px solid ${Colors.Naranja}`,
    },
    label: { color: Colors.Blanco, padding: 0, margin: 0 },
    buttonContainer: { display: "grid" },
    button: { margin: "0.5rem 0" },
    breadcrumbWrapper: {
      width: "Calc(100%)",
      paddingTop: "10px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
    header: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      padding: "20px",
      backgroundColor: Colors.GrisAzuladoOscuro,
    },
    divider: {
      borderColor: Colors.Naranja,
      width: "100%",
      margin: "10px 0",
    },
    title: {
      color: Colors.Naranja,
      fontWeight: "bold",
      textAlign: "center",
    },
    row: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    input: {
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
    backButton: {
      backgroundColor: Colors.Azul,
      color: Colors.BlancoEnBlanco,
      padding: "0.5rem 1rem",
      fontSize: "1rem",
      fontWeight: "bold",
      borderRadius: "0.375rem",
      border: "none",
      cursor: "pointer",
      textAlign: "center",
      marginTop: "10px",
    },
  };

  const breadcrumbItems = [
    { title: "Inicio", url: "/inicio" },
    { title: "Mis Puestos", url: "/listado-puestos-encargado" },
    { title: "Mis Productos", url: `/listado-productos/${producto.puestoId}` },
    { title: "Actualizar Producto", url: `/producto/${producto.id}` },
  ];

  return (
    <div style={styles.container}>
      <Sidebar tipoUsuario={session?.tipoUsuario} />
      <div style={styles.content}>
        <div style={styles.header}>
          <h1 style={styles.title}>Actualizar Producto</h1>
        </div>
        <hr style={styles.divider} />
        <div style={styles.breadcrumbWrapper}>
          <Breadcrumb
            items={breadcrumbItems}
            style={{ width: "Calc(100% - 40px)", marginLeft: "20px" }}
          />
        </div>
      </div>
      <div style={styles.content}>
        <div style={styles.card}>
          <form onSubmit={handleSaveChanges}>
            <div style={styles.row}>
              <div style={{ width: "50%", marginRight: "10px" }}>
                <label style={styles.label}>Nombre</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  disabled={!editMode}
                  style={styles.input}
                />
              </div>
              <div style={{ width: "50%" }}>
              <label style={styles.label}>Precio</label>
              <input
                type="number"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                disabled={!editMode}
                style={styles.input}
              />
            </div>
            </div>
            <div>
                <label style={styles.label}>Descripción</label>
                <input
                  type="text"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  disabled={!editMode}
                  style={styles.input}
                />
              </div>
            <div>
              <label style={styles.label}>Aderezos</label>
              <input
                type="text"
                value={aderezos}
                onChange={(e) => setAderezos(e.target.value)}
                disabled={!editMode}
                style={styles.input}
              />
            </div>
            
            <div>
              <label style={styles.label}>Estado</label>
              <select
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                style={styles.input}
                disabled={!editMode}
              >
                <option value={false}>Standby</option>
                <option value={true}>Listo para la venta</option>
              </select>
            </div>
            <div style={styles.buttonContainer}>
              {!editMode && (
                <button
                  type="button"
                  onClick={handleEditModeToggle}
                  style={styles.submitButton}
                >
                  Editar
                </button>
              )}
              {editMode && (
                <button
                  type="submit"
                  style={styles.submitButton}
                >
                  Guardar Cambios
                </button>
              )}
              <Link
              to={`/listado-productos/${producto?.puestoId}`}
              style={styles.backButton}
            >
              Volver
            </Link>
            </div>
            
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ConsultarProducto;
