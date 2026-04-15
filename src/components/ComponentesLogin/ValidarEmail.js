import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "../ComponentesGenerales/Footer";

import "./../sass/main.scss";
import { useParams } from "react-router-dom";

const ValidarEmail = () => {
  const { id, codigo } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACK_URL}user/validarEmailUsuario/${id}/${codigo}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        if (Number(data.code) === 200) {
          toast.success("Email validado");
          navigate(`/login`);
        } else {
          toast.error("error");
          navigate(`/login`);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id, codigo, navigate]);

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
        <h2 style={{ color: "white" }}>Validando Correo Electronico...</h2>
      </div>
      <div>
        <Footer />
      </div>
    </section>
  );
};

export default ValidarEmail;
