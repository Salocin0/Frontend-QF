import React, { useState } from "react";
import FormUsuario from "./FormUsuario";
import FormProductor from "./FormProductor";
import FormConsumidor from "./FormConsumidor";
import FormEncargado from "./FormEncargado";
import FormRepartidor from "./FormRepartidor";
import { useParams } from "react-router-dom";

const ProcesoRegistro = () => {
  const { tipoUsuario } = useParams();
  const [step, setStep] = useState(1);
  console.log("tipoUsuario:", tipoUsuario);

  // Función para avanzar al siguiente paso
  const nextStep = () => {
    setStep(step + 1);
  };

  const backStep = () => {
    setStep(step - 1);
  };

  // Función para manejar el envío del formulario de registro
  const handleRegistro = (data) => {
    // Realiza un fetch para enviar los datos al servidor
    // Aquí puedes agregar la lógica de envío de datos al servidor
    console.log("Datos de registro:", data);
  };

  // Renderiza el componente correspondiente según el paso actual
  switch (step) {
    case 1:
      return (
        <FormUsuario
          nextStep={nextStep}
          backStep={backStep}
          tipoUsuario={tipoUsuario}
          handleRegistro={handleRegistro}
        />
      );
    case 2:
      return (
        <FormConsumidor nextStep={nextStep} backStep={backStep} tipoUsuario={tipoUsuario} handleRegistro={handleRegistro} />
      );
    case 3:
      if (tipoUsuario === "repartidor") {
        return (
          <FormRepartidor nextStep={nextStep} backStep={backStep} tipoUsuario={tipoUsuario} handleRegistro={handleRegistro} />
        );
      } else if (tipoUsuario === "encargado") {
        return (
          <FormEncargado nextStep={nextStep} backStep={backStep} tipoUsuario={tipoUsuario} handleRegistro={handleRegistro} />
        );
      } else if (tipoUsuario === "productor") {
        return (
          <FormProductor nextStep={nextStep} backStep={backStep} tipoUsuario={tipoUsuario} handleRegistro={handleRegistro} />
        );
      }
    default:
      //registrar
      //redirigir a login + toast
  }
};

export default ProcesoRegistro;
