import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactECharts from "echarts-for-react";
import Sidebar from "../../ComponentesGenerales/Sidebar";
import Footer from "../../ComponentesGenerales/Footer";
import { faUpLong, faDownLong } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import GraficaBarras from "../GraficaBarras";
import GraficaTorta from "../GraficaTorta";

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
    <div>
      <div className="d-flex mainFormEventos">
        <div className="">
          <Sidebar tipoUsuario={session?.tipoUsuario} />
        </div>
        <div className="container containerGraficaProductor">
          <div className="div1productor d-flex" style={{ position: "relative" }}>
            <div
              className="ps-3 pb-3"
              style={{ position: "absolute", bottom: 0, left: 0 }}
            >
              <h1 style={{ color: "white" }}>$3.000.000</h1>
              <p>
                <strong style={{ color: "white" }}>
                  Total Generado con QuickFood
                </strong>
              </p>
            </div>
          </div>

          <div className="div2productor" style={{ position: "relative" }}>
            <div
              className="pt-3 ps-3"
              style={{ position: "absolute", top: 0, left: 0 }}
            >
              <select
                name=""
                id=""
                style={{
                  borderRadius: "5px",
                  backgroundColor: "#1E88E5",
                  border: "none",
                  color: "white",
                }}
              >
                <option value="">Conquin Rock</option>
                <option value="">Festival de Villa Maria</option>
              </select>
            </div>

            <div
              className="pt-3 pe-3"
              style={{ position: "absolute", top: 0, right: 0 }}
            >
              <button className="btn btn-sm" style={{ color: "white" }}>
                Dinero
              </button>
              <button
                className="btn btn-sm"
                style={{ backgroundColor: "#1a73c1", color: "white" }}
              >
                Pedidos
              </button>
            </div>

            <div
              className="ps-3 pb-3"
              style={{ position: "absolute", bottom: 0, left: 0 }}
            >
              <h1 style={{ color: "white" }}>684</h1>
              <p>
                <strong style={{ color: "white" }}>
                  Ventas totales en el evento
                </strong>
              </p>
            </div>
          </div>
          <div className="toppuestosproductor text-center p-3">
            <h2>Top Puestos</h2>
            <p>Puestos actualizados a las 22:20</p>
            <hr />
            <div>
              <table id="miTabla" className="w-100">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Nombre</th>
                    <th>Pedidos</th>
                    <th>Dinero</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>Puesto 3</td>
                    <td>15</td>
                    <td>$53000</td>
                    <td>
                      <FontAwesomeIcon
                        icon={faUpLong}
                        style={{ color: "green" }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>Puesto 5</td>
                    <td>10</td>
                    <td>$48600</td>
                    <td>
                      <FontAwesomeIcon
                        icon={faUpLong}
                        style={{ color: "green" }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>Puesto 4</td>
                    <td>8</td>
                    <td>$36000</td>
                    <td>
                      <FontAwesomeIcon
                        icon={faDownLong}
                        style={{ color: "red" }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>4</td>
                    <td>Puesto 1</td>
                    <td>5</td>
                    <td>$23400</td>
                    <td>
                      <FontAwesomeIcon
                        icon={faUpLong}
                        style={{ color: "green" }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>5</td>
                    <td>Puesto 2</td>
                    <td>3</td>
                    <td>$18500</td>
                    <td>
                      <FontAwesomeIcon
                        icon={faDownLong}
                        style={{ color: "red" }}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="graficaTortaproductor" style={{ marginTop: "125px" }}>
              <GraficaTorta />
            </div>
          </div>
          <div className="graficaBarrasproductor">
            <GraficaBarras />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PanelProductor;
