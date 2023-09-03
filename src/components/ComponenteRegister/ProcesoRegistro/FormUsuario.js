import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../seleccionRegister.css";

const FormUsuario = ({ nextStep, backStep, tipoUsuario, handleRegistro }) => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    handleRegistro(userData);
    nextStep();
  };

  console.log(tipoUsuario);

  return (
    <div className="background">
      <div className="container vh-100">
        <div className="row h-100 justify-content-center align-items-center">
          <div className="col-md-4">
            <div className="card">
              <div className="card-header">
                <h2 className="text-center">
                  Datos Usuario 1/{tipoUsuario === "consumidor" ? "2" : "3"}
                </h2>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="username">Nombre de usuario</label>
                    <input
                      type="text"
                      name="username"
                      value={userData.username}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Nombre de usuario"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={userData.email}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Email"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">Contraseña</label>
                    <div className="input-group">
                      <input
                        type="password"
                        name="password"
                        value={userData.password}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Contraseña"
                      />
                      <div className="input-group-append">
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                        >
                          Mostrar
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="confirmPassword">Repetir Contraseña</label>
                    <div className="input-group">
                      <input
                        type="password"
                        name="confirmPassword"
                        value={userData.confirmPassword}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Repetir Contraseña"
                      />
                      <div className="input-group-append">
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                        >
                          Mostrar
                        </button>
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between mt-2">
                    <Link
                      to={"/seleccion-perfil"}
                      className="btn btn-secondary"
                    >
                      Atrás
                    </Link>
                    <button type="submit" className="btn btn-primary">
                      Siguiente
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormUsuario;
