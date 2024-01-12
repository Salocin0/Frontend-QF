import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import Sidebar from "../../ComponentesGenerales/Sidebar";
import "./../../sass/main.css";
import Pedido from "../Pedido";
import PedidoEncargado from "./PedidoRepartidor";
import PedidoRepartidor from "./PedidoRepartidor";

const ListadoPedidosRepartidor = () => {
  const [rows, setRows] = useState([]);
  const [session, setSession] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [recargar, setRecargar] = useState(0);

  const recargarComponente = () => {
    setRecargar(prevRecargar => prevRecargar + 1);
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

      fetch(`${process.env?.REACT_APP_BACK_URL}pedido/repartidor`, {
        method: "GET",
        headers: headers,
      })
        .then((response) => response.json())
        .then((data) => {
          setPedidos(data.data);
          console.log(data);
          const totalEventos = Math.ceil(data.data.length / 4) * 4;
          const eventosConNulos = [
            ...data.data,
            ...Array(totalEventos - data.data.length).fill(null),
          ];

          const generatedRows = [];
          for (let i = 0; i < eventosConNulos.length; i += 4) {
            const row = eventosConNulos.slice(i, i + 4);
            generatedRows.push(row);
          }
          setRows(generatedRows);
          
        })
        .catch((error) => console.log("No existen pedidos.", error));
    }
  }, [session, recargar]);

  return (
    <div>
      <div className={`row m-0 mainFormEventos`}>
        <div className="col-2 p-0">
          <Sidebar tipoUsuario={session?.tipoUsuario} />
        </div>
        <div className={`col-10`}>
          <div className="d-flex justify-content-center mb-3 tituloSeccion">
            <h1 className="pt-2">
              Pedidos asignados
            </h1>
          </div>
          <hr style={{ color: "#F7B813" }} />
          <div className="d-flex align-items-center justify-content-center">
            <div className="pt-2 pb-4 h-100 w-100">
              {Array.isArray(pedidos) && pedidos.length > 0 ? (
                rows.length > 0 &&
                rows.map((row, rowIndex) => (
                  <div key={rowIndex} >
                    {row.map((pedido, index) => (
                      <div
                        key={index}
                      >
                        {pedido !== null ? (
                          <PedidoRepartidor
                            pedido={pedido}
                            session={session}
                            recargar={recargarComponente}
                          />
                        ) : null}
                      </div>
                    ))}
                  </div>
                ))
              ) : (
                <h2 className={"tituloSeccionNegativo"}>
                  No hay Pedidos asignados
                </h2>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListadoPedidosRepartidor;
