import React, { useEffect, useState } from "react";
import Sidebar from "../ComponentesGenerales/Sidebar";
import Pedido from "./Pedido";
import { useContext } from "react";
import { UserContext } from "../ComponentesGenerales/UserContext";
import usedynamicColors from "../../UseDinamicColors";
import Tabs from "./PedidosRepartidor/Tabs";
import Breadcrumb from "../ComponentesGenerales/Breadcrumb";

const ListadoPedidos = () => {
  const [rows, setRows] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [recargar, setRecargar] = useState(0);
  const { user } = useContext(UserContext);
  const Colors = usedynamicColors();
  const [activeTab, setActiveTab] = useState("Todos");
  const [pedidosFiltrados, setPedidosFiltrados] = useState([]);

  // Función para recargar el componente
  const recargarComponente = () => {
    setRecargar((prev) => prev + 1);
  };

  // useEffect para cargar los pedidos
  useEffect(() => {
    if (user) {
      const headers = new Headers();
      headers.append("ConsumidorId", user.consumidorId);

      fetch(`${process.env?.REACT_APP_BACK_URL}pedido/`, {
        method: "GET",
        headers: headers,
      })
        .then((response) => response.json())
        .then((data) => {
          setPedidos(data.data);
        })
        .catch((error) => console.log("No existen pedidos.", error));
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
    mainFormEventos: {
      margin: 0,
      backgroundColor: Colors.GrisAzuladoOscuro,
      minHeight: "100vh",
    },
    sidebarCol: {
      padding: 0,
      margin: 0,
      width: "20%",
    },
    contentCol: {
      padding: 0,
      margin: 0,
      marginLeft: "Calc(20% - 10px)",
    },
    tituloSeccion: {
      display: "flex",
      justifyContent: "center",
      marginBottom: "1rem",
    },
    tituloTexto: {
      paddingTop: "0.5rem",
      color: Colors.Naranja,
    },
    seccionNegativo: {
      color: Colors.Naranja,
    },
    divider: {
      color: Colors.Naranja,
    },
    contentWrapper: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginLeft: "30px",
      width: "Calc(100% - 50px)",
    },
    pedidosWrapper: {
      paddingTop: "0.5rem",
      paddingBottom: "3rem",
      width: "100%",
      margin: "0",
      overflowY: "scroll",
      height: "calc(100vh - 250px)",
      scrollbarWidth: "none",
      msOverflowStyle: "none",
    },
    breadcrumbWrapper: {
      width: "100%",
      paddingTop: "10px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
  };

  const breadcrumbItems = [
    { title: "Inicio", url: "/inicio" },
    { title: "Mis pedidos", url: "/Listado-eventos" },
  ];

  return (
    <div style={styles.mainFormEventos}>
      <div style={styles.sidebarCol}>
        <Sidebar tipoUsuario={user?.tipoUsuario} />
      </div>
      <div style={styles.contentCol}>
        <div style={styles.tituloSeccion}>
          <h1 style={styles.tituloTexto}>Pedidos</h1>
        </div>
        <hr style={styles.divider} />
        <div style={styles.breadcrumbWrapper}>
          <Breadcrumb
            items={breadcrumbItems}
            style={{ width: "Calc(100% - 50px)" }}
          />
        </div>

        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <div style={styles.contentWrapper}>
          <div style={styles.pedidosWrapper}>
            {Array.isArray(pedidosFiltrados) && pedidosFiltrados.length > 0 ? (
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
    </div>
  );
};

export default ListadoPedidos;
