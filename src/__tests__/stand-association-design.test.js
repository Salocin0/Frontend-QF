import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EventoEncargado from '../components/ComponentesEventos/EventoEncargado';
import AsociarPuestoAEvento from '../components/ComponentesPuesto/AsociarPuestoAEvento';
import { UserContext } from '../components/ComponentesGenerales/UserContext';
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({ useNavigate: () => mockNavigate, useParams: () => ({ puestoId: '1' }), Link: ({ children, to }) => <a href={to}>{children}</a> }));
jest.mock('../components/ComponentesGenerales/PageLayout', () => ({ children }) => <div>{children}</div>);
jest.mock('../components/ComponentesGenerales/Footer', () => () => null);
jest.mock('react-toastify', () => ({ toast: { success: jest.fn(), error: jest.fn() } }));
const event = { id: 9, nombre: 'Cuarteto', descripcion: 'Música y comida', estado: 'Confirmado' };
const wrapper = ({ children }) => <UserContext.Provider value={{ user: { consumidorId: 7 } }}>{children}</UserContext.Provider>;
afterEach(() => { if (global.fetch.mockRestore) global.fetch.mockRestore(); jest.clearAllMocks(); });

test('no restrictions preserves the confirmed direct association flow and endpoint', async () => {
  const reload = jest.fn();
  const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValueOnce({ status: 200 }).mockResolvedValueOnce({ status: 404 }).mockResolvedValueOnce({ json: async () => ({ code: 200 }) });
  render(<EventoEncargado evento={event} puestoId="1" recargar={reload} />, { wrapper });
  await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
  fireEvent.click(await screen.findByRole('button', { name: 'Asociarme a Evento' }));
  expect(fetchMock).toHaveBeenCalledTimes(1);
  fireEvent.click(screen.getByRole('button', { name: 'Confirmar' }));
  await waitFor(() => expect(reload).toHaveBeenCalledTimes(1));
  expect(fetchMock.mock.calls[1][0]).toContain('restriccion/evento/9');
  expect(fetchMock.mock.calls[2][0]).toContain('asociacion/evento/9/asociarSimple/1/0');
  expect(fetchMock.mock.calls[2][1].method).toBe('POST');
});

test('events with restrictions still navigate to their existing form without posting', async () => {
  const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValueOnce({ status: 200 }).mockResolvedValueOnce({ status: 200, json: async () => ({}) });
  render(<EventoEncargado evento={event} puestoId="1" recargar={jest.fn()} />, { wrapper });
  await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
  fireEvent.click(await screen.findByRole('button', { name: 'Asociarme a Evento' }));
  fireEvent.click(screen.getByRole('button', { name: 'Confirmar' }));
  await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/restriccionesEvento/9'));
  expect(fetchMock).toHaveBeenCalledTimes(2);
});

test('pending association hides the associate action', async () => {
  jest.spyOn(global, 'fetch').mockResolvedValue({ status: 400 });
  render(<EventoEncargado evento={event} puestoId="1" recargar={jest.fn()} />, { wrapper });
  expect(await screen.findByText('Tiene una asociación pendiente')).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Asociarme a Evento' })).not.toBeInTheDocument();
});

test('list queries the same five allowed event states and handles empty payloads', async () => {
  const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue({ ok: true, json: async () => ({ data: {} }) });
  render(<AsociarPuestoAEvento />, { wrapper });
  expect(await screen.findByText('Todavía no hay eventos disponibles')).toBeInTheDocument();
  expect(fetchMock.mock.calls.map(([url]) => url.split('/').pop())).toEqual(['EnPreparacion', 'EnPreparacion1', 'EnPreparacion2', 'EnPreparacion3', 'Confirmado']);
});
