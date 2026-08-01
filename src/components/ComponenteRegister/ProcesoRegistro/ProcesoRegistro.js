import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import FormConsumidor from "./FormConsumidor";
import FormEncargado from "./FormEncargado";
import FormProductor from "./FormProductor";
import FormRepartidor from "./FormRepartidor";
import FormUsuario from "./FormUsuario";
import useBreakpoint from "../../../useBreakpoint";
import "../placeholder.css"

const STEP_LABELS = {
  1: "Usuario",
  2: "Datos",
  3: "Perfil",
};

const ProcesoRegistro = () => {
  const { isMobile } = useBreakpoint();
  const { tipoUsuario } = useParams();
  const totalSteps = tipoUsuario === "consumidor" ? 2 : 3;
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({});
  const [consumidorData, setConsumidorData] = useState({});
  const [, setRepartidorData] = useState({});
  const [encargadoData, setEncargadoData] = useState({});
  const [productorData, setProductorData] = useState({});
  const [registrar, setRegistrar] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
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
      setIsRegistering(true);
      const datosRegistro = {
        correoElectronico: userData.email,
        contraseña: userData.password,
        usuario: {
          contraseña: userData.password,
          fechaAlta: Date.now(),
          nombreDeUsuario: userData.username,
          correoElectronico: userData.email,
          tipoUsuario: tipoUsuario,
          tokenWeb: userData.tokenWeb,
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
      console.log(datosRegistro.tokenWeb);

      fetch(`${process.env.REACT_APP_BACK_URL}user/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datosRegistro),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Respuesta de servidor no exitosa");
          }
        })
        .then((data) => {
          setIsRegistering(false);
          if (data.status === "success") {
            toast.success("Registro exitoso");
            toast.info("Se envio un email de validacion a su correo");
            navigate(`/login`);
          } else {
            throw new Error(data.msg || "Error en el servidor");
          }
        })
        .catch((error) => {
          setIsRegistering(false);
          console.error("Error en la solicitud:", error);
          toast.error("Error al registrar. Por favor, vuelva a intentar.");
          //toast.success("Registro exitoso");
          navigate(`/`);
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registrar]);

  const stepperDots = (
    <div
      data-testid="registro-stepper"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: isMobile ? "4px" : "16px",
        padding: isMobile ? "12px 8px" : "20px 16px",
        width: "100%",
        maxWidth: isMobile ? "100%" : "600px",
        margin: "0 auto",
      }}
    >
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => (
        <div
          key={s}
          style={{
            display: "flex",
            alignItems: "center",
            gap: isMobile ? "4px" : "8px",
          }}
        >
          <div
            style={{
              width: isMobile ? "32px" : "36px",
              height: isMobile ? "32px" : "36px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              fontSize: isMobile ? "0.8rem" : "0.9rem",
              backgroundColor: step === s ? "var(--qf-naranja)" : "var(--qf-bg-card)",
              color: step === s ? "#000" : "var(--qf-text-white)",
              border: "2px solid var(--qf-naranja)",
              transition: "background-color 0.2s",
            }}
          >
            {s}
          </div>
          {!isMobile && (
            <span
              style={{
                fontSize: "0.85rem",
                color: step === s ? "var(--qf-naranja)" : "var(--qf-text-muted)",
                fontWeight: step === s ? "bold" : "normal",
              }}
            >
              {STEP_LABELS[s]}
            </span>
          )}
          {s < totalSteps && (
            <div
              style={{
                width: isMobile ? "24px" : "40px",
                height: "2px",
                backgroundColor: step > s ? "var(--qf-naranja)" : "var(--qf-bg-card)",
                transition: "background-color 0.2s",
              }}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderForm = () => {
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
            isRegistering={isRegistering}
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

  return (
    <div data-testid="proceso-registro">
      {stepperDots}
      {renderForm()}
    </div>
  );
};

export default ProcesoRegistro;
