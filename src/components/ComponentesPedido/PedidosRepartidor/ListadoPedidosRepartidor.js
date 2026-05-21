import React, { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import PageLayout from "../../ComponentesGenerales/PageLayout";
import PedidoRepartidor from "./PedidoRepartidor";
import { useContext } from "react";
import { UserContext } from "../../ComponentesGenerales/UserContext";
import Breadcrumb from "../../ComponentesGenerales/Breadcrumb";

const ListadoPedidosRepartidor = () => {
  const [rows, setRows] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [recargar, setRecargar] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(UserContext);

  const recargarComponente = () => {
    setRecargar((prevRecargar) => prevRecargar + 1);
  };

  useEffect(() => {
    if (user) {
      const headers = new Headers();
      headers.append("ConsumidorId", user.consumidorId);

      setIsLoading(true);
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
        .catch((error) => console.log("No existen pedidos.", error))
        .finally(() => setIsLoading(false));
    }
  }, [user, recargar]);

  const styles = {
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
      color: "var(--qf-naranja)",
    },
    separator: {
      color: "var(--qf-naranja)",
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
      marginBottom: "20px",
    },
    noPedidosText: {
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
    { title: "Pedidos Asignados", url: "/pedidos-asignados" },
  ];

  return (
    <PageLayout sidebarProps={{ tipoUsuario: user?.tipoUsuario }}>
      <div style={styles.content}>
        <div style={styles.titleSection}>
          <h1 style={styles.titleText}>Pedidos asignados</h1>
        </div>
        <hr style={styles.separator} />
        <div style={styles.breadcrumbWrapper}>
          <Breadcrumb
            items={breadcrumbItems}
            style={{
              width: "Calc(100% - 40px)",
              marginLeft: "Calc(20px)",
            }}
          />
        </div>
        <div style={styles.centerContent}>
          <div style={styles.listContainer}>
            {isLoading ? (
              <div style={{ display: "flex", justifyContent: "center", marginTop: "3rem" }}>
                <CircularProgress style={{ color: "var(--qf-naranja)" }} />
              </div>
            ) : Array.isArray(pedidos) && pedidos.length > 0 ? (
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
    </PageLayout>
  );
};

export default ListadoPedidosRepartidor;
