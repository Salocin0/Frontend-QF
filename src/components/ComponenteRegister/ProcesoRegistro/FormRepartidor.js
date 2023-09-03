import React, { useState } from "react";

const FormRepartidor = ({ nextStep, handleRegistro }) => {
  const [repartidorData, setRepartidorData] = useState({
    // Campos específicos para repartidores
  });

  // Función para manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setRepartidorData({
      ...repartidorData,
      [name]: value,
    });
  };

  // Función para manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    // Validación de datos aquí

    // Llama a la función de registro en el componente principal
    handleRegistro(repartidorData);

    // Avanza al siguiente paso
    nextStep();
  };

  return (
    <div>
      <h2>Datos Repartidor</h2>
      <form onSubmit={handleSubmit}>
        {/* Campos específicos para repartidores */}
        <input
          type="text"
          name="campoEspecifico"
          value={repartidorData.campoEspecifico}
          onChange={handleChange}
          placeholder="Campo Específico"
        />
        {/* Agrega más campos según sea necesario */}
        <button type="submit">Registrar</button>
      </form>
    </div>
  );
};

export default FormRepartidor;
