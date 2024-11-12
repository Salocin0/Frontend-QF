// Carrousel.js
import React from "react";
import Carousel from "react-bootstrap/Carousel";
import image3 from "../img/4636599.jpg";
import image2 from "../img/5817068.jpg";
import image1 from "../img/6460329.jpg";

const Carrousel = () => {
  return (
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
  );
};

export default Carrousel;
