import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { UserProvider } from '../components/ComponentesGenerales/UserContext';

// Mock component imports used by Inicio.js
jest.mock('../components/ComponentesGenerales/CardInicio', () => () => <div data-testid="mock-CardInicio">CardInicio</div>);
jest.mock('../components/ComponentesGenerales/PageLayout', () => ({ children }) => <div data-testid="mock-PageLayout">{children}</div>);
jest.mock('../components/ComponentesGenerales/ActionButton', () => ({ title, icon, onClick, style }) => (
  <button data-testid={`action-${title.replace(/\s/g, '-')}`} onClick={onClick} style={style}>{title}</button>
));
jest.mock('../components/ComponentesLandingPage/ChatPanel', () => ({ onClose }) => <div data-testid="mock-Panel">Panel</div>);
jest.mock('../components/ComponentesGenerales/Footer', () => () => <div data-testid="mock-Footer">Footer</div>);
jest.mock('../useBreakpoint', () => ({
  __esModule: true,
  default: () => ({ isMobile: false, isTablet: false, isDesktop: true }),
}));

// Override useNavigate for this test file
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('../__mocks__/react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Dynamic import AFTER mocks
let Inicio;

beforeAll(() => {
  Inicio = require('../components/ComponentesGenerales/Inicio').default;
});

describe('Inicio — logout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
    localStorage.clear();
    sessionStorage.clear();
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ status: 'success', data: { tipoUsuario: 'consumidor', nombre: 'Test', id: 'u123' } }),
      })
    );
  });

  afterEach(() => {
    global.fetch.mockRestore?.();
  });

  const renderInicio = (userValue = null) => {
    if (userValue) {
      localStorage.setItem('user', JSON.stringify(userValue));
    }
    sessionStorage.setItem('sessionId', 'test-session-123');
    return render(
      <UserProvider>
        <MemoryRouter initialEntries={['/inicio']}>
          <Inicio />
        </MemoryRouter>
      </UserProvider>
    );
  };

  // ── Logout cleans localStorage.user ──
  test('logout removes user from localStorage', async () => {
    renderInicio({ tipoUsuario: 'consumidor', nombre: 'Test' });
    // Wait for the useEffect session fetch to settle (loading spinner gone,
    // the logout button rendered) — PageLayout mounts immediately regardless
    // of loading state, so waiting on it doesn't actually wait for the fetch.
    await waitFor(() => {
      expect(screen.getByTestId('action-Cerrar-Sesión')).toBeInTheDocument();
    });

    // Before logout, user IS in localStorage
    expect(localStorage.getItem('user')).not.toBeNull();

    // Click "Cerrar Sesión"
    act(() => {
      screen.getByTestId('action-Cerrar-Sesión').click();
    });

    // After logout, user is removed from localStorage
    await waitFor(() => {
      expect(localStorage.getItem('user')).toBeNull();
    });
  });

  // ── Logout removes sessionId from sessionStorage ──
  test('logout removes sessionId from sessionStorage', async () => {
    renderInicio({ tipoUsuario: 'consumidor', nombre: 'Test' });
    await waitFor(() => {
      expect(screen.getByTestId('action-Cerrar-Sesión')).toBeInTheDocument();
    });

    act(() => {
      screen.getByTestId('action-Cerrar-Sesión').click();
    });

    await waitFor(() => {
      expect(sessionStorage.getItem('sessionId')).toBeNull();
    });
  });

  // ── Logout navigates to /login with replace: true ──
  test('logout navigates to /login with replace: true', async () => {
    renderInicio({ tipoUsuario: 'consumidor', nombre: 'Test' });
    await waitFor(() => {
      expect(screen.getByTestId('action-Cerrar-Sesión')).toBeInTheDocument();
    });

    act(() => {
      screen.getByTestId('action-Cerrar-Sesión').click();
    });

    await waitFor(() => {
      // mockNavigate is the mocked navigate function returned by useNavigate()
      expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true });
    });
  });

  // ── Logout calls POST /user/cerrarWeb ──
  test('logout calls POST /user/cerrarWeb', async () => {
    renderInicio({ tipoUsuario: 'consumidor', nombre: 'Test', id: 'u123' });

    // Wait for session-dependent UI — consumidor shows 5 cards (2 base + 3 consumidor)
    await waitFor(() => {
      const cards = screen.getAllByTestId('mock-CardInicio');
      expect(cards.length).toBe(5);
    });

    act(() => {
      screen.getByTestId('action-Cerrar-Sesión').click();
    });

    // Verify cerrarWeb was called
    await waitFor(() => {
      const calls = global.fetch.mock.calls;
      const cerrarWebCall = calls.find(call => call[0] && call[0].includes('cerrarWeb'));
      expect(cerrarWebCall).toBeDefined();
      expect(cerrarWebCall[1]).toMatchObject({ method: 'POST' });
    });
  });
});
