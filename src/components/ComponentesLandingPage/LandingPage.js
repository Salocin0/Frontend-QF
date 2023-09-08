import React from "react";
import Footer from "../ComponentesGenerales/Footer";
import ComoFunciona from "./ComoFunciona";
import Contacto from "./Contacto";
import Imagenes from "./Imagenes";
import Navbar from "./Navbar";
import style from "./landingPage.module.css";


const LandingPage = () => {
  return (
    <div>
      <nav className={style.navbar}>
        <Navbar />
      </nav>

      <section className={style.imagenes}>
        <Imagenes />
      </section>

      <section className={style.ComoFunciona}>
        <ComoFunciona />
      </section>

      <section>
        <Contacto />
      </section>

      <footer className={style.footer}>
        <Footer />
      </footer>
    </div>
  );
};

export default LandingPage;
