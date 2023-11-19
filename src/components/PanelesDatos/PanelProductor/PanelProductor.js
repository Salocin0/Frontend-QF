import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactECharts from "echarts-for-react";
import Sidebar from "../../ComponentesGenerales/Sidebar";
import Footer from "../../ComponentesGenerales/Footer";
import Grafica from "../../ComponentesGenerales/PruebaGrafica";
const PanelProductor = () => {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const sessionId = localStorage.getItem("sessionId");

    if (!sessionId) {
      console.error("No session ID found.");
      return;
    }

    fetch("http://localhost:8000/user/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sessionID: sessionId }),
    })
      .then((response) => response.json())
      .then((data) => {
        setSession(data.data);
        console.log(data.data.tipoUsuario);
      })
      .catch((error) => console.error("Error fetching session:", error));
  }, []);

  return (
    <div className="d-flex mainFormEventos">
      <div className="">
        <Sidebar tipoUsuario={session?.tipoUsuario} />
      </div>
      <div className="container ">
        <div className="div1 d-flex flex-column align-items-center justify-content-start ps-4">
          <div>
            <h1 style={{ color: "white" }}>3.000.000</h1>
          </div>
          <div>
            <p style={{ color: "grey" }}>Total Generado con QuickFood</p>
          </div>
        </div>

        <div className="div2">
          <p>tarjeta 2</p>
        </div>
        <div className="toppuestos">
          <p>top puestos</p>
        </div>
        <div className="grafica">
          <Grafica />
        </div>
      </div>
    </div>
  );
};

export default PanelProductor;
