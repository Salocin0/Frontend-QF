import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import styles from "../seleccionRegister.module.css";

const FormUsuario = ({ nextStep, backStep, tipoUsuario, handleRegistro }) => {
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

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
      toast.error("el nombre de usuario no puede estar vacío.");
      return;
    }

    if (userData.email.length===0) {
      toast.error("el email no puede estar vacío.");
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

    handleRegistro(userData);
    nextStep();
  };

  return (
    <div className={`${styles.background} ${styles.container} vh-100`}>
      <div className="row h-100 justify-content-center align-items-center">
        <div className="col-md-4">
          <div className={`${styles.card} card`}>
            <div className={`${styles.cardheader}`}>
              <h2
                className={`${styles.h2} text-center`}
                style={{ color: "white" }}
              >
                Datos Usuario 1/{tipoUsuario === "consumidor" ? "2" : "3"}
              </h2>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className={`form-group`}>
                  <label htmlFor="username" className={styles.label}>
                    Nombre de usuario
                  </label>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    data-testid="username"
                    value={userData.username}
                    onChange={handleChange}
                    className={`${styles.blackwhite}  form-control`}
                    placeholder="Nombre de usuario"
                    autoComplete=" "
                  />
                </div>
                <div className={` form-group`}>
                  <label htmlFor="email" className={styles.label}>
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    data-testid="email"
                    value={userData.email}
                    onChange={handleChange}
                    className={`${styles.blackwhite}  form-control`}
                    placeholder="Email"
                    autoComplete=" "
                  />
                </div>
                <div className={` form-group`}>
                  <label htmlFor="password" className={styles.label}>
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
                      className={`${styles.blackwhite} form-control`}
                      placeholder="Contraseña"
                    />
                    <div className="input-group-append">
                      <button
                        type="button"
                        className={`${styles["btn"]} btn btn-outline-secondary`}
                        onClick={toggleShowPassword1}
                      >
                        {showPassword1 ? "Ocultar" : "Mostrar"}
                      </button>
                    </div>
                  </div>
                </div>
                <div className={`${styles["form-group"]} form-group`}>
                  <label htmlFor="confirmPassword" className={styles.label}>
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
                      className={` form-control ${styles.blackwhite}`}
                      placeholder="Repetir Contraseña"
                    />
                    <div className="input-group-append">
                      <button
                        type="button"
                        className={`${styles["btn"]} btn btn-outline-secondary`}
                        onClick={toggleShowPassword2}
                      >
                        {showPassword2 ? "Ocultar" : "Mostrar"}
                      </button>
                    </div>
                  </div>
                </div>
                <hr style={{ color: "white" }} />
                <div
                  className={`d-flex justify-content-between mt-2 ${styles["d-flex"]}`}
                >
                  <Link
                    to={"/seleccion-perfil"}
                    className={`${styles["btn"]} btn btn-secondary`}
                  >
                    Atrás
                  </Link>
                  <button
                    type="submit"
                    className={`${styles["btn"]} btn btn-primary`}
                  >
                    Siguiente
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormUsuario;
