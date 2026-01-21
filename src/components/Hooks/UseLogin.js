import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const useLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tokenWeb, setTokenWeb] = useState("");
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async () => {
    const rawBase = process.env.REACT_APP_BACK_URL || "";
    const prefixed = rawBase.startsWith("http://") || rawBase.startsWith("https://") ? rawBase : `https://${rawBase}`;
    const base = prefixed.endsWith("/") ? prefixed : `${prefixed}/`;
    const url = `${base}login/`;
    const data = {
      contraseña: password,
      correoElectronico: email,
      tokenWeb:tokenWeb
    };

    console.log(data)
    console.log("Base backend utilizada:", base);
    console.log("URL de login:", url);

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

      const contentType = response.headers.get("content-type") || "";
      let responseData;
      if (contentType.includes("application/json")) {
        responseData = await response.json();
      } else {
        const text = await response.text();
        console.error("Respuesta no JSON recibida al iniciar sesión:", text);
        throw new Error("Respuesta del servidor no es JSON");
      }

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
    tokenWeb,
    setTokenWeb,
  };
};

export default useLogin;
