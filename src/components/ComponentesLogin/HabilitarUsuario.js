import "bootstrap/dist/css/bootstrap.min.css";
import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "../ComponentesGenerales/Footer";
import { UserContext } from "../ComponentesGenerales/UserContext";
import style from "./Login.module.css";
import { useParams } from "react-router-dom";
import { handleRequest } from "msw";

const HabilitarUsuario = () => {
  const { id } = useParams();
  const [emailback, setEmailBack] = useState("");
  const [emailcompleto, setEmailCompleto] = useState("");

  const handleEmailcompletoChange = (e) => {
    setEmailCompleto(e.target.value);
  };

  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/user/habilitar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (Number(data.code) === 200) {
          setEmailBack(data.data);
        } else {
          toast.error("Error");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleEnviarCodigo = () => {
    //enviar al back el email ingresado
    fetch(`http://127.0.0.1:8000/user/habilitar/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id ,email:emailcompleto}),
    })
      .then((response) => response.json())
      .then((data) => {
        if (Number(data.code) === 200) {
          toast.success("Usuario habilitado correctamente");
          navigate(`/login`);
        } else {
          toast.error("error");
          navigate(`/login`);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <section
      className="vh-100 d-flex align-items-center justify-content-center"
      style={{
        background: "url(/../QuickFoodFondo.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        width: "100%",
        height: "100vh",
      }}
    >
      <div className="d-flex align-items-center justify-content-center">
        <div className="card p-3">
          <div className="card-body">
            <h2 className="card-title">Habilitar Usuario</h2>
            <label style={{ color: "black" }} className="py-3">
              {`Complete el email: ${emailback}***@*****`}
            </label>
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Ingrese su email"
              value={emailcompleto}
              onChange={handleEmailcompletoChange}
            />
            <div className="d-flex justify-content-end">
              <button className="btn btn-primary" onClick={handleEnviarCodigo}> 
                Enviar email
              </button>
            </div>
          </div>
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </section>
  );
};

export default HabilitarUsuario;
