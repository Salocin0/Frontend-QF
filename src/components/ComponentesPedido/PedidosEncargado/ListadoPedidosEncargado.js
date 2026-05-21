import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import KanbanBoard from "../../ComponentesEPC/KanbanBoard.js";
import PageLayout from "../../ComponentesGenerales/PageLayout";
import { UserContext } from "../../ComponentesGenerales/UserContext.js";
import Footer from "../../ComponentesGenerales/Footer.js";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Breadcrumb from "../../ComponentesGenerales/Breadcrumb.js";

const ListadoPedidosEncargado = () => {
  const { user } = useContext(UserContext);
  const [pedidos, setPedidos] = useState([]);
  const [recargar, setRecargar] = useState(0);
  const { id } = useParams();
  const location = useLocation();
  const carrito = location.state;
  console.log(carrito);

  const recargarComponente = () => {
    setRecargar((prevRecargar) => prevRecargar + 1);
  };

  useEffect(() => {
    if (user) {
      const headers = new Headers();
      headers.append("ConsumidorId", user.consumidorId);

      fetch(`${process.env?.REACT_APP_BACK_URL}pedido/puesto/${id}`, {
        method: "GET",
        headers: headers,
      })
        .then((response) => response.json())
        .then((data) => {
          setPedidos(data.data);
          console.log(data.data);
        })
        .catch((error) => console.log("No existen pedidos.", error));
    }
  }, [user, recargar, id]);

  const initialData = {
    tasks: pedidos.reduce((acc, pedido) => {
      acc[pedido.id] = {
        id: pedido.id,
        content: `Pedido ID: ${pedido.id}, Consumidor: ${
          pedido.consumidorId
        }, Total: ${pedido.total.toFixed(2)}`,
        fecha: pedido.fecha,
        total: pedido.total,
        estado: pedido.estado,
      };
      return acc;
    }, {}),
    columns: {
      "column-1": {
        id: "column-1",
        title: "To do",
        taskIds: pedidos
          .filter((pedido) => pedido.estado === "To do")
          .map((pedido) => pedido.id),
      },
      "column-2": {
        id: "column-2",
        title: "In progress",
        taskIds: pedidos
          .filter((pedido) => pedido.estado === "In progress")
          .map((pedido) => pedido.id),
      },
      "column-3": {
        id: "column-3",
        title: "Done",
        taskIds: pedidos
          .filter((pedido) => pedido.estado === "Done")
          .map((pedido) => pedido.id),
      },
    },
    columnOrder: ["column-1", "column-2", "column-3"],
  };

  const updatePedidoState = (taskId, newColumnId) => {
    const newState = {
      "column-1": "To do",
      "column-2": "In progress",
      "column-3": "Done",
    };

    const newStatus = newState[newColumnId];

    fetch(
      `${process.env?.REACT_APP_BACK_URL}pedido/cambiarEstado/${taskId}/${newStatus}`,
      {
        method: "POST",
      }
    )
      .then((response) => response.json())
      .then((data) => {
        toast.success(`Pedido ${newStatus}`);
        recargarComponente();
      })
      .catch((error) => console.error("Error updating pedido state:", error));
  };

  const styles = {
    container: {
      marginBottom: "0",
      width: "Calc(100% - 30px)",
      marginLeft: "20px",
      marginRight: "20px"
    },
    tituloSeccion: {
      display: "flex",
      justifyContent: "center",
      paddingTop: "1rem",
      fontSize: "2rem",
      color: "var(--qf-naranja)",
    },
    colContent: {
      marginLeft: "20%",
      width: "80%",
      height: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
    },
    boardContainer: {
      paddingBottom: "4rem",
      width: "100%",
      height: "100%",
    },
    tituloSeccionNegativo: {
      fontSize: "2rem",
      color: "var(--qf-naranja)",
      textAlign: "center",
    },
    breadcrumbWrapper: {
      width: "Calc(100%)",
      paddingTop: "10px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
  };
  const breadcrumbItems = [
    { title: "Inicio", url: "/inicio" },
    { title: "Mis Puestos", url: "/listado-puestos-encargado" },
    { title: "Mis Pedidos", url: `/pedidos-Encargado/${carrito.id}` },
  ];

  return (
    <PageLayout sidebarProps={{ tipoUsuario: user?.tipoUsuario }}>
      <div style={styles.colContent}>
        <div style={styles.tituloSeccion}>
          <h1>Pedidos {carrito?.nombreCarro}</h1>
        </div>
        <hr style={{ color: "var(--qf-naranja)" }} />
        <div style={styles.breadcrumbWrapper}>
          <Breadcrumb
            items={breadcrumbItems}
            style={{ width: "Calc(100% - 40px)", marginLeft: "20px" }}
          />
        </div>
        <div style={styles.container}>
          <div style={styles.boardContainer}>
            {Array.isArray(pedidos) && pedidos.length > 0 ? (
              <KanbanBoard
                initialData={initialData}
                onUpdateState={updatePedidoState}
                id={id}
              />
            ) : (
              <h2 style={styles.tituloSeccionNegativo}>
                No hay Pedidos hechos.
              </h2>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </PageLayout>
  );
};

export default ListadoPedidosEncargado;
