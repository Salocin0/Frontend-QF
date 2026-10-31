import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/ComponentesGenerales/App.js';
import reportWebVitals from './reportWebVitals';
import { initializeTheme } from './useTheme';

// Aplicar data-theme al <html> ANTES del primer render
// para evitar flash de tema incorrecto (FOUC)
// Respetar la preferencia guardada también al navegar con una recarga completa.
initializeTheme();

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
