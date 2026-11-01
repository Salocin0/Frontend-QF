import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AsociacionesEPC from '../components/ComponentesEPC/AsociacionesEPC';
import { UserContext } from '../components/ComponentesGenerales/UserContext';
import { toast } from 'react-toastify';
jest.mock('../components/ComponentesGenerales/PageLayout', () => ({ children }) => <div>{children}</div>);
jest.mock('../components/ComponentesGenerales/Footer', () => () => null);
jest.mock('react-router-dom', () => ({ Link: ({ to, children }) => <a href={to}>{children}</a> }));
jest.mock('react-toastify', () => ({ toast: { success: jest.fn(), error: jest.fn() } }));
const data = { eventos: [{ id: 1, nombre: 'Cuarteto', descripcion: 'Música' }, { id: 2, nombre: 'Feria', descripcion: 'Comida' }], asociaciones: [{ id: 8, eventoId: 1, estado: 'PendienteDeAceptacion' }, { id: 9, eventoId: 2, estado: 'Aceptada' }] };
const response = (value = data) => ({ ok: true, json: async () => ({ data: value }) });
const renderPage = () => render(<UserContext.Provider value={{ user: { consumidorId: 7 } }}><AsociacionesEPC /></UserContext.Provider>);
afterEach(() => { if (global.fetch.mockRestore) global.fetch.mockRestore(); jest.clearAllMocks(); });

test('search and status filters work together and only pending associations can be cancelled', async () => {
  jest.spyOn(global, 'fetch').mockResolvedValue(response());
  renderPage();
  await screen.findByRole('heading', { name: 'Cuarteto' });
  expect(screen.getAllByRole('button', { name: 'Cancelar asociación' })).toHaveLength(1);
  fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Aceptada' } });
  expect(screen.queryByRole('heading', { name: 'Cuarteto' })).not.toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Feria' })).toBeInTheDocument();
  fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'cuarteto' } });
  expect(screen.getByText('No encontramos asociaciones con esos filtros')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Limpiar filtros' }));
  expect(screen.getByRole('heading', { name: 'Cuarteto' })).toBeInTheDocument();
});

test('confirmation cancels through the original endpoint and refreshes without resetting search', async () => {
  const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValueOnce(response()).mockResolvedValueOnce({ ok: true }).mockResolvedValueOnce(response({ ...data, asociaciones: [{ ...data.asociaciones[0], estado: 'Cancelada' }, data.asociaciones[1]] }));
  renderPage();
  fireEvent.click(await screen.findByRole('button', { name: 'Cancelar asociación' }));
  expect(fetchMock).toHaveBeenCalledTimes(1);
  fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
  expect(fetchMock).toHaveBeenCalledTimes(1);
  fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'cuarteto' } });
  fireEvent.click(screen.getByRole('button', { name: 'Cancelar asociación' }));
  fireEvent.click(screen.getByRole('button', { name: 'Confirmar' }));
  await screen.findByText('Cancelada', { selector: 'span' });
  expect(fetchMock.mock.calls[1]).toEqual([expect.stringContaining('asociacion/cambiarEstado/8/cancelar'), { method: 'POST' }]);
  expect(screen.getByRole('searchbox')).toHaveValue('cuarteto');
  expect(toast.success).toHaveBeenCalledTimes(1);
});

test('server failure keeps cancellation available for retry', async () => {
  jest.spyOn(global, 'fetch').mockResolvedValueOnce(response()).mockRejectedValueOnce(new Error('Sin conexión'));
  renderPage();
  fireEvent.click(await screen.findByRole('button', { name: 'Cancelar asociación' }));
  fireEvent.click(screen.getByRole('button', { name: 'Confirmar' }));
  await waitFor(() => expect(toast.error).toHaveBeenCalled());
  expect(screen.getByRole('button', { name: 'Cancelar asociación' })).toBeEnabled();
  expect(toast.success).not.toHaveBeenCalled();
});

test('empty response has a working link to choose a stand', async () => {
  jest.spyOn(global, 'fetch').mockResolvedValue(response({}));
  renderPage();
  expect(await screen.findByText('Todavía no tenés asociaciones')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Ver mis puestos' })).toHaveAttribute('href', '/listado-puestos-encargado');
});
