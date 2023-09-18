import { default as React, useEffect, useState } from "react";
import { Dropdown } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import imgDefault from "./../../components/QuickFoodLogo.png";
import style from "./producto.module.css";

const Producto = ({ producto, session, idpuesto, recargar }) => {
  const handleDropdownClick = (e) => {
    e.preventDefault();
  };

  const { id } = useParams();
  const navigate = useNavigate();

  const handleDelete = () => {
    const headers = new Headers();
    headers.append("ConsumidorId", session.consumidorId);

    fetch(`http://localhost:8000/producto/${producto.id}`, {
      method: "DELETE",
      headers: headers,
    })
      .then((response) => {
        if (response.ok) {
          toast.success("Producto deshabilitado correctamente");
          recargar();
        } else {
          response.json().then((errorData) => {
            const errorMessage = errorData.message || "Ha ocurrido un error";
            toast.error(errorMessage);
          });
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  useEffect(() => {
    console.log(producto);
  }, []);

  return (
    <div className={style.cardlink}>
      <div className="card shadow-sm">
        <img
          src={producto?.imgs || imgDefault}
          className={style.cardimgtop}
          alt="Thumbnail"
        />
        <div className="card-body">
          <div style={{ height: "60px" }}>
            <h6 className="card-title text-center">
              {producto?.nombre}
            </h6>
          </div>
          <div style={{ height: "80px" }}>
            <p className="card-text text-center">
              {producto?.descripcion}
            </p>
          </div>

          <div className="row">
            <div className="col-10">
              <h4 className="card-text">$ {producto?.precio}</h4>
            </div>
            <div className="col-2">
              <div className="d-flex justify-content-end">
                <Dropdown>
                  <Dropdown.Toggle variant="danger"></Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item as={Link} to={`/producto/${producto?.id}`}>
                      Actualizar Producto
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleDelete}>
                      Deshabilitar Producto
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Producto;
