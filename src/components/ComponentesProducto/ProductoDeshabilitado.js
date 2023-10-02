import { default as React, useEffect } from "react";
import { Dropdown } from "react-bootstrap";
import { toast } from "react-toastify";

import style from "./producto.module.css";

const ProductoDeshabilitado = ({ producto, session, idpuesto, recargar }) => {



    const hablitarNuevamente = () => {
        fetch(`http://localhost:8000/producto/${producto.id}/habilitar`, {
          method: "PUT",
        })
          .then((response) => response.json())
          .then(() => {
            toast.success("Producto habilitado nuevamente con éxito");

            recargar();
        })
          .catch((error) => toast.error("Error al habilitar el producto"));
      };


  useEffect(() => {
  }, []);

  return (
    <div className={style.cardlink}>
      <div className="card shadow-sm">
        <img
          src={`${producto?.img}`}
          className={`${style.cardimgtop} img-flex`}
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
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={hablitarNuevamente}>
                      Habilitar Producto Nuevamente
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

export default ProductoDeshabilitado;
