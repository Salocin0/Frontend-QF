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

// Mock dependencies
jest.mock('../components/ComponentesGenerales/Footer', () => ({
  __esModule: true,
  default: () => <div data-testid="footer" />,
}));

const useBreakpoint = require('../useBreakpoint').default;
const RegistrarRepartidor = require('../components/ComponenteRegister/RegistrarRepartidor').default;
const RegistrarProductor = require('../components/ComponenteRegister/RegistrarProductor').default;
const RegistrarEncargado = require('../components/ComponenteRegister/RegistrarEncargado').default;
const SeleccionRegister = require('../components/ComponenteRegister/SeleccionRegister').default;

describe('Register forms - responsive layout (Phase 4b)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem('sessionId', 'test-session');
  });

  afterEach(() => {
    localStorage.clear();
  });

  // ---- 4.4 RegistrarRepartidor ----

  describe('4.4 RegistrarRepartidor', () => {
    test('mobile: card maxWidth 100%', () => {
      useBreakpoint.mockReturnValue({ isMobile: true, isTablet: false, isDesktop: false, breakpoint: 'xs', width: 375 });
      const { container } = render(
        <MemoryRouter><RegistrarRepartidor /></MemoryRouter>
      );
      const card = container.querySelector('[data-testid="form-card-registrar-repartidor"]');
      expect(card).toBeInTheDocument();
      expect(card.style.maxWidth).toBe('100%');
    });

    test('desktop: card maxWidth 500px', () => {
      useBreakpoint.mockReturnValue({ isMobile: false, isTablet: false, isDesktop: true, breakpoint: 'xl', width: 1200 });
      const { container } = render(
        <MemoryRouter><RegistrarRepartidor /></MemoryRouter>
      );
      const card = container.querySelector('[data-testid="form-card-registrar-repartidor"]');
      expect(card.style.maxWidth).toBe('500px');
    });

    test('renders form title', () => {
      useBreakpoint.mockReturnValue({ isMobile: false, isTablet: false, isDesktop: true, breakpoint: 'xl', width: 1200 });
      render(<MemoryRouter><RegistrarRepartidor /></MemoryRouter>);
      expect(document.querySelector('h1')).toHaveTextContent('Registrar Usuario');
    });
  });

  // ---- 4.5 RegistrarProductor ----

  describe('4.5 RegistrarProductor', () => {
    test('mobile: card maxWidth 100%', () => {
      useBreakpoint.mockReturnValue({ isMobile: true, isTablet: false, isDesktop: false, breakpoint: 'xs', width: 375 });
      const { container } = render(
        <MemoryRouter><RegistrarProductor /></MemoryRouter>
      );
      const card = container.querySelector('[data-testid="form-card-registrar-productor"]');
      expect(card).toBeInTheDocument();
      expect(card.style.maxWidth).toBe('100%');
    });

    test('desktop: card maxWidth 500px', () => {
      useBreakpoint.mockReturnValue({ isMobile: false, isTablet: false, isDesktop: true, breakpoint: 'xl', width: 1200 });
      const { container } = render(
        <MemoryRouter><RegistrarProductor /></MemoryRouter>
      );
      const card = container.querySelector('[data-testid="form-card-registrar-productor"]');
      expect(card.style.maxWidth).toBe('500px');
    });

    test('renders form title', () => {
      useBreakpoint.mockReturnValue({ isMobile: false, isTablet: false, isDesktop: true, breakpoint: 'xl', width: 1200 });
      render(<MemoryRouter><RegistrarProductor /></MemoryRouter>);
      expect(document.querySelector('h1')).toHaveTextContent('Registrar Usuario');
    });
  });

  // ---- 4.6 RegistrarEncargado ----

  describe('4.6 RegistrarEncargado', () => {
    test('mobile: card maxWidth 100%', () => {
      useBreakpoint.mockReturnValue({ isMobile: true, isTablet: false, isDesktop: false, breakpoint: 'xs', width: 375 });
      const { container } = render(
        <MemoryRouter><RegistrarEncargado /></MemoryRouter>
      );
      const card = container.querySelector('[data-testid="form-card-registrar-encargado"]');
      expect(card).toBeInTheDocument();
      expect(card.style.maxWidth).toBe('100%');
    });

    test('desktop: card maxWidth 500px', () => {
      useBreakpoint.mockReturnValue({ isMobile: false, isTablet: false, isDesktop: true, breakpoint: 'xl', width: 1200 });
      const { container } = render(
        <MemoryRouter><RegistrarEncargado /></MemoryRouter>
      );
      const card = container.querySelector('[data-testid="form-card-registrar-encargado"]');
      expect(card.style.maxWidth).toBe('500px');
    });

    test('renders form title', () => {
      useBreakpoint.mockReturnValue({ isMobile: false, isTablet: false, isDesktop: true, breakpoint: 'xl', width: 1200 });
      render(<MemoryRouter><RegistrarEncargado /></MemoryRouter>);
      expect(document.querySelector('h1')).toHaveTextContent('Registrar Usuario');
    });
  });

  // ---- 4.7 SeleccionRegister ----

  describe('4.7 SeleccionRegister', () => {
    test('mobile: card maxWidth 100%', () => {
      useBreakpoint.mockReturnValue({ isMobile: true, isTablet: false, isDesktop: false, breakpoint: 'xs', width: 375 });
      const { container } = render(
        <MemoryRouter><SeleccionRegister /></MemoryRouter>
      );
      const card = container.querySelector('[data-testid="form-card-seleccion"]');
      expect(card).toBeInTheDocument();
      expect(card.style.maxWidth).toBe('100%');
    });

    test('desktop: card maxWidth 500px', () => {
      useBreakpoint.mockReturnValue({ isMobile: false, isTablet: false, isDesktop: true, breakpoint: 'xl', width: 1200 });
      const { container } = render(
        <MemoryRouter><SeleccionRegister /></MemoryRouter>
      );
      const card = container.querySelector('[data-testid="form-card-seleccion"]');
      expect(card.style.maxWidth).toBe('500px');
    });

    test('renders form title', () => {
      useBreakpoint.mockReturnValue({ isMobile: false, isTablet: false, isDesktop: true, breakpoint: 'xl', width: 1200 });
      render(<MemoryRouter><SeleccionRegister /></MemoryRouter>);
      expect(document.querySelector('h2')).toHaveTextContent('Seleccione Perfil');
    });
  });
});
