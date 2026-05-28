import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Mock useBreakpoint
jest.mock('../useBreakpoint', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock CSS imports
jest.mock('bootstrap/dist/css/bootstrap.min.css', () => ({}), { virtual: true });
jest.mock('../components/ComponenteRegister/placeholder.css', () => ({}), { virtual: true });
jest.mock('../components/sass/main.scss', () => ({}), { virtual: true });
jest.mock('../components/ComponentesLogin/RegistrarUsuario.css', () => ({}), { virtual: true });

// Mock dependencies
jest.mock('../components/ComponentesGenerales/Footer', () => ({
  __esModule: true,
  default: () => <div data-testid="footer" />,
}));
jest.mock('../components/ComponenteRegister/PasswordToggle', () => ({
  __esModule: true,
  default: ({ inputId, value, onChange, placeholder }) => (
    <input data-testid={inputId} type="password" value={value} onChange={onChange} placeholder={placeholder} />
  ),
}));
jest.mock('../firebase.js', () => ({
  fetchToken: jest.fn().mockResolvedValue('mock-token'),
}));

const useBreakpoint = require('../useBreakpoint').default;
const RecuperarContraseña = require('../components/ComponentesLogin/RecuperarContraseña').default;
const CambiarContraseña = require('../components/ComponentesLogin/CambiarContraseña').default;
const RegistrarUsuario = require('../components/ComponentesLogin/RegistrarUsuario').default;

describe('Auth forms - responsive layout (Phase 4a)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem('sessionId', 'test-session');
  });

  afterEach(() => {
    localStorage.clear();
  });

  // ---- 4.1 RecuperarContraseña ----

  describe('4.1 RecuperarContraseña', () => {
    test('mobile: card maxWidth 100%', () => {
      useBreakpoint.mockReturnValue({ isMobile: true, isTablet: false, isDesktop: false, breakpoint: 'xs', width: 375 });
      const { container } = render(
        <MemoryRouter><RecuperarContraseña /></MemoryRouter>
      );
      const card = container.querySelector('[data-testid="form-card-recuperar"]');
      expect(card).toBeInTheDocument();
      expect(card.style.maxWidth).toBe('100%');
    });

    test('desktop: card maxWidth 400px', () => {
      useBreakpoint.mockReturnValue({ isMobile: false, isTablet: false, isDesktop: true, breakpoint: 'xl', width: 1200 });
      const { container } = render(
        <MemoryRouter><RecuperarContraseña /></MemoryRouter>
      );
      const card = container.querySelector('[data-testid="form-card-recuperar"]');
      expect(card.style.maxWidth).toBe('400px');
    });

    test('renders form title', () => {
      useBreakpoint.mockReturnValue({ isMobile: false, isTablet: false, isDesktop: true, breakpoint: 'xl', width: 1200 });
      render(<MemoryRouter><RecuperarContraseña /></MemoryRouter>);
      expect(document.querySelector('h1')).toHaveTextContent('Recuperar Contraseña');
    });
  });

  // ---- 4.2 CambiarContraseña ----

  describe('4.2 CambiarContraseña', () => {
    test('mobile: card maxWidth 100%', () => {
      useBreakpoint.mockReturnValue({ isMobile: true, isTablet: false, isDesktop: false, breakpoint: 'xs', width: 375 });
      const { container } = render(
        <MemoryRouter><CambiarContraseña /></MemoryRouter>
      );
      const card = container.querySelector('[data-testid="form-card-cambiar"]');
      expect(card).toBeInTheDocument();
      expect(card.style.maxWidth).toBe('100%');
    });

    test('desktop: card maxWidth 400px', () => {
      useBreakpoint.mockReturnValue({ isMobile: false, isTablet: false, isDesktop: true, breakpoint: 'xl', width: 1200 });
      const { container } = render(
        <MemoryRouter><CambiarContraseña /></MemoryRouter>
      );
      const card = container.querySelector('[data-testid="form-card-cambiar"]');
      expect(card.style.maxWidth).toBe('400px');
    });

    test('renders form title', () => {
      useBreakpoint.mockReturnValue({ isMobile: false, isTablet: false, isDesktop: true, breakpoint: 'xl', width: 1200 });
      render(<MemoryRouter><CambiarContraseña /></MemoryRouter>);
      expect(document.querySelector('h1')).toHaveTextContent('Cambiar Contraseña');
    });
  });

  // ---- 4.3 RegistrarUsuario ----

  describe('4.3 RegistrarUsuario', () => {
    test('mobile: card maxWidth 100%', () => {
      useBreakpoint.mockReturnValue({ isMobile: true, isTablet: false, isDesktop: false, breakpoint: 'xs', width: 375 });
      const { container } = render(
        <MemoryRouter><RegistrarUsuario /></MemoryRouter>
      );
      const card = container.querySelector('[data-testid="form-card-registrar-usuario"]');
      expect(card).toBeInTheDocument();
      expect(card.style.maxWidth).toBe('100%');
    });

    test('desktop: card maxWidth 400px', () => {
      useBreakpoint.mockReturnValue({ isMobile: false, isTablet: false, isDesktop: true, breakpoint: 'xl', width: 1200 });
      const { container } = render(
        <MemoryRouter><RegistrarUsuario /></MemoryRouter>
      );
      const card = container.querySelector('[data-testid="form-card-registrar-usuario"]');
      expect(card.style.maxWidth).toBe('400px');
    });

    test('renders form title', () => {
      useBreakpoint.mockReturnValue({ isMobile: false, isTablet: false, isDesktop: true, breakpoint: 'xl', width: 1200 });
      render(<MemoryRouter><RegistrarUsuario /></MemoryRouter>);
      expect(document.querySelector('h1')).toHaveTextContent('Registrar Usuario');
    });
  });
});
