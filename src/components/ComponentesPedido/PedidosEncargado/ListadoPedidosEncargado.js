import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import KanbanBoard from "../../ComponentesEPC/KanbanBoard.js";
import PageLayout from "../../ComponentesGenerales/PageLayout";
import { UserContext } from "../../ComponentesGenerales/UserContext.js";
import Footer from "../../ComponentesGenerales/Footer.js";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Breadcrumb from "../../ComponentesGenerales/Breadcrumb.js";
import useBreakpoint from "../../../useBreakpoint";

const ListadoPedidosEncargado = () => {
  const { isMobile } = useBreakpoint();
  const { user } = useContext(UserContext);
  const [pedidos, setPedidos] = useState([]);
  const [recargar, setRecargar] = useState(0);
  const { id } = useParams();
  const location = useLocation();
  const carrito = location.state;

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
    pagina: {
      display: "flex",
      flexDirection: "column",
      gap: "20px",
      flex: 1,
      minHeight: 0,
      overflow: "hidden", // necesario para que el flex:1 anclado funcione en toda la cadena
      paddingTop: "20px",
      paddingLeft: "20px",
      paddingRight: "20px",
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
    boardWrapper: {
      display: "flex",
      justifyContent: "center",
      flex: 1,
      minHeight: 0,
      overflow: "hidden", // ancla el board al espacio restante; el scroll horizontal queda siempre visible
    },
  };

  const breadcrumbItems = [
    { title: "Inicio", url: "/inicio" },
    { title: "Mis Puestos", url: "/listado-puestos-encargado" },
    { title: "Mis Pedidos", url: `/pedidos-Encargado/${carrito.id}` },
  ];

  return (
    <PageLayout sidebarProps={{ tipoUsuario: user?.tipoUsuario }}>
      <div style={styles.pagina}>
        {/* Título centrado */}
        <h1 style={styles.tituloSeccion}>
          Pedidos {carrito?.nombreCarro}
        </h1>

        {/* HR a ancho completo */}
        <hr style={styles.hrFull} />

        {/* Breadcrumb a ancho completo */}
        <div style={styles.breadcrumbWrapper}>
          <Breadcrumb
            items={breadcrumbItems}
            style={{ width: "100%", margin: "8px 0" }}
          />
        </div>

        {/* Kanban board */}
        <div style={styles.boardWrapper}>
          {Array.isArray(pedidos) && pedidos.length > 0 ? (
            <KanbanBoard
              initialData={initialData}
              onUpdateState={updatePedidoState}
              id={id}
            />
          ) : (
            <h2 style={{ fontSize: "2rem", color: "var(--qf-naranja)", textAlign: "center" }}>
              No hay Pedidos hechos.
            </h2>
          )}
        </div>
      </div>
      <Footer />
    </PageLayout>
  );
};

export default ListadoPedidosEncargado;
