import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../ComponentesGenerales/Footer';
import Sidebar from '../ComponentesGenerales/Sidebar';
import carro from '../img/carro.png';
import eventos from '../img/eventos.png';
import pedidos from '../img/pedidos.png';
import perfil from '../img/perfil.png';
import './cards.css';

const Inicio = () => {
  return (
    <>
      <div className="d-flex">
        <div className='col-2'>
          <Sidebar />
        </div>
        <div className="flex-grow-1" style={{ background: `url('QuickFoodFondo.png')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <section className="container py-5">
            <div className="row row-cols-2 g-4">
              <Link to="/perfil" style={{ textDecoration: "none" }}>
                <div className="col card-position">
                  <div className="card bg-warning shadow-sm card-custom">
                    <img src={perfil} className="card-img-top mx-auto mt-5" style={{ width: "200px", height: "200px" }} alt="Icono de perfil" />
                    <div className="card-body text-center">
                      <h2 className="card-title">Perfil</h2>
                    </div>
                  </div>
                </div>
              </Link>
              <Link to="/eventos" style={{ textDecoration: "none" }}>
                <div className="col card-position">
                  <div className="card bg-warning shadow-sm card-custom">
                    <img src={eventos} className="card-img-top mx-auto mt-5" style={{ width: "200px", height: "200px" }} alt="Icono de eventos" />
                    <div className="card-body text-center">
                      <h2 className="card-title">Eventos</h2>
                    </div>
                  </div>
                </div>
              </Link>
              <Link to="/pedidos" style={{ textDecoration: "none" }}>
                <div className="col card-position">
                  <div className="card bg-warning shadow-sm card-custom">
                    <img src={pedidos} className="card-img-top mx-auto mt-5" style={{ width: "200px", height: "200px" }} alt="Icono de pedidos" />
                    <div className="card-body text-center">
                      <h2 className="card-title">Pedidos</h2>
                    </div>
                  </div>
                </div>
              </Link>
              <Link to="/puestos" style={{ textDecoration: "none" }}>
                <div className="col card-position">
                  <div className="card bg-warning shadow-sm card-custom">
                    <img src={carro} className="card-img-top mx-auto mt-5" style={{ width: "200px", height: "200px" }} alt="Icono de puestos" />
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
