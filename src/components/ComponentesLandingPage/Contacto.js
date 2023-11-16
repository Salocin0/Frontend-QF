import React, { useState } from "react";
import imagen from "../img/contacto.jpg";
import "bootstrap/dist/css/bootstrap.min.css";
import "./../sass/main.scss";

const Contacto = () => {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Formulario enviado:", nombre, correo, mensaje);
  };

  return (
    <main className="contacto d-flex pt-3">
      <div className="col-lg-4 offset-lg-2">
        <form className="w-100" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="form-nombre">Nombre</label>
            <input
              type="text"
              id="form-nombre"
              className="form-control"
              placeholder="Ingrese su nombre"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="form-email">Email</label>
            <input
              type="email"
              id="form-email"
              className="form-control"
              placeholder="Ingrese su email"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="Asunto">Asunto</label>
            <textarea
              id="Asunto"
              className="form-control"
              rows="4"
              required
            ></textarea>
          </div>
          <div className="text-end">
            <input
              type="submit"
              className="btn btn-primary my-2"
              value="Enviar"
            />
          </div>
        </form>
      </div>
      <div className="col-lg-4 order-lg-2 p-3">
        <div className="divcontacto">
          <img src={imagen} alt="imagen contacto" className="img-fluid" />
        </div>
      </div>
    </main>
  );
};

export default Contacto;
