import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../ComponentesGenerales/Footer';
import Sidebar from '../ComponentesGenerales/Sidebar';
import puestos from "../img/carro.png";
import eventos from '../img/eventos.png';
import pedidos from '../img/pedidos.png';
import perfil from '../img/perfil.png';
import './cards.css';

const Inicio = () => {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const sessionId = localStorage.getItem("sessionId");

    if (sessionId) {
      fetch("http://localhost:8000/user/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionID: sessionId }),
      })
        .then((response) => response.json())
        .then((data) => {
          setSession(data.data);
          console.log(data.data);
        })
        .catch((error) => console.error("Error fetching session:", error));
    }
  }, []);

  return (
    <>
      <div className="d-flex">
        <div className='col-2'>
          <Sidebar tipoUsuario={session?.tipoUsuario} />
        </div>
        <div className="flex-grow-1" style={{ background: `url('QuickFoodFondo.png')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <section className="container py-5">
            <div className="row row-cols-2 g-4">
              <Link to="/perfil-nuevo" style={{ textDecoration: "none" }} className="mb-3">
                <div className="col">
                <div className="card bg-warning shadow-sm card-custom" style={{ width: "300px", height: "300px", margin: "0 auto auto 200px" }} alt="Icono de perfil">
                    <img src={perfil} className="card-img-top mx-auto mt-5" style={{ width: "150px", height: "150px" }} alt="Icono de perfil" />
                    <div className="card-body text-center">
                      <h2 className="card-title">Perfil</h2>
                    </div>
                  </div>
                </div>
              </Link>
              <Link to="/consultar-eventos" style={{ textDecoration: "none" }} className="mb-3">
                <div className="col">
                <div className="card bg-warning shadow-sm card-custom" style={{ width: "300px", height: "300px", margin: "0 10px" }} alt="Icono de perfil">
                    <img src={eventos} className="card-img-top mx-auto mt-5" style={{ width: "150px", height: "150px" }} alt="Icono de perfil" />
                    <div className="card-body text-center">
                      <h2 className="card-title">Eventos</h2>
                    </div>
                  </div>
                </div>
              </Link>
              <Link to="/consultar-pedidos" style={{ textDecoration: "none" }} className="mb-3">
                <div className="col">
                <div className="card bg-warning shadow-sm card-custom" style={{ width: "300px", height: "300px", margin: "0 auto auto 200px" }} alt="Icono de perfil">
                    <img src={pedidos} className="card-img-top mx-auto mt-5" style={{ width: "150px", height: "150px" }} alt="Icono de perfil" />
                    <div className="card-body text-center">
                      <h2 className="card-title">Pedidos</h2>
                    </div>
                  </div>
                </div>
              </Link>
              <Link to="/consultar-puesto" style={{ textDecoration: "none" }} className="mb-3">
                <div className="col">
                  <div className="card bg-warning shadow-sm card-custom" style={{ width: "300px", height: "300px", margin: "0 10px" }} alt="Icono de perfil">
                    <img src={puestos} className="card-img-top mx-auto mt-5" style={{ width: "150px", height: "150px" }} alt="Icono de puestos" />
                    <div className="card-body text-center">
                      <h2 className="card-title">Puestos</h2>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Inicio;
