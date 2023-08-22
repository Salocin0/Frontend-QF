import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDolly, faShop, faRightToBracket, faBriefcase } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  return (
    <header className="navbar">
      <nav className="navbar navbar-expand-lg navbar-light bg-light w-100">
        <div className="col-2">
          <h2 className="logo2">LOGO</h2>
        </div>
        <div className="col-10 d-flex justify-content-end">
          <ul className="navbar-nav">
            <Link to="/ser-repartidor" className="btn btn-primary nav-item gray">
              <FontAwesomeIcon icon={faDolly}/>&nbsp;Ser Repartidor
            </Link>
            <Link to="/ser-productor" className="btn btn-primary nav-item gray">
              <FontAwesomeIcon icon={faBriefcase}/>&nbsp;Ser Productor
            </Link>
            <Link to="/ser-encargado" className="btn btn-primary nav-item gray">
              <FontAwesomeIcon icon={faShop}/>&nbsp;Ser Encargado de Puesto
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
