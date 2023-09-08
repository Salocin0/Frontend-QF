import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import styleFooter from './footer.module.css';

const Footer = () => {
  return (
    <footer className={styleFooter.footer}>
      <div className="container">
        <div className={`row ${styleFooter.row}`}>
          <div className="col text-start">
            <a href="/" className={styleFooter.footerlink}>Trabaja con Nosotros</a>
            <a href="/registrarse" className={styleFooter.footerlink}>Contacto</a>
            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className={styleFooter.footericon}>
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