import { faRightToBracket, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";
import Logo from "../img/QuickFood_LogoYellow.png";
import useDynamicColors from "../../UseDinamicColors";

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
      padding: "5px",
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
      padding: "5px",
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
              <FontAwesomeIcon icon={faUser} />
              &nbsp;Registrarse
            </li>
          </Link>
          <Link to="/login" style={styles.navItemYellow}>
            <li>
              <FontAwesomeIcon icon={faRightToBracket} />
              &nbsp;Ingresar
            </li>
          </Link>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
