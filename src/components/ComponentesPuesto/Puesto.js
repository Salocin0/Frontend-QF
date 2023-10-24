import React, { useEffect, useState } from "react";
import { Dropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { base64ToFile } from "../ComponentesGenerales/Utils/base64";
import "./../sass/main.scss";

const Puesto = ({ carrito,recargar }) => {
  const [session, setSession] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const sessionId = localStorage.getItem("sessionId");

    if (sessionId) {
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
          console.log(data.data);
        })
        .catch((error) => console.error("Error fetching session:", error));
    }
  }, []);

  useEffect(() => {
    if (carrito && carrito.img) {
      try {
        const file = base64ToFile(
          carrito.img,
          "imagen.png",
          "image/png"
        );
        setImageFile(file);
      } catch (error) {
        console.error("Error al convertir la imagen:", error);
      }
    }
  }, [carrito]);

  const handleDelete = () => {
    const headers = new Headers();
    headers.append("ConsumidorId", session.consumidorId);

    fetch(`http://localhost:8000/puesto/${carrito.id}`, {
      method: "DELETE",
      headers: headers,
    })
      .then((response) => {
        if (response.ok) {
          toast.success("Puesto deshabilitado correctamente");
          navigate(`/listado-puestos`);
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

  return (
    <div className="cardlink">
      <div className="card shadow-sm">
        {imageFile && (
          <img
            src={carrito?.img}
            className="cardimgtop"
            alt="Thumbnail"
          />
        )}
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className={`card-text truncate`} title={carrito.nombreCarro}>
              {carrito.nombreCarro}
            </h5>
            <Dropdown>
              <Dropdown.Toggle variant="danger"></Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item as={Link} to={`/listado-productos/${carrito.id}`}>
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
