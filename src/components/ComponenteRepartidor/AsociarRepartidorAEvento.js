import React, { useContext, useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import PageLayout from "../ComponentesGenerales/PageLayout";
import "./../sass/main.scss";
import EventoRepartidor from "./EventoRepartidor";
import { UserContext } from "../ComponentesGenerales/UserContext";
import Breadcrumb from "../ComponentesGenerales/Breadcrumb";
import Footer from "../ComponentesGenerales/Footer";

const AsociarRepartidorAEvento = () => {
  const {user} = useContext(UserContext);
  const [eventos, setEventos] = useState([]);
  const [recargar, setRecargar] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const recargarComponente = () => {
    setRecargar(+1);
  };

  useEffect(() => {
    if (user) {
      const headers = new Headers();
      headers.append("ConsumidorId", user.consumidorId);

      setIsLoading(true);
      fetch(`${process.env?.REACT_APP_BACK_URL}evento/enEstado/EnPreparacion`, {
        method: "GET",
        headers: headers,
      })
        .then((response) => response.json())
        .then((data) => {
          setEventos(data.data);
        })
        .catch((error) => console.log("No existen carritos.", error))
        .finally(() => setIsLoading(false));
    }
  }, [user, recargar]);

  const breadcrumbItems = [
    { title: "Inicio", url: "/inicio" },
    { title: "Asociarte a evento", url: "/asociarRepartidorAEvento" },
  ];

  return (
    <PageLayout sidebarProps={{ tipoUsuario: user?.tipoUsuario }}>
      <div style={{ width: "100%" }}>
        {/* Header centrado */}
        <div className="qf-page-header--full" style={{ paddingTop: "1rem" }}>
          <h1 style={{ color: "var(--qf-naranja)", textAlign: "center" }}>
            Asociate a un Evento
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

        {/* Listado de eventos */}
        <div style={{ padding: "1rem 20px 2rem 20px" }}>
          {isLoading ? (
            <div style={{ display: "flex", justifyContent: "center", marginTop: "3rem" }}>
              <CircularProgress style={{ color: "var(--qf-naranja)" }} />
            </div>
          ) : Array.isArray(eventos) && eventos.length > 0 ? (
            <div>
              {eventos.map((evento, index) => (
                <div key={index}>
                  <EventoRepartidor
                    evento={evento}
                    recargar={recargarComponente}
                  />
                </div>
              ))}
            </div>
          ) : (
            <h2
              style={{
                color: "var(--qf-naranja)",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              No hay eventos activos en este momento.
            </h2>
          )}
        </div>
        <Footer />
      </div>
    </PageLayout>
  );
};

export default AsociarRepartidorAEvento;
