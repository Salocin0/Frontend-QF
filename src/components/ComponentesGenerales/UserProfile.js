import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState,useEffect } from "react";
import useDynamicColors from "../../UseDinamicColors";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "./UserContext";
import { toast } from "react-toastify";

const UserProfile = ({ haveRol }) => {
  const Colors = useDynamicColors();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const { user,setUser } = useContext(UserContext);

  const handleLogout = () => {
    if (user.id) {
      fetch(`${process.env?.REACT_APP_BACK_URL}user/cerrarWeb`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: user.id }),
      })
        .then((response) => response.json())
        .then((data) => {
          setUser({});
          navigate("/login");
          toast.success("Sesión cerrada");
        })
        .catch((error) => toast.error("Error al cerrar sesion"));
    }
  };

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
          <span style={styles.dropdownItem} onClick={handleLogout}>
            Cerrar Sesión
          </span>
        </li>
      </ul>
    </li>
  );
};

export default UserProfile;
