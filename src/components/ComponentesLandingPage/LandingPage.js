import React from 'react';

const LandingPage = () => {
  return (
    <div className="app">
      <header className="navbar">
        <nav>
          <ul className="nav-list">
            <li className="nav-item">Ser Repartidor</li>
            <li className="nav-item">Ser Productor</li>
            <li className="nav-item">Ser Encargado de Puesto</li>
            <li className="nav-item">Login</li>
          </ul>
        </nav>
      </header>

      <section className="imagenes">
        {/* Contenido de la sección de imágenes */}
      </section>

      <section className="como funciona">
        {/* Contenido de la sección "Cómo funciona" */}
      </section>

      <section className="quienes confiaron en nosotros">
        {/* Contenido de la sección "Quienes confiaron en nosotros" */}
      </section>

      <section className="contacto">
        {/* Contenido de la sección de contacto */}
      </section>

      <footer className="footer">
        {/* Contenido del footer */}
      </footer>
    </div>
  );
};

export default LandingPage;
