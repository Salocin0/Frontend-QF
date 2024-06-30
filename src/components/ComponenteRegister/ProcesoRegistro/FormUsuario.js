import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchToken } from "../../../firebase.js"; // Asegúrate de importar fetchToken
import Footer from "../../ComponentesGenerales/Footer";
import "./../../sass/main.scss";

const FormUsuario = ({ nextStep, backStep, tipoUsuario, handleRegistro }) => {
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [currentToken, setCurrentToken] = useState(null); // Estado para almacenar el token web

  useEffect(() => {
    // Función para obtener el token web al cargar el componente
    fetchToken()
      .then((token) => setCurrentToken(token))
      .catch((error) => {
        console.error("Error al obtener el token web:", error);
        toast.error("Error al obtener el token web. Inténtalo de nuevo más tarde.");
      });
  }, []);

  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const toggleShowPassword1 = () => {
    setShowPassword1(!showPassword1);
  };

  const toggleShowPassword2 = () => {
    setShowPassword2(!showPassword2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!userData.username.trim()) {
      toast.error("El nombre de usuario no puede estar vacío.");
      return;
    }

    if (userData.email.length === 0) {
      toast.error("El email no puede estar vacío.");
      return;
    }

    if (userData.password !== userData.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    if (!userData.password.trim()) {
      toast.error("La contraseña no puede estar vacía.");
      return;
    }

    if (userData.password.length < 8) {
      toast.error("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (!currentToken) {
      toast.error("No se ha podido obtener el token web. Inténtalo de nuevo.");
      return;
    }

    // Incluir el token web en userData
    const userDataWithToken = {
      ...userData,
      tokenWeb: currentToken,
    };

    handleRegistro(userDataWithToken); // Envía userData con el token al backend
    nextStep(); // Avanza al siguiente paso si todo es correcto
  };

  return (
    <div className="background-prelogin">
      <div className="container vh-100">
        <div className="row h-100 justify-content-center align-items-center">
          <div className="col-10 col-sm-9 col-md-8 col-lg-6">
            <div className={`card`}>
              <div className={`cardheader`}>
                <h2 className={`h2 text-center`} style={{ color: "white" }}>
                  Datos Usuario 1/{tipoUsuario === "consumidor" ? "2" : "3"}
                </h2>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className={`form-group`}>
                    <label htmlFor="username" className="label">
                      Nombre de usuario
                    </label>
                    <input
                      type="text"
                      name="username"
                      id="username"
                      data-testid="username"
                      value={userData.username}
                      onChange={handleChange}
                      className={`blackwhite form-control`}
                      placeholder="Nombre de usuario"
                      autoComplete=" "
                    />
                  </div>
                  <div className={` form-group`}>
                    <label htmlFor="email" className="label">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      data-testid="email"
                      value={userData.email}
                      onChange={handleChange}
                      className={`blackwhite form-control`}
                      placeholder="Email"
                      autoComplete=" "
                    />
                  </div>
                  <div className={` form-group`}>
                    <label htmlFor="password" className="label">
                      Contraseña
                    </label>
                    <div className="input-group">
                      <input
                        type={showPassword1 ? "text" : "password"}
                        name="password"
                        id="password"
                        data-testid="password"
                        value={userData.password}
                        onChange={handleChange}
                        className={`blackwhite form-control`}
                        placeholder="Contraseña"
                      />
                      <div className="input-group-append">
                        <button
                          type="button"
                          className={`btn btn-outline-secondary`}
                          onClick={toggleShowPassword1}
                        >
                          {showPassword1 ? "Ocultar" : "Mostrar"}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className={`form-group`}>
                    <label htmlFor="confirmPassword" className="label">
                      Repetir Contraseña
                    </label>
                    <div className="input-group">
                      <input
                        type={showPassword2 ? "text" : "password"}
                        name="confirmPassword"
                        id="confirmPassword"
                        data-testid="confirmPassword"
                        value={userData.confirmPassword}
                        onChange={handleChange}
                        className={` form-control blackwhite`}
                        placeholder="Repetir Contraseña"
                      />
                      <div className="input-group-append">
                        <button
                          type="button"
                          className={`btn btn-outline-secondary`}
                          onClick={toggleShowPassword2}
                        >
                          {showPassword2 ? "Ocultar" : "Mostrar"}
                        </button>
                      </div>
                    </div>
                  </div>
                  <hr style={{ color: "white" }} />
                  <div className={`d-flex justify-content-between mt-2`}>
                    <Link
                      to={"/seleccion-perfil"}
                      className={`btn btn-secondary`}
                    >
                      Atrás
                    </Link>
                    <button type="submit" className={`btn btn-primary`}>
                      Siguiente
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <Footer />
      </div>
    </div>
  );
};

export default FormUsuario;
