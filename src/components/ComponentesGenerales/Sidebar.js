import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import React, { useEffect, useState } from "react";
import style from "./Sidebar.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDolly,faAddressBook,faSquarePlus } from '@fortawesome/free-solid-svg-icons';

import Logo from "../img/QuickFood_LogoYellow.png";

const Sidebar = ({ tipoUsuario }) => {
  const [usuario, setUsuario] = useState("consumidor");
  const [isResponsable, setIsResponsable] = useState(false);
  const [isProductor, setIsProductor] = useState(false);
  const [isRepartidor, setIsRepartidor] = useState(false);
  const [haveRol, setHaveRol] = useState(false);

  useEffect(() => {
    setUsuario(tipoUsuario);
    setIsResponsable(usuario === "encargado");
    setIsProductor(usuario === "productor");
    setIsRepartidor(usuario === "repartidor");
    setHaveRol(usuario !== "consumidor");
  }, [tipoUsuario, usuario]);

  return (
    <>
      <div className={style.sidebar}>
        <div className={style.logocontainer}>
          <a href="/inicio">
            <img src={Logo} alt="Logo" className={style.logo} />
          </a>
        </div>
        <div className="menu-container">
          <ul className={`${style.nav} flex-column p-3`}>
            <li className={style.navitem}>
              <a href="/inicio" className={`${style.navlink} text-truncate`}>
                <i className={`${style.icono} bi bi-house`}></i>
                <span className="ms-1 d-none d-sm-inline w-100">Inicio</span>
              </a>
            </li>
            <li className={style.navitem}>
              <a href="/Listado-eventos" className={`${style.navlink} text-truncate`} >
                <i className={`${style.icono} bi bi-balloon`}></i>
                <span className="ms-1 d-none d-sm-inline w-100">
                  Eventos
                </span>
              </a>
            </li>
            <li className={style.navitem}>
              <a href="/pedidos" className={`${style.navlink} text-truncate`} >
                <i className={`${style.icono} bi bi-bag`}></i>
                <span className="ms-1 d-none d-sm-inline w-100">
                  Pedidos
                </span>
              </a>
            </li>
            <li className={style.navitem}>
              <a href="/Notificaciones" className={`${style.navlink} text-truncate`} >
                <i className={`${style.icono} bi bi-bell`}></i>
                <span className="ms-1 d-none d-sm-inline w-100">
                  Notificaciones
                </span>
              </a>
            </li>
            <li className={style.navitem}>
              <a href="/carrito" className={`${style.navlink} text-truncate`} >
                <i className={`${style.icono} bi bi-cart`}></i>
                <span className="ms-1 d-none d-sm-inline w-100">
                  Carrito
                </span>
              </a>
            </li>
            <hr style={{ color: "white" }} />
            {isResponsable && (
              <li className={style.navitem}>
                <a href="/listado-puestos" className={`${style.navlink} text-truncate`}>
                  <i className={`${style.icono} bi bi-shop`}></i>
                  <span className="ms-1 d-none d-sm-inline w-100">
                    Mis Puestos
                  </span>
                </a>
              </li>
            )}
            {isProductor && (
              <li className={style.navitem}>
                <a href="/eventos" className={`${style.navlink} text-truncate`}>
                  <i className={`${style.icono} bi bi-balloon`}></i>
                  <span className="ms-1 d-none d-sm-inline w-100">
                    Mis Eventos
                  </span>
                </a>
              </li>
            )}
            {isRepartidor && (
              <li className={style.navitem}>
                <a href="/pedidos-asignados" className={`${style.navlink} text-truncate`}>
                <FontAwesomeIcon icon={faDolly} className={`${style.icono}`}/>
                  <span className="ms-1 d-none d-sm-inline w-100">
                    Pedidos Asignados
                  </span>
                </a>
              </li>
            )}
            {isRepartidor && (
              <li className={style.navitem}>
                <a href="/asociarRepartidorAEvento" className={`${style.navlink} text-truncate`}>
                <FontAwesomeIcon icon={faSquarePlus} className={`${style.icono}`} />
                  <span className="ms-1 d-none d-sm-inline w-100">
                    Asociar A Evento
                  </span>
                </a>
              </li>
            )}
            {(isRepartidor || isResponsable) && (
              <li className={style.navitem}>
                <a href="/misAsociaciones" className={`${style.navlink} text-truncate`}>
                <FontAwesomeIcon icon={faAddressBook} className={`${style.icono}`} />
                  <span className="ms-1 d-none d-sm-inline w-100">
                    Mis asociaciones
                  </span>
                </a>
              </li>
            )}

            <li className={`${style.navitem} dropdown ${style.especial}`}>
              <i className={`${style.icono} bi bi-person-circle ${style.iconoespecial}`} ></i>
              <a
                className={`${style.navlink} text-truncate dropdown-toggle`}
                id="dropdown"
                data-bs-toggle="dropdown"
                aria-expanded="true"
              >
                <span className="ms-1 d-none d-sm-inline w-100">Mi Perfil</span>
              </a>
              <ul
                className="dropdown-menu text-small shadow"
                aria-labelledby="dropdown"
              >
                {!haveRol && (
                  <li>
                    <a className="dropdown-item" href="/adquirir-nuevo-rolPE">
                      ¡Quiero ser Productor!
                    </a>
                  </li>
                )}
                {!haveRol && (
                  <li>
                    <a className="dropdown-item" href="/adquirir-nuevo-rolEPC">
                      ¡Quiero ser Encargado de Puestos!
                    </a>
                  </li>
                )}
                {!haveRol && (
                  <li>
                    <a className="dropdown-item" href="/adquirir-nuevo-rolR">
                      ¡Quiero ser Repartidor!
                    </a>
                  </li>
                )}

                <li>
                  <a className="dropdown-item" href="/perfil-nuevo">
                    Perfil
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="/configuracion">
                    Configuración
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <a className="dropdown-item" href="/">
                    Cerrar Sesión
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
