import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { UserContext } from '../components/ComponentesGenerales/UserContext';
import { toast } from 'react-toastify';
import ConsultarEvento from '../components/ComponentesEventos/ConsultarEvento';
jest.mock('react-router-dom', () => ({ useParams: () => ({ id: '1' }), Link: ({ children, to }) => <a href={to}>{children}</a> }));
jest.mock('../components/ComponentesGenerales/PageLayout', () => ({ children }) => <div>{children}</div>);
jest.mock('../components/ComponentesGenerales/Footer', () => () => null);
jest.mock('react-toastify', () => ({ toast: { success: jest.fn(), error: jest.fn() } }));
const wrapper = ({ children }) => <UserContext.Provider value={{ user: { consumidorId: 7, tipoUsuario: 'productor' } }}>{children}</UserContext.Provider>;
const setup = (restrictionData, eventData = {}) => jest.spyOn(global, 'fetch').mockImplementation(async (url) => ({ ok: true, json: async () => {
  if (String(url).includes('georef')) return { provincias: [] };
  if (String(url).includes('user/session')) return { data: { consumidorId: 7, tipoUsuario: 'productor' } };
  if (String(url).includes('restriccion')) return { data: restrictionData };
  return { data: { id: 1, nombre: 'Cuarteto', descripcion: '', ubicacion: '', localidad: '', provincia: '', tipoEvento: '', tipoPago: '', estado: 'EnPreparacion', ...eventData } };
} }));
afterEach(() => { global.fetch.mockRestore(); localStorage.clear(); jest.clearAllMocks(); });

test.each([{}, null, undefined, []])('edit form opens with non-list or empty restrictions: %p', async (data) => {
  const fetchMock = setup(data);
  render(<ConsultarEvento />, { wrapper });
  expect(await screen.findByDisplayValue('Cuarteto')).toBeInTheDocument();
  await waitFor(() => expect(fetchMock.mock.calls.some(([url]) => String(url).includes('restriccion/evento/1'))).toBe(true));
  expect(screen.getByRole('button', { name: 'Editar' })).toBeInTheDocument();
});

test('entering edit mode cancels the click default and never submits the event', async () => {
  const fetchMock = setup([]);
  render(<ConsultarEvento />, { wrapper });
  await screen.findByDisplayValue('Cuarteto');
  const editButton = screen.getByRole('button', { name: 'Editar' });
  const click = new MouseEvent('click', { bubbles: true, cancelable: true });
  fireEvent(editButton, click);
  expect(click.defaultPrevented).toBe(true);
  expect(screen.getByLabelText('Nombre del Evento')).toBeEnabled();
  expect(screen.getByRole('button', { name: 'Guardar Cambios' })).not.toBe(editButton);
  await waitFor(() => expect(fetchMock.mock.calls.some(([url]) => String(url).includes('restriccion/evento/1'))).toBe(true));
  expect(fetchMock.mock.calls.some(([, request]) => ['POST', 'PUT', 'PATCH', 'DELETE'].includes(request?.method))).toBe(false);
  expect(toast.error).not.toHaveBeenCalled();
  expect(toast.success).not.toHaveBeenCalled();
});

test('existing restrictions remain visible in the editor', async () => {
  setup([{ id: 8, titulo: 'Constancia AFIP', tipo: 'PDF', opciones: '', usuario: 'Ambos' }]);
  render(<ConsultarEvento />, { wrapper });
  expect(await screen.findByRole('cell', { name: 'Constancia AFIP' })).toBeInTheDocument();
});

test('new restriction can be removed locally before saving without deleting an undefined id', async () => {
  const fetchMock = setup([]);
  render(<ConsultarEvento />, { wrapper });
  await screen.findByDisplayValue('Cuarteto');
  fireEvent.click(screen.getByRole('button', { name: 'Editar' }));
  fireEvent.change(screen.getByLabelText('Título'), { target: { value: 'Documento nuevo' } });
  fireEvent.click(screen.getByRole('button', { name: 'Agregar Restriccion' }));
  expect(screen.getByRole('cell', { name: 'Documento nuevo' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Eliminar' }));
  expect(screen.queryByRole('cell', { name: 'Documento nuevo' })).not.toBeInTheDocument();
  expect(fetchMock.mock.calls.some(([, request]) => request?.method === 'DELETE')).toBe(false);
});

test('failed save retains the edited values and preserves the event state in the request', async () => {
  const fetchMock = setup([]);
  render(<ConsultarEvento />, { wrapper });
  await screen.findByDisplayValue('Cuarteto');
  fireEvent.click(screen.getByRole('button', { name: 'Editar' }));
  fireEvent.change(screen.getByLabelText('Nombre del Evento'), { target: { value: 'Cuarteto renovado' } });
  fetchMock.mockResolvedValueOnce({ ok: false, json: async () => ({ msg: 'No se pudo guardar' }) });
  fireEvent.click(screen.getByRole('button', { name: 'Guardar Cambios' }));
  await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Error al guardar los cambios: No se pudo guardar'));
  expect(screen.getByLabelText('Nombre del Evento')).toHaveValue('Cuarteto renovado');
  expect(screen.getByRole('button', { name: 'Guardar Cambios' })).toBeEnabled();
  const request = fetchMock.mock.calls.find(([, options]) => options?.method === 'PUT');
  expect(JSON.parse(request[1].body).evento).toEqual(expect.objectContaining({ nombre: 'Cuarteto renovado', estado: 'EnPreparacion', restricciones: [], consumidorId: 7 }));
});

test('prefills from the current user context without calling the legacy session endpoint', async () => {
  const fetchMock = setup([], { fechaHoraInicio: '2099-01-01T18:30:00Z', fechaHoraFin: '2099-01-03T21:15:00Z', tipoEvento: 'Música', tipoPago: 'Gratuito', provincia: 'Córdoba', localidad: 'Villa María', conButaca: true, conRepartidor: true, tienePreventa: true, capacidadMaxima: 500, cantidadPuestos: '12' });
  render(<ConsultarEvento />, { wrapper });
  await screen.findByDisplayValue('Cuarteto');
  expect(fetchMock.mock.calls.some(([url]) => String(url).includes('user/session'))).toBe(false);
  expect(screen.getByLabelText('Provincia')).toHaveValue('Córdoba');
  expect(screen.getByLabelText('Localidad')).toHaveValue('Villa María');
  expect(screen.getByLabelText('Tipo Evento')).toHaveValue('Música');
  expect(screen.getByLabelText('Capacidad máxima')).toHaveValue(500);
  expect(screen.getByLabelText('¿Tiene Butacas?')).toBeChecked();
  expect(screen.getByLabelText('¿Tiene Repartidores?')).toBeChecked();
  expect(screen.getByLabelText('¿Tiene preventa?')).toBeChecked();
  expect(screen.getByLabelText('Fecha inicio evento').value).toMatch(/^2099-01-/);
  expect(screen.getByLabelText('Hora inicio evento').value).not.toBe('');
  expect(screen.getByRole('button', { name: 'Editar' })).toBeEnabled();
});

test('failed loading blocks editing and retries with the existing event data', async () => {
  const fetchMock = setup([]);
  fetchMock.mockImplementationOnce(async () => ({ json: async () => ({ provincias: [] }) }));
  // Route requests independently: fail the first event load, succeed on retry.
  let first = true;
  const working = fetchMock.getMockImplementation();
  fetchMock.mockImplementation(async (url, options) => {
    if (String(url).includes('/evento/1') && first) { first = false; return { ok: false }; }
    return working(url, options);
  });
  render(<ConsultarEvento />, { wrapper });
  await screen.findByRole('alert');
  expect(screen.getByRole('button', { name: 'Editar' })).toBeDisabled();
  fireEvent.click(screen.getByRole('button', { name: 'Reintentar' }));
  expect(await screen.findByDisplayValue('Cuarteto')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Editar' })).toBeEnabled();
});

test('saving an unrelated edit preserves the original event timestamps', async () => {
  const start = '2099-01-01T18:30:20.000Z';
  const end = '2099-01-03T21:15:40.000Z';
  const fetchMock = setup([], { fechaHoraInicio: start, fechaHoraFin: end });
  render(<ConsultarEvento />, { wrapper });
  await screen.findByDisplayValue('Cuarteto');
  fireEvent.click(screen.getByRole('button', { name: 'Editar' }));
  fireEvent.change(screen.getByLabelText('Nombre del Evento'), { target: { value: 'Cuarteto actualizado' } });
  fetchMock.mockResolvedValueOnce({ ok: true, json: async () => ({}) });
  fireEvent.click(screen.getByRole('button', { name: 'Guardar Cambios' }));
  await waitFor(() => expect(toast.success).toHaveBeenCalled());
  const save = fetchMock.mock.calls.find(([, options]) => options?.method === 'PUT');
  expect(JSON.parse(save[1].body).evento).toEqual(expect.objectContaining({ fechaInicio: start, fechaFin: end }));
});

test('saving an event without optional capacity, couriers or presale sends no invalid empty values', async () => {
  const fetchMock = setup([], { capacidadMaxima: null, cantidadRepartidores: null, fechaInicioPreventa: null, tienePreventa: false });
  render(<ConsultarEvento />, { wrapper });
  await screen.findByDisplayValue('Cuarteto');
  fireEvent.click(screen.getByRole('button', { name: 'Editar' }));
  fireEvent.click(screen.getByRole('button', { name: 'Guardar Cambios' }));
  await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Cambios guardados correctamente'));
  const writes = fetchMock.mock.calls.filter(([, options]) => options?.method === 'PUT');
  expect(writes).toHaveLength(1);
  const payload = JSON.parse(writes[0][1].body).evento;
  expect(payload).not.toHaveProperty('capacidadMaxima');
  expect(payload).not.toHaveProperty('cantidadRepartidores');
  expect(payload.fechaInicioPreventa).toBeNull();
  expect(payload.tienePreventa).toBe(false);
});
