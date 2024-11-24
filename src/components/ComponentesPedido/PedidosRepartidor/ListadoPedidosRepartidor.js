import React, { useEffect, useState } from "react";
import Sidebar from "../../ComponentesGenerales/Sidebar";
import PedidoRepartidor from "./PedidoRepartidor";
import { useContext } from "react";
import { UserContext } from "../../ComponentesGenerales/UserContext";
import useDynamicColors from "../../../UseDinamicColors";

const ListadoPedidosRepartidor = () => {
  const [rows, setRows] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [recargar, setRecargar] = useState(0);
  const { user } = useContext(UserContext);
  const Colors = useDynamicColors();

  const recargarComponente = () => {
    setRecargar((prevRecargar) => prevRecargar + 1);
  };

  useEffect(() => {
    if (user) {
      const headers = new Headers();
      headers.append("ConsumidorId", user.consumidorId);

      fetch(`${process.env?.REACT_APP_BACK_URL}pedido/repartidor`, {
        method: "GET",
        headers: headers,
      })
        .then((response) => response.json())
        .then((data) => {
          setPedidos(data.data);
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
  }, [user, recargar]);

  const styles = {
    container: {
      display: "flex",
      flexDirection: "row",
      margin: 0,
      height: "100vh",
      backgroundColor: Colors.GrisAzuladoOscuro,
    },
    content: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      height: "100%",
      marginLeft: "20%",
    },
    titleSection: {
      display: "flex",
      justifyContent: "center",
      marginBottom: "1rem",
    },
    titleText: {
      paddingTop: "0.5rem",
      color: Colors.Naranja,
    },
    separator: {
      color: Colors.Naranja,
    },
    centerContent: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    listContainer: {
      paddingTop: "0.5rem",
      paddingBottom: "1rem",
      height: "100%",
      width: "100%",
    },
    noPedidosText: {
      color: Colors.Naranja,
      textAlign: "center",
    },
  };

  return (
    <div>
      <div style={styles.container}>
        <Sidebar tipoUsuario={user?.tipoUsuario} />
        <div style={styles.content}>
          <div style={styles.titleSection}>
            <h1 style={styles.titleText}>Pedidos asignados</h1>
          </div>
          <hr style={styles.separator} />
          <div style={styles.centerContent}>
            <div style={styles.listContainer}>
              {Array.isArray(pedidos) && pedidos.length > 0 ? (
                rows.length > 0 &&
                rows.map((row, rowIndex) => (
                  <div key={rowIndex}>
                    {row.map((pedido, index) => (
                      <div key={index}>
                        {pedido !== null ? (
                          <PedidoRepartidor
                            pedido={pedido}
                            recargar={recargarComponente}
                          />
                        ) : null}
                      </div>
                    ))}
                  </div>
                ))
              ) : (
                <h2 style={styles.noPedidosText}>No hay Pedidos asignados</h2>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListadoPedidosRepartidor;
