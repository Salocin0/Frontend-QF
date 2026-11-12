import React from 'react';
import { render, screen, waitFor, fireEvent, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

// Mock useBreakpoint
jest.mock('../useBreakpoint', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock CSS
jest.mock('bootstrap/dist/css/bootstrap.min.css', () => ({}), { virtual: true });
jest.mock('../components/sass/main.scss', () => ({}), { virtual: true });

// Mock PageLayout
jest.mock('../components/ComponentesGenerales/PageLayout', () => ({
  __esModule: true,
  default: ({ children }) => <div data-testid="page-layout">{children}</div>,
}));

// Mock Footer
jest.mock('../components/ComponentesGenerales/Footer', () => ({
  __esModule: true,
  default: () => <div data-testid="footer" />,
}));

// Mock react-toastify
jest.mock('react-toastify', () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

const useBreakpoint = require('../useBreakpoint').default;

import EventoDetalleWeb from '../components/ComponentesEventos/EventoDetalleWeb';
import { UserContext } from '../components/ComponentesGenerales/UserContext';

const backUrl = 'http://127.0.0.1:8000/';

const fullEvent = {
  id: 42,
  nombre: 'Feria Gastronomica',
  descripcion: 'Una gran feria de comida',
  tipoEvento: 'Feria',
  tipoPago: 'Gratuito',
  estado: 'Confirmado',
  ubicacion: 'Plaza Principal',
  localidad: 'Cordoba',
  provincia: 'Cordoba',
  fechaHoraInicio: '2026-06-15T10:00:00.000Z',
  fechaHoraFin: '2026-06-15T18:00:00.000Z',
  cantidadPuestos: 50,
  cantidadDiasEvento: 1,
  img: 'base64image',
  diaEventos: [
    { id: 1, nombre: 'Dia 1', fecha: '2026-06-15' },
    { id: 2, nombre: 'Dia 2', fecha: '2026-06-16' },
  ],
};

const fullPuntos = [
  { id: 1, nombre: 'Entrada Norte', longitud: -64.1833, latitud: -31.4167, habilitado: true },
  { id: 2, nombre: 'Entrada Sur', longitud: -64.19, latitud: -31.42, habilitado: true },
];

function mockFetchResponse(body, status = 200) {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
    text: () => Promise.resolve(JSON.stringify(body)),
  });
}

const renderWithContext = (component, { userOverride, initialRoute = '/evento-detalle/42' } = {}) => {
  const defaultUser = { consumidorId: 1, tipoUsuario: 'Productor' };
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <UserContext.Provider value={{ user: userOverride ?? defaultUser, updateUser: jest.fn(), clearUser: jest.fn() }}>
        <Routes>
          <Route path="/evento-detalle/:id" element={component} />
        </Routes>
      </UserContext.Provider>
    </MemoryRouter>
  );
};

describe('EventoDetalleWeb - producer view (TDD)', () => {
  let fetchSpy;

  beforeEach(() => {
    localStorage.setItem('sessionId', 'test-session');
    process.env.REACT_APP_BACK_URL = backUrl;
    process.env.PUBLIC_URL = '';
    useBreakpoint.mockReturnValue({
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      breakpoint: 'xl',
      width: 1200,
    });
    jest.clearAllMocks();
    fetchSpy = jest.spyOn(global, 'fetch');
  });

  afterEach(() => {
    localStorage.clear();
    fetchSpy.mockRestore();
  });

  // ── ED-H1: Render event card, days, meeting points, and state actions ──
  test('renders event card with image, name, description, state badge, location, dates, dias, and puntos', async () => {
    fetchSpy
      .mockResolvedValueOnce(mockFetchResponse({ status: 'success', data: fullEvent }))
      .mockResolvedValueOnce(mockFetchResponse({ status: 'success', data: fullPuntos }));

    renderWithContext(<EventoDetalleWeb />);

    await waitFor(() => expect(screen.getByRole('heading', { name: 'Feria Gastronomica' })).toBeInTheDocument());

    expect(screen.getByText('Una gran feria de comida')).toBeInTheDocument();
    expect(screen.getByText('Confirmado')).toBeInTheDocument();
    expect(screen.getByText(/Cordoba/)).toBeInTheDocument();
    expect(screen.getByText('Feria')).toBeInTheDocument();

    const img = screen.getByAltText('Feria Gastronomica');
    expect(img).toBeInTheDocument();

    expect(screen.getByText('Dia 1')).toBeInTheDocument();
    expect(screen.getByText('Dia 2')).toBeInTheDocument();

    expect(screen.getByText('Entrada Norte')).toBeInTheDocument();
    expect(screen.getByText('Entrada Sur')).toBeInTheDocument();

    // El mapa se abre en un modal embebido (iframe de Google Maps), no con
    // un link externo, así que cada punto tiene su propio botón "Ver Mapa".
    const mapsButtons = screen.getAllByText('Ver Mapa');
    expect(mapsButtons).toHaveLength(2);
  });

  // ── ED-H1b: State actions for "Confirmado" ──
  test('shows Iniciar, Pausar, and Cancelar buttons for Confirmado state', async () => {
    fetchSpy
      .mockResolvedValueOnce(mockFetchResponse({ status: 'success', data: fullEvent }))
      .mockResolvedValueOnce(mockFetchResponse({ status: 'success', data: [] }));

    renderWithContext(<EventoDetalleWeb />);

    await waitFor(() => expect(screen.getByRole('heading', { name: 'Feria Gastronomica' })).toBeInTheDocument());

    expect(screen.getByText('Iniciar Evento')).toBeInTheDocument();
    expect(screen.getByText('Pausar Evento')).toBeInTheDocument();
    expect(screen.getByText('Cancelar Evento')).toBeInTheDocument();
  });

  // ── ED-H1c: State actions for "EnCurso" ──
  test('shows only Finalizar button for EnCurso state', async () => {
    fetchSpy
      .mockResolvedValueOnce(mockFetchResponse({ status: 'success', data: { ...fullEvent, estado: 'EnCurso' } }))
      .mockResolvedValueOnce(mockFetchResponse({ status: 'success', data: [] }));

    renderWithContext(<EventoDetalleWeb />);

    await waitFor(() => expect(screen.getByRole('heading', { name: 'Feria Gastronomica' })).toBeInTheDocument());

    expect(screen.getByText('Finalizar Evento')).toBeInTheDocument();
    expect(screen.queryByText('Iniciar Evento')).toBeNull();
    expect(screen.queryByText('Pausar Evento')).toBeNull();
  });

  // ── ED-E1: Image fallback when img is null ──
  test('falls back to qf-new-logo-transparent.png when event img is null', async () => {
    fetchSpy
      .mockResolvedValueOnce(mockFetchResponse({ status: 'success', data: { ...fullEvent, img: null } }))
      .mockResolvedValueOnce(mockFetchResponse({ status: 'success', data: [] }));

    renderWithContext(<EventoDetalleWeb />);

    await waitFor(() => expect(screen.getByRole('heading', { name: 'Feria Gastronomica' })).toBeInTheDocument());

    const img = screen.getByAltText('Feria Gastronomica');
    expect(img).toHaveAttribute('src', expect.stringContaining('qf-new-logo-transparent.png'));
  });

  // ── ED-E4: Empty diaEventos shows empty/placeholder state ──
  test('shows empty state message when diaEventos is empty', async () => {
    fetchSpy
      .mockResolvedValueOnce(mockFetchResponse({ status: 'success', data: { ...fullEvent, diaEventos: [] } }))
      .mockResolvedValueOnce(mockFetchResponse({ status: 'success', data: [] }));

    renderWithContext(<EventoDetalleWeb />);

    await waitFor(() => expect(screen.getByRole('heading', { name: 'Feria Gastronomica' })).toBeInTheDocument());

    expect(screen.getByText(/registrados para este evento/i)).toBeInTheDocument();
  });

  // ── ED-H2: Confirm dialog opens and API is called on state change ──
  test('opens ConfirmDialog when clicking state action and calls API on confirm', async () => {
    fetchSpy
      .mockResolvedValueOnce(mockFetchResponse({ status: 'success', data: fullEvent }))
      .mockResolvedValueOnce(mockFetchResponse({ status: 'success', data: [] }))
      .mockResolvedValueOnce(mockFetchResponse({ status: 'success' }))
      .mockResolvedValueOnce(mockFetchResponse({ status: 'success', data: fullEvent }))
      .mockResolvedValueOnce(mockFetchResponse({ status: 'success', data: [] }));

    renderWithContext(<EventoDetalleWeb />);

    await waitFor(() => expect(screen.getByRole('heading', { name: 'Feria Gastronomica' })).toBeInTheDocument());

    fireEvent.click(screen.getByText('Iniciar Evento'));

    await waitFor(() => expect(screen.getByText('Confirmar')).toBeInTheDocument());
    expect(screen.getByText('Cancelar')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Confirmar'));

    // The POST to cambiarEstado should have been called
    await waitFor(() => {
      const postCall = fetchSpy.mock.calls.find(
        (call) => call[0] && call[0].includes('cambiarEstado')
      );
      expect(postCall).toBeTruthy();
    });
  });

  // ── ED-H3: EnCurso > Finalizar flow ──
  test('allows Finalizar from EnCurso state with confirm dialog', async () => {
    fetchSpy
      .mockResolvedValueOnce(mockFetchResponse({ status: 'success', data: { ...fullEvent, estado: 'EnCurso' } }))
      .mockResolvedValueOnce(mockFetchResponse({ status: 'success', data: [] }))
      .mockResolvedValueOnce(mockFetchResponse({ status: 'success' }))
      .mockResolvedValueOnce(mockFetchResponse({ status: 'success', data: { ...fullEvent, estado: 'EnCurso' } }))
      .mockResolvedValueOnce(mockFetchResponse({ status: 'success', data: [] }));

    renderWithContext(<EventoDetalleWeb />);

    await waitFor(() => expect(screen.getByRole('heading', { name: 'Feria Gastronomica' })).toBeInTheDocument());

    fireEvent.click(screen.getByText('Finalizar Evento'));

    await waitFor(() => expect(screen.getByText('Confirmar')).toBeInTheDocument());

    fireEvent.click(screen.getByText('Confirmar'));

    await waitFor(() => {
      const postCall = fetchSpy.mock.calls.find(
        (call) => call[0] && call[0].includes('finalizar')
      );
      expect(postCall).toBeTruthy();
    });
  });

  // ── Cancel dialog without confirming ──
  test('closes ConfirmDialog when Cancelar is clicked', async () => {
    fetchSpy
      .mockResolvedValueOnce(mockFetchResponse({ status: 'success', data: fullEvent }))
      .mockResolvedValueOnce(mockFetchResponse({ status: 'success', data: [] }));

    renderWithContext(<EventoDetalleWeb />);

    await waitFor(() => expect(screen.getByRole('heading', { name: 'Feria Gastronomica' })).toBeInTheDocument());

    fireEvent.click(screen.getByText('Iniciar Evento'));

    await waitFor(() => expect(screen.getByText('Cancelar')).toBeInTheDocument());

    fireEvent.click(screen.getByText('Cancelar'));

    await waitFor(() => expect(screen.getByRole('heading', { name: 'Feria Gastronomica' })).toBeInTheDocument());
    expect(screen.queryByText('Confirmar')).toBeNull();
  });

  // ── ED-E2: API fetch fails, error state renders ──
  test('shows error message when event API fails', async () => {
    fetchSpy
      .mockResolvedValueOnce(mockFetchResponse(null, 500))
      .mockResolvedValueOnce(mockFetchResponse(null, 500));

    renderWithContext(<EventoDetalleWeb />);

    await waitFor(() => expect(screen.getByText(/Error/i)).toBeInTheDocument());
  });

  // ── Triangulation: EnPreparacion state shows Confirmar and Cancelar ──
  test('shows Confirmar and Cancelar buttons for EnPreparacion state', async () => {
    fetchSpy
      .mockResolvedValueOnce(mockFetchResponse({ status: 'success', data: { ...fullEvent, estado: 'EnPreparacion' } }))
      .mockResolvedValueOnce(mockFetchResponse({ status: 'success', data: [] }));

    renderWithContext(<EventoDetalleWeb />);

    await waitFor(() => expect(screen.getByRole('heading', { name: 'Feria Gastronomica' })).toBeInTheDocument());

    expect(screen.getByText('Confirmar Evento')).toBeInTheDocument();
    expect(screen.getByText('Cancelar Evento')).toBeInTheDocument();
    expect(screen.queryByText('Iniciar Evento')).toBeNull();
    expect(screen.queryByText('Finalizar Evento')).toBeNull();
  });

  // ── A draft cannot be confirmed: it offers to resume the wizard at its pending step ──
  test.each([
    ['EnPreparacion1', {}, '/registrar-evento3'],
    ['EnPreparacion2', { fechaHoraInicio: '2026-12-01T18:00:00.000Z', fechaHoraFin: '2026-12-02T23:00:00.000Z' }, '/registrar-evento4/2'],
  ])('a draft in %s shows "Seguir preparando" instead of Confirmar and opens its pending step', async (estado, fechas, path) => {
    const { useNavigate } = require('react-router-dom');
    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);
    fetchSpy
      .mockResolvedValueOnce(mockFetchResponse({ status: 'success', data: { ...fullEvent, id: 42, estado, ...fechas } }))
      .mockResolvedValueOnce(mockFetchResponse({ status: 'success', data: [] }));

    renderWithContext(<EventoDetalleWeb />);
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Feria Gastronomica' })).toBeInTheDocument());

    expect(screen.queryByText('Confirmar Evento')).toBeNull();
    expect(screen.getByText('Cancelar Evento')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Seguir preparando'));
    expect(mockNavigate).toHaveBeenCalledWith(path, { state: { eventoId: 42 } });
    expect(screen.queryByText(/¿Está seguro/)).toBeNull();
  });

  // ── S3: a paused event offers Cancelar, Editar evento (middle) and Continuar ──
  test('shows Cancelar, Editar evento and Continuar for Pausado, and Editar evento opens the wizard without confirming', async () => {
    const { useNavigate } = require('react-router-dom');
    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);
    fetchSpy
      .mockResolvedValueOnce(mockFetchResponse({ status: 'success', data: { ...fullEvent, estado: 'Pausado' } }))
      .mockResolvedValueOnce(mockFetchResponse({ status: 'success', data: [] }));

    renderWithContext(<EventoDetalleWeb />);

    await waitFor(() => expect(screen.getByRole('heading', { name: 'Feria Gastronomica' })).toBeInTheDocument());

    const acciones = screen.getByRole('region', { name: 'Acciones del evento' });
    expect(within(acciones).getAllByRole('button').map((b) => b.textContent.trim())).toEqual(['Cancelar Evento', 'Editar evento', 'Continuar Evento']);
    expect(screen.queryByText('Preparar Evento')).toBeNull();

    fireEvent.click(within(acciones).getByRole('button', { name: 'Editar evento' }));
    expect(mockNavigate).toHaveBeenCalledWith('/registrar-evento2', { state: { eventoId: 42, modo: 'editar' } });
    expect(localStorage.getItem('eventoCreacionId')).toBe('42');
    expect(screen.queryByText(/¿Está seguro/)).toBeNull();
    expect(fetchSpy.mock.calls.find((call) => String(call[0]).includes('cambiarEstado'))).toBeUndefined();
  });
  test('opens the selected meeting point map and closes the accessible dialog', async () => {
    fetchSpy
      .mockResolvedValueOnce(mockFetchResponse({ data: fullEvent }))
      .mockResolvedValueOnce(mockFetchResponse({ data: fullPuntos }));
    renderWithContext(<EventoDetalleWeb />);
    await screen.findByText('Entrada Norte');
    fireEvent.click(screen.getAllByRole('button', { name: 'Ver Mapa' })[0]);
    expect(screen.getByRole('dialog', { name: 'Entrada Norte' })).toBeInTheDocument();
    expect(screen.getByTitle('Mapa - Entrada Norte')).toHaveAttribute('src', expect.stringContaining('-31.4167,-64.1833'));
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar mapa' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  test('producer edits an event in preparation from the detail header through the creation wizard', async () => {
    const { useNavigate } = require('react-router-dom');
    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);
    fetchSpy.mockResolvedValueOnce(mockFetchResponse({ data: { ...fullEvent, estado: 'EnPreparacion' } })).mockResolvedValueOnce(mockFetchResponse({ data: [] }));
    renderWithContext(<EventoDetalleWeb />);
    fireEvent.click(await screen.findByRole('button', { name: 'Editar evento' }));
    expect(mockNavigate).toHaveBeenCalledWith('/registrar-evento2', { state: { eventoId: 42, modo: 'editar' } });
    expect(screen.queryByRole('link', { name: 'Editar evento' })).not.toBeInTheDocument();
  });

  test.each(['Confirmado', 'EnCurso'])('a %s event cannot be edited: "Editar evento" does not appear', async (estado) => {
    fetchSpy.mockResolvedValueOnce(mockFetchResponse({ data: { ...fullEvent, estado } })).mockResolvedValueOnce(mockFetchResponse({ data: [] }));
    renderWithContext(<EventoDetalleWeb />);
    await screen.findByRole('heading', { name: fullEvent.nombre });
    expect(screen.queryByRole('button', { name: 'Editar evento' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Editar evento' })).not.toBeInTheDocument();
  });

  test('encargado does not see the producer edit action', async () => {
    fetchSpy.mockResolvedValueOnce(mockFetchResponse({ data: { ...fullEvent, estado: 'EnPreparacion' } })).mockResolvedValueOnce(mockFetchResponse({ data: [] }));
    renderWithContext(<EventoDetalleWeb />, { userOverride: { consumidorId: 2, tipoUsuario: 'encargado' } });
    await screen.findByRole('heading', { name: fullEvent.nombre });
    expect(screen.queryByRole('link', { name: 'Editar evento' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Editar evento' })).not.toBeInTheDocument();
  });

});
