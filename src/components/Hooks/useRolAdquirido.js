import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UserContext } from "../ComponentesGenerales/UserContext";

// After acquiring a new role the session is updated in place (the backend has no
// role-bound session state), so the user keeps working instead of logging in again.
export const useRolAdquirido = () => {
  const { user, updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  return (tipoUsuario, mensaje) => {
    updateUser({ ...user, tipoUsuario });
    toast.success(mensaje);
    navigate("/inicio");
  };
};
