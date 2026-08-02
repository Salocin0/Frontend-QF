import React, { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import Footer from "../ComponentesGenerales/Footer";
import PageLayout from "../ComponentesGenerales/PageLayout";
import Producto from "./Producto";
import { UserContext } from "../ComponentesGenerales/UserContext";
import { useContext } from "react";
import Breadcrumb from "../ComponentesGenerales/Breadcrumb";
import LoandingComponent from "../ComponentesGenerales/LoandingComponent";
import { FaEye, FaPlus } from "react-icons/fa";

const ListadoProductoDeshabilitado = () => {
  const contentRef = useRef(null);
  const [contentWidth, setContentWidth] = useState(0);
  const isNarrowLayout = contentWidth < 768 && contentWidth > 0;

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setContentWidth(entry.contentRect.width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const { id } = useParams();
  const { user } = useContext(UserContext);
  const [productos, setProductos] = useState([]);
  const [recargar, setRecargar] = useState(0);
  const [busqueda, setBusqueda] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const recargarComponente = () => {
    setRecargar((prev) => prev + 1);
  };

  useEffect(() => {
    if (user) {
      const headers = new Headers();
      headers.append("ConsumidorId", user.consumidorId);
      headers.append("puestoId", id);

      setIsLoading(true);
      fetch(`${process.env?.REACT_APP_BACK_URL}producto/${id}/deshabilitados`, {
        method: "GET",
        headers: headers,
      })
        .then((response) => response.json())
        .then((data) => setProductos(data.data))
        .catch((error) => console.log("No existen carritos.", error))
        .finally(() => setIsLoading(false));
    }
  }, [user, recargar, id]);

  const breadcrumbItems = [
    { title: "Inicio", url: "/inicio" },
    { title: "Mis Puestos", url: "/listado-puestos-encargado" },
    { title: "Mis Productos", url: `/listado-productos/${id}` },
    { title: "Productos Deshabilitados", url: `/listado-productos-deshabilitados/${id}` },
  ];

  return (
    <PageLayout sidebarProps={{ tipoUsuario: user?.tipoUsuario }}>
      <div ref={contentRef} style={{
        width: "100%",
        height: "100%",
        padding: 0,
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        flex: 1,
      }}>
        {/* Título centrado */}
        <h1 style={{
          textAlign: "center",
          paddingTop: "1rem",
          paddingBottom: "1rem",
          fontSize: "2rem",
          color: "var(--qf-naranja)",
          margin: 0,
        }}>
          Productos Deshabilitados
        </h1>
        <hr style={{
          border: "none",
          borderTop: "1px solid var(--qf-naranja)",
          margin: 0,
          width: "100%",
        }} />

        {/* Contenido scrollable con dos columnas */}
        <div style={{
          flex: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}>
          <div style={{
            display: "flex",
            flexDirection: isNarrowLayout ? "column" : "row",
            gap: "20px",
            alignItems: isNarrowLayout ? "stretch" : "flex-start",
            padding: "1rem 20px 50px 20px",
          }}>
            {/* Columna izquierda: breadcrumb + productos */}
            <div style={{
              width: isNarrowLayout ? "100%" : "70%",
              boxSizing: "border-box",
            }}>
              <Breadcrumb
                items={breadcrumbItems}
                style={{ width: "100%", margin: "0 0 10px 0" }}
              />

              <div style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}>
                {isLoading ? (
                  <LoandingComponent />
                ) : Array.isArray(productos) &&
                  productos.filter((p) =>
                    JSON.stringify(p)
                      .toLowerCase()
                      .includes(busqueda.toLowerCase())
                  ).length > 0 ? (
                  productos
                    .filter((p) =>
                      JSON.stringify(p)
                        .toLowerCase()
                        .includes(busqueda.toLowerCase())
                    )
                    .map((producto, index) => (
                      <Producto
                        key={index}
                        producto={producto}
                        idpuesto={id}
                        recargar={recargarComponente}
                        isDisabled={true}
                      />
                    ))
                ) : (
                  <h2 className="qf-no-results">
                    No tienes ningún producto deshabilitado en este carrito.
                  </h2>
                )}
              </div>
            </div>

            {/* Columna derecha: buscador + botón agregar + volver */}
            <div style={{
              width: isNarrowLayout ? "100%" : "30%",
              minWidth: isNarrowLayout ? "auto" : "260px",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              order: isNarrowLayout ? -1 : 0,
            }}>
              <input
                type="text"
                placeholder="Buscar productos..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "4px",
                  border: `1px solid var(--qf-text-muted)`,
                  backgroundColor: "var(--qf-bg-main)",
                  color: "var(--qf-text-primary)",
                  boxSizing: "border-box",
                }}
              />
              <Link
                to={`/registrar-productos/${id}`}
                className="qf-btn qf-btn--primary"
                style={{ textDecoration: "none", textAlign: "center" }}
              >
                <FaPlus style={{ marginRight: "6px" }} />
                Agregar Producto
              </Link>
              <Link
                to={`/listado-productos/${id}`}
                className="qf-btn"
                style={{
                  textDecoration: "none",
                  textAlign: "center",
                  backgroundColor: "var(--qf-bg-secondary)",
                  padding: "10px",
                  borderRadius: "10px",
                  color: "var(--qf-blanco-puro)",
                  fontWeight: "bold",
                }}
              >
                <FaEye style={{ marginRight: "6px" }} /> Productos Habilitados
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </PageLayout>
  );
};

export default ListadoProductoDeshabilitado;
