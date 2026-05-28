import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import Sidebar from "./Sidebar";
import useBreakpoint from "../../useBreakpoint";

/**
 * PageLayout — Contenedor principal responsive para páginas con sidebar.
 *
 * En desktop (>= 768px): sidebar siempre visible, contenido a la derecha.
 * En mobile (< 768px): sidebar oculto, se abre como drawer con botón hamburguesa.
 *
 * Uso:
 *   <PageLayout sidebarProps={{ tipoUsuario }}>
 *     {children} {/* contenido de la página *}
 *   </PageLayout>
 */
const PageLayout = ({ children, sidebarProps = {} }) => {
  const { isMobile } = useBreakpoint();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen((prev) => !prev);
  const closeSidebar = () => setIsOpen(false);

  // En mobile, el sidebar se superpone como drawer
  const sidebarOpenClass = isOpen && isMobile ? "sidebar--open" : "";

  return (
    <div className="page-layout">
      {/* Botón hamburguesa (solo mobile) */}
      <button className="hamburger-btn" onClick={toggleSidebar} aria-label="Menú">
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Overlay oscuro para cerrar sidebar en mobile */}
      {isOpen && isMobile && (
        <div className="sidebar-overlay" onClick={closeSidebar} />
      )}

      {/* Sidebar */}
      <div className={`page-layout__sidebar ${sidebarOpenClass}`}>
        <Sidebar {...sidebarProps} />
      </div>

      {/* Contenido principal */}
      <div className="page-layout__content" data-testid="page-layout-content">{children}</div>
    </div>
  );
};

export default PageLayout;
