import React, { useState } from "react";

const FormUsuario = ({ nextStep, tipoUsuario, handleRegistro }) => {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Función para manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  // Función para manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    // Validación de datos aquí

    // Llama a la función de registro en el componente principal
    handleRegistro(userData);

    // Avanza al siguiente paso
    nextStep();
  };

  return (
    <div>
      <h2>Datos Usuario</h2>
      <form onSubmit={handleSubmit}>
        {/* Campos de formulario para nombre de usuario, email, contraseña, etc. */}
        <input
          type="text"
          name="username"
          value={userData.username}
          onChange={handleChange}
          placeholder="Nombre de usuario"
        />
        {/* Agrega más campos según sea necesario */}
        <button type="submit">Siguiente</button>
      </form>
    </div>
  );
};

export default FormUsuario;
