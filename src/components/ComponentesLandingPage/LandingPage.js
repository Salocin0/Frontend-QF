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
<<<<<<< HEAD
      <div className='divimagenessec'>
        <Imagenes/>
      </div>
        
=======

      <section className="imagenes">
        <Imagenes/>
      </section>
>>>>>>> 3f0a15d1b0836bf3ac49aab578d19128982e337a

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
