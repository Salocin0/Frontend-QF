import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/ComponentesGenerales/App.js';
import reportWebVitals from './reportWebVitals';

// Aplicar data-theme al <html> ANTES del primer render
// para evitar flash de tema incorrecto (FOUC)
// Cada carga comienza en modo oscuro; el usuario puede cambiarlo con el botón.
localStorage.setItem("modoOscuroActivo", "true");
document.documentElement.setAttribute("data-theme", "dark");

const root = ReactDOM.createRoot(document.getElementById('root'));

// Mostrar en consola la URL base del backend usada por el frontend
(() => {
  const rawBase = process.env.REACT_APP_BACK_URL || '';
  const prefixed = rawBase.startsWith('http://') || rawBase.startsWith('https://') ? rawBase : `https://${rawBase}`;
  const base = prefixed.endsWith('/') ? prefixed : `${prefixed}/`;
})();

root.render(
  <App/>
);

reportWebVitals();
