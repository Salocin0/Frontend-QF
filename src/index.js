import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/ComponentesGenerales/App.js';
import reportWebVitals from './reportWebVitals';

// Aplicar data-theme al <html> ANTES del primer render
// para evitar flash de tema incorrecto (FOUC)
const storedTheme = localStorage.getItem("modoOscuroActivo");
const isDark = storedTheme === null ? true : storedTheme === "true";
document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");

const root = ReactDOM.createRoot(document.getElementById('root'));

// Mostrar en consola la URL base del backend usada por el frontend
(() => {
  const rawBase = process.env.REACT_APP_BACK_URL || '';
  const prefixed = rawBase.startsWith('http://') || rawBase.startsWith('https://') ? rawBase : `https://${rawBase}`;
  const base = prefixed.endsWith('/') ? prefixed : `${prefixed}/`;
  console.log('Backend base URL:', base);
})();

root.render(
  <App/>
);

reportWebVitals();