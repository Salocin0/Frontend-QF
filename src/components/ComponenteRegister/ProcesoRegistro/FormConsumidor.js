import React, { useState } from "react";

const FormConsumidor = ({ nextStep, handleRegistro }) => {
  const [consumidorData, setConsumidorData] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    fechaNacimiento: "",
    provincia: "",
    localidad: "",
    telefono: "",
  });

  // Función para manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setConsumidorData({
      ...consumidorData,
      [name]: value,
    });
  };

  // Función para manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    // Validación de datos aquí

    // Llama a la función de registro en el componente principal
    handleRegistro(consumidorData);

    // Avanza al siguiente paso
    nextStep();
  };

  return (
    <div>
      <h2>Datos Consumidor</h2>
      <form onSubmit={handleSubmit}>
        {/* Campos de formulario para nombre, apellido, dni, etc. */}
        <input
          type="text"
          name="nombre"
          value={consumidorData.nombre}
          onChange={handleChange}
          placeholder="Nombre"
        />
        {/* Agrega más campos según sea necesario */}
        <button type="submit">Registrar</button>
      </form>
    </div>
  );
};

export default FormConsumidor;
