import { faRightToBracket, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { Link } from "react-router-dom";
import Logo from '../img/QuickFood_LogoYellow.png';
import "./../sass/main.scss";

const Navbar = () => {
  return (
    <header className={`navbar`}>
      <nav
        className={`navbar navbar-expand-lg navbar-light bg-light`}
      >
        <div className="container-fluid d-flex align-items-center mx-0 w-100">
        <img src={Logo} alt="Logo" className="logo" />
          <div className="d-flex justify-content-end mx-0 mt-2 w-100">
            <ul className="navbar-nav">
              <Link
                to="/seleccion-perfil"
                className={`navItemGray btn btn-primary nav-item`}
              >
                <FontAwesomeIcon icon={faUser} />
                &nbsp;Registrarse
              </Link>
              <Link
                to="/login"
                className={`navItemYellow btn btn-primary nav-item`}
              >
                <FontAwesomeIcon icon={faRightToBracket} />
                &nbsp;Ingresar
              </Link>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
