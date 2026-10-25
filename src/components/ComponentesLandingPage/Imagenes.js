import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import Carrousel from "./Carrousel";

const Imagenes = () => (
  <section className="qf-hero" aria-labelledby="qf-hero-title">
    <div className="qf-hero__copy">
      <span className="qf-eyebrow">PEDÍ Y DISFRUTÁ. SIN FILAS.</span>
      <h1 id="qf-hero-title">Tu evento.<br />Tu comida.<br /><span>Sin esperar.</span></h1>
      <p>Viví cada momento. Elegí lo que más te gusta y recibí tu pedido sin perderte nada del evento.</p>
      <Link className="qf-primary-link" to="/Listado-eventos">Explorar eventos <FaArrowRight aria-hidden="true" /></Link>
      <div className="qf-hero__benefits"><span>Elegí tu puesto</span><span>Pedí desde tu lugar</span><span>Disfrutá el evento</span></div>
    </div>
    <div className="qf-hero__events">
      <div className="qf-hero__events-heading"><h2>Próximos eventos</h2><span>Con QuickFood</span></div>
      <Carrousel />
    </div>
  </section>
);

export default Imagenes;
