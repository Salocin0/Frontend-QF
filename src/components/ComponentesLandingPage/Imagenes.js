import React from "react";
import Carousel from "react-bootstrap/Carousel";
import "./landingPage.css";
import "./img/ejemplo.png";

const Imagenes = () => {
  return (
    <div className="imagenes row d-flex align-items-center justify-content-center">
      <div className="col-10 row">
        <div className="text-center pb-5 mb-5">
          <h2>Proximos Eventos</h2>
        </div>
        <div className="col-8 h-100">
          <div className="carousel-container">
            <Carousel className="carousel">
              <Carousel.Item>
                <img
                  className="d-block"
                  src="./img/ejemplo.png"
                  alt="Primer slide"
                />
              </Carousel.Item>
              <Carousel.Item>
                <img
                  className="d-block"
                  src="./img/ejemplo.png"
                  alt="Segundo slide"
                />
              </Carousel.Item>
              <Carousel.Item>
                <img
                  className="d-block"
                  src="./img/ejemplo.png"
                  alt="Tercer slide"
                />
              </Carousel.Item>
            </Carousel>
          </div>
        </div>
        <div className="col-4 h-100">
          <div className="descripcion text-center">
            <p>
              Estos son los proximos eventos en trabajar con quickfood para
              mejorar la experiencia de compra para los espectadores
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Imagenes;
