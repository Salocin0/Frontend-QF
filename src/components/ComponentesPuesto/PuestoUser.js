import { default as React, useState } from "react";
import { Dropdown } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import imgDefault from "../QuickFoodLogo.png";
import style from "./puestos.module.css";

const PuestoUser = ({ carrito }) => {
  const handleDropdownClick = (e) => {
    e.preventDefault();
  };

  const { id } = useParams();
  const [session, setSession] = useState(null);
  const navigate = useNavigate();

  const handleDelete = () => {
    const headers = new Headers();
    headers.append("ConsumidorId", session.consumidorId);

    fetch(`http://localhost:8000/puesto/${id}`, {
      method: "DELETE",
      headers: headers,
    })
      .then((response) => {
        if (response.ok) {
          toast.success("Puesto deshabilitado correctamente");
          navigate(`/listado-puestos`);
        } else {
          response.json().then((errorData) => {
            const errorMessage = errorData.message || "Ha ocurrido un error";
            toast.error(errorMessage);
          });
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  return (
    <Link
      to={`/productos-puesto/${carrito?.id}`}
      style={{ textDecoration: "none" }}
    >
      <div className={style.cardlink}>
        <div className="card shadow-sm">
          <img
            src={`${carrito?.img}`}
            className={style.cardimgtop}
            alt="Thumbnail"
          />
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className={`card-text`} title={carrito.nombreCarro}>
                {carrito.nombreCarro}
              </h5>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PuestoUser;
