import React, { useEffect, useState } from "react";
import Logo from "../img/adaptive-icon.png";
import MenuItems from "./MenuItems";
import UserProfile from "./UserProfile";
import Panel from "../ComponentesLandingPage/ChatPanel";
import useDynamicColors from "../../UseDinamicColors";

const Sidebar = ({ tipoUsuario }) => {
  const [usuario, setUsuario] = useState("consumidor");
  const [isResponsable, setIsResponsable] = useState(false);
  const [isProductor, setIsProductor] = useState(false);
  const [isRepartidor, setIsRepartidor] = useState(false);
  const [haveRol, setHaveRol] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const  Colors  = useDynamicColors();

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

  const sidebarStyles = {
    width: "20%",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    padding: "20px",
    boxSizing: "border-box",
    backgroundColor: Colors.GrisAzuladoOscuro,
    position: "fixed",
  };

  return (
    <div className="sidebar" style={sidebarStyles}>
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
