import { format } from "date-fns";
import { default as React, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import FiltersEventosConsumidor from "../../filters/filtersEventosConsumidor";
import "./../../sass/main.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleInfo,
  faBan,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";


const PedidoRepartidor = ({ pedido, recargar }) => {
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const sessionId = localStorage.getItem("sessionId");

    if (!sessionId) {
      console.error("No session ID found.");
      return;
    }

    fetch(`${process.env?.REACT_APP_BACK_URL}user/session`, {
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

  const calcularCantidadTotal = (pedido) => {
    let cantidadTotal = 0;

    pedido.detalles.forEach((item) => {
      cantidadTotal += item.cantidad;
    });

    return cantidadTotal;
  };

  const pedidoEntregado = () => {
    fetch(`${process.env?.REACT_APP_BACK_URL}pedido/cambiarEstado/${pedido.id}/pedidoEntregado`, {
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        toast.success("pedido en camino");
        recargar();
      })
      .catch((error) => console.error("Error fetching session:", error));
  };

  const mostrarDialog = () => {
    const dialog = document.getElementById(`myDialog${pedido.id}`);
    dialog.showModal();
  };

  const cerrarDialog = () => {
    const dialog = document.getElementById(`myDialog${pedido.id}`);
    dialog.close();
  };

  return (
    <div>
      <div className="container-fluid">
        <div className="card">
          <div className="card-body">
            <div className="row">
              <div className="col-md-12 position-relative" style={{position:"relative"}}>
                <h5 className="card-title">
                  Pedido hecho al puesto {pedido.puesto.nombreCarro}
                </h5>
                <p className="card-descripcion">
                  {calcularCantidadTotal(pedido)} productos comprados
                </p>
                <p className="card-estado-pedido me-2" style={{position:"absolute", bottom:"0px", right:"0px"}}>{pedido.estado}</p>
              </div>
              <hr style={{ color: "white" }} />
              <div className="text-end">

                {pedido.estado === "EnCamino" && (
                  <button
                    className="btn btn-success btn-sm me-2"
                    onClick={pedidoEntregado}
                  >
                    Entregado
                  </button>
                )}

                <button
                  className="btn btn-info btn-sm me-2"
                  onClick={mostrarDialog}
                >
                  <FontAwesomeIcon icon={faCircleInfo} />
                </button>

              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="filtrosEventosConsumidor">
        <FiltersEventosConsumidor />
      </div>
      <dialog
        id={`myDialog${pedido.id}`}
        className="dialog"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "400px",
          borderRadius:"10px",
          transform: "translate(-50%, -50%)",
        }}
      >
        <div>
          <h2 className="mt-2 tituloSeccion tituloSeccionNegativo">Pedido</h2>
          <hr style={{ color: "#F7B813" }} />
          <table className="text-center w-100 table table-striped table-dark">
            <thead className="thead-dark">
              <tr className="text-center mx-2">
                <th className="text-center mx-2">Producto</th>
                <th className="text-center mx-2">Cantidad</th>
              </tr>
            </thead>
            <tbody>
              {pedido?.detalles.map((item, index) => (
                <tr key={index}>
                  <td>{item.producto.nombre}</td>
                  <td>{item.cantidad}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <hr style={{ color: "#F7B813" }} />
          <div className="text-center">
          <button className="btn btn-danger btn-sm m-2 w-50" onClick={cerrarDialog}>
          Cerrar
          </button>
          </div>
          
        </div>
      </dialog>
    </div>
  );
};

export default PedidoRepartidor;
