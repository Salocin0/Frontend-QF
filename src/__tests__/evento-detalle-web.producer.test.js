import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
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

    await waitFor(() => expect(screen.getByText('Feria Gastronomica')).toBeInTheDocument());

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

    const mapsLinks = screen.getAllByText('Ver en Google Maps');
    expect(mapsLinks).toHaveLength(2);
    expect(mapsLinks[0]).toHaveAttribute('href', expect.stringContaining('maps.google.com'));
  });

  // ── ED-H1b: State actions for "Confirmado" ──
  test('shows Iniciar, Pausar, and Cancelar buttons for Confirmado state', async () => {
    fetchSpy
      .mockResolvedValueOnce(mockFetchResponse({ status: 'success', data: fullEvent }))
      .mockResolvedValueOnce(mockFetchResponse({ status: 'success', data: [] }));

    renderWithContext(<EventoDetalleWeb />);

    await waitFor(() => expect(screen.getByText('Feria Gastronomica')).toBeInTheDocument());

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

    await waitFor(() => expect(screen.getByText('Feria Gastronomica')).toBeInTheDocument());

    expect(screen.getByText('Finalizar Evento')).toBeInTheDocument();
    expect(screen.queryByText('Iniciar Evento')).toBeNull();
    expect(screen.queryByText('Pausar Evento')).toBeNull();
  });

  // ── ED-E1: Image fallback when img is null ──
  test('falls back to logoevento.webp when event img is null', async () => {
    fetchSpy
      .mockResolvedValueOnce(mockFetchResponse({ status: 'success', data: { ...fullEvent, img: null } }))
      .mockResolvedValueOnce(mockFetchResponse({ status: 'success', data: [] }));

    renderWithContext(<EventoDetalleWeb />);

    await waitFor(() => expect(screen.getByText('Feria Gastronomica')).toBeInTheDocument());

    const img = screen.getByAltText('Feria Gastronomica');
    expect(img).toHaveAttribute('src', expect.stringContaining('logoevento.webp'));
  });

  // ── ED-E4: Empty diaEventos shows empty/placeholder state ──
  test('shows empty state message when diaEventos is empty', async () => {
    fetchSpy
      .mockResolvedValueOnce(mockFetchResponse({ status: 'success', data: { ...fullEvent, diaEventos: [] } }))
      .mockResolvedValueOnce(mockFetchResponse({ status: 'success', data: [] }));

    renderWithContext(<EventoDetalleWeb />);

    await waitFor(() => expect(screen.getByText('Feria Gastronomica')).toBeInTheDocument());

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

    await waitFor(() => expect(screen.getByText('Feria Gastronomica')).toBeInTheDocument());

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

    await waitFor(() => expect(screen.getByText('Feria Gastronomica')).toBeInTheDocument());

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

    await waitFor(() => expect(screen.getByText('Feria Gastronomica')).toBeInTheDocument());

    fireEvent.click(screen.getByText('Iniciar Evento'));

    await waitFor(() => expect(screen.getByText('Cancelar')).toBeInTheDocument());

    fireEvent.click(screen.getByText('Cancelar'));

    await waitFor(() => expect(screen.getByText('Feria Gastronomica')).toBeInTheDocument());
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

    await waitFor(() => expect(screen.getByText('Feria Gastronomica')).toBeInTheDocument());

    expect(screen.getByText('Confirmar Evento')).toBeInTheDocument();
    expect(screen.getByText('Cancelar Evento')).toBeInTheDocument();
    expect(screen.queryByText('Iniciar Evento')).toBeNull();
    expect(screen.queryByText('Finalizar Evento')).toBeNull();
  });

  // ── Triangulation: Pausado state shows Cancelar, Preparar, Continuar ──
  test('shows Cancelar, Preparar, and Continuar buttons for Pausado state', async () => {
    fetchSpy
      .mockResolvedValueOnce(mockFetchResponse({ status: 'success', data: { ...fullEvent, estado: 'Pausado' } }))
      .mockResolvedValueOnce(mockFetchResponse({ status: 'success', data: [] }));

    renderWithContext(<EventoDetalleWeb />);

    await waitFor(() => expect(screen.getByText('Feria Gastronomica')).toBeInTheDocument());

    expect(screen.getByText('Cancelar Evento')).toBeInTheDocument();
    expect(screen.getByText('Preparar Evento')).toBeInTheDocument();
    expect(screen.getByText('Continuar Evento')).toBeInTheDocument();
  });
});
