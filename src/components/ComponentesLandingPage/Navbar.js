import React, { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../img/adaptive-icon.png";
import { FaUserPlus, FaSignInAlt, FaBars, FaTimes } from "react-icons/fa";
import useBreakpoint from "../../useBreakpoint";

const Navbar = () => {
  const { isMobile } = useBreakpoint();
  const [menuOpen, setMenuOpen] = useState(false);

  const styles = {
    navbar: {
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "10px 20px",
      backgroundColor: "var(--qf-bg-main)",
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      position: "relative",
    },
    navbarTop: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      width: isMobile ? "100%" : "auto",
    },
    logo: {
      height: "50px",
      width: "auto",
      marginRight: "15px",
    },
    hamburgerBtn: {
      display: isMobile ? "flex" : "none",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "transparent",
      border: "none",
      cursor: "pointer",
      fontSize: "1.5rem",
      color: "var(--qf-naranja)",
      padding: "5px",
    },
    navbarCollapse: {
      display: isMobile ? (menuOpen ? "flex" : "none") : "flex",
      alignItems: "center",
      flexDirection: isMobile ? "column" : "row",
      width: isMobile ? "100%" : "auto",
      paddingTop: isMobile ? "10px" : "0",
    },
    navItemGray: {
      color: "var(--qf-text-muted)",
      cursor: "pointer",
      textDecoration: "none",
      border: `2px solid var(--qf-text-muted)`,
      borderRadius: "10px",
      margin: isMobile ? "5px 0" : "10px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "5px 20px",
      width: isMobile ? "100%" : "auto",
    },
    navItemYellow: {
      backgroundColor: "var(--qf-naranja)",
      color: "var(--qf-negro-puro)",
      cursor: "pointer",
      textDecoration: "none",
      borderRadius: "10px",
      margin: isMobile ? "5px 0" : "10px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "5px 20px",
      width: isMobile ? "100%" : "auto",
    },
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.navbarTop}>
        <img src={Logo} alt="Logo" style={styles.logo} />
        <button
          style={styles.hamburgerBtn}
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Menú"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
      <div style={styles.navbarCollapse}>
        <ul style={{ display: "flex", flexDirection: isMobile ? "column" : "row", listStyle: "none", margin: 0, padding: 0, width: isMobile ? "100%" : "auto" }}>
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
