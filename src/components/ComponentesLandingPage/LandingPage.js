import React from "react";
import Footer from "../ComponentesGenerales/Footer";
import ComoFunciona from "./ComoFunciona";
import Contacto from "./Contacto";
import Imagenes from "./Imagenes";
import Navbar from "./Navbar";
import "./../sass/main.scss";


const LandingPage = () => {
  return (
    <div>
      <nav className="navbar">
        <Navbar />
      </nav>

      <section className="imagenes">
        <Imagenes />
      </section>

      <section className="ComoFunciona">
        <ComoFunciona />
      </section>

      <section>
        <Contacto />
      </section>

      <footer className="footer">
        <Footer />
      </footer>
    </div>
  );
};

export default LandingPage;
