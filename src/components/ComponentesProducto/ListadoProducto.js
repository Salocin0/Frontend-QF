import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Footer from "../ComponentesGenerales/Footer";
import PageLayout from "../ComponentesGenerales/PageLayout";
import Producto from "./Producto";
import { UserContext } from "../ComponentesGenerales/UserContext";
import { useContext } from "react";
import { useLocation } from "react-router-dom";
import Breadcrumb from "../ComponentesGenerales/Breadcrumb";
import LoandingComponent from "../ComponentesGenerales/LoandingComponent";
import { FaEyeSlash, FaPlus, FaSearch } from "react-icons/fa";
import useBreakpoint from "../../useBreakpoint";

const ListadoProducto = () => {
  const { isMobile, isTablet } = useBreakpoint();
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const [productos, setProductos] = useState([]);
  const [recargar, setRecargar] = useState(0);
  const [busqueda, setBusqueda] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const carrito = location.state;

  const recargarComponente = () => {
    setRecargar((prev) => prev + 1);
  };

  useEffect(() => {
    if (user) {
      const headers = new Headers();
      headers.append("ConsumidorId", user.consumidorId);
      headers.append("puestoId", id);

      setIsLoading(true);
      fetch(`${process.env?.REACT_APP_BACK_URL}producto`, {
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
    { title: "Mis Productos", url: `/listado-productos${carrito?.id}` },
  ];

  return (
    <PageLayout sidebarProps={{ tipoUsuario: user?.tipoUsuario }}>
      <div style={{
        width: isMobile ? "100%" : "80%",
        height: "100%",
        padding: 0,
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        flex: 1,
      }}>
        {/* Header con título + link a deshabilitados */}
        <div className="qf-page-header" style={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}>
          <h1 className="qf-page-title" style={{ fontSize: "1.75rem" }}>
            {carrito?.nombreCarro
              ? "Productos de " + carrito?.nombreCarro
              : "Productos"}
          </h1>
          <Link
            to={`/listado-productos-deshabilitados/${id}`}
            style={{
              position: "absolute",
              top: "10px",
              right: "20px",
              backgroundColor: "var(--qf-bg-secondary)",
              padding: "10px",
              borderRadius: "10px",
              color: "var(--qf-blanco-puro)",
              fontWeight: "bold",
              cursor: "pointer",
              textDecoration: "none",
            }}
          >
            <FaEyeSlash /> Productos Deshabilitados
          </Link>
        </div>
        <hr className="qf-separator" style={{ marginRight: "1rem" }} />

        {/* Contenido scrollable con dos columnas */}
        <div style={{
          flex: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}>
          <div style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: "20px",
            alignItems: isMobile ? "stretch" : "flex-start",
            padding: "1rem 20px 50px 20px",
          }}>
            {/* Columna izquierda: breadcrumb + productos */}
            <div style={{
              width: isMobile ? "100%" : isTablet ? "65%" : "70%",
              boxSizing: "border-box",
            }}>
              <div style={{
                margin: "0 0 10px 0",
                backgroundColor: "var(--qf-bg-secondary)",
                width: "100%",
                padding: "8px 16px",
                borderRadius: "10px",
                border: "1px solid var(--qf-naranja)",
              }}>
                <Breadcrumb
                  items={breadcrumbItems}
                  style={{
                    width: "100%",
                    margin: "0",
                    padding: "0",
                    backgroundColor: "transparent",
                    border: "none",
                  }}
                />
              </div>

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
                      />
                    ))
                ) : (
                  <h2 className="qf-no-results">
                    No tienes ningún producto asociado a este carrito.
                  </h2>
                )}
              </div>
            </div>

            {/* Columna derecha: buscador + botón agregar */}
            <div style={{
              width: isMobile ? "100%" : "30%",
              minWidth: isMobile ? "auto" : "260px",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              order: isMobile ? -1 : 0,
            }}>
              <div style={{ display: "flex", gap: "5px" }}>
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  style={{
                    flex: 1,
                    padding: "8px",
                    borderRadius: "4px",
                    border: `1px solid var(--qf-text-muted)`,
                    backgroundColor: "var(--qf-bg-main)",
                    color: "var(--qf-text-primary)",
                  }}
                />
                <button
                  onClick={() => { /* filtering already automatic */ }}
                  className="qf-btn qf-btn--success"
                  style={{ padding: "8px 12px", display: "flex", alignItems: "center", gap: "4px" }}
                >
                  <FaSearch />
                  Buscar
                </button>
              </div>
              <Link
                to={`/registrar-productos/${id}`}
                className="qf-btn qf-btn--primary"
                style={{ textDecoration: "none", textAlign: "center" }}
              >
                <FaPlus style={{ marginRight: "6px" }} />
                Agregar Producto
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </PageLayout>
  );
};

export default ListadoProducto;
