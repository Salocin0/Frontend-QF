import { faRightToBracket, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { Link } from "react-router-dom";
import Logo from "../img/QuickFood_LogoYellow.png";
import "./../sass/main.scss";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark">
      <div className="container-fluid">
        <button
          className="navbar-toggler mb-1"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <img src={Logo} alt="Logo" className="logonav"/>
        <div
          className="collapse navbar-collapse divbotonesnavar"
          id="navbarNav"
        >
          <ul className="navbar-nav ml-auto">
            <Link to="/seleccion-perfil">
              <li className="navItemGray nav-item my-1 mx-1">
                <FontAwesomeIcon icon={faUser} />
                &nbsp;Registrarse
              </li>
            </Link>
            <Link to="/login">
              <li className="navItemYellow nav-item my-1 mx-1">
                <FontAwesomeIcon icon={faRightToBracket} />
                &nbsp;Ingresar
              </li>
            </Link>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
