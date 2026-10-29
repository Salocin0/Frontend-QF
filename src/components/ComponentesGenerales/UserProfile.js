import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import { toast } from "react-toastify";
import { FaSignOutAlt } from "react-icons/fa";

const UserProfile = ({ logoutOnly = false }) => {
  const navigate = useNavigate();
  const { user, updateUser } = useContext(UserContext);
  const handleLogout = () => {
    if (user?.id) {
      const base = process.env?.REACT_APP_BACK_URL || "";
      const normalizedBase = base.startsWith("http") ? base : `https://${base}`;
      const url = normalizedBase.endsWith("/") ? `${normalizedBase}user/cerrarWeb` : `${normalizedBase}/user/cerrarWeb`;

      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: user.id }),
      })
        .then(async (response) => {
          if (!response.ok) {
            const text = await response.text().catch(() => "<no body>");
            console.error("Error closing session - non-OK response:", response.status, text);
            toast.error("Error al cerrar sesion");
            return;
          }
          return response.json();
        })
        .then((data) => {
          if (data) {
            updateUser({});
            navigate("/login");
            toast.success("Sesión cerrada");
          }
        })
        .catch((error) => {
          console.log(error);
          toast.error("Error al cerrar sesion");
        });
    }
  };

  if (logoutOnly) {
    return <button type="button" className="qf-account-logout" onClick={handleLogout}><FaSignOutAlt aria-hidden="true" /> Cerrar sesión</button>;
  }

  return (
    <li data-testid="user-profile-nav" className="qf-account-summary">
      <div className="navlink">
        <div>
          <div style={{ fontSize: "15px", fontWeight: "bold" }}>{user?.usuario || "Usuario"}</div>
          <div className="qf-role-badge" aria-label={`Rol activo: ${user?.tipoUsuario || "sin rol"}`}>{user?.tipoUsuario || "Sin rol"}</div>
        </div>
      </div>
    </li>
  );
};

export default UserProfile;
