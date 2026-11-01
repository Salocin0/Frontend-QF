import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
jest.mock('../components/ComponentesGenerales/PageLayout', () => ({ children }) => <div>{children}</div>);
jest.mock('../components/ComponentesGenerales/Footer', () => () => null);
const ConsultarEvento = require('../components/ComponentesEventos/ConsultarEvento').default;

describe('ConsultarEvento - accessible editor', () => {
  beforeEach(() => { localStorage.setItem('sessionId', 'test-session'); jest.spyOn(global, 'fetch').mockImplementation(async (url) => ({ ok: true, json: async () => String(url).includes('georef') ? { provincias: [] } : String(url).includes('user/session') ? { data: { consumidorId: 7 } } : String(url).includes('restriccion') ? { data: [] } : { data: { id: 1, nombre: 'Cuarteto' } } })); });
  afterEach(() => { global.fetch.mockRestore(); localStorage.clear(); });
  test('starts read-only with a clear event heading', () => {
    render(<MemoryRouter><ConsultarEvento /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: 'Editar evento' })).toBeInTheDocument();
    expect(screen.getByLabelText('Nombre del Evento')).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Editar' })).toBeDisabled();
  });

  test('all form control ids are unique and restrictions have no nested form', () => {
    const { container } = render(<MemoryRouter><ConsultarEvento /></MemoryRouter>);
    const ids = [...container.querySelectorAll('[id]')].map((node) => node.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(container.querySelectorAll('form')).toHaveLength(1);
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  test('edit enables both event fields and restriction controls', async () => {
    render(<MemoryRouter><ConsultarEvento /></MemoryRouter>);
    await screen.findByDisplayValue('Cuarteto');
    fireEvent.click(screen.getByRole('button', { name: 'Editar' }));
    expect(screen.getByLabelText('Nombre del Evento')).toBeEnabled();
    expect(screen.getByLabelText('Descripción')).toBeEnabled();
    expect(screen.getByLabelText('Usuario')).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Guardar Cambios' })).toBeInTheDocument();
  });
});
