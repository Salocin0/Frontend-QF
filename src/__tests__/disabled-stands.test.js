import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Listado from '../components/ComponentesPuesto/PuestoDeshabilitados';
import { UserContext } from '../components/ComponentesGenerales/UserContext';
import { toast } from 'react-toastify';
jest.mock('../components/ComponentesGenerales/PageLayout', () => ({ children }) => <div>{children}</div>);
jest.mock('../components/ComponentesGenerales/Footer', () => () => null);
jest.mock('react-toastify', () => ({ toast: { success: jest.fn(), error: jest.fn() } }));
const stand = { id: 4, nombreCarro: 'Cuarteto', numeroCarro: 12, telefonoCarro: '351123' };
const renderPage = () => render(<UserContext.Provider value={{ user: { consumidorId: 7 } }}><Listado /></UserContext.Provider>);
afterEach(() => { if (global.fetch.mockRestore) global.fetch.mockRestore(); jest.clearAllMocks(); });

test('lists disabled stands with search and working links without legacy session calls', async () => {
  const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue({ ok: true, json: async () => ({ data: [stand] }) });
  renderPage();
  await screen.findByRole('heading', { name: 'Cuarteto' });
  expect(fetchMock).toHaveBeenCalledTimes(1);
  expect(fetchMock.mock.calls[0][0]).toContain('puesto/deshabilitados');
  expect(screen.getByRole('link', { name: 'Información' })).toHaveAttribute('href', '/info-puesto/4');
  fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'otro' } });
  expect(screen.getByText('No encontramos puestos con esa búsqueda')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Limpiar búsqueda' }));
  expect(screen.getByRole('heading', { name: 'Cuarteto' })).toBeInTheDocument();
});

test('enable preserves PUT endpoint and consumer header and refreshes the list', async () => {
  const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValueOnce({ ok: true, json: async () => ({ data: [stand] }) }).mockResolvedValueOnce({ ok: true }).mockResolvedValueOnce({ status: 404, ok: false });
  renderPage();
  fireEvent.click(await screen.findByRole('button', { name: 'Habilitar puesto' }));
  expect(await screen.findByText('No tenés puestos deshabilitados')).toBeInTheDocument();
  expect(fetchMock.mock.calls[1]).toEqual([expect.stringContaining('puesto/4/habilitacion'), { method: 'PUT', headers: { ConsumidorId: 7 } }]);
  expect(screen.getByRole('link', { name: 'Ver mis puestos' })).toHaveAttribute('href', '/listado-puestos-encargado');
});

test('failed enable keeps the stand available to retry', async () => {
  jest.spyOn(global, 'fetch').mockResolvedValueOnce({ ok: true, json: async () => ({ data: [stand] }) }).mockResolvedValueOnce({ ok: false });
  renderPage();
  fireEvent.click(await screen.findByRole('button', { name: 'Habilitar puesto' }));
  await waitFor(() => expect(toast.error).toHaveBeenCalled());
  expect(screen.getByRole('button', { name: 'Habilitar puesto' })).toBeEnabled();
  expect(screen.getByRole('heading', { name: 'Cuarteto' })).toBeInTheDocument();
});
