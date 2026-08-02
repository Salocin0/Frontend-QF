import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "../ComponentesGenerales/Footer";
import PageLayout from "../ComponentesGenerales/PageLayout";
import Breadcrumb from "../ComponentesGenerales/Breadcrumb";
import { UserContext } from "../ComponentesGenerales/UserContext";
import useBreakpoint from "../../useBreakpoint";

const ConsultarProducto = () => {
  const { isMobile } = useBreakpoint();
  const { id } = useParams();
  const { user } = useContext(UserContext);
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
      width: "100%",
    },
    breadcrumbWrapper: {
      width: "100%",
    },
    content: {
      display: "flex",
      justifyContent: "center",
      backgroundColor: "var(--qf-bg-main)",
      padding: isMobile ? "0" : "0",
    },
    card: {
      backgroundColor: "var(--qf-bg-secondary)",
      borderRadius: "10px",
      color: "var(--qf-text-primary)",
      width: "100%",
      padding: "20px",
      border: `1px solid var(--qf-naranja)`,
      boxSizing: "border-box",
    },
    label: { color: "var(--qf-text-primary)", padding: 0, margin: 0 },
    buttonContainer: { display: "grid" },
    button: { margin: "0.5rem 0" },
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
      color: "var(--qf-blanco-puro)",
      backgroundColor: "var(--qf-bg-secondary)",
      boxSizing: "border-box",
      overflow: "hidden",
      textOverflow: "ellipsis",
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
    backButton: {
      backgroundColor: "var(--qf-blue)",
      color: "var(--qf-blanco-puro)",
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
    { title: "Mis Productos", url: `/listado-productos/${producto?.puestoId ?? ""}` },
    { title: "Actualizar Producto", url: `/producto/${producto?.id ?? ""}` },
  ];

  return (
    <PageLayout sidebarProps={{ tipoUsuario: user?.tipoUsuario }}>
      <div style={styles.pagina}>
        {/* Título centrado */}
        <h1 style={styles.tituloSeccion}>Actualizar Producto</h1>

        <hr style={styles.hrFull} />

        <div className="qf-page-content">
          <div className="qf-page-content__main">
            {/* Breadcrumb a ancho completo */}
            <div style={styles.breadcrumbWrapper}>
              <Breadcrumb
                items={breadcrumbItems}
                style={{ width: "100%", margin: "8px 0" }}
              />
            </div>

            {/* Formulario centrado */}
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
          </div>
        </div>
      </div>
      <Footer />
    </PageLayout>
  );
};

export default ConsultarProducto;
