import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import React, { useEffect,useState } from "react";
import "./Sidebar.css";

import Logo from "../QuickFoodLogo.png";
import { useAccordionButton } from "react-bootstrap";

const Sidebar = ({ tipoUsuario }) => {
  const [usuario, setUsuario] = useState("Consumidor");
  const [isResponsable, setIsResponsable] = useState(false);
  const [isProductor, setIsProductor] = useState(false);
  const [isRepartidor, setIsRepartidor] = useState(false);
  const [haveRol, setHaveRol] = useState(false);

  useEffect(() => {
    setUsuario(tipoUsuario);
    setIsResponsable(usuario === "Responsable");
    setIsProductor(usuario === "Productor");
    setIsRepartidor(usuario === "Repartidor");
    setHaveRol(usuario !== "Consumidor");
  }, [tipoUsuario,usuario]);

  return (
    <>
      <div className="sidebar">
        <div className="logo-container">
          <a href="/inicio">
            <img src={Logo} alt="Logo" className="logo" />
          </a>
        </div>
        <div className="menu-container">
          <ul className="nav flex-column p-3">
            <li className="nav-item">
              <a href="/inicio" className="nav-link text-truncate">
                <i className="bi bi-1-circle-fill icono"></i>
                <span className="ms-1 d-none d-sm-inline w-100">Inicio</span>
              </a>
            </li>
            <li className="nav-item">
              <a href="/historial-pedidos" className="nav-link text-truncate">
                <i className="bi bi-1-circle-fill icono"></i>
                <span className="ms-1 d-none d-sm-inline w-100">
                  Mis Pedidos
                </span>
              </a>
            </li>
            {isResponsable && (
              <li className="nav-item">
                <a href="/listado-puestos" className="nav-link text-truncate">
                  <i className="bi bi-1-circle-fill icono"></i>
                  <span className="ms-1 d-none d-sm-inline w-100">
                    Mis Puestos
                  </span>
                </a>
              </li>
            )}
            {isProductor && (
              <li className="nav-item">
                <a href="/listado-puestos" className="nav-link text-truncate">
                  <i className="bi bi-1-circle-fill icono"></i>
                  <span className="ms-1 d-none d-sm-inline w-100">
                    Mis Eventos
                  </span>
                </a>
              </li>
            )}
            {isRepartidor && (
              <li className="nav-item">
                <a href="/listado-puestos" className="nav-link text-truncate">
                  <i className="bi bi-1-circle-fill icono"></i>
                  <span className="ms-1 d-none d-sm-inline w-100">
                    Pedidos Asignados
                  </span>
                </a>
              </li>
            )}
            <li className="nav-item">
              <a href="/perfil-nuevo" className="nav-link text-truncate">
                <i className="bi bi-1-circle-fill icono"></i>
                <span className="ms-1 d-none d-sm-inline w-100">
                  Provisional Profile
                </span>
              </a>
            </li>
            <li className="nav-item dropdown especial">
              <i className="bi bi-1-circle-fill icono iconoespecial"></i>
              <a
                className="nav-link dropdown-toggle text-truncate"
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
                  <a className="dropdown-item" href="/consultar-usuario">
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
