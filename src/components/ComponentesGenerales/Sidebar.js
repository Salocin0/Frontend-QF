import React, { useEffect, useState } from "react";
import Logo from "../img/qf-new-logo-solid.png";
import LogoTransparent from "../img/qf-new-logo-transparent.png";
import MenuItems from "./MenuItems";
import UserProfile from "./UserProfile";
import useBreakpoint from "../../useBreakpoint";
import useTheme from "../../useTheme";
import { FaTimes, FaSun, FaMoon } from "react-icons/fa";

const Sidebar = ({ tipoUsuario, onClose, isCollapsed }) => {
  const { isMobile } = useBreakpoint();
  const { isDark, toggleTheme } = useTheme();
  const [usuario, setUsuario] = useState("consumidor");
  const [isResponsable, setIsResponsable] = useState(false);
  const [isProductor, setIsProductor] = useState(false);
  const [isRepartidor, setIsRepartidor] = useState(false);
  const [haveRol, setHaveRol] = useState(false);

  // Verificación de seguridad
  const SafeMenuItems = (props) => typeof MenuItems === 'function' ? <MenuItems {...props} /> : <div>Error: MenuItems undefined</div>;
  const SafeUserProfile = (props) => typeof UserProfile === 'function' ? <UserProfile {...props} /> : <div>Error: UserProfile undefined</div>;
  useEffect(() => {
    setUsuario(tipoUsuario);
    setIsResponsable(usuario === "encargado");
    setIsProductor(usuario === "productor");
    setIsRepartidor(usuario === "repartidor");
    setHaveRol(usuario !== "consumidor");
  }, [tipoUsuario, usuario]);

  return (
    <div className="sidebar">
      {/* X para cerrar en mobile */}
      {isMobile && onClose && (
        <button
          className="sidebar-close-btn"
          onClick={onClose}
          aria-label="Cerrar menú"
        >
          <FaTimes />
        </button>
      )}

      <div className="logocontainer">
        <a href="/inicio">
          <img src={isDark ? Logo : LogoTransparent} alt="QuickFood" className="logo" style={{ borderRadius: "10px", width: isCollapsed && !isMobile ? "56px" : "120px", height: "auto", maxWidth: "100%", objectFit: "contain" }} />
        </a>

      </div>
      <div className="menu-container">
        <SafeMenuItems
          haveRol={haveRol}
          isResponsable={isResponsable}
          isProductor={isProductor}
          isRepartidor={isRepartidor}
        />
      </div>
      <div className="qf-sidebar-account-footer">
      <div className="qf-sidebar-account">
        <ul><SafeUserProfile haveRol={haveRol} /></ul>
        <button type="button" className="qf-sidebar-theme" onClick={toggleTheme} aria-label={isDark ? "Activar modo claro" : "Activar modo oscuro"} title={isDark ? "Activar modo claro" : "Activar modo oscuro"}>
          {isDark ? <FaSun aria-hidden="true" /> : <FaMoon aria-hidden="true" />}
        </button>
      </div>
      <SafeUserProfile logoutOnly />
      </div>
    </div>
  );
};

export default Sidebar;
