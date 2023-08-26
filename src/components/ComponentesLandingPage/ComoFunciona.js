import React from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./landingPage.css";

const ComoFunciona = () => {
  return (
    <div className="como-funciona h-100">
      <div className="row h-100">
        <div className="col-md-5 offset-1">
          <h2 className="text-center mt-3">Cómo Funciona</h2>
          <p>
            Realiza pedidos desde tu asiento y disfruta del evento mientras tu
            pedido se hace y llega hacia ti, sin filas ni frustaciones
          </p>
          <div className="items-container flex-column">
            <div className="item pt-2">
            <i class="bi bi-balloon"></i>
              <p>
                Seleciona el evento en el que deseas realizar tu pedido
              </p>
            </div>

            <div className="item pt-2">
            <i class="bi bi-shop"></i>
              <p>
                Seleciona el puesto al cual quieres hacer el pedido
              </p>
            </div>

            <div className="item pt-2">
            <i class="bi bi-cart"></i>
              <p>
                Realiza la compra de tu pedido
              </p>
            </div>

            <div className="item pt-2">
            <i class="bi bi-signpost-split bi-2x"></i>
              <p>
                Recibe el pedido en cualquier parte del evento donde te encuentres
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-5 offset-1 divimagen h-100"></div>
      </div>
    </div>
  );
};

export default ComoFunciona;