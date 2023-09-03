import React, { useState } from "react";

const FormEncargado = ({ nextStep, handleRegistro }) => {
  const [encargadoData, setEncargadoData] = useState({
    // Campos específicos para encargados
  });

  // Resto del código similar a FormConsumidor
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEncargadoData({
      ...encargadoData,
      [name]: value,
    });
  };

  // Función para manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    // Validación de datos aquí

    // Llama a la función de registro en el componente principal
    handleRegistro(encargadoData);

    // Avanza al siguiente paso
    nextStep();
  };
  return (
    <div>
      <h2>Datos Encargado</h2>
      <form onSubmit={handleSubmit}>
        {/* Campos específicos para encargados */}
        <input
          type="text"
          name="campoEspecifico"
          value={encargadoData.campoEspecifico}
          onChange={handleChange}
          placeholder="Campo Específico"
        />
        {/* Agrega más campos según sea necesario */}
        <button type="submit">Registrar</button>
      </form>
    </div>
  );
};

export default FormEncargado;
