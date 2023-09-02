import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faRightToBracket} from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  return (
    <header className="navbar">
      <nav className="navbar navbar-expand-lg navbar-light bg-light w-100">
        <div className="col-2">
          <h2 className="logo2">LOGO</h2>
        </div>
        <div className="col-10 d-flex justify-content-end">
          <ul className="navbar-nav">
          <Link to="/seleccion-perfil" className="btn btn-primary nav-item gray">
              <FontAwesomeIcon icon={faUser}/>&nbsp;Registrarse
            </Link>
            <Link to="/login" className="btn btn-primary nav-item yellow">
              <FontAwesomeIcon icon={faRightToBracket}/>&nbsp;Ingresar
            </Link>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
