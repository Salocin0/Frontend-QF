import React from "react";
import Sidebar from "../../ComponentesGenerales/Sidebar";
import Footer from "../../ComponentesGenerales/Footer";
import { faUpLong, faDownLong } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import GraficaLineas from "../GraficaLineas";
import GraficaTortaProductos from "../GraficaTortaProductos";
import { UserContext } from "../../ComponentesGenerales/UserContext";
import { useContext } from "react";
import useDynamicColors from "../../../UseDinamicColors";

const PanelEncargado = () => {
  const { user } = useContext(UserContext);
  const Colors = useDynamicColors();

  return (
    <div style={{ height: "100vh", backgroundColor:Colors.GrisAzuladoOscuro }}>
      <h1 style={{ color: Colors.Naranja, textAlign: "center", marginLeft: "20%", paddingTop: "10px" }}>Estadisticas Productor</h1>
      <hr style={{ color: Colors.Naranja, width: "100%", paddingBottom: "10px"}}/>
      <div className="d-flex mainFormEventos" style={{ height: "75vh", backgroundColor:Colors.GrisAzuladoOscuro,marginBottom: "50px" }}>
        <div className="col-2">
          <Sidebar tipoUsuario={user?.tipoUsuario} />
        </div>
        <div className="container containerGraficaEncargado ms-5">
          <div
            className="div1Encargado d-flex"
            style={{ position: "relative" }}
          >
            <div
              className="ps-3 pb-3"
              style={{ position: "absolute", bottom: 0, left: 0 }}
            >

<select
                name=""
                id=""
                style={{
                  borderRadius: "5px",
                  backgroundColor: "#5E35B1",
                  border: "none",
                  color: "white",
                  width: "70%",
                }}
              >
                <option value="">Cosquin Rock</option>
                <option value="">Festival de Villa Maria</option>
              </select>
              <h1 style={{ color: "white" }}>$725.300</h1>
              <p>
                <strong style={{ color: "white" }}>
                  Total Recaudado en Evento
                </strong>
              </p>
            </div>
          </div>

          <div className="div2Encargado" style={{ position: "relative" }}>
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
                  width: "100%",
                }}
              >
                <option value="">Taco Fiesta</option>
                <option value="">Taco Fiesta</option>
              </select>
            </div>

            <div
              className="ps-3 pb-3"
              style={{ position: "absolute", bottom: 0, left: 0 }}
            >
              <h1 style={{ color: "white" }}>4.2/5</h1>
              <p>
                <strong style={{ color: "white" }}>
                  Valoracion Promedio
                </strong>
              </p>

              <button style={{ backgroundColor: "#1E88E5", color: "white", border:"none", padding:"2px", borderRadius:"5px"}}>Ver Valoraciones</button>
            </div>
          </div>

          <div className="div3Encargado" style={{ position: "relative" }}>
            <div
              className="pt-3 ps-3"
              style={{ position: "absolute", top: 0, left: 0 }}
            >
              <select
                name=""
                id=""
                style={{
                  borderRadius: "5px",
                  backgroundColor: "#ec93c2",
                  border: "none",
                  color: "white",
                }}
              >
                <option value="">Taco Fiesta</option>
                <option value="">Taco Fiesta</option>
              </select>
            </div>
            <div
              className="pt-3 pe-3"
              style={{ position: "absolute", top: 0, right: 0 }}
            >
              <button className="btn btn-sm" style={{ color: "white" }}>
                Mejor
              </button>
              <button
                className="btn btn-sm"
                style={{ backgroundColor: "#ec93c2", color: "white" }}
              >
                Promedio
              </button>
            </div>

            <div
              className="ps-3 pb-3"
              style={{ position: "absolute", bottom: 0, left: 0 }}
            >
              <h1 style={{ color: "white" }}>15:43</h1>
              <p>
                <strong style={{ color: "white" }}>
                  Tiempo Promedio de entrega
                </strong>
              </p>
            </div>
          </div>

          <div className="toppuestosEncargado text-center p-3">
            <h2>Top Productos</h2>
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
                    <td>Prod 3</td>
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
                    <td>Prod 5</td>
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
                    <td>Prod 4</td>
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
                    <td>Prod 1</td>
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
                    <td>Prod 2</td>
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
            <div
              className="graficaTortaEncargado "
              style={{ marginTop: "0px" }}
            >
              <GraficaTortaProductos />
            </div>
          </div>
          <div className="graficaBarrasEncargado">
            <GraficaLineas />
          </div>
        </div>
        <div>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default PanelEncargado;
