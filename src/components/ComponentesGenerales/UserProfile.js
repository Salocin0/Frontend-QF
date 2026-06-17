import React, { useState, useContext, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import { toast } from "react-toastify";
import { FaUser } from "react-icons/fa";
import useBreakpoint from "../../useBreakpoint";

const UserProfile = ({ haveRol }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { user, updateUser } = useContext(UserContext);
  const [isHoveredIndex, setIsHoveredIndex] = useState(null);
  const wrapperRef = useRef(null);
  const { isMobile } = useBreakpoint();

  const handleLogout = () => {
    if (user.id) {
      const base = process.env?.REACT_APP_BACK_URL || "";
      const normalizedBase = base.startsWith("http") ? base : `https://${base}`;
      const url = normalizedBase.endsWith("/") ? `${normalizedBase}user/cerrarWeb` : `${normalizedBase}/user/cerrarWeb`;
      console.log('UserProfile - logout url:', url);

      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: user.id }),
      })
        .then(async (response) => {
          if (!response.ok) {
            const text = await response.text().catch(() => "<no body>");
            console.error("Error closing session - non-OK response:", response.status, text);
            toast.error("Error al cerrar sesion");
            return;
          }
          return response.json();
        })
        .then((data) => {
          if (data) {
            updateUser({});
            navigate("/login");
            toast.success("Sesión cerrada");
          }
        })
        .catch((error) => {
          console.log(error);
          toast.error("Error al cerrar sesion");
        });
    }
  };

  // Posición del dropdown relativa al wrapper
  const [dropdownPos, setDropdownPos] = useState(null);

  useEffect(() => {
    if (isOpen && wrapperRef.current) {
      const r = wrapperRef.current.getBoundingClientRect();
      setDropdownPos({
        bottom: window.innerHeight - r.top + 4,
        left: r.left,
      });
    } else {
      setDropdownPos(null);
    }
  }, [isOpen]);

  const styles = {
    icon: {
      fontSize: "1.3rem",
      cursor: "pointer",
      color: isOpen ? "black" : "var(--qf-naranja)",
    },
    dropdownMenu: {
      position: "absolute",
      bottom: "100%",
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: "99999",
      padding: "0.5rem 0",
      backgroundColor: "var(--qf-bg-main)",
      border: "1px solid rgba(255,255,255,0.60)",
      borderRadius: "0.25rem",
      boxShadow: "0 0.5rem 1rem rgba(0, 0, 0, 0.175)",
      listStyleType: "none",
      marginBottom: "4px",
      minWidth: "200px",
    },
    dropdownItem: {
      display: "block",
      width: "100%",
      padding: "0.25rem 1.5rem",
      clear: "both",
      fontWeight: "400",
      color: "var(--qf-text-primary)",
      textAlign: "inherit",
      textDecoration: "none",
      whiteSpace: "nowrap",
      cursor: "pointer",
    },
    dropdownItemHovered: {
      backgroundColor: "var(--qf-naranja)",
      color: "var(--qf-text-primary)",
    },
    divider: {
      height: "1px",
      margin: "0.5rem 0",
      overflow: "hidden",
      backgroundColor: "var(--qf-bg-neutral)",
    },
    navItemmasicon: {
      display: "flex",
      alignItems: "center",
      width: "100%",
      clear: "both",
      fontWeight: "400",
      color: "var(--qf-blanco-puro)",
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
      color: "var(--qf-text-muted)",
      listStyleType: "none",
      cursor: "pointer",
      bottom: "70px",
      width: "85%",
      margin: "0 auto",
      padding: "8px 0",
      border: "2px solid var(--qf-naranja)",
      minHeight: "60px",
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
    { label: "Perfil", href: "/perfil", showWhenNoRol: true },
  ];

  return (
    <li
      ref={wrapperRef}
      data-testid="user-profile-nav"
      style={{
        ...styles.navItem,
        position: isMobile ? "relative" : styles.navItem.position,
        bottom: isMobile ? "auto" : styles.navItem.bottom,
        width: isMobile ? "100%" : styles.navItem.width,
        backgroundColor: isOpen ? "var(--qf-naranja)" : "transparent",
      }}
    >
      <div
        className="navlink"
        id="dropdown"
        style={styles.navItemmasicon}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="icono" style={styles.icon}><FaUser /></span>
        <div
          className="ms-1 text-center"
          style={{
            color: isOpen ? "var(--qf-text-primary)" : "var(--qf-naranja)",
            lineHeight: 1.3,
          }}
        >
          <div style={{ fontSize: "15px", fontWeight: "bold" }}>{user?.usuario || "Usuario"}</div>
          <div style={{ fontSize: "13px", opacity: 0.8, textTransform: "capitalize" }}>{user?.tipoUsuario || ""}</div>
        </div>
      </div>
      {isOpen && dropdownPos && createPortal(
        <>
          {/* Backdrop */}
          <div
            style={{ position: "fixed", inset: 0, zIndex: 99998 }}
            onClick={() => setIsOpen(false)}
          />
          {/* Dropdown */}
          <ul
            style={{
              position: "fixed",
              bottom: `${dropdownPos.bottom}px`,
              left: `${dropdownPos.left}px`,
              zIndex: 99999,
              padding: "0.5rem 0",
              backgroundColor: "var(--qf-bg-main)",
              border: "1px solid rgba(255,255,255,0.60)",
              borderRadius: "0.25rem",
              boxShadow: "0 0.5rem 1rem rgba(0, 0, 0, 0.175)",
              listStyleType: "none",
              minWidth: "200px",
              margin: 0,
            }}
            aria-labelledby="dropdown"
          >
            {menuItems
              .filter((item) => !haveRol || item.showWhenNoRol)
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
        </>,
        document.body
      )}
    </li>
  );
};

export default UserProfile;
