import React from "react";
import { Link } from "react-router-dom";
import Logo from "../img/adaptive-icon.png";
import useDynamicColors from "../../UseDinamicColors";
import { FaUserPlus, FaSignInAlt } from "react-icons/fa";

const Navbar = () => {
  const Colors = useDynamicColors();
  const styles = {
    navbar: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "10px 20px",
      backgroundColor: Colors.GrisAzuladoOscuro,
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    },
    logo: {
      height: "50px",
      width: "auto",
      marginRight: "15px",
    },
    togglerButton: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "transparent",
      border: "none",
      cursor: "pointer",
      marginBottom: "10px",
    },
    togglerIcon: {
      width: "30px",
      height: "30px",
      backgroundColor: Colors.GrisClaro,
    },
    navbarCollapse: {
      display: "flex",
      alignItems: "center",
      flexDirection: "row",
    },
    navItemGray: {
      color: Colors.Gris,
      cursor: "pointer",
      textDecoration: "none",
      border: `2px solid ${Colors.Gris}`,
      borderRadius: "10px",
      margin: "10px",
      display: "flex",
      alignItems: "center",
      padding: "5px 20px",
    },
    navItemYellow: {
      backgroundColor: Colors.Naranja,
      color: Colors.BlancoEnBlanco,
      cursor: "pointer",
      textDecoration: "none",
      borderRadius: "10px",
      margin: "10px",
      display: "flex",
      alignItems: "center",
      padding: "5px 20px",
    },
    themeButton: {
      color: Colors.Naranja,
      fontSize: "1.5rem",
      cursor: "pointer",
      backgroundColor: "transparent",
      border: "none",
      padding: "5px 20px",
      marginLeft: "10px",
    },
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.navbarCollapse}>
        <img src={Logo} alt="Logo" style={styles.logo} />
      </div>
      <div style={styles.navbarCollapse}>
        <ul style={{ display: "flex", listStyle: "none", margin: 0, padding: 0 }}>
          <Link to="/seleccion-perfil" style={styles.navItemGray}>
            <li>
              <FaUserPlus />
              &nbsp;Registrarse
            </li>
          </Link>
          <Link to="/login" style={styles.navItemYellow}>
            <li>
              <FaSignInAlt />
              &nbsp;Ingresar
            </li>
          </Link>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
