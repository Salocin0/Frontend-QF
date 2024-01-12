import { default as React, useEffect, useState } from "react";
import { Dropdown } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import imgDefault from "./../../components/QuickFoodLogo.png";
import "./../sass/main.scss";

const ProductoUser = ({ producto, session, idpuesto, recargar }) => {
  const handleDropdownClick = (e) => {
    e.preventDefault();
  };

  const { id } = useParams();
  const navigate = useNavigate();

  const handleAddtocart = () => {
    const headers = new Headers();
    headers.append("ConsumidorId", session.consumidorId);

    fetch(`${process.env?.REACT_APP_BACK_URL}carrito/addToCart/${producto.id}`, {
      method: "PUT",
      headers: headers,
    })
      .then((response) => {
        if (response.ok) {
          toast.success("Se agrego un producto al carrito: " + producto.nombre);
          recargar();
        } else {
          toast.error("Error al agregar producto al carrito");
        }
      })
      .catch((error) => console.error("Error:", error));
    
  };

  useEffect(() => {
    console.log(producto);
  }, []);

  return (
    <div className="cardlink">
      <div className="card shadow-sm">
        <img
          src={`${producto?.img}`}
          className={`cardimgtop img-flex`}
          alt="Thumbnail"
          style={{ height: "150px"}}
        />
        <div className="card-body">
          <div>
            <h6 className="card-title text-center">{producto?.nombre}</h6>
          </div>
          <div style={{ height: "100px" }}>
            <p className="card-text text-center">{producto?.descripcion}</p>
          </div>

          <div className="row">
            <div className="col-5">
              <h4 className="card-text">$ {producto?.precio}</h4>
            </div>
            <div className="col-7">
              <div className="d-flex justify-content-end">
                <button className="btn btn-danger" onClick={handleAddtocart}>
                  <i className="bi bi-cart-plus"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductoUser;
