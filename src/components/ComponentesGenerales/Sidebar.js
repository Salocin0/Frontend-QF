import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Logo from "../img/adaptive-icon.png";
import MenuItems from "./MenuItems";
import UserProfile from "./UserProfile";
import Panel from "../ComponentesLandingPage/ChatPanel";
import useBreakpoint from "../../useBreakpoint";
import { FaTimes } from "react-icons/fa";

const Sidebar = ({ tipoUsuario, onClose, isCollapsed }) => {
  const { isMobile } = useBreakpoint();
  const [usuario, setUsuario] = useState("consumidor");
  const [isResponsable, setIsResponsable] = useState(false);
  const [isProductor, setIsProductor] = useState(false);
  const [isRepartidor, setIsRepartidor] = useState(false);
  const [haveRol, setHaveRol] = useState(false);
  const [showPanel, setShowPanel] = useState(false);

  // Verificación de seguridad
  const SafeMenuItems = (props) => typeof MenuItems === 'function' ? <MenuItems {...props} /> : <div>Error: MenuItems undefined</div>;
  const SafeUserProfile = (props) => typeof UserProfile === 'function' ? <UserProfile {...props} /> : <div>Error: UserProfile undefined</div>;
  const SafePanel = (props) => typeof Panel === 'function' ? <Panel {...props} /> : <div>Error: Panel undefined</div>;

  const togglePanel = () => {
    setShowPanel(!showPanel);
  };

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
          <img src={Logo} alt="Logo" className="logo" style={{ borderRadius: "10px" }} />
        </a>
      </div>
      <div className="menu-container">
        <SafeMenuItems
          isResponsable={isResponsable}
          isProductor={isProductor}
          isRepartidor={isRepartidor}
          togglePanel={togglePanel}
        />
        {showPanel && createPortal(
          <SafePanel
            onClose={togglePanel}
            position="fixed"
            bottom={isMobile ? "80px" : "44px"}
            left={isMobile || isCollapsed ? "0" : "280px"}
            isLogin={true}
          />,
          document.body
        )}
        <SafeUserProfile haveRol={haveRol} />
      </div>
    </div>
  );
};

export default Sidebar;
