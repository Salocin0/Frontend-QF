import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import KanbanBoard from "../../ComponentesEPC/KanbanBoard.js";
import Sidebar from "../../ComponentesGenerales/Sidebar";
import "./../../sass/main.css";


const ListadoPedidosEncargado2 = () => {
  const [session, setSession] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [recargar, setRecargar] = useState(0);

  const recargarComponente = () => {
    setRecargar((prevRecargar) => prevRecargar + 1);
  };

  useEffect(() => {
    const sessionId = localStorage.getItem("sessionId");

    if (!sessionId) {
      console.error("No session ID found.");
      return;
    }

    fetch(`${process.env?.REACT_APP_BACK_URL}user/session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sessionID: sessionId }),
    })
      .then((response) => response.json())
      .then((data) => {
        setSession(data.data);
      })
      .catch((error) => console.error("Error fetching session:", error));
  }, []);

  useEffect(() => {
    if (session) {
      const headers = new Headers();
      headers.append("ConsumidorId", session.consumidorId);

      fetch(`${process.env?.REACT_APP_BACK_URL}pedido/puesto/`, {
        method: "GET",
        headers: headers,
      })
        .then((response) => response.json())
        .then((data) => {
          setPedidos(data.data);
        })
        .catch((error) => console.log("No existen pedidos.", error));
    }
  }, [session, recargar]);

  const initialData = {
    tasks: pedidos.reduce((acc, pedido) => {
      acc[pedido.id] = {
        id: pedido.id,
        content: `Pedido ID: ${pedido.id}, Consumidor: ${pedido.consumidorId}, Total: ${pedido.total.toFixed(2)}`,
        fecha: pedido.fecha,
        total: pedido.total,
        estado: pedido.estado,
      };
      return acc;
    }, {}),
    columns: {
      'column-1': {
        id: 'column-1',
        title: 'To do',
        taskIds: pedidos.filter(pedido => pedido.estado === 'To do').map(pedido => pedido.id),
      },
      'column-2': {
        id: 'column-2',
        title: 'In progress',
        taskIds: pedidos.filter(pedido => pedido.estado === 'In progress').map(pedido => pedido.id),
      },
      'column-3': {
        id: 'column-3',
        title: 'Done',
        taskIds: pedidos.filter(pedido => pedido.estado === 'Done').map(pedido => pedido.id),
      },
    },
    columnOrder: ['column-1', 'column-2', 'column-3'],
  };

  const updatePedidoState = (taskId, newColumnId) => {
    const newState = {
      'column-1': 'To do',
      'column-2': 'In progress',
      'column-3': 'Done',
    };

    const newStatus = newState[newColumnId];

    fetch(`${process.env?.REACT_APP_BACK_URL}pedido/cambiarEstado/${taskId}/${newStatus}`, {
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => {
        toast.success(`Pedido ${newStatus}`);
        recargarComponente();
      })
      .catch((error) => console.error("Error updating pedido state:", error));
  };

  return (
    <div>
      <div className={`row m-0 mainFormEventos`}>
        <div className="col-2 p-0">
          <Sidebar tipoUsuario={session?.tipoUsuario} />
        </div>
        <div className={`col-10`}>
          <div className="d-flex justify-content-center mb-3 tituloSeccion">
            <h1 className="pt-2">Pedidos</h1>
          </div>
          <hr style={{ color: "#F7B813" }} />
          <div className="d-flex align-items-center justify-content-center">
            <div className="pt-2 pb-4 h-100 w-100">
              {Array.isArray(pedidos) && pedidos.length > 0 ? (
                <KanbanBoard initialData={initialData} onUpdateState={updatePedidoState} />
              ) : (
                <h2 className={"tituloSeccionNegativo"}>No hay Pedidos hechos.</h2>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListadoPedidosEncargado2;
