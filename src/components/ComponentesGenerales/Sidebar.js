import React, { useEffect, useState } from "react";
import Logo from "../img/adaptive-icon.png";
import MenuItems from "./MenuItems";
import UserProfile from "./UserProfile";
import Panel from "../ComponentesLandingPage/ChatPanel";

const Sidebar = ({ tipoUsuario }) => {
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
        {showPanel && (
          <SafePanel
            onClose={togglePanel}
            position="fixed"
            bottom="56px"
            left="306px "
            isLogin={true}
          />
        )}
        <SafeUserProfile haveRol={haveRol} />
      </div>
    </div>
  );
};

export default Sidebar;
