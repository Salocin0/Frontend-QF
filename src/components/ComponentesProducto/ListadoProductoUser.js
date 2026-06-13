import banner from "../ComponentesProducto/banner.jpg";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageLayout from "../ComponentesGenerales/PageLayout";
import LoandingComponent from "../ComponentesGenerales/LoandingComponent";
import Footer from "../ComponentesGenerales/Footer";
import ProductoUser from "./ProductoUser";
import { UserContext } from "../ComponentesGenerales/UserContext";
import { useContext } from "react";
import BuscadorProductoConsumidor from "../Filtros y Buscadores/BuscadorProductoConsumidor";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../ComponentesGenerales/Breadcrumb";
import { useLocation } from "react-router-dom";
import useBreakpoint from "../../useBreakpoint";

const ListadoProductoUser = () => {
  const { isMobile, isTablet } = useBreakpoint();
  const { id } = useParams();
  const [loanding, setLoanding] = useState(false);
  const [productos, setProductos] = useState([]);
  const [filteredProductos, setFilteredProductos] = useState([]);
  const [puesto, setPuesto] = useState();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const selectedDay = location.state?.selectedDay || null;
  let evento = location.state?.evento || null;
  const eventoId = location.state?.eventoid;
  
  const breadcrumbItems = [
    { title: "Inicio", url: "/inicio" },
    { title: "Eventos", url: "/Listado-eventos" },
    { title: "Puestos", url: `/listado-puestos/${evento?.id || id}` },
    { title: "Productos", url: `/productos/${puesto?.id}` },
  ];
  console.log(eventoId);
  if(evento===null){
    evento={id:eventoId}
  }
  
  console.log(selectedDay);

  useEffect(() => {
    if (user) {
      setLoanding(false);
      const headers = new Headers();
      headers.append("ConsumidorId", user.consumidorId);
      headers.append("puestoId", id);

      const fetchProductos = fetch(`${process.env?.REACT_APP_BACK_URL}producto`, {
        method: "GET",
        headers: headers,
      }).then((response) => response.json());

      const fetchPuesto = fetch(`${process.env?.REACT_APP_BACK_URL}puesto/consultar/${id}`, {
        method: "GET",
      }).then((response) => response.json());

      Promise.all([fetchProductos, fetchPuesto])
        .then(([productosData, puestoData]) => {
          setProductos(productosData.data);
          setFilteredProductos(productosData.data);
          setPuesto(puestoData.data);
          setLoanding(true);
        })
        .catch((error) => {
          console.log("Error al cargar productos.", error);
          setLoanding(true);
        });
    }
  }, [user, id]);

  // Maneja el filtro de productos
  const handleSearch = (searchTerm) => {
    const filtered = productos.filter(
      (producto) =>
        producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProductos(filtered);
  };

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
        {/* Banner */}
        <div style={{
          backgroundImage: `url(${banner})`,
          height: "120px",
          backgroundSize: "100%",
          backgroundRepeat: "no-repeat",
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          borderBottom: "2px solid var(--qf-blanco-puro)",
          marginBottom: "20px",
          paddingLeft: "16px",
        }}>
          <h1 className="qf-page-title" style={{
            fontSize: "1.5rem",
            backgroundColor: "var(--qf-bg-secondary)",
            padding: "10px 16px",
            borderRadius: "10px",
            border: "2px solid var(--qf-blanco-puro)",
            width: "98%",
            margin: 0,
            textAlign: "left",
          }}>
            {puesto?.nombreCarro}
          </h1>
        </div>

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
            height: isMobile ? "auto" : "100%",
            overflow: isMobile ? "visible" : "hidden",
          }}>
            {/* Columna izquierda: breadcrumb + productos */}
            <div style={{
              width: isMobile ? "100%" : isTablet ? "65%" : "70%",
              boxSizing: "border-box",
            }}>
              <div style={{ paddingLeft: "16px" }}>
                <Breadcrumb items={breadcrumbItems} />
              </div>

              <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "0",
                paddingBottom: "80px",
                overflow: "visible",
                width: "100%",
                boxSizing: "border-box",
              }}>
                {!loanding ? (
                  <LoandingComponent />
                ) : Array.isArray(filteredProductos) && filteredProductos.length > 0 ? (
                  filteredProductos.map((producto, index) => (
                    <div key={index} style={{ width: "100%", display: "flex", justifyContent: "center", boxSizing: "border-box" }}>
                      <ProductoUser producto={producto} user={user} idpuesto={id} selectedDay={selectedDay} evento={evento}/>
                    </div>
                  ))
                ) : (
                  <h2 className="qf-no-results">
                    No existen productos en este carrito.
                  </h2>
                )}
              </div>
            </div>

            {/* Columna derecha: buscador + botón carrito */}
            <div style={{
              width: isMobile ? "100%" : isTablet ? "35%" : "30%",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              alignItems: isMobile ? "stretch" : "flex-start",
              order: isMobile ? -1 : 0,
            }}>
              <div className="qf-search-box">
                <BuscadorProductoConsumidor onSearch={handleSearch} />
              </div>
              <button
                className="qf-btn qf-btn--primary"
                style={{ width: "100%" }}
                onClick={() => navigate("/carrito")}
              >
                Ir a mi Carrito
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </PageLayout>
  );
};

export default ListadoProductoUser;
