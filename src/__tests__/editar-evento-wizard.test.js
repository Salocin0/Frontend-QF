import React from 'react';
import { render, screen, waitFor, fireEvent, within } from '@testing-library/react';
import { UserContext } from '../components/ComponentesGenerales/UserContext';

const mockNavigate = jest.fn();
let mockLocation = { state: null };
let mockParams = {};
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => mockLocation,
  useParams: () => mockParams,
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));
jest.mock('../components/sass/main.scss', () => ({}), { virtual: true });
jest.mock('bootstrap/dist/css/bootstrap.min.css', () => ({}), { virtual: true });
jest.mock('../components/ComponentesGenerales/PageLayout', () => ({ __esModule: true, default: ({ children }) => <div>{children}</div> }));
jest.mock('../components/ComponentesGenerales/Footer', () => ({ __esModule: true, default: () => null }));
jest.mock('../components/ComponentesGenerales/Breadcrumb', () => ({ __esModule: true, default: () => <nav /> }));
jest.mock('react-toastify', () => ({ toast: { success: jest.fn(), error: jest.fn(), info: jest.fn() } }));
jest.mock('leaflet/dist/images/marker-icon-2x.png', () => 'icon-2x', { virtual: true });
jest.mock('leaflet/dist/images/marker-icon.png', () => 'icon', { virtual: true });
jest.mock('leaflet/dist/images/marker-shadow.png', () => 'shadow', { virtual: true });
jest.mock('leaflet/dist/leaflet.css', () => ({}), { virtual: true });
jest.mock('leaflet', () => ({ Icon: { Default: { prototype: { _getIconUrl: () => {} }, mergeOptions: jest.fn() } } }));
jest.mock('react-leaflet', () => ({
  MapContainer: ({ children }) => <div>{children}</div>,
  TileLayer: () => null,
  Marker: () => null,
  useMap: () => ({ setView: jest.fn(), getZoom: () => 14 }),
  useMapEvents: () => null,
}));

const { toast } = require('react-toastify');
const RegistrarEvento2 = require('../components/ComponentesEventos/RegistrarEvento2').default;
const RegistrarEvento3 = require('../components/ComponentesEventos/RegistrarEvento3').default;
const RegistrarEvento4 = require('../components/ComponentesEventos/RegistrarEvento4').default;
const RegistrarEvento5 = require('../components/ComponentesEventos/RegistrarEvento5').default;
const { editarEvento, esEventoEditable } = require('../components/ComponentesEventos/editarEvento');

const BACK = 'http://127.0.0.1:8000/';
const KEY = 'eventoCreacionId';
const EDIT = { eventoId: 19, modo: 'editar' };
const pad = (n) => String(n).padStart(2, '0');
const local = (iso) => {
  const d = new Date(iso);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const pausedEvent = {
  id: 19,
  nombre: 'Fiesta pausada',
  descripcion: 'Una fiesta',
  ubicacion: 'Plaza Central, Córdoba',
  localidad: 'Córdoba',
  provincia: 'Córdoba',
  tipoEvento: 'Festival',
  tipoPago: 'Pago',
  img: 'data:image/png;base64,abc',
  latitud: -31.4,
  longitud: -64.18,
  estado: 'Pausado',
  fechaHoraInicio: '2099-01-01T18:00:00.000Z',
  fechaHoraFin: '2099-01-03T02:00:00.000Z',
  tienePreventa: true,
  conRepartidor: true,
  conButaca: false,
  capacidadMaxima: 300,
  cantidadPuestos: 40,
  cantidadRepartidores: 3,
  linkVentaEntradas: 'https://entradas.example/fiesta',
  diaEventos: [
    { id: 2, fechaHoraInicioDiaEvento: '2099-01-02T20:00:00.000Z', fechaHoraFinDiaEvento: '2099-01-03T02:00:00.000Z' },
    { id: 1, fechaHoraInicioDiaEvento: '2099-01-01T19:00:00.000Z', fechaHoraFinDiaEvento: '2099-01-02T01:00:00.000Z' },
  ],
};

const json = (body, status = 200) => Promise.resolve({ ok: status < 300, status, json: () => Promise.resolve(body) });
const user = { token: 't', consumidorId: 7, productorId: 3, tipoUsuario: 'Productor' };
const renderPage = (ui) => render(<UserContext.Provider value={{ user }}>{ui}</UserContext.Provider>);

// Routes the stubbed fetch by URL and method; records every call.
const mockApi = (evento, extra = {}) => {
  global.fetch = jest.fn((url, options = {}) => {
    const u = String(url);
    const method = options.method || 'GET';
    if (u.includes('georef')) return json({ provincias: [] });
    if (u.includes('nominatim')) return json([]);
    if (u.includes('puntosEncuentro')) return json({ status: 'success', data: extra.puntos || [] });
    if (method === 'GET' && u.startsWith(`${BACK}evento/`)) return json({ data: evento });
    return json({ status: 'success', data: { id: 19 } });
  });
};
const calls = (method, fragment) => global.fetch.mock.calls.filter(([url, opts = {}]) => (opts.method || 'GET') === method && String(url).includes(fragment));

beforeEach(() => {
  process.env.REACT_APP_BACK_URL = BACK;
  localStorage.clear();
  mockNavigate.mockReset();
  mockLocation = { state: null };
  mockParams = {};
  jest.clearAllMocks();
});

describe('editarEvento: which events open the wizard in edit mode (S6)', () => {
  test.each(['EnPreparacion1', 'EnPreparacion2', 'EnPreparacion3', 'EnPreparacion', 'Pausado'])('%s is editable and opens step 1 preloaded', (estado) => {
    localStorage.setItem('eventoDatos', '{"stale":true}');
    expect(esEventoEditable({ estado })).toBe(true);
    expect(editarEvento({ id: 19, estado }, mockNavigate)).toBe(true);
    expect(mockNavigate).toHaveBeenCalledWith('/registrar-evento2', { state: { eventoId: 19, modo: 'editar' } });
    expect(localStorage.getItem(KEY)).toBe('19');
    expect(localStorage.getItem('eventoDatos')).toBeNull();
  });

  test.each(['Confirmado', 'EnCurso', 'Finalizado', 'Cancelado', undefined])('%s is not editable and nothing happens', (estado) => {
    expect(esEventoEditable({ estado })).toBe(false);
    expect(editarEvento({ id: 19, estado }, mockNavigate)).toBe(false);
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(localStorage.getItem(KEY)).toBeNull();
  });
});

describe('Step 1 (RegistrarEvento2) in edit mode', () => {
  test('a paused event is preloaded (no draft banner), saved with PUT keeping its coordinates and state, and edit mode moves on', async () => {
    localStorage.setItem(KEY, '19');
    mockLocation = { state: EDIT };
    mockApi(pausedEvent);
    renderPage(<RegistrarEvento2 />);

    expect(await screen.findByDisplayValue('Fiesta pausada')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Editar evento');
    expect(screen.queryByText(/Tenés un borrador sin terminar/i)).not.toBeInTheDocument();
    expect(screen.getByLabelText(/Descripción Del Evento/i).value).toBe('Una fiesta');
    expect(screen.getByLabelText(/Ubicación Del Evento/i).value).toBe('Plaza Central, Córdoba');
    expect(screen.getByRole('radio', { name: 'Festival' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Pago' })).toBeChecked();
    expect(localStorage.getItem(KEY)).toBe('19');

    fireEvent.click(screen.getByRole('button', { name: /Siguiente/ }));
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/registrar-evento3', { state: { eventoId: 19, modo: 'editar' } }));

    expect(calls('POST', 'evento')).toHaveLength(0);
    expect(calls('GET', 'nominatim')).toHaveLength(0);
    const [[url, opts]] = calls('PUT', 'evento/preparacion/19');
    expect(url).toBe(`${BACK}evento/preparacion/19`);
    const body = JSON.parse(opts.body);
    expect(body).toMatchObject({ nombre: 'Fiesta pausada', latitud: -31.4, longitud: -64.18, imagenEvento: 'data:image/png;base64,abc', tipoEvento: 'Festival', tipoPago: 'Pago' });
    expect(body).not.toHaveProperty('estado');
  });

  test('a confirmed event cannot be edited: the user is sent back and the id is dropped', async () => {
    localStorage.setItem(KEY, '19');
    mockLocation = { state: EDIT };
    mockApi({ ...pausedEvent, estado: 'Confirmado' });
    renderPage(<RegistrarEvento2 />);

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/listado-eventos-productor'));
    expect(toast.error).toHaveBeenCalledWith('Este evento no se puede editar en su estado actual. Pausalo para editarlo.');
    expect(localStorage.getItem(KEY)).toBeNull();
    expect(screen.getByLabelText(/Nombre Del Evento/i).value).toBe('');
  });

  test('previous behavior: creating a new event (no stored id, no edit mode) still POSTs a draft', async () => {
    mockApi(null);
    renderPage(<RegistrarEvento2 />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Crear un Evento');
    fireEvent.change(screen.getByLabelText(/Nombre Del Evento/i), { target: { value: 'Nuevo' } });
    fireEvent.change(screen.getByLabelText(/Descripción Del Evento/i), { target: { value: 'Desc' } });
    fireEvent.change(screen.getByLabelText(/Ubicación Del Evento/i), { target: { value: 'Calle 1' } });
    fireEvent.click(screen.getByRole('button', { name: /Siguiente/ }));

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/registrar-evento3', { state: { eventoId: 19 } }));
    const [[url, opts]] = calls('POST', 'evento');
    expect(url).toBe(`${BACK}evento`);
    expect(JSON.parse(opts.body)).toMatchObject({ nombre: 'Nuevo', estado: 'EnPreparacion1' });
    expect(calls('PUT', 'evento/preparacion')).toHaveLength(0);
  });

  test('previous behavior: resuming a draft from the next step PUTs it as a draft and keeps the old navigation state', async () => {
    localStorage.setItem(KEY, '19');
    mockLocation = { state: { eventoId: 19 } };
    mockApi({ ...pausedEvent, estado: 'EnPreparacion2' });
    renderPage(<RegistrarEvento2 />);

    expect(await screen.findByDisplayValue('Fiesta pausada')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Crear un Evento');
    fireEvent.click(screen.getByRole('button', { name: /Siguiente/ }));

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/registrar-evento3', { state: { eventoId: 19 } }));
    const [[, opts]] = calls('PUT', 'evento/preparacion/19');
    expect(JSON.parse(opts.body)).toMatchObject({ estado: 'EnPreparacion1' });
  });
});

describe('Step 2 (RegistrarEvento3) in edit mode', () => {
  test('preloads dates and settings from the event and saves them with PUT, keeping edit mode', async () => {
    mockLocation = { state: EDIT };
    mockApi(pausedEvent);
    renderPage(<RegistrarEvento3 />);

    await waitFor(() => expect(screen.getByLabelText(/Fecha Inicio Evento/).value).toBe(local(pausedEvent.fechaHoraInicio)));
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Editar evento');
    expect(screen.getByLabelText(/Fecha Fin Evento/).value).toBe(local(pausedEvent.fechaHoraFin));
    expect(within(screen.getByRole('group', { name: 'Preventa*' })).getByLabelText('Sí')).toBeChecked();
    expect(within(screen.getByRole('group', { name: /tiene repartidores/ })).getByLabelText('Sí')).toBeChecked();
    expect(within(screen.getByRole('group', { name: /tiene butacas/ })).getByLabelText('No')).toBeChecked();
    expect(screen.getByLabelText(/Capacidad Máxima/).value).toBe('300');
    expect(screen.getByLabelText(/Link Venta Entradas/).value).toBe('https://entradas.example/fiesta');

    // The presale start is not stored by the backend, so (as in creation) it has to be entered again.
    fireEvent.change(screen.getByLabelText(/¿Cuándo iniciará la preventa\?/), { target: { value: '2098-12-31T10:00' } });
    fireEvent.click(screen.getByRole('button', { name: /Siguiente/ }));
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/registrar-evento4/2', { state: { eventoId: 19, modo: 'editar' } }));
    const [[, opts]] = calls('PUT', 'evento/preparacion/19');
    expect(JSON.parse(opts.body)).toMatchObject({
      fechaInicio: '2099-01-01T18:00:00.000Z',
      fechaFin: '2099-01-03T02:00:00.000Z',
      tienePreventa: true,
      conRepartidor: true,
      conButaca: false,
      capacidadMaxima: '300',
      cantidadPuestos: '40',
      cantidadRepartidores: '3',
      linkVentaEntradas: 'https://entradas.example/fiesta',
      cantidadDiasEvento: 2,
    });
  });

  test('a paused event whose unchanged start already passed can still be saved', async () => {
    mockLocation = { state: EDIT };
    mockApi({ ...pausedEvent, tienePreventa: false, fechaHoraInicio: '2020-01-01T18:00:00.000Z', fechaHoraFin: '2099-01-01T18:00:00.000Z' });
    renderPage(<RegistrarEvento3 />);
    await waitFor(() => expect(screen.getByLabelText(/Fecha Inicio Evento/).value).toBe(local('2020-01-01T18:00:00.000Z')));
    fireEvent.click(screen.getByRole('button', { name: /Siguiente/ }));
    await waitFor(() => expect(calls('PUT', 'evento/preparacion/19')).toHaveLength(1));
    expect(toast.error).not.toHaveBeenCalled();
  });
});

describe('Step 3 (RegistrarEvento4) in edit mode', () => {
  const eventoDatos = { fechaInicio: '2099-01-01T18:00:00.000Z', fechaFin: '2099-01-03T02:00:00.000Z', tienePreventa: false, cantidadDiasEvento: 2 };

  test('preloads each day from the saved days and saving it (S2: a paused event ends EnPreparacion server-side) keeps edit mode', async () => {
    localStorage.setItem('eventoDatos', JSON.stringify(eventoDatos));
    mockLocation = { state: EDIT };
    mockParams = { diferenciaDiasEvento: '2' };
    mockApi(pausedEvent);
    renderPage(<RegistrarEvento4 />);

    await waitFor(() => expect(screen.getByLabelText(/Fecha y Hora de Inicio - Día 1/).value).toBe(local('2099-01-01T19:00:00.000Z')));
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Editar evento');
    expect(screen.getByLabelText(/Fecha y Hora de Fin - Día 1/).value).toBe(local('2099-01-02T01:00:00.000Z'));
    expect(screen.getByLabelText(/Fecha y Hora de Inicio - Día 2/).value).toBe(local('2099-01-02T20:00:00.000Z'));
    expect(screen.getByLabelText(/Fecha y Hora de Fin - Día 2/).value).toBe(local('2099-01-03T02:00:00.000Z'));

    fireEvent.click(screen.getByRole('button', { name: /Siguiente/ }));
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/registrar-evento5/19/2', { state: { modo: 'editar' } }));
    const [[, opts]] = calls('PUT', 'evento/preparacion/19');
    expect(JSON.parse(opts.body).diasEvento).toEqual([
      { dia: 1, horaInicio: '2099-01-01T19:00:00.000Z', horaFin: '2099-01-02T01:00:00.000Z', tienePreventa: false },
      { dia: 2, horaInicio: '2099-01-02T20:00:00.000Z', horaFin: '2099-01-03T02:00:00.000Z', tienePreventa: false },
    ]);
  });

  test('when the day count changed, the days are generated as before', async () => {
    localStorage.setItem('eventoDatos', JSON.stringify(eventoDatos));
    mockLocation = { state: EDIT };
    mockParams = { diferenciaDiasEvento: '2' };
    mockApi({ ...pausedEvent, diaEventos: [pausedEvent.diaEventos[1]] });
    renderPage(<RegistrarEvento4 />);

    await waitFor(() => expect(calls('GET', 'evento/19')).toHaveLength(1));
    expect(screen.getByLabelText(/Fecha y Hora de Inicio - Día 1/).value).toBe(local(eventoDatos.fechaInicio));
    expect(screen.getByLabelText(/Fecha y Hora de Inicio - Día 2/).value).toMatch(/T00:00$/);
  });

  test('previous behavior: creation does not load saved days and navigates without state', async () => {
    localStorage.setItem('eventoDatos', JSON.stringify(eventoDatos));
    mockLocation = { state: { eventoId: 19 } };
    mockParams = { diferenciaDiasEvento: '2' };
    mockApi(pausedEvent);
    renderPage(<RegistrarEvento4 />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Crear un Evento');
    fireEvent.click(screen.getByRole('button', { name: /Siguiente/ }));
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/registrar-evento5/19/2'));
    expect(calls('GET', 'evento/19')).toHaveLength(0);
  });
});

describe('Step 4 (RegistrarEvento5) in edit mode', () => {
  test('finishing says the changes were saved instead of "Registro Exitoso"', async () => {
    mockLocation = { state: { modo: 'editar' } };
    mockParams = { eventoId: '19', diferenciaDiasEvento: '2' };
    mockApi(pausedEvent, { puntos: [{ id: 1, nombre: 'Entrada', latitud: -31.4, longitud: -64.18 }] });
    renderPage(<RegistrarEvento5 />);

    expect(await screen.findByText('Entrada')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Editar evento');
    fireEvent.click(screen.getByRole('button', { name: /Finalizar/ }));
    expect(await screen.findByText('¡Cambios guardados!')).toBeInTheDocument();
    expect(screen.queryByText('¡Registro Exitoso!')).not.toBeInTheDocument();
  });

  test('previous behavior: creation still ends with "Registro Exitoso"', async () => {
    mockParams = { eventoId: '19', diferenciaDiasEvento: '2' };
    mockApi(pausedEvent, { puntos: [{ id: 1, nombre: 'Entrada', latitud: -31.4, longitud: -64.18 }] });
    renderPage(<RegistrarEvento5 />);
    expect(await screen.findByText('Entrada')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Finalizar Registro/ }));
    expect(await screen.findByText('¡Registro Exitoso!')).toBeInTheDocument();
  });
});
