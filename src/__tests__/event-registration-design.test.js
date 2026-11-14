import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegistrarEvento2 from '../components/ComponentesEventos/RegistrarEvento2';
import { UserContext } from '../components/ComponentesGenerales/UserContext';
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({ useNavigate: () => mockNavigate, useLocation: () => ({ state: null }), Link: ({ children, to }) => <a href={to}>{children}</a> }));
jest.mock('../components/ComponentesGenerales/PageLayout', () => ({ children }) => <div>{children}</div>);
jest.mock('../components/ComponentesGenerales/Footer', () => () => null);
jest.mock('react-toastify', () => ({ toast: { success: jest.fn(), error: jest.fn(), info: jest.fn() } }));
afterEach(() => { if (global.fetch.mockRestore) global.fetch.mockRestore(); localStorage.clear(); jest.clearAllMocks(); });

test('radio options store the same textual catalog values and next saves step one', async () => {
  const fetchMock = jest.spyOn(global, 'fetch').mockImplementation(async (url) => {
    if (String(url).includes('georef')) return { json: async () => ({ provincias: [] }) };
    if (String(url).includes('nominatim')) return { ok: true, json: async () => [] };
    return { ok: true, status: 200, json: async () => ({ data: { id: 19 } }) };
  });
  render(<UserContext.Provider value={{ user: { consumidorId: 7, productorId: 4 } }}><RegistrarEvento2 /></UserContext.Provider>);
  expect(screen.getByLabelText('Progreso del registro').querySelector('[aria-current="step"]')).toHaveTextContent('Información');
  fireEvent.change(screen.getByLabelText('Nombre Del Evento*'), { target: { value: 'Festival' } });
  fireEvent.change(screen.getByLabelText('Descripción Del Evento*'), { target: { value: 'Música y comida' } });
  fireEvent.change(screen.getByLabelText('Ubicación Del Evento*'), { target: { value: 'Córdoba' } });
  fireEvent.click(screen.getByRole('radio', { name: 'Música' }));
  fireEvent.click(screen.getByRole('radio', { name: 'Gratuito' }));
  expect(screen.getByRole('radio', { name: 'Música' })).toBeChecked();
  expect(screen.getByRole('radio', { name: 'Gratuito' })).toBeChecked();
  fireEvent.click(screen.getByRole('button', { name: 'Siguiente' }));
  await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/registrar-evento3', { state: { eventoId: 19 } }));
  const saveCall = fetchMock.mock.calls.find(([, request]) => request?.method === 'POST');
  expect(JSON.parse(saveCall[1].body)).toEqual(expect.objectContaining({ tipoEvento: 'Música', tipoPago: 'Gratuito', estado: 'EnPreparacion1', consumidorId: 7, productorId: 4 }));
  expect(localStorage.getItem('eventoCreacionId')).toBe('19');
});
