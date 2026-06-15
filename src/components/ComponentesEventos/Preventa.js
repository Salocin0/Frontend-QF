import CardCompraInstantanea from "./CardCompraInstantanea";
import CardPreCompra from "./CardPreCompra";
import PageLayout from "../ComponentesGenerales/PageLayout";
import Footer from "../ComponentesGenerales/Footer";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../ComponentesGenerales/UserContext";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";

const Preventa = () => {
  const [evento, setEvento] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(UserContext);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      const headers = new Headers();
      headers.append("ConsumidorId", user.consumidorId);
      fetch(`${process.env?.REACT_APP_BACK_URL}evento/${id}`, {
        method: "GET",
        headers: headers,
      })
        .then((response) => response.json())
        .then((data) => {
          setEvento(data.data);
        })
        .catch((error) => console.log("No existen eventos.", error))
        .finally(() => setIsLoading(false));
    }
  }, [user,id]);

  const eventoFinalizado = () => {
    if (!evento?.diaEventos?.length) return false;
    const ahora = new Date();
    const fechaFin = new Date(
      Math.max(...evento.diaEventos.map((d) => new Date(d.fechaHoraFinDiaEvento)))
    );
    return fechaFin <= ahora;
  };

  const irACompraInstantanea = () => {
    if (eventoFinalizado()) {
      toast.error("El evento ha finalizado. No se pueden realizar pedidos.");
      return;
    }
    if (evento.estado !== "EnCurso") {
      toast.error("El evento todavía no ha comenzado.");
      return;
    }
    navigate(`/listado-puestos/${evento.id}`);
  };

  const styles = {
  };

  return (
    <PageLayout sidebarProps={{ tipoUsuario: user.tipoUsuario }}>
      {isLoading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
            minHeight: 0,
          }}
        >
          <CircularProgress style={{ color: "var(--qf-naranja)" }} size={50} />
        </div>
      ) : (
        <div
          data-testid="preventa-cards-grid"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            flex: 1,
            minHeight: 0,
          }}
        >
          <div onClick={() => irACompraInstantanea()}>
            <CardCompraInstantanea evento={evento} />
          </div>
          <CardPreCompra evento={evento} />
        </div>
      )}
      <Footer />
    </PageLayout>
  );
};

export default Preventa;
