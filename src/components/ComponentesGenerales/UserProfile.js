import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import useDynamicColors from "../../UseDinamicColors";

const UserProfile = ({ haveRol }) => {
  const Colors = useDynamicColors();
  const [isHovered, setIsHovered] = useState(false);

  const styles = {
    icon: {
      fontSize: "1.5rem",
      cursor: "pointer",
      color: isHovered ? "black" : "",
    },
    dropdownMenu: {
      position: "absolute",
      bottom: "100%",
      left: "50%",
      zIndex: "1000",
      display: "none",
      padding: "0.5rem 0",
      marginTop: "0.125rem",
      backgroundColor: Colors.Blanco,
      border: Colors.Blanco==="#fff" ? "1px solid rgba(0,0,0,0.60)" : "1px solid rgba(255,255,255,0.60)",
      borderRadius: "0.25rem",
      boxShadow: "0 0.5rem 1rem rgba(0, 0, 0, 0.175)",
      listStyleType: "none",
    },
    dropdownItem: {
      display: "block",
      width: "100%",
      padding: "0.25rem 1.5rem",
      clear: "both",
      fontWeight: "400",
      color: Colors.Negro,
      textAlign: "inherit",
      textDecoration: "none",
      whiteSpace: "nowrap",
      cursor: "pointer",
    },
    divider: {
      height: "1px",
      margin: "0.5rem 0",
      overflow: "hidden",
      backgroundColor: Colors.GrisClaroPeroNoTanClaro,
    },
    navItemmasicon: {
      display: "flex",
      alignItems: "center",
      width: "100%",
      clear: "both",
      fontWeight: "400",
      color: Colors.Negro, 
      textAlign: "inherit",
      textDecoration: "none",
      whiteSpace: "nowrap",
      cursor: "pointer",
      justifyContent: "center",
      borderRadius: "5px",
      transition: "all 0.2s ease",
    },
    navItem: {
      position: "absolute",
      display: "flex",
      alignItems: "center",
      borderRadius: "5px 5px 5px 5px",
      paddingRight: "5px",
      marginBottom: "10px",
      color: Colors.Gris,
      listStyleType: "none",
      cursor: "pointer",
      bottom: "70px",
      width: "85%",
      margin: "0 auto",
      padding: "0",
      backgroundColor: isHovered ? Colors.Naranja : "transparent",
      border: `2px solid ${Colors.Naranja}`,
    },
  };

  return (
    <li
      style={styles.navItem}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="navlink"
        id="dropdown"
        onClick={(e) => {
          const dropdown = e.currentTarget.nextSibling;
          dropdown.style.display =
            dropdown.style.display === "block" ? "none" : "block";
        }}
        style={styles.navItemmasicon}
      >
        <FontAwesomeIcon icon={faUser} style={styles.icon} className="icono" />
        <span className="ms-1 d-none d-sm-inline text-center">Mi Perfil</span>
      </div>
      <ul style={styles.dropdownMenu} aria-labelledby="dropdown">
        {!haveRol && (
          <>
            <li>
              <a style={styles.dropdownItem} href="/adquirir-nuevo-rolPE">
                ¡Quiero ser Productor!
              </a>
            </li>
            <li>
              <a style={styles.dropdownItem} href="/adquirir-nuevo-rolEPC">
                ¡Quiero ser Encargado de Puestos!
              </a>
            </li>
            <li>
              <a style={styles.dropdownItem} href="/adquirir-nuevo-rolR">
                ¡Quiero ser Repartidor!
              </a>
            </li>
          </>
        )}
        <li>
          <a style={styles.dropdownItem} href="/perfil-nuevo">
            Perfil
          </a>
        </li>
        <li>
          <a style={styles.dropdownItem} href="/configuracion">
            Configuración
          </a>
        </li>
        <li style={styles.divider}></li>
        <li>
          <a style={styles.dropdownItem} href="/">
            Cerrar Sesión
          </a>
        </li>
      </ul>
    </li>
  );
};

export default UserProfile;
