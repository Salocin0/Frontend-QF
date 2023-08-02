import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from '../ComponentesGenerales/Footer';
import Sidebar from '../ComponentesGenerales/Sidebar';

const Inicio = () => {
  return (
    <>
      <div className="d-flex">
        <Sidebar />
        <div className="flex-grow-1" style={{ background: `url('QuickFoodFondo.png')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Inicio;
