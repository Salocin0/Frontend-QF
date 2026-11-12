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
  ['EnPreparacion1', ['Ver Info', 'Editar evento', 'Ver Solicitudes', 'Seguir preparando']],
  ['EnPreparacion2', ['Ver Info', 'Editar evento', 'Ver Solicitudes', 'Seguir preparando']],
  ['EnPreparacion3', ['Ver Info', 'Editar evento', 'Ver Solicitudes', 'Confirmar Evento']],
  ['Confirmado', ['Ver Info', 'Ver Solicitudes', 'Iniciar Evento', 'Pausar Evento']],
  ['Pausado', ['Ver Info', 'Editar evento', 'Ver Solicitudes', 'Continuar Evento', 'Cancelar Evento']],
  ['EnCurso', ['Ver Info', 'Finalizar Evento']],
  ['Finalizado', ['Ver Info', 'Ver Solicitudes']],
  ['Cancelado', ['Ver Info', 'Ver Solicitudes']],
])('state %s shows exactly its actions ("Editar evento" only while editable)', (state, buttons) => {
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

test.each(['EnPreparacion1', 'EnPreparacion', 'Pausado'])('"Editar evento" on a %s event opens the creation wizard preloaded', (estado) => {
  localStorage.clear();
  render(<EventoProductor evento={{ ...event, estado }} recargarComponente={jest.fn()} />);
  fireEvent.click(screen.getByRole('button', { name: 'Editar evento' }));
  expect(mockNavigate).toHaveBeenCalledWith('/registrar-evento2', { state: { eventoId: 9, modo: 'editar' } });
  expect(localStorage.getItem('eventoCreacionId')).toBe('9');
});

test.each(['EnPreparacion1', 'EnPreparacion2'])('a draft in %s cannot be confirmed and says data is missing', (state) => {
  render(<EventoProductor evento={{ ...event, estado: state }} recargarComponente={jest.fn()} />);
  expect(screen.queryByRole('button', { name: /Confirmar Evento/ })).not.toBeInTheDocument();
  expect(screen.getByRole('note')).toHaveTextContent('Faltan completar datos del evento. Seguí preparándolo para poder confirmarlo.');
});

test('a rejected confirmation shows the backend reason instead of a success message', async () => {
  const { toast } = require('react-toastify');
  const recargar = jest.fn();
  global.fetch = jest.fn(() => Promise.resolve({ ok: false, status: 400, json: async () => ({ message: 'No se puede confirmar el evento: faltan completar pasos de su creación. Editalo y completá todos los datos.' }) }));
  render(<EventoProductor evento={{ ...event, estado: 'EnPreparacion' }} recargarComponente={recargar} />);
  fireEvent.click(screen.getByRole('button', { name: /Confirmar Evento/ }));
  fireEvent.click(screen.getByRole('button', { name: 'Confirmar' }));
  await waitFor(() => expect(toast.error).toHaveBeenCalledWith('No se puede confirmar el evento: faltan completar pasos de su creación. Editalo y completá todos los datos.'));
  expect(toast.success).not.toHaveBeenCalled();
  expect(recargar).not.toHaveBeenCalled();
});

test('"Seguir preparando" on a draft in EnPreparacion1 opens its pending step 2', () => {
  render(<EventoProductor evento={{ ...event, id: 19, estado: 'EnPreparacion1' }} recargarComponente={jest.fn()} />);
  fireEvent.click(screen.getByRole('button', { name: /Seguir preparando/ }));
  expect(mockNavigate).toHaveBeenCalledWith('/registrar-evento3', { state: { eventoId: 19 } });
});
