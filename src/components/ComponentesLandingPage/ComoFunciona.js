import React from "react";
import "./../sass/main.scss";
import img from "./../img/replace-hamburger.png";
import { FaCalendarAlt, FaStore, FaShoppingCart, FaMapMarkedAlt } from "react-icons/fa";

const items = [
  { icon: <FaCalendarAlt aria-hidden="true" />, title: "Elegí tu evento", text: "Buscá el evento donde vas a disfrutar." },
  { icon: <FaStore aria-hidden="true" />, title: "Encontrá tu puesto", text: "Descubrí la comida que más te gusta." },
  { icon: <FaShoppingCart aria-hidden="true" />, title: "Hacé tu pedido", text: "Pedí desde tu lugar, rápido y fácil." },
  { icon: <FaMapMarkedAlt aria-hidden="true" />, title: "Recibí y disfrutá", text: "Te lo llevamos, sin filas ni demoras." },
];

const ComoFunciona = () => (
  <div className="qf-how-it-works">
    <div className="qf-how__content">
      <h2>Cómo funciona</h2>
      <p className="qf-how__intro">Vos disfrutá del evento.<br />Nosotros nos encargamos de tu pedido.</p>
      <ol className="qf-how__steps">
        {items.map((item, idx) => (
          <li key={item.title}>
            <span className="qf-how__icon">{item.icon}</span>
            <div><h3><span>{idx + 1}.</span> {item.title}</h3><p>{item.text}</p></div>
          </li>
        ))}
      </ol>
    </div>
    <div className="qf-how__image">
      <img src={img} alt="Personas disfrutando de un evento y pidiendo comida con QuickFood" loading="lazy" />
    </div>
  </div>
);

export default ComoFunciona;
