import React from 'react';
import fs from 'fs';
import path from 'path';
import { render, screen } from '@testing-library/react';
import LoadingSpinner from '../components/ComponentesGenerales/LoadingSpinner';

const COMPONENTS_DIR = path.join(__dirname, '..', 'components');
// DialogWithPatmentSheet already shows a MUI spinner next to its text; LoadingSpinner holds the default label.
const EXCLUIDOS = new Set(['DialogWithPatmentSheet.js', 'LoadingSpinner.js']);

const archivos = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const full = path.join(dir, entry.name);
  if (entry.isDirectory()) return archivos(full);
  return entry.name.endsWith('.js') ? [full] : [];
});

describe('Estados de carga con spinner', () => {
  test('el spinner muestra el anillo y deja el texto solo para lectores de pantalla', () => {
    const { container } = render(<p role="status"><LoadingSpinner label="Cargando pedidos…" /></p>);
    expect(container.querySelector('.qf-loading-spinner__ring')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByRole('status')).toHaveTextContent('Cargando pedidos…');
    expect(screen.getByText('Cargando pedidos…')).toHaveClass('qf-loading-spinner__label');
  });

  test('ningún componente muestra un texto "Cargando" sin spinner', () => {
    const textoVisible = /(>\s*Cargando[^<{]*<)|(["'`]Cargando[^"'`]*["'`])/g;
    const hallazgos = [];
    for (const archivo of archivos(COMPONENTS_DIR)) {
      if (EXCLUIDOS.has(path.basename(archivo))) continue;
      const fuente = fs.readFileSync(archivo, 'utf8').replace(/label="Cargando[^"]*"/g, '');
      for (const match of fuente.matchAll(textoVisible)) {
        hallazgos.push(`${path.relative(COMPONENTS_DIR, archivo)}: ${match[0].trim()}`);
      }
    }
    expect(hallazgos).toEqual([]);
  });
});
