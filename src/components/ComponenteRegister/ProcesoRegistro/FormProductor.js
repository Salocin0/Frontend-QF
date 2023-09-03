import React, { useState } from "react";

const FormProductor = ({ nextStep, handleRegistro }) => {
  const [productorData, setProductorData] = useState({
    // Campos específicos para productores
  });

  // Función para manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductorData({
      ...productorData,
      [name]: value,
    });
  };

  // Función para manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    // Validación de datos aquí

    // Llama a la función de registro en el componente principal
    handleRegistro(productorData);

    // Avanza al siguiente paso
    nextStep();
  };

  return (
    <div>
      <h2>Datos Productor</h2>
      <form onSubmit={handleSubmit}>
        {/* Campos específicos para productores */}
        <input
          type="text"
          name="campoEspecifico"
          value={productorData.campoEspecifico}
          onChange={handleChange}
          placeholder="Campo Específico"
        />
        {/* Agrega más campos según sea necesario */}
        <button type="submit">Registrar</button>
      </form>
    </div>
  );
};

export default FormProductor;
