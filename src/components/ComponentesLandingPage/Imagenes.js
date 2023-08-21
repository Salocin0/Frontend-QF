import React from "react";
import Carousel from "react-bootstrap/Carousel";
import image3 from "../img/comida-rapida-casera.jpg";
import image2 from "../img/contacto.jpg";
import image1 from "../img/ejemplo.png";
import "./landingPage.css";

const Imagenes = () => {
  return (
    <div className="imagenes row d-flex align-items-center justify-content-center">
      <div className="col-10 row">
        <div className="text-center pb-2 mb-3">
          <h2>Próximos Eventos</h2>
        </div>
        <div className="col-8 h-100">
          <div className="carousel-container">
            <Carousel className="carousel">
              <Carousel.Item>
                <img
                  className="d-block w-100 carousel-image"
                  src={image1}
                  alt="Primer slide"
                />
              </Carousel.Item>
              <Carousel.Item>
                <img
                  className="d-block w-100 carousel-image"
                  src={image2}
                  alt="Segundo slide"
                />
              </Carousel.Item>
              <Carousel.Item>
                <img
                  className="d-block w-100 carousel-image"
                  src={image3}
                  alt="Tercer slide"
                />
              </Carousel.Item>
            </Carousel>
          </div>
        </div>
        <div className="col-4 h-100">
          <div className="descripcion text-center">
            <p>
              Estos son los próximos eventos en los que trabajaremos con Quickfood para mejorar la experiencia de compra de los espectadores.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Imagenes;
