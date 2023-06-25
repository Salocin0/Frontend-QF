import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import '../estilos.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col text-start">
            <a href="/" className="footer-link">Iniciar sesión</a>
            <a href="/registrarse" className="footer-link">Registrarse</a>
            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="footer-icon">
              <FontAwesomeIcon icon={faInstagram} size="lg" />
            </a>
          </div>
          <div className="col text-end">
            <p className="mb-0 footer-text">QuickFood. Todos los derechos reservados.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;