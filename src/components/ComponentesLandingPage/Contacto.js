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
    <div className="contacto">
      <main className="w-100">
        <div className="row center-outer-container h-100 pt-3">
          <div className="offset-2 w-100 pt-3">
            <div className="row col-8">
              <div className="col-12 col-md-6 d-flex justify-content-center align-items-center">
                <form className="mt-3 w-100" onSubmit={handleSubmit}>
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
              <div className="col-12 mt-3 col-md-6 ps-2">
                <div className="divcontacto">
                  <img
                    src={imagen}
                    alt="imagen contacto"
                    className={`divcontacto img-fluid`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contacto;
