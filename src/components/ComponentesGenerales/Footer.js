import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import "./../sass/main.scss";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className={`row`}>
          <div className="col text-start">
            <a href="/" className="footerlink">
              Trabaja con Nosotros
            </a>
            <a href="/registrarse" className="footerlink">
              Contacto
            </a>
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="footericon"
            >
              <FontAwesomeIcon icon={faInstagram} size="lg" />
            </a>
          </div>
          <div className="col text-end">
            <p className="mb-0 footer-text">
              QuickFood. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
