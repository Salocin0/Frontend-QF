import { format } from "date-fns";
import { default as React, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import FiltersEventosConsumidor from "../filters/filtersEventosConsumidor";
import "./../sass/main.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo, faBan } from "@fortawesome/free-solid-svg-icons";

const Pedido = ({ pedido, recargar }) => {
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const navigate = useNavigate();
  console.log(pedido);

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

  const calcularCantidadTotal = (pedido) => {
    let cantidadTotal = 0;

    // Iterar sobre cada objeto en el pedido y sumar sus cantidades
    pedido.detalles.forEach((item) => {
      cantidadTotal += item.cantidad;
    });

    return cantidadTotal;
  };

  /* const handleDelete = () => {
    const headers = new Headers();
    headers.append("ConsumidorId", session.consumidorId);

    fetch(`http://localhost:8000/evento/${evento.id}}`, {
      method: "DELETE",
      headers: headers,
    })
      .then((response) => {
        if (response.ok) {
          toast.success("Evento deshabilitado correctamente");
          navigate(`/listado-eventos`);
          recargar();
        } else {
          response.json().then((errorData) => {
            const errorMessage = errorData.message || "Ha ocurrido un error";
            toast.error(errorMessage);
          });
        }
      })
      .catch((error) => console.error("Error:", error));
  };*/

  return (
    <div>
      <div className="container-fluid">
        <div className="card">
          <div className="card-body">
            <div className="row">
              <div className="col-md-8 position-relative">
                <h5 className="card-title">
                  Pedido hecho al puesto {pedido.puesto.nombreCarro}
                </h5>
                <p className="card-descripcion">
                  {calcularCantidadTotal(pedido)} productos comprados 
                </p>
                <p className="card-text">${pedido.total}</p>
                <p className="card-estado">{pedido.estado}</p>
              </div>
              <hr style={{ color: "white" }} />
              <div className="text-end">
                <button className="btn btn-info btn-sm me-2">
                  <FontAwesomeIcon icon={faCircleInfo} />
                </button>
                <button className="btn btn-danger btn-sm me-2">
                  <FontAwesomeIcon icon={faBan} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="filtrosEventosConsumidor">
        <FiltersEventosConsumidor />
      </div>
    </div>
  );
};

export default Pedido;
