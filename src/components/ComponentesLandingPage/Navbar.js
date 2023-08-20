import React from "react";

const Navbar = () => {
  return (
    <header className="navbar">
      <nav className="navbar navbar-expand-lg navbar-light bg-light w-100">
        <div className="col-2">
          <h2 className="logo2">LOGO</h2>
        </div>
        <div className="col-10 d-flex justify-content-end">
          <ul className="navbar-nav">
            <button className="nav-item gray">Ser Repartidor</button>
            <button className="nav-item gray">Ser Productor</button>
            <button className="nav-item gray">Ser Encargado de Puesto</button>
            <button className="nav-item yellow">Login</button>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
