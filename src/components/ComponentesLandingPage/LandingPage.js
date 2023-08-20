import React from 'react';
import Footer from '../ComponentesGenerales/Footer';
import Contacto from './Contacto';
import Confiaron from './Confiaron';
import ComoFunciona from './ComoFunciona';
import Imagenes from './Imagenes';
import Navbar from './Navbar';
import "./landingPage.css";

const LandingPage = () => {
  return (
    <div className="app">
      
      <nav className='navbar'>
        <Navbar/>
      </nav>

        <Imagenes/>

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
