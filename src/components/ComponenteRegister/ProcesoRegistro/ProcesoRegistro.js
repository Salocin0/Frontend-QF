import React, { useState, useEffect } from "react";
import FormUsuario from "./FormUsuario";
import FormProductor from "./FormProductor";
import FormConsumidor from "./FormConsumidor";
import FormEncargado from "./FormEncargado";
import FormRepartidor from "./FormRepartidor";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ProcesoRegistro = () => {
  const { tipoUsuario } = useParams();
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({});
  const [consumidorData, setConsumidorData] = useState({});
  const [repartidorData, setRepartidorData] = useState({});
  const [encargadoData, setEncargadoData] = useState({});
  const [productorData, setProductorData] = useState({});
  const [registrar, setRegistrar] = useState(false);
  const navigate = useNavigate();
  
  const handleFinalizar = () => {
    setRegistrar(true);
  };

  const handleUser = (data) => {
    setUserData(data);
  };
  const handleConsumidor = (data) => {
    setConsumidorData(data);
    if (tipoUsuario === "consumidor") {
      handleFinalizar();
    }
  };
  const handleRepartidor = (data) => {
    setRepartidorData(data);
    handleFinalizar();
  };
  const handleEncargado = (data) => {
    setEncargadoData(data);
    handleFinalizar();
  };
  const handleProductor = (data) => {
    setProductorData(data);
    handleFinalizar();
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const backStep = () => {
    setStep(step - 1);
  };

  useEffect(() => {
    if (registrar) {
      const datosRegistro = {
        correoElectronico: userData.email,
        contraseña: userData.password,
        usuario: {
          contraseña: userData.password,
          fechaAlta: Date.now(),
          nombreDeUsuario: userData.username,
          correoElectronico: userData.email,
          tipoUsuario: tipoUsuario,
        },
        consumidor: {
          nombre: consumidorData.nombre,
          apellido: consumidorData.apellido,
          fechaDeNacimiento: consumidorData.fechaNacimiento,
          dni: consumidorData.dni,
          localidad: consumidorData.localidad,
          provincia: consumidorData.provincia,
          telefono: consumidorData.telefono,
        },
        repartidor: {},
        encargado: {
          cuit: encargadoData.cuit,
          razonSocial: encargadoData.razonSocial,
          condicionIva: encargadoData.ivaCondicion,
        },
        productor: {
          cuit: productorData.cuit,
          razonSocial: productorData.razonSocial,
          condicionIva: productorData.ivaCondicion,
        },
      };
      console.log(JSON.stringify(datosRegistro));

      fetch("http://127.0.0.1:8000/user/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datosRegistro),
      })
        .then((response) => response.json())
        .then((data) => {
          toast.success("registro correcto");
          navigate(`/login`);
        })
        .catch((error) => {
          console.error("Error en la solicitud:", error);
          toast.error("error al registrar");
          navigate(`/`);
        });
    }
  }, [registrar]);

  switch (step) {
    case 1:
      return (
        <FormUsuario
          nextStep={nextStep}
          backStep={backStep}
          tipoUsuario={tipoUsuario}
          handleRegistro={handleUser}
        />
      );
    case 2:
      return (
        <FormConsumidor
          nextStep={nextStep}
          backStep={backStep}
          tipoUsuario={tipoUsuario}
          handleRegistro={handleConsumidor}
        />
      );
    case 3:
      if (tipoUsuario === "repartidor") {
        return (
          <FormRepartidor
            nextStep={nextStep}
            backStep={backStep}
            tipoUsuario={tipoUsuario}
            handleRegistro={handleRepartidor}
          />
        );
      } else if (tipoUsuario === "encargado") {
        return (
          <FormEncargado
            nextStep={nextStep}
            backStep={backStep}
            tipoUsuario={tipoUsuario}
            handleRegistro={handleEncargado}
          />
        );
      } else if (tipoUsuario === "productor") {
        return (
          <FormProductor
            nextStep={nextStep}
            backStep={backStep}
            tipoUsuario={tipoUsuario}
            handleRegistro={handleProductor}
          />
        );
      }
  }
};

export default ProcesoRegistro;
