import React from "react";
import { FaHome, FaCalendarAlt, FaShoppingBag, FaShoppingCart, FaBell, FaStore, FaHandshake, FaChartBar, FaUsers, FaTruck, FaUser, FaMoon, FaSun } from "react-icons/fa";
import useTheme from "../../useTheme";

const MenuItems = ({
  isResponsable,
  isProductor,
  isRepartidor,
  togglePanel,
}) => {
  const { isDark, toggleTheme } = useTheme();

   const handleBotonChat = () => {
    togglePanel();
   }

  return (
    <ul className="nav flex-column p-3">
      {/* Enlace a la página de inicio */}
      <li className="navitem">
        <a href="/inicio" className="navlink text-truncate">
          <FaHome className="icono" />
          <span className="ms-1 w-100">Inicio</span>
        </a>
      </li>

      {/* Enlace a eventos */}
      <li className="navitem">
        <a href="/Listado-eventos" className="navlink text-truncate">
          <FaCalendarAlt className="icono" />
          <span className="ms-1 w-100">Eventos</span>
        </a>
      </li>

      {/* Enlace a pedidos */}
      <li className="navitem">
        <a href="/pedidos" className="navlink text-truncate">
          <FaShoppingBag className="icono" />
          <span className="ms-1 w-100">Pedidos</span>
        </a>
      </li>

      {/* Enlace al carrito */}
      <li className="navitem">
        <a href="/carrito" className="navlink text-truncate">
          <FaShoppingCart className="icono" />
          <span className="ms-1 w-100">Carrito</span>
        </a>
      </li>
      {/* Enlace al carrito */}
      <li className="navitem">
        <a href="/notificaciones" className="navlink text-truncate">
          <FaBell className="icono" />
          <span className="ms-1 w-100">Notificaciones</span>
        </a>
      </li>
      
      <hr className="divicionnav" style={{ color: "white", width: "100%" }} />
      {/* Enlaces específicos para el responsable */}
      {isResponsable && (
        <>
          <li className="navitem">
            <a
              href="/listado-puestos-encargado"
              className="navlink text-truncate"
            >
              <FaStore className="icono" />
              <span className="ms-1 w-100">Mis Puestos</span>
            </a>
          </li>
          <li className="navitem">
            <a href="/misAsociacionesEPC" className="navlink text-truncate">
              <FaHandshake className="icono" />
              <span className="ms-1 w-100">
                Mis asociaciones
              </span>
            </a>
          </li>
          <li className="navitem">
            <a href="/grafica-encargado" className="navlink text-truncate">
              <FaChartBar className="icono" />
              <span className="ms-1 w-100">
                Estadisticas Puesto
              </span>
            </a>
          </li>
          <hr className="divicionnav" style={{ color: "white", width: "100%" }} />
        </>
      )}

      {/* Enlaces específicos para el productor */}
      {isProductor && (
        <>
          <li className="navitem">
            <a
              href="/listado-eventos-productor"
              className="navlink text-truncate"
            >
              <FaCalendarAlt className="icono" />
              <span className="ms-1 w-100">Mis Eventos</span>
            </a>
          </li>
          <li className="navitem">
            <a href="/grafica-productor" className="navlink text-truncate">
              <FaChartBar className="icono" />
              <span className="ms-1 w-100">
                Estadisticas Eventos
              </span>
            </a>
          </li>
          <hr className="divicionnav" style={{ color: "white", width: "100%" }} />
        </>
      )}
      {/* Enlaces específicos para el repartidor */}
      {isRepartidor && (
        <>
          <li className="navitem">
            <a href="/pedidos-asignados" className="navlink text-truncate">
              <FaTruck className="icono" />
              <span className="ms-1 w-100">
                Pedidos Asignados
              </span>
            </a>
          </li>
          <li className="navitem">
            <a
              href="/asociarRepartidorAEvento"
              className="navlink text-truncate"
            >
              <FaUsers className="icono" />
              <span className="ms-1 w-100">
                Asociar A Evento
              </span>
            </a>
          </li>
          <li className="navitem">
            <a href="/misAsociacionesR" className="navlink text-truncate">
              <FaHandshake className="icono" />
              <span className="ms-1 w-100">
                Mis asociaciones
              </span>
            </a>
          </li>
          <hr className="divicionnav" style={{ color: "white", width: "100%" }} />
        </>
      )}

      <li className="navitem">
        <span onClick={() => handleBotonChat()} className="navlink text-truncate">
          <FaUser className="icono" />
          <span className="ms-1 w-100">
            Foody
          </span>
        </span>
      </li>

      {/* Botón de cambiar tema (sincronizado en toda la app) */}
      <li
        className="navitem"
        onClick={toggleTheme}
        style={{ cursor: "pointer" }}
        role="switch"
        aria-checked={isDark}
        title="Cambiar entre modo claro y oscuro"
      >
        <span className="navlink text-truncate">
          {isDark ? <FaSun className="icono" /> : <FaMoon className="icono" />}
          <span className="ms-1 w-100">{isDark ? "Modo claro" : "Modo oscuro"}</span>
        </span>
      </li>
    </ul>
  );
};

export default MenuItems;
