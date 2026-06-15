import React, { useEffect, useState, useContext } from "react";
import PageLayout from "../ComponentesGenerales/PageLayout";
import Pedido from "./Pedido";
import LoandingComponent from "../ComponentesGenerales/LoandingComponent";
import { UserContext } from "../ComponentesGenerales/UserContext";
import Tabs from "./PedidosRepartidor/Tabs";
import Breadcrumb from "../ComponentesGenerales/Breadcrumb";
import Footer from "../ComponentesGenerales/Footer";

const ListadoPedidos = () => {
  const [loanding, setLoanding] = useState(false);
  const [rows, setRows] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [recargar, setRecargar] = useState(0);
  const { user } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState("Todos");
  const [pedidosFiltrados, setPedidosFiltrados] = useState([]);

  // Función para recargar el componente
  const recargarComponente = () => {
    setRecargar((prev) => prev + 1);
  };

  // useEffect para cargar los pedidos
  useEffect(() => {
    if (user) {
      setLoanding(false);
      const headers = new Headers();
      headers.append("ConsumidorId", user.consumidorId);

      fetch(`${process.env?.REACT_APP_BACK_URL}pedido/`, {
        method: "GET",
        headers: headers,
      })
        .then((response) => response.json())
        .then((data) => {
          setPedidos(data.data);
          setLoanding(true);
        })
        .catch((error) => {
          console.log("No existen pedidos.", error);
          setLoanding(true);
        });
    }
  }, [user, recargar]);

  // useEffect para filtrar los pedidos
  useEffect(() => {
    const pedidosFiltrados = pedidos.filter((pedido) => {
      if (activeTab === "Todos") return true;
      if (activeTab === "Pendientes") return pedido.estado === "Pendiente";
      if (activeTab === "Aceptados")
        return pedido.estado === "Aceptado" || pedido.estado === "Precomprado";
      if (activeTab === "En Preparacion")
        return pedido.estado === "EnPreparacion";
      if (activeTab === "En Camino") return pedido.estado === "EnCamino";
      if (activeTab === "Entregados") return pedido.estado === "Entregado";
      if (activeTab === "Cancelados") return pedido.estado === "Cancelado";
      return pedido.estado.toLowerCase() === activeTab.toLowerCase();
    });

    // Actualizar el estado de pedidosFiltrados
    setPedidosFiltrados(pedidosFiltrados);
  }, [pedidos, activeTab]);

  // useEffect para organizar los pedidos en filas de 4 elementos
  useEffect(() => {
    const totalEventos = Math.ceil(pedidosFiltrados.length / 4) * 4;
    const eventosConNulos = [
      ...pedidosFiltrados,
      ...Array(totalEventos - pedidosFiltrados.length).fill(null),
    ];

    const generatedRows = [];
    for (let i = 0; i < eventosConNulos.length; i += 4) {
      const row = eventosConNulos.slice(i, i + 4);
      generatedRows.push(row);
    }
    setRows(generatedRows);
  }, [pedidosFiltrados]);

  const styles = {
    mainContent: {
      width: "100%",
      padding: "0 20px",
      height: "100%",
      marginBottom: "5rem",
    },
    titleSection: {
      display: "flex",
      justifyContent: "center",
      marginBottom: "1rem",
    },
    seccionNegativo: {
      color: "var(--qf-naranja)",
    },
    separator: {
      border: "none",
      borderTop: `1px solid var(--qf-naranja)`,
    },
    contentWrapper: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    pedidosWrapper: {
      width: "100%",
      paddingTop: "0.5rem",
      paddingBottom: "3rem",
      overflowY: "auto",
      height: "calc(100vh - 250px)",
      scrollbarWidth: "none",
      msOverflowStyle: "none",
    },
  };

  const breadcrumbItems = [
    { title: "Inicio", url: "/inicio" },
    { title: "Mis pedidos", url: "/Listado-eventos" },
  ];

  return (
    <PageLayout sidebarProps={{ tipoUsuario: user?.tipoUsuario }}>
      <div style={styles.mainContent}>
        <div style={styles.titleSection}>
          <h1 className="qf-page-title">Pedidos</h1>
        </div>
        <hr className="qf-separator" style={{ marginLeft: "-40px", marginRight: "-40px", width: "auto", marginBottom: "20px" }} />
        <Breadcrumb
          items={breadcrumbItems}
          style={{ width: "100%", margin: "10px 0" }}
        />

        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <div style={styles.contentWrapper}>
          <div style={styles.pedidosWrapper}>
            {!loanding ? (
              <LoandingComponent />
            ) : Array.isArray(pedidosFiltrados) && pedidosFiltrados.length > 0 ? (
              rows.length > 0 &&
              rows.map((row, rowIndex) => (
                <div key={rowIndex}>
                  {row.map((pedido, index) => (
                    <div key={index}>
                      {pedido !== null ? (
                        <Pedido pedido={pedido} recargar={recargarComponente} />
                      ) : null}
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <h2 style={styles.seccionNegativo}>No hay Pedidos hechos.</h2>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </PageLayout>
  );
};

export default ListadoPedidos;
