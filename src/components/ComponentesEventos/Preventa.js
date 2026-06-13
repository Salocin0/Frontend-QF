import CardCompraInstantanea from "./CardCompraInstantanea";
import CardPreCompra from "./CardPreCompra";
import PageLayout from "../ComponentesGenerales/PageLayout";
import Footer from "../ComponentesGenerales/Footer";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../ComponentesGenerales/UserContext";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // Importa Toastify
import useBreakpoint from "../../useBreakpoint";

const Preventa = () => {
  const [evento, setEvento] = useState([]);
  const { user } = useContext(UserContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const { isMobile, isTablet } = useBreakpoint();

  useEffect(() => {
    if (user) {
      const headers = new Headers();
      headers.append("ConsumidorId", user.consumidorId);
      fetch(`${process.env?.REACT_APP_BACK_URL}evento/${id}`, {
        method: "GET",
        headers: headers,
      })
        .then((response) => response.json())
        .then((data) => {
          setEvento(data.data);
          console.log(data.data);
        })
        .catch((error) => console.log("No existen eventos.", error));
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
      <div
        data-testid="preventa-cards-grid"
        style={{
          display: "grid",
          gridTemplateColumns: isMobile
            ? "1fr"
            : isTablet
            ? "repeat(2, 1fr)"
            : "repeat(3, 1fr)",
          gap: "16px",
        }}
      >
        <div onClick={() => irACompraInstantanea()}>
          <CardCompraInstantanea evento={evento} />
        </div>
        <CardPreCompra evento={evento} />
      </div>
      <Footer />
    </PageLayout>
  );
};

export default Preventa;
