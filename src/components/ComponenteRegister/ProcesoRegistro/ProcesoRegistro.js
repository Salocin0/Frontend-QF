import React, { useState } from "react";
import FormUsuario from "./FormUsuario";
import FormProductor from "./FormProductor";
import FormConsumidor from "./FormConsumidor";
import FormEncargado from "./FormEncargado";
import FormRepartidor from "./FormRepartidor";
import { useParams } from "react-router-dom";

const ProcesoRegistro = ({ tipoUsuario }) => {
  const { tipo } = useParams();
  const [step, setStep] = useState(1); // Controla el paso actual del registro

  //si tipo==="consumidor" el proceso va a ser formUsuario -> formConsumidor = finaliza
  //si tipo==="repartidor" el proceso va a ser formUsuario -> formConsumidor -> formRepartidor = finaliza
  //si tipo==="engargado" el proceso va a ser formUsuario -> formConsumidor -> formEncargado = finaliza
  //si tipo==="productor" el proceso va a ser formUsuario -> formConsumidor -> formProductor = finaliza

  // Función para avanzar al siguiente paso
  const nextStep = () => {
    setStep(step + 1);
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
          tipoUsuario={tipoUsuario}
          handleRegistro={handleRegistro}
        />
      );
    case 2:
      return (
        <FormConsumidor nextStep={nextStep} handleRegistro={handleRegistro} />
      );
    case 3:
      if (tipo === "repartidor") {
        return (
          <FormRepartidor nextStep={nextStep} handleRegistro={handleRegistro} />
        );
      } else if (tipo === "engargado") {
        return (
          <FormEncargado nextStep={nextStep} handleRegistro={handleRegistro} />
        );
      } else if (tipo === "productor") {
        return (
          <FormProductor nextStep={nextStep} handleRegistro={handleRegistro} />
        );
      }else{
        //redirigir a login + toast
      }
    default:
      //redirigir a login + toast
  }
};

export default ProcesoRegistro;
