import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import React, { useEffect, useState } from "react";
import style from "./Sidebar.module.css";

import Logo from "../QuickFoodLogo.png";

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
                <i className={`${style.icono} bi bi-1-circle-fill`}></i>
                <span className="ms-1 d-none d-sm-inline w-100">Inicio</span>
              </a>
            </li>
            <li className={style.navitem}>
              <a href="#" className={`${style.navlink} text-truncate`} onClick={(e) => e.preventDefault()}>
                <i className={`${style.icono} bi bi-1-circle-fill`}></i>
                <span className="ms-1 d-none d-sm-inline w-100">
                  Pedidos
                </span>
              </a>
            </li>
            {isResponsable && (
              <li className={style.navitem}>
                <a href="/listado-puestos" className={`${style.navlink} text-truncate`}>
                  <i className={`${style.icono} bi bi-1-circle-fill`}></i>
                  <span className="ms-1 d-none d-sm-inline w-100">
                    Mis Puestos
                  </span>
                </a>
              </li>
            )}
            {isProductor && (
              <li className={style.navitem}>
                <a href="/listado-puestos" className={`${style.navlink} text-truncate`}>
                  <i className={`${style.icono} bi bi-1-circle-fill`}></i>
                  <span className="ms-1 d-none d-sm-inline w-100">
                    Mis Eventos
                  </span>
                </a>
              </li>
            )}
            {isRepartidor && (
              <li className={style.navitem}>
                <a href="/listado-puestos" className={`${style.navlink} text-truncate`}>
                  <i className={`${style.icono} bi bi-1-circle-fill`}></i>
                  <span className="ms-1 d-none d-sm-inline w-100">
                    Pedidos Asignados
                  </span>
                </a>
              </li>
            )}

            <li className={`${style.navitem} dropdown ${style.especial}`}>
              <i className={`${style.icono} bi bi-1-circle-fill ${style.iconoespecial}`} ></i>
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
