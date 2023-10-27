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
      <Navbar />

      <section className="imagenes">
        <Imagenes />
      </section>

      <section className="ComoFunciona pb-3">
        <ComoFunciona />
      </section>


      <footer className="footer">
        <Footer />
      </footer>
    </div>
  );
};

export default LandingPage;
