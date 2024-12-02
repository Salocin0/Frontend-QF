import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDolly,
  faAddressBook,
  faSquarePlus,
  faScroll,
  faChartColumn,
  faCalendarDays,
  faShop,
  faRobot,
} from "@fortawesome/free-solid-svg-icons";

const MenuItems = ({
  isResponsable,
  isProductor,
  isRepartidor,
  togglePanel,
}) => {

   const handleBotonChat = () => {
    togglePanel();
   }

  return (
    <ul className="nav flex-column p-3">
      {/* Enlace a la página de inicio */}
      <li className="navitem">
        <a href="/inicio" className="navlink text-truncate">
          <i className="icono bi bi-house"></i>
          <span className="ms-1 d-none d-sm-inline w-100">Inicio</span>
        </a>
      </li>

      {/* Enlace a eventos */}
      <li className="navitem">
        <a href="/Listado-eventos" className="navlink text-truncate">
          <i className="icono bi bi-balloon"></i>
          <span className="ms-1 d-none d-sm-inline w-100">Eventos</span>
        </a>
      </li>

      {/* Enlace a pedidos */}
      <li className="navitem">
        <a href="/pedidos" className="navlink text-truncate">
          <i className="icono bi bi-bag"></i>
          <span className="ms-1 d-none d-sm-inline w-100">Pedidos</span>
        </a>
      </li>

      {/* Enlace al carrito */}
      <li className="navitem">
        <a href="/carrito" className="navlink text-truncate">
          <i className="icono bi bi-cart"></i>
          <span className="ms-1 d-none d-sm-inline w-100">Carrito</span>
        </a>
      </li>
      {/* Enlace al carrito */}
      <li className="navitem">
        <a href="/notificaciones" className="navlink text-truncate">
          <i className="icono bi bi-bell"></i>
          <span className="ms-1 d-none d-sm-inline w-100">Notificaciones</span>
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
              <FontAwesomeIcon icon={faShop} className="icono" />
              <span className="ms-1 d-none d-sm-inline w-100">Mis Puestos</span>
            </a>
          </li>
          <li className="navitem">
            <a href="/misAsociacionesEPC" className="navlink text-truncate">
              <FontAwesomeIcon icon={faAddressBook} className="icono" />
              <span className="ms-1 d-none d-sm-inline w-100">
                Mis asociaciones
              </span>
            </a>
          </li>
          <li className="navitem">
            <a href="/grafica-encargado" className="navlink text-truncate">
              <FontAwesomeIcon icon={faChartColumn} className="icono" />
              <span className="ms-1 d-none d-sm-inline w-100">
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
              <FontAwesomeIcon icon={faCalendarDays} className="icono" />
              <span className="ms-1 d-none d-sm-inline w-100">Mis Eventos</span>
            </a>
          </li>
          <li className="navitem">
            <a href="/grafica-productor" className="navlink text-truncate">
              <FontAwesomeIcon icon={faChartColumn} className="icono" />
              <span className="ms-1 d-none d-sm-inline w-100">
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
              <FontAwesomeIcon icon={faDolly} className="icono" />
              <span className="ms-1 d-none d-sm-inline w-100">
                Pedidos Asignados
              </span>
            </a>
          </li>
          <li className="navitem">
            <a
              href="/asociarRepartidorAEvento"
              className="navlink text-truncate"
            >
              <FontAwesomeIcon icon={faSquarePlus} className="icono" />
              <span className="ms-1 d-none d-sm-inline w-100">
                Asociar A Evento
              </span>
            </a>
          </li>
          <li className="navitem">
            <a href="/misAsociacionesR" className="navlink text-truncate">
              <FontAwesomeIcon icon={faAddressBook} className="icono" />
              <span className="ms-1 d-none d-sm-inline w-100">
                Mis asociaciones
              </span>
            </a>
          </li>
          <hr className="divicionnav" style={{ color: "white", width: "100%" }} />
        </>
      )}

      <li className="navitem">
        <span onClick={() => handleBotonChat()} className="navlink text-truncate">
          <FontAwesomeIcon icon={faRobot} className="icono" />
          <span className="ms-1 d-none d-sm-inline w-100">
            Foody
          </span>
        </span>
      </li>
    </ul>
  );
};

export default MenuItems;
