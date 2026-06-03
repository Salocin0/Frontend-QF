import React, { useState, useEffect } from "react";
import { FaBars, FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Sidebar from "./Sidebar";
import useBreakpoint from "../../useBreakpoint";

/**
 * PageLayout — Contenedor principal responsive para páginas con sidebar.
 *
 * En desktop (>= 768px):
 *   - Sidebar visible por defecto, colapsable con botón toggle
 *   - Al colapsar: sidebar se oculta, contenido ocupa todo el ancho
 *
 * En mobile (< 768px):
 *   - Sidebar oculto, se abre como drawer con botón hamburguesa
 *   - Comportamiento original intacto
 *
 * Props:
 *   - sidebarProps: props que se pasan al Sidebar
 *   - collapsible: si el sidebar se puede colapsar en desktop (default: true)
 *   - defaultCollapsed: estado inicial del sidebar (default: false)
 *   - onCollapsed: callback cuando cambia el estado collapsed
 *
 * Uso:
 *   <PageLayout sidebarProps={{ tipoUsuario }}>
 *     {children}
 *   </PageLayout>
 */
const PageLayout = ({
  children,
  sidebarProps = {},
  collapsible = true,
  defaultCollapsed = false,
  onCollapsed,
}) => {
  const { isMobile } = useBreakpoint();
  const [isOpen, setIsOpen] = useState(false);     // drawer mobile
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed); // desktop collapse

  // Sincronizar collapsed con el exterior si hay callback
  useEffect(() => {
    onCollapsed?.(isCollapsed);
  }, [isCollapsed, onCollapsed]);

  const toggleSidebar = () => setIsOpen((prev) => !prev);
  const closeSidebar = () => setIsOpen(false);

  const toggleCollapsed = () => {
    setIsCollapsed((prev) => !prev);
  };

  // En mobile, el sidebar se superpone como drawer
  const sidebarOpenClass = isOpen && isMobile ? "sidebar--open" : "";
  // En desktop, colapsar si corresponde
  const collapsedClass =
    !isMobile && isCollapsed && collapsible ? "page-layout--collapsed" : "";

  return (
    <div className={`page-layout ${collapsedClass}`}>
      {/* Botón hamburguesa (solo mobile) */}
      <button className="hamburger-btn" onClick={toggleSidebar} aria-label="Menú">
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Botón toggle colapsable (solo desktop) */}
      {!isMobile && collapsible && (
        <button
          className="sidebar-toggle-btn"
          onClick={toggleCollapsed}
          aria-label={isCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
          title={isCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
        >
          {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
      )}

      {/* Overlay oscuro para cerrar sidebar en mobile */}
      {isOpen && isMobile && (
        <div className="sidebar-overlay" onClick={closeSidebar} />
      )}

      {/* Sidebar */}
      <div className={`page-layout__sidebar ${sidebarOpenClass}`}>
        <Sidebar {...sidebarProps} />
      </div>

      {/* Contenido principal */}
      <div className="page-layout__content" data-testid="page-layout-content">
        {children}
      </div>
    </div>
  );
};

export default PageLayout;
