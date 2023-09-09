import { default as React, useState } from "react";
import { Dropdown } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import imgDefault from "../QuickFoodLogo.png";
import style from "./puestos.module.css";

const Puesto = ({ carrito }) => {
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
    <div className={style.cardlink}>
      <div className="card shadow-sm">
        <img
          src={carrito.thumbnail || imgDefault}
          className={style.cardimgtop}
          alt="Thumbnail"
        />
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <h3 className="card-text">{carrito.nombreCarro}</h3>

            <Dropdown>
              <Dropdown.Toggle variant="danger">
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item as={Link} to="/listado-productos">
                  Actualizar Listado Productos
                </Dropdown.Item>
                <Dropdown.Item as={Link} to={`/puesto/${carrito.id}`}>
                  Modificar Datos Carrito
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleDelete}>Deshabilitar Carrito</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Puesto;
