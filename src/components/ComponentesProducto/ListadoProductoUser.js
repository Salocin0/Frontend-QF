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

const ListadoProductoUser = () => {
  const { id } = useParams();
  const [loanding, setLoanding] = useState(false);
  const [productos, setProductos] = useState([]);
  const [filteredProductos, setFilteredProductos] = useState([]);
  const [puesto, setPuesto] = useState();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  
  const breadcrumbItems = [
    { title: "Inicio", url: "/inicio" },
    { title: "Eventos", url: "/Listado-eventos" },
    { title: "Puestos", url: `/listado-puestos/${id}` },
    { title: "Productos", url: `/productos/${puesto?.id}` },
  ];
  const location = useLocation();
  const selectedDay = location.state?.selectedDay || null;
  let evento = location.state?.evento || null;
  const eventoId = location.state?.eventoid;
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

  const styles = {
    mainContent: {
      width: "80%",
      padding: "0",
      boxSizing: "border-box",
    },
    contentRow: {
      display: "flex",
      gap: "20px",
      alignItems: "flex-start",
    },
    leftCol: {
      width: "70%",
      boxSizing: "border-box",
    },
    rightColInner: {
      width: "30%",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      alignItems: "flex-start",
    },
    buscadorBox: {
      width: "98%",
      border: `1px solid var(--qf-naranja)`,
      borderRadius: "10px",
      padding: "8px 16px",
      boxSizing: "border-box",
      backgroundColor: "var(--qf-bg-secondary)",
    },
    boton: {
      width: "98%",
      border: `1px solid var(--qf-naranja)`,
      borderRadius: "10px",
      backgroundColor: "var(--qf-naranja)",
      padding: "10px",
      color: "var(--qf-text-primary)",
      cursor: "pointer",
    },
    banner: {
      backgroundImage: `url(${banner})`,
      height: "120px",
      backgroundSize: "100%",
      backgroundRepeat: "no-repeat",
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "center",
      borderBottom: `2px solid var(--qf-blanco-puro)`,
      marginBottom: "20px",
      paddingLeft: "16px",
    },
    bannerText: {
      fontSize: "32px",
      fontWeight: "bold",
      color: "var(--qf-naranja)",
      backgroundColor: "var(--qf-bg-secondary)",
      padding: "10px 16px",
      borderRadius: "10px",
      border: `2px solid var(--qf-blanco-puro)`,
      width: "98%",
      margin: 0,
      textAlign: "left",
    },
    productsContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "0",
      paddingBottom: "80px",
      // Dejar que la página maneje el scroll, no el contenedor
      overflow: "visible",
      width: "100%",
      boxSizing: "border-box",
    },
    productCard: {
      width: "100%",
      display: "flex",
      justifyContent: "center",
      boxSizing: "border-box",
    },
    noProductsMessage: {
      textAlign: "center",
      fontSize: "24px",
      color: "var(--qf-naranja)",
      height: "50vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },

  };

  return (
    <PageLayout sidebarProps={{ tipoUsuario: user?.tipoUsuario }}>

      <div style={styles.mainContent}>
        <div style={styles.banner}>
          <h1 style={styles.bannerText}>{puesto?.nombreCarro}</h1>
        </div>
        <div style={styles.contentRow}>
          <div style={styles.leftCol}>
            <div>
              <Breadcrumb items={breadcrumbItems} />
            </div>

            <div style={styles.productsContainer}>
              {!loanding ? (
                <LoandingComponent />
              ) : Array.isArray(filteredProductos) && filteredProductos.length > 0 ? (
                filteredProductos.map((producto, index) => (
                  <div key={index} style={styles.productCard}>
                    <ProductoUser producto={producto} user={user} idpuesto={id} selectedDay={selectedDay} evento={evento}/>
                  </div>
                ))
              ) : (
                <h2 style={styles.noProductsMessage}>
                  No existen productos en este carrito.
                </h2>
              )}
            </div>
          </div>

          <div style={styles.rightColInner}>
            <div style={styles.buscadorBox}>
              <BuscadorProductoConsumidor onSearch={handleSearch} />
            </div>
            <button style={styles.boton} onClick={() => navigate("/carrito")}>
              Ir a mi Carrito
            </button>
          </div>
        </div>
      </div>



      <Footer />
    </PageLayout>
  );
};

export default ListadoProductoUser;
