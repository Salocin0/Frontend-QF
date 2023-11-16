import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Carousel from "react-bootstrap/Carousel";
import image3 from "../img/4636599.jpg";
import image2 from "../img/5817068.jpg";
import image1 from "../img/6460329.jpg";
import "./../sass/main.scss";

const Imagenes = () => {
  return (
    <div className="imagenes d-flex align-items-center justify-content-center">
      <div className="col-10 row">
        <div className="text-center pb-2 mb-3">
          <h2>Próximos Eventos</h2>
        </div>
        <div className="col-lg-8 h-100">
          <div className="carousel-container">
            <Carousel className="carousel">
              <Carousel.Item>
                <div className="imgcarrouselcontainer">
                  <img
                    className="imgcarrousel d-block"
                    src={image1}
                    alt="Primer slide"
                  />
                </div>
              </Carousel.Item>
              <Carousel.Item>
                <div className="imgcarrouselcontainer">
                  <img
                    className="imgcarrousel d-block"
                    src={image2}
                    alt="Segundo slide"
                  />
                </div>
              </Carousel.Item>
              <Carousel.Item>
                <div className="imgcarrouselcontainer">
                  <img
                    className="imgcarrousel d-block"
                    src={image3}
                    alt="Tercer slide"
                  />
                </div>
              </Carousel.Item>
            </Carousel>
          </div>
        </div>
        <div className="col-lg-4 h-100">
          <div className="descripcion text-center">
            <p>
              Estos son los próximos eventos en los que trabajaremos con
              Quickfood para mejorar la experiencia de compra de los
              espectadores.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Imagenes;
