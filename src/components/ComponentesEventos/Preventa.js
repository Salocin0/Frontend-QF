import CardCompraInstantanea from "./CardCompraInstantanea";
import CardPreCompra from "./CardPreCompra";
import Sidebar from "../ComponentesGenerales/Sidebar";
import Footer from "../ComponentesGenerales/Footer";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../ComponentesGenerales/UserContext";
import { useParams } from "react-router-dom";
const Preventa = () => {
  const [evento, setEvento] = useState([]);
  const { user } = useContext(UserContext);
  const { id } = useParams();

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
  }, [user]);

  return (
    <div>
      <Sidebar />
      <CardCompraInstantanea evento={evento} />
      <CardPreCompra evento={evento}/>
      <Footer />
    </div>
  );
};

export default Preventa;
