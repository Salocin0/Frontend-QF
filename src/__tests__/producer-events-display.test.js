import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ListadoEventosProductor, { filterProducerEvents } from '../components/ComponentesEventos/ListadoEventosProductor';
import EventoProductor from '../components/ComponentesEventos/EventoProductor';
import { UserContext } from '../components/ComponentesGenerales/UserContext';
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({ useNavigate: () => mockNavigate, Link: ({ children, to }) => <a href={to}>{children}</a> }));
jest.mock('../components/ComponentesGenerales/PageLayout', () => ({ children }) => <div>{children}</div>);
jest.mock('../components/ComponentesGenerales/Footer', () => () => null);
jest.mock('react-toastify', () => ({ toast: { success: jest.fn(), error: jest.fn() } }));
const event = { id: 9, nombre: 'Cuarteto', descripcion: 'Música y comida', estado: 'Confirmado', fechaHoraInicio: '2099-01-01T18:00:00Z' };
const wrapper = ({ children }) => <UserContext.Provider value={{ user: { consumidorId: 7 } }}>{children}</UserContext.Provider>;
afterEach(() => { if (global.fetch.mockRestore) global.fetch.mockRestore(); jest.clearAllMocks(); });

test.each([
  ['EnPreparacion', ['Ver Info', 'Editar evento', 'Ver Solicitudes', 'Confirmar Evento']],
  ['EnPreparacion1', ['Ver Info', 'Editar evento', 'Ver Solicitudes', 'Confirmar Evento']],
  ['EnPreparacion2', ['Ver Info', 'Editar evento', 'Ver Solicitudes', 'Confirmar Evento']],
  ['EnPreparacion3', ['Ver Info', 'Editar evento', 'Ver Solicitudes', 'Confirmar Evento']],
  ['Confirmado', ['Ver Info', 'Editar evento', 'Ver Solicitudes', 'Iniciar Evento', 'Pausar Evento']],
  ['Pausado', ['Ver Info', 'Editar evento', 'Ver Solicitudes', 'Continuar Evento', 'Cancelar Evento']],
  ['EnCurso', ['Ver Info', 'Editar evento', 'Finalizar Evento']],
  ['Finalizado', ['Ver Info', 'Editar evento', 'Ver Solicitudes']],
  ['Cancelado', ['Ver Info', 'Editar evento', 'Ver Solicitudes']],
])('state %s retains exactly its original actions', (state, buttons) => {
  render(<EventoProductor evento={{ ...event, estado: state }} recargarComponente={jest.fn()} />);
  expect(screen.getAllByRole('button').map((button) => button.textContent.trim())).toEqual(buttons);
  expect(screen.queryByText('A 1km de distancia')).not.toBeInTheDocument();
});

test('starting still requires confirmation and retains its date warning and API action', async () => {
  const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue({ json: async () => ({}) });
  const reload = jest.fn();
  render(<EventoProductor evento={event} recargarComponente={reload} />);
  fireEvent.click(screen.getByRole('button', { name: 'Iniciar Evento' }));
  expect(fetchMock).not.toHaveBeenCalled();
  expect(screen.getByText(/todavía no llegó/)).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Confirmar' }));
  await waitFor(() => expect(reload).toHaveBeenCalledTimes(1));
  expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('evento/cambiarEstado/9/iniciarEvento'), { method: 'POST' });
});

test('preparation variants stay grouped and searches tolerate missing names', () => {
  const events = [{ ...event, estado: 'EnPreparacion1' }, { ...event, id: 10, nombre: null, estado: 'EnPreparacion3' }, event];
  expect(filterProducerEvents(events, '', 'EnPreparacion')).toHaveLength(2);
  expect(filterProducerEvents(events, ' CUARTETO ', 'Confirmado')).toEqual([event]);
});

test('list handles empty API payloads and uses the same create route as the main action', async () => {
  jest.spyOn(global, 'fetch').mockResolvedValue({ ok: true, json: async () => ({ data: {} }) });
  render(<ListadoEventosProductor />, { wrapper });
  await screen.findByText('Tu próximo evento empieza acá');
  expect(screen.getByRole('link', { name: 'Crear evento' })).toHaveAttribute('href', '/registrar-evento2');
  expect(screen.getByRole('link', { name: 'Agregar evento' })).toHaveAttribute('href', '/registrar-evento2');
});

test('each event card exposes a direct edit action', () => {
  render(<EventoProductor evento={event} recargarComponente={jest.fn()} />);
  fireEvent.click(screen.getByRole('button', { name: 'Editar evento' }));
  expect(mockNavigate).toHaveBeenCalledWith('/evento/9');
});
