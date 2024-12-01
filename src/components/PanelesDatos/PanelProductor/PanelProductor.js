import React, { useContext } from "react";
import Sidebar from "../../ComponentesGenerales/Sidebar";
import Footer from "../../ComponentesGenerales/Footer";
import { faUpLong, faDownLong } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import GraficaBarras from "../GraficaBarras";
import GraficaTorta from "../GraficaTorta";
import { UserContext } from "../../ComponentesGenerales/UserContext";
import useDynamicColors from "../../../UseDinamicColors";

const PanelProductor = () => {
  const { user } = useContext(UserContext)
  const Colors = useDynamicColors()
  return (
    <div style={{ height: "100vh", backgroundColor:Colors.GrisAzuladoOscuro }}>
      <h1 style={{ color: Colors.Naranja, textAlign: "center", marginLeft: "20%", paddingTop: "10px" }}>Estadisticas Productor</h1>
      <hr style={{ color: Colors.Naranja, width: "100%", paddingBottom: "10px"}}/>
      <div className="d-flex mainFormEventos" style={{ height: "75vh", backgroundColor:Colors.GrisAzuladoOscuro,marginBottom: "50px" }}>
      
        <div className="col-2">
          <Sidebar tipoUsuario={user?.tipoUsuario} />
        </div>
        
        <div className="container containerGraficaProductor ms-5">
        
          <div className="div1productor d-flex" style={{ position: "relative" }}>
          
            <div
              className="ps-3 pb-3"
              style={{ position: "absolute", bottom: 0, left: 0 }}
            >
              <button style={{backgroundColor: "#7F53D8", color: "white",border:"none",padding:"5px",borderRadius:"5px"}}>Ver por puesto</button>
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
                <option value="">Todos</option>
                <option value="">Cosquin Rock</option>
                <option value="">Festival de Villa Maria</option>
              </select>
            </div>

            <div
              className="pt-3 pe-3"
              style={{ position: "absolute", top: 0, right: 0 }}
            >
            </div>

            <div
              className="ps-3 pb-3"
              style={{ position: "absolute", bottom: 0, left: 0 }}
            >
              <h1 style={{ color: "white" }}>3.5/5</h1>
              <p>
                <strong style={{ color: "white" }}>
                  Valoracion promedio en mis eventos
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
            <div className="graficaTortaproductor" style={{ marginTop: "0px" }}>
              <GraficaTorta />
            </div>
          </div>
          <div className="graficaBarrasproductor">
            <GraficaBarras />
          </div>
        </div>
        <div>
          <Footer/>
        </div>
      </div>
    </div>
  );
};

export default PanelProductor;
