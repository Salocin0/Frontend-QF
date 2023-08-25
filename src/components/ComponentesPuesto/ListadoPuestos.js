import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect } from "react";
import Sidebar from "../ComponentesGenerales/Sidebar";
import Puesto from "./Puesto";
import "./puestos.css";
import '../ComponentesConsumidor/ConsultarUsuario.css'
import { Link } from "react-router-dom";
import Footer from "../ComponentesGenerales/Footer";

const ListadoPuestos = () => {
  const [carritos, setCarritos] = useState([]);

  /*export const fetchUserData = async () => {
    try {
      const response = await axios.get('/api/user');
      return response.data;
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  };

  /* useEffect(() => {
    fetch("http://localhost:8000/puesto"),{
        method: "GET",
    }
      .then(response => response.json())
      .then(data => setCarritos(data))
      .catch(error => console.error("Error fetching carritos:", error));
  }, []);*/
  const carritosSimulados = Array.from({ length: 19 }, (_, index) => ({
    id: index + 1,
    nombre: `Puesto ${index + 1}`,
  }));

  const totalCarritos = Math.ceil(carritosSimulados.length / 4) * 4;
  const carritosConNulos = [
    ...carritosSimulados,
    ...Array(totalCarritos - carritosSimulados.length).fill(null),
  ];
  const rows = [];

  for (let i = 0; i < carritosConNulos.length; i += 4) {
    const row = carritosConNulos.slice(i, i + 4);
    rows.push(row);
  }

  return (
    <div className="d-flex">
      <div className="col-2">
        <Sidebar />
      </div>
      <div className="flex-grow-1 background pb-5">
        <div className="container pt-2 ">
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className="row">
              {row.map((carrito, index) => (
                <div key={index} className="col-md-3 pb-2">
                  {carrito !== null ? <Puesto carrito={carrito} /> : null}
                </div>
              ))}
            </div>
          ))}
        </div>
        <Link to={`/crear-puesto`} className="btn btn-primary btn-floating btn-lg">
          +
        </Link>
        <Footer/>
      </div>
        
    </div>
  );
};

export default ListadoPuestos;
