import { default as React, useEffect } from "react";
import { Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import "./../sass/main.scss";

const Producto = ({ producto, session, idpuesto, recargar }) => {



  const handleDelete = () => {
    const headers = new Headers();
    headers.append("ConsumidorId", session.consumidorId);

    fetch(`${process.env?.REACT_APP_BACK_URL}producto/${producto.id}`, {
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
  }, []);

  return (
    <div className="cardlink">
      <div className="card shadow-sm">
        <img
          src={`${producto?.img}`}
          className={`cardimgtop img-fluid`}
          alt="Thumbnail"
          style={{ height: "150px" }}
        />
        <div className="card-body">
          <div >
            <h6 className="card-title text-center">
              {producto?.nombre}
            </h6>
          </div>
          <div style={{ height: "100px" }}>
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
