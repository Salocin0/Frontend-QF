import React, { useEffect, useState } from 'react';
import '../estilos.css';

const Navbar = ({ id, onItemClick }) => {
  const [items, setItems] = useState([]);

  const handleItemClick = (item) => {
    onItemClick(item);
  };

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/acciones/14/`)/*${id}*/
      .then(response => response.json())
      .then(data => setItems(data.acciones.slice(1, -1).split(",")))
      .catch(error => console.log(error));
  }, [id]);

  return (
    <nav className="navbar navbar-expand-sm navbar">
      <a className="navbar-brand ms-5" href="#">Logo</a>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse text-center row" id="navbarSupportedContent">
        <div className="d-flex justify-content-center">
          <ul className="navbar-nav mr-auto pe-5 me-5">
            {items.map((item, index) => (
              <li className="nav-item" key={index}>
                <a className="nav-link" onClick={() => handleItemClick(item)} >{item}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
