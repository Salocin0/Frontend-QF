import React from 'react';
import Carousel from 'react-bootstrap/Carousel';

const Confiaron = () => {
  return (
    <div className="confiaron">
      <h2>Quienes Confiaron en Nosotros</h2>
      <Carousel>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="imagen1.jpg"
            alt="Primer slide"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="imagen2.jpg"
            alt="Segundo slide"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="imagen3.jpg"
            alt="Tercer slide"
          />
        </Carousel.Item>
      </Carousel>
    </div>
  );
};

export default Confiaron;
