import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const useLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async () => {
    const url = `${process.env.REACT_APP_BACK_URL}login/`;
    const data = {
      contraseña: password,
      correoElectronico: email,
    };

    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };

    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error("Error en la solicitud");
      }

      const responseData = await response.json();

      if (Number(responseData.code) === 200) {
        sessionStorage.setItem("sessionId", responseData.data.sessionId);
        toast.success("Login correcto");
        navigate(`/inicio`);
        return { success: true, data: responseData.data };
      } else if (Number(responseData.code) === 300) {
        toast.info("Email no validado, revisa tu correo");
        navigate(`/login`);
      } else if (Number(responseData.code) === 301) {
        toast.info("Usuario inhabilitado");
        navigate(`/habilitar-Usuario-deshabilitado/${responseData.data.id}`);
      } else {
        toast.error("Datos incorrectos");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error de red");
    }

    return { success: false };
  };

  return {
    email,
    password,
    handleEmailChange,
    handlePasswordChange,
    handleLogin,
  };
};

export default useLogin;
