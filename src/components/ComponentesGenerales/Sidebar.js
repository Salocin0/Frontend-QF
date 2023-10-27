import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import React, { useEffect, useState } from "react";
import "./../sass/main.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDolly } from "@fortawesome/free-solid-svg-icons";

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
      <div className={"sidebar"}>
        <div className={"logocontainer"}>
          <a href="/inicio">
            <img src={Logo} alt="Logo" className={"logo"} />
          </a>
        </div>
        <div className="menu-container">
          <ul className={`nav flex-column p-3`}>
            <li className={"navitem"}>
              <a href="/inicio" className={`navlink text-truncate`}>
                <i className={`icono bi bi-house`}></i>
                <span className="ms-1 d-none d-sm-inline w-100">Inicio</span>
              </a>
            </li>
            <li className="navitem">
              <a href="/eventos" className={`navlink text-truncate`}>
                <i className={`icono bi bi-balloon`}></i>
                <span className="ms-1 d-none d-sm-inline w-100">Eventos</span>
              </a>
            </li>
            <li className="navitem">
              <a href="/pedidos" className={`navlink text-truncate`}>
                <i className={`icono bi bi-bag`}></i>
                <span className="ms-1 d-none d-sm-inline w-100">Pedidos</span>
              </a>
            </li>
            <li className="navitem">
              <a href="/Notificaciones" className={`navlink text-truncate`}>
                <i className={`icono bi bi-bell`}></i>
                <span className="ms-1 d-none d-sm-inline w-100">
                  Notificaciones
                </span>
              </a>
            </li>
            <li className="navitem">
              <a href="/carrito" className={`navlink text-truncate`}>
                <i className={`icono bi bi-cart`}></i>
                <span className="ms-1 d-none d-sm-inline w-100">Carrito</span>
              </a>
            </li>
            <hr style={{ color: "white" }} />
            {isResponsable && (
              <li className="navitem">
                <a href="/listado-puestos" className={`navlink text-truncate`}>
                  <i className={`icono bi bi-shop`}></i>
                  <span className="ms-1 d-none d-sm-inline w-100">
                    Mis Puestos
                  </span>
                </a>
              </li>
            )}
            {isProductor && (
              <li className="navitem">
                <a href="/listado-eventos" className={`navlink text-truncate`}>
                  <i className={`icono bi bi-balloon`}></i>
                  <span className="ms-1 d-none d-sm-inline w-100">
                    Mis Eventos
                  </span>
                </a>
              </li>
            )}
            {isRepartidor && (
              <li className="navitem">
                <a
                  href="/pedidos-asignados"
                  className={`navlink text-truncate`}
                >
                  <FontAwesomeIcon icon={faDolly} className={`icono`} />
                  <span className="ms-1 d-none d-sm-inline w-100">
                    Pedidos Asignados
                  </span>
                </a>
              </li>
            )}

            <li className="navitem dropdown especial ">
              <i className="icono bi bi-person-circle iconoespecial"></i>
              <div
                className="navlink text-truncate dropdown-toggle"
                id="dropdown"
                data-bs-toggle="dropdown"
                aria-expanded="true"
              >
                <span className="ms-1 d-none d-sm-inline w-100">Mi Perfil</span>
              </div>
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
