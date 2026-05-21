import CardCompraInstantanea from "./CardCompraInstantanea";
import CardPreCompra from "./CardPreCompra";
import PageLayout from "../ComponentesGenerales/PageLayout";
import Footer from "../ComponentesGenerales/Footer";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../ComponentesGenerales/UserContext";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // Importa Toastify

const Preventa = () => {
  const [evento, setEvento] = useState([]);
  const { user } = useContext(UserContext);
  const { id } = useParams();
  const navigate = useNavigate();

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

  const irACompraInstantanea = () => {
    if (evento.estado !== "EnCurso") {
      // Muestra un toast si el evento no está en estado "EnCurso"
      toast.error("El evento todavía no ha comenzado.");
    } else {
      console.log(evento.id);
      navigate(`/listado-puestos/${evento.id}`);
    }
  };

  const styles = {
  };

  return (
    <PageLayout sidebarProps={{ tipoUsuario: user.tipoUsuario }}>
      <div onClick={() => irACompraInstantanea()}>
        <CardCompraInstantanea evento={evento} />
      </div>
      <CardPreCompra evento={evento} />
      <Footer />
    </PageLayout>
  );
};

export default Preventa;
