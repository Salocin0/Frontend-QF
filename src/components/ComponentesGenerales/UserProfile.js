import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import useDynamicColors from "../../UseDinamicColors";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "./UserContext";
import { toast } from "react-toastify";

const UserProfile = ({ haveRol }) => {
  const Colors = useDynamicColors();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const { user, updateUser } = useContext(UserContext);
  const [isHoveredIndex, setIsHoveredIndex] = useState(null);

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
          updateUser({});
          navigate("/login");
          toast.success("Sesión cerrada");
        })
        .catch((error) => {
          console.log(error);
          toast.error("Error al cerrar sesion");
        });
    }
  };

  const styles = {
    icon: {
      fontSize: "1.5rem",
      cursor: "pointer",
      color: isHovered ? "black" : Colors.Naranja,
    },
    dropdownMenu: {
      position: "absolute",
      bottom: "15px",
      left: "50%",
      zIndex: "1000",
      display: "none",
      padding: "0.5rem 0",
      marginTop: "0.125rem",
      backgroundColor: Colors.Blanco,
      border:
        Colors.Blanco === "#fff"
          ? "1px solid rgba(0,0,0,0.60)"
          : "1px solid rgba(255,255,255,0.60)",
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
    dropdownItemHovered: {
      backgroundColor: Colors.Naranja,
      color: Colors.Blanco,
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
      marginBottom: "20px",
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

  const menuItems = [
    {
      label: "¡Quiero ser Productor!",
      href: "/adquirir-nuevo-rolPE",
      showWhenNoRol: false,
    },
    {
      label: "¡Quiero ser Encargado de Puestos!",
      href: "/adquirir-nuevo-rolEPC",
      showWhenNoRol: false,
    },
    {
      label: "¡Quiero ser Repartidor!",
      href: "/adquirir-nuevo-rolR",
      showWhenNoRol: false,
    },
    { label: "Perfil", href: "/perfil-nuevo", showWhenNoRol: true },
    { label: "Configuración", href: "/configuracion", showWhenNoRol: true },
  ];

  return (
    <li
      style={{
        ...styles.navItem,
        backgroundColor: isHovered ? Colors.Naranja : "transparent",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="navlink"
        id="dropdown"
        style={styles.navItemmasicon}
        onClick={(e) => {
          const dropdown = e.currentTarget.nextSibling;
          dropdown.style.display =
            dropdown.style.display === "block" ? "none" : "block";
        }}
      >
        <FontAwesomeIcon icon={faUser} style={styles.icon} className="icono" />
        <span
          className="ms-1 d-none d-sm-inline text-center"
          style={{ color: isHovered ? Colors.Negro : Colors.Naranja }}
        >
          Mi Perfil
        </span>
      </div>
      <ul
        style={{
          ...styles.dropdownMenu,
          display: isHovered ? "block" : "none", // Mostrar el menú solo cuando `isHovered` es verdadero
        }}
        aria-labelledby="dropdown"
      >
        {menuItems
          .filter((item) => !haveRol || item.showWhenNoRol) // Condicional para mostrar elementos
          .map((item, index) => (
            <li
              key={index}
              onMouseEnter={() => setIsHoveredIndex(index)}
              onMouseLeave={() => setIsHoveredIndex(null)}
            >
              <a
                href={item.href}
                style={{
                  ...styles.dropdownItem,
                  ...(isHoveredIndex === index && styles.dropdownItemHovered),
                }}
              >
                {item.label}
              </a>
            </li>
          ))}
        <li style={styles.divider}></li>
        <li>
          <span
            style={{
              ...styles.dropdownItem,
              ...(isHoveredIndex === "logout" && styles.dropdownItemHovered),
            }}
            onMouseEnter={() => setIsHoveredIndex("logout")}
            onMouseLeave={() => setIsHoveredIndex(null)}
            onClick={handleLogout}
          >
            Cerrar Sesión
          </span>
        </li>
      </ul>
    </li>
  );
};

export default UserProfile;
