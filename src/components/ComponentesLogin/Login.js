import "bootstrap/dist/css/bootstrap.min.css";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "../ComponentesGenerales/Footer";
import { UserContext } from "../ComponentesGenerales/UserContext";
import style from "./Login.module.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { updateUser } = useContext(UserContext);

  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      contraseña: password,
      correoElectronico: email,
    };

    fetch("http://127.0.0.1:8000/login/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (Number(data.code) === 200) {
          localStorage.setItem("sessionId", data.data.sessionId);
          toast.success("Login correcto");
          updateUser(data.data);
          navigate(`/perfil-nuevo`);
        } else {
          toast.error("Datos incorrectos");
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
        background: "url(QuickFoodFondo.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className={style.contenedor}>
        <div className={`${style.tarjeta}`}>
          <h1 className="fs-4 card-title fw-bold mb-4 text-black">QuickFood</h1>
          <div className="">
            <form onSubmit={handleSubmit} className="needs-validation">
              <div className="mb-3">
                <label className="mb-2 text-muted" htmlFor="usuario">
                  Usuario
                </label>
                <input
                  id="usuario"
                  type="text"
                  className="form-control"
                  name="usuario"
                  value={email}
                  onChange={handleEmailChange}
                  required
                  autoFocus
                />
              </div>

              <div className="mb-3">
                <div className="mb-2 w-100">
                  <label className="text-muted" htmlFor="contraseña">
                    Contraseña
                  </label>
                </div>
                <input
                  id="contraseña"
                  type="password"
                  className="form-control"
                  name="password"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                />
                <div className="invalid-feedback">Contraseña Requerida</div>
              </div>

              <div className="d-flex align-items-center">
                <button
                  type="submit"
                  className="btn btn-primary btn-strong ms-auto"
                >
                  Ingresar
                </button>
              </div>

              <div className="mt-2 text-center">
                <a href="/recuperar" className="text-primary">
                  Recuperar Contraseña
                </a>
              </div>

              <div className="mt-2 text-center">
                ¿No tienes cuenta?{" "}
                <a href="/seleccion-perfil" className="text-primary">
                  Registrarme
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </section>
  );
};

export default Login;
