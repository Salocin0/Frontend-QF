import React from "react";
import { Link } from "react-router-dom";
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
        <Link to="/inicio" className="navlink text-truncate">
          <FaHome className="icono" />
          <span className="ms-1 w-100">Inicio</span>
        </Link>
      </li>

      {/* Enlace a eventos */}
      <li className="navitem">
        <Link to="/Listado-eventos" className="navlink text-truncate">
          <FaCalendarAlt className="icono" />
          <span className="ms-1 w-100">Eventos</span>
        </Link>
      </li>

      {/* Enlace a pedidos */}
      <li className="navitem">
        <Link to="/pedidos" className="navlink text-truncate">
          <FaShoppingBag className="icono" />
          <span className="ms-1 w-100">Pedidos</span>
        </Link>
      </li>

      {/* Enlace al carrito */}
      <li className="navitem">
        <Link to="/carrito" className="navlink text-truncate">
          <FaShoppingCart className="icono" />
          <span className="ms-1 w-100">Carrito</span>
        </Link>
      </li>
      {/* Enlace al carrito */}
      <li className="navitem">
        <Link to="/notificaciones" className="navlink text-truncate">
          <FaBell className="icono" />
          <span className="ms-1 w-100">Notificaciones</span>
        </Link>
      </li>
      
      <hr className="divicionnav" style={{ color: "white", width: "100%" }} />
      {/* Enlaces específicos para el responsable */}
      {isResponsable && (
        <>
          <li className="navitem">
            <Link
              to="/listado-puestos-encargado"
              className="navlink text-truncate"
            >
              <FaStore className="icono" />
              <span className="ms-1 w-100">Mis Puestos</span>
            </Link>
          </li>
          <li className="navitem">
            <Link to="/misAsociacionesEPC" className="navlink text-truncate">
              <FaHandshake className="icono" />
              <span className="ms-1 w-100">
                Mis asociaciones
              </span>
            </Link>
          </li>
          <li className="navitem">
            <Link to="/grafica-encargado" className="navlink text-truncate">
              <FaChartBar className="icono" />
              <span className="ms-1 w-100">
                Estadisticas Puesto
              </span>
            </Link>
          </li>
          <hr className="divicionnav" style={{ color: "white", width: "100%" }} />
        </>
      )}

      {/* Enlaces específicos para el productor */}
      {isProductor && (
        <>
          <li className="navitem">
            <Link
              to="/listado-eventos-productor"
              className="navlink text-truncate"
            >
              <FaCalendarAlt className="icono" />
              <span className="ms-1 w-100">Mis Eventos</span>
            </Link>
          </li>
          <li className="navitem">
            <Link to="/grafica-productor" className="navlink text-truncate">
              <FaChartBar className="icono" />
              <span className="ms-1 w-100">
                Estadisticas Eventos
              </span>
            </Link>
          </li>
          <hr className="divicionnav" style={{ color: "white", width: "100%" }} />
        </>
      )}
      {/* Enlaces específicos para el repartidor */}
      {isRepartidor && (
        <>
          <li className="navitem">
            <Link to="/pedidos-asignados" className="navlink text-truncate">
              <FaTruck className="icono" />
              <span className="ms-1 w-100">
                Pedidos Asignados
              </span>
            </Link>
          </li>
          <li className="navitem">
            <Link
              to="/asociarRepartidorAEvento"
              className="navlink text-truncate"
            >
              <FaUsers className="icono" />
              <span className="ms-1 w-100">
                Asociar A Evento
              </span>
            </Link>
          </li>
          <li className="navitem">
            <Link to="/misAsociacionesR" className="navlink text-truncate">
              <FaHandshake className="icono" />
              <span className="ms-1 w-100">
                Mis asociaciones
              </span>
            </Link>
          </li>
          <hr className="divicionnav" style={{ color: "white", width: "100%" }} />
        </>
      )}



      <li className="qf-sidebar-section-label">Mi cuenta</li>
      <li className="navitem">
        <Link to="/perfil" className="navlink"><FaUser className="icono" /><span>Mi perfil</span></Link>
      </li>
      {!haveRol && (
        <>
          <li className="qf-sidebar-section-label">Sumate a QuickFood</li>
          <li className="navitem"><Link to="/adquirir-nuevo-rolPE" className="navlink"><FaCalendarAlt className="icono" /><span>Quiero ser productor</span></Link></li>
          <li className="navitem"><Link to="/adquirir-nuevo-rolEPC" className="navlink"><FaStore className="icono" /><span>Quiero ser encargado</span></Link></li>
          <li className="navitem"><Link to="/adquirir-nuevo-rolR" className="navlink"><FaMale className="icono" /><span>Quiero ser repartidor</span></Link></li>
        </>
      )}
    </ul>
  );
};

export default MenuItems;
