import React from "react";
import { FaMale } from "react-icons/fa";
import { FaHome, FaCalendarAlt, FaShoppingBag, FaShoppingCart, FaBell, FaStore, FaHandshake, FaChartBar, FaUsers, FaTruck, FaUser } from "react-icons/fa";

const MenuItems = ({
  haveRol,
  isResponsable,
  isProductor,
  isRepartidor,
}) => {

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



      <li className="qf-sidebar-section-label">Mi cuenta</li>
      <li className="navitem">
        <a href="/perfil" className="navlink"><FaUser className="icono" /><span>Mi perfil</span></a>
      </li>
      {!haveRol && (
        <>
          <li className="qf-sidebar-section-label">Sumate a QuickFood</li>
          <li className="navitem"><a href="/adquirir-nuevo-rolPE" className="navlink"><FaCalendarAlt className="icono" /><span>Quiero ser productor</span></a></li>
          <li className="navitem"><a href="/adquirir-nuevo-rolEPC" className="navlink"><FaStore className="icono" /><span>Quiero ser encargado</span></a></li>
          <li className="navitem"><a href="/adquirir-nuevo-rolR" className="navlink"><FaMale className="icono" /><span>Quiero ser repartidor</span></a></li>
        </>
      )}
    </ul>
  );
};

export default MenuItems;
