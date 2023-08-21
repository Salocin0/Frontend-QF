import React from 'react';
import Footer from '../ComponentesGenerales/Footer';
import ComoFunciona from './ComoFunciona';
import Contacto from './Contacto';
import Imagenes from './Imagenes';
import Navbar from './Navbar';
import "./landingPage.css";

const LandingPage = () => {
  return (
    <div className="app">
      
      <nav className='navbar'>
        <Navbar/>
      </nav>

      <section className="imagenes">
        <Imagenes/>
      </section>

      <section className="comofunciona">
        <ComoFunciona/>
      </section>

      <section className="contacto">
        <Contacto/>
      </section>

      <footer className="footer">
        <Footer/>
      </footer>
    </div>
  );
};

export default LandingPage;
