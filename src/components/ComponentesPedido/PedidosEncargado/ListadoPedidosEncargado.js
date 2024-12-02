import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import KanbanBoard from "../../ComponentesEPC/KanbanBoard.js";
import Sidebar from "../../ComponentesGenerales/Sidebar.js";
import { UserContext } from "../../ComponentesGenerales/UserContext.js";
import useDynamicColors from "../../../UseDinamicColors.js";
import Footer from "../../ComponentesGenerales/Footer.js";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";

const ListadoPedidosEncargado = () => {
  const { user } = useContext(UserContext);
  const [pedidos, setPedidos] = useState([]);
  const [recargar, setRecargar] = useState(0);
  const Colors = useDynamicColors();
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
  }, [user, recargar,id]);

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
      width: "100%",
    },
    tituloSeccion: {
      display: "flex",
      justifyContent: "center",
      paddingTop: "2rem",
      fontSize: "2rem",
      color: Colors.Naranja,
    },
    row: {
      margin: 0,
      backgroundColor: Colors.GrisAzuladoOscuro,
      height: "100vh",
      overflowY: "auto", // Permite el desplazamiento solo si es necesario
      msOverflowStyle: "none", // IE and Edge
      scrollbarWidth: "none", // Firefox
      WebkitScrollbar: { display: "none" }, // Hide scrollbar for Chrome, Safari, and Opera
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
      paddingTop: "2rem",
      paddingBottom: "4rem",
      width: "100%",
      height: "100%",
    },
    tituloSeccionNegativo: {
      fontSize: "2rem",
      color: Colors.Naranja,
      textAlign: "center",
    },
  };

  return (
    <div style={styles.row}>
      <Sidebar tipoUsuario={user?.tipoUsuario} />
      <div style={styles.colContent}>
        <div style={styles.tituloSeccion}>
          <h1>Pedidos {carrito?.nombreCarro}</h1>
        </div>
        <hr style={{ color: Colors.Naranja }} />
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
      <Footer/>
    </div>
  );
};

export default ListadoPedidosEncargado;
