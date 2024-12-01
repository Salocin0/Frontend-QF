import banner from "../ComponentesProducto/banner.jpg";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../ComponentesGenerales/Sidebar";
import Footer from "../ComponentesGenerales/Footer";
import ProductoUser from "./ProductoUser";
import { UserContext } from "../ComponentesGenerales/UserContext";
import { useContext } from "react";
import useDynamicColors from "../../UseDinamicColors";
import BuscadorProductoConsumidor from "../Filtros y Buscadores/BuscadorProductoConsumidor";
import Breadcrumb from "../ComponentesGenerales/Breadcrumb";

const ListadoProductoUser = () => {
  const { id } = useParams();
  const [productos, setProductos] = useState([]);
  const [filteredProductos, setFilteredProductos] = useState([]);
  const [puesto, setPuesto] = useState();
  const { user } = useContext(UserContext);
  const Colors = useDynamicColors();
  const navigate = useNavigate();
  const breadcrumbItems = [
    { title: "Inicio", url: "/inicio" },
    { title: "Eventos", url: "/Listado-eventos" },
    { title: "Puestos", url: `/listado-puestos/${id}` },
    { title: "Productos", url: `/productos/${puesto?.id}` },
  ];
  const location = useLocation();
  const selectedDay = location.state?.selectedDay || null;

  useEffect(() => {
    if (user) {
      const headers = new Headers();
      headers.append("ConsumidorId", user.consumidorId);
      headers.append("puestoId", id);

      fetch(`${process.env?.REACT_APP_BACK_URL}producto`, {
        method: "GET",
        headers: headers,
      })
        .then((response) => response.json())
        .then((data) => {
          setProductos(data.data);
          setFilteredProductos(data.data); // Inicializa los productos filtrados
        })
        .catch((error) => console.log("No existen productos.", error));
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetch(`${process.env?.REACT_APP_BACK_URL}puesto/consultar/${id}`, {
        method: "GET",
      })
        .then((response) => response.json())
        .then((data) => {
          setPuesto(data.data);
        })
        .catch((error) => console.log("No existen carritos.", error));
    }
  }, [user]);

  const handleSearch = (searchTerm) => {
    const filtered = productos.filter(
      (producto) =>
        producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProductos(filtered);
  };

  const styles = {
    container: {
      display: "flex",
      flexDirection: "row",
      margin: "0",
      padding: "0",
      height: "100vh",
      backgroundColor: Colors.GrisAzuladoOscuro,
      overflow: "hidden",
    },
    sidebar: {
      width: "20%",
    },
    mainContent: {
      width: "80%",
    },
    banner: {
      backgroundImage: `url(${banner})`,
      height: "150px",
      backgroundSize: "100%",
      backgroundRepeat: "no-repeat",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      borderBottom: `2px solid ${Colors.BlancoEnBlanco}`,
      marginBottom: "20px",
    },
    bannerText: {
      fontSize: "32px",
      fontWeight: "bold",
      color: Colors.Naranja,
      backgroundColor: Colors.GrisAzuladoClaro,
      padding: "20px",
      borderRadius: "10px",
      border: `2px solid ${Colors.BlancoEnBlanco}`,
    },
    productsContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      overflowY: "scroll",
      height: "calc(100vh - 200px)",
      paddingBottom: "40px",
      scrollbarWidth: "none",
      msOverflowStyle: "none",
      "::-webkit-scrollbar": {
        display: "none",
      },
    },
    productCard: {
      width: "100%",
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-between",
      gap: "10px",
    },
    noProductsMessage: {
      textAlign: "center",
      fontSize: "24px",
      color: Colors.Naranja,
      height: "50vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    buscador: {
      width: "15%",
      position: "absolute",
      top: "170px",
      right: "2%",
      border: `1px solid ${Colors.Naranja}`,
      borderRadius: "10px",
      zIndex: 2,
    },
    boton: {
      width: "100%",
      border: `1px solid ${Colors.Naranja}`,
      borderRadius: "10px",
      backgroundColor: Colors.Naranja,
      padding: "10px",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <Sidebar tipoUsuario={user?.tipoUsuario} />
      </div>
      <div style={styles.buscador}>
        <BuscadorProductoConsumidor onSearch={handleSearch} />
        <button style={styles.boton} onClick={() => navigate("/carrito")}>
          Ir a mi Carrito
        </button>
      </div>

      <div style={styles.mainContent}>
        <div style={styles.banner}>
          <h1 style={styles.bannerText}>{puesto?.nombreCarro}</h1>
        </div>
        <Breadcrumb items={breadcrumbItems} />
        <div style={styles.productsContainer}>
          {Array.isArray(filteredProductos) && filteredProductos.length > 0 ? (
            filteredProductos.map((producto, index) => (
              <div key={index} style={styles.productCard}>
                <ProductoUser producto={producto} user={user} idpuesto={id} selectedDay={selectedDay} />
              </div>
            ))
          ) : (
            <h2 style={styles.noProductsMessage}>
              No existen productos en este carrito.
            </h2>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ListadoProductoUser;
