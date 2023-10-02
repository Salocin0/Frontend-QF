import React, { useEffect, useState } from "react";
import { Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { base64ToFile } from "../ComponentesGenerales/Utils/base64";
import style from "./puestos.module.css";

const PuestoDeshabilitado = ({ carrito,recargar }) => {
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

  const handleHabilitar = () => {
    const headers = new Headers();
    headers.append("ConsumidorId", session.consumidorId);

    fetch(`http://localhost:8000/puesto/${carrito.id}/habilitacion`, {
      method: "PUT",
      headers: headers,
    })
      .then((response) => {
        if (response.ok) {
          toast.success("Puesto habilitado nuevamente");
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
    <div className={style.cardlink}>
      <div className="card shadow-sm">
        {imageFile && (
          <img
            src={carrito?.img}
            className={style.cardimgtop}
            alt="Thumbnail"
          />
        )}
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className={`card-text ${style.truncate}`} title={carrito.nombreCarro}>
              {carrito.nombreCarro}
            </h5>
            <Dropdown>
              <Dropdown.Toggle variant="danger"></Dropdown.Toggle>
              <Dropdown.Menu>
                  <Dropdown.Item onClick={handleHabilitar}>Habilitar Carrito</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PuestoDeshabilitado;