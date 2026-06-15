import React, { useEffect, useState, useContext } from "react";
import { CircularProgress } from "@mui/material";
import PageLayout from "../../ComponentesGenerales/PageLayout";
import PedidoRepartidor from "./PedidoRepartidor";
import { UserContext } from "../../ComponentesGenerales/UserContext";
import Breadcrumb from "../../ComponentesGenerales/Breadcrumb";
import Footer from "../../ComponentesGenerales/Footer";

const ListadoPedidosRepartidor = () => {
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
        })
        .catch((error) => console.log("No existen pedidos.", error))
        .finally(() => setIsLoading(false));
    }
  }, [user, recargar]);

  const breadcrumbItems = [
    { title: "Inicio", url: "/inicio" },
    { title: "Pedidos Asignados", url: "/pedidos-asignados" },
  ];

  return (
    <PageLayout sidebarProps={{ tipoUsuario: user?.tipoUsuario }}>
      <div style={{ width: "100%" }}>
        {/* Header centrado */}
        <div className="qf-page-header--full">
          <h1 style={{ color: "var(--qf-naranja)", textAlign: "center" }}>
            Pedidos asignados
          </h1>
        </div>
        <hr className="qf-separator qf-separator--spaced" />

        {/* Breadcrumb con borde dorado */}
        <Breadcrumb
          items={breadcrumbItems}
          style={{
            border: "1px solid var(--qf-naranja)",
            margin: "0 20px",
            width: "auto",
          }}
        />

        {/* Listado de cards responsivo */}
        <div style={{ padding: "0.5rem 20px 1rem 20px" }}>
          {isLoading ? (
            <div style={{ display: "flex", justifyContent: "center", marginTop: "3rem" }}>
              <CircularProgress style={{ color: "var(--qf-naranja)" }} />
            </div>
          ) : Array.isArray(pedidos) && pedidos.length > 0 ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              {pedidos.map((pedido) => (
                <PedidoRepartidor
                  key={pedido.id}
                  pedido={pedido}
                  recargar={recargarComponente}
                />
              ))}
            </div>
          ) : (
            <h2
              style={{
                color: "var(--qf-naranja)",
                textAlign: "center",
              }}
            >
              No hay Pedidos asignados
            </h2>
          )}
        </div>
        <Footer />
      </div>
    </PageLayout>
  );
};

export default ListadoPedidosRepartidor;
