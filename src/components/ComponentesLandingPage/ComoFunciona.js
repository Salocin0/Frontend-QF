import React from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./../sass/main.scss";
import img from "./../img/comida-rapida-casera.jpg"


const ComoFunciona = () => {
  return (
    <div className={`comofunciona h-100`}>
      <div className="row h-100">
        <div className="col-5 offset-1">
          <h2 className="text-center mt-3">Cómo Funciona</h2>
          <p>
            Realiza pedidos desde tu asiento y disfruta del evento mientras tu
            pedido se hace y llega hacia ti, sin filas ni frustaciones
          </p>
          <div className="items-container flex-column">
            <div className={`item pt-2`}>
              <i className={`circleicon bi bi-balloon`}></i>
              <p>Seleciona el evento en el que deseas realizar tu pedido</p>
            </div>

            <div className={`item pt-2`}>
              <i className={`circleicon bi bi-shop`}></i>
              <p>Seleciona el puesto al cual quieres hacer el pedido</p>
            </div>

            <div className={"item pt-2"}>
              <i className={`circleicon bi bi-cart`}></i>
              <p>Realiza la compra de tu pedido</p>
            </div>

            <div className={`item pt-2 pb-2`}>
              <i className={`circleicon bi bi-signpost-split`}></i>
              <p>
                Recibe el pedido en cualquier parte del evento donde te
                encuentres
              </p>
            </div>
          </div>
        </div>
        <div className={`col-6`}>
        <img
            src={img}
            alt="Comida Rápida Casera"
            className={`divimagenimg w-100 h-100`}
          />
        </div>
      </div>
    </div>
  );
};

export default ComoFunciona;
