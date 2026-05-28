import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Mock useBreakpoint
jest.mock('../useBreakpoint', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock CSS imports
jest.mock('../components/sass/main.scss', () => ({}), { virtual: true });
jest.mock('../components/sass/main.css', () => ({}), { virtual: true });
jest.mock('../components/ComponenteRegister/placeholder.css', () => ({}), { virtual: true });

// Mock Footer (shared dependency)
jest.mock('../components/ComponentesGenerales/Footer', () => ({
  __esModule: true,
  default: () => <div data-testid="footer" />,
}));

// Mock PasswordToggle (used by FormUsuario)
jest.mock('../components/ComponenteRegister/PasswordToggle.jsx', () => ({
  __esModule: true,
  default: ({ inputId, value, onChange, placeholder }) => (
    <input
      data-testid={inputId}
      type="password"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  ),
}));

const useBreakpoint = require('../useBreakpoint').default;
const FormUsuario = require('../components/ComponenteRegister/ProcesoRegistro/FormUsuario').default;
const FormConsumidor = require('../components/ComponenteRegister/ProcesoRegistro/FormConsumidor').default;
const FormEncargado = require('../components/ComponenteRegister/ProcesoRegistro/FormEncargado').default;
const FormProductor = require('../components/ComponenteRegister/ProcesoRegistro/FormProductor').default;
const FormRepartidor = require('../components/ComponenteRegister/ProcesoRegistro/FormRepartidor').default;

const mockProps = {
  nextStep: jest.fn(),
  backStep: jest.fn(),
  handleRegistro: jest.fn(),
  tipoUsuario: 'consumidor',
  isRegistering: false,
};

describe('ProcesoRegistro forms - responsive layout (Phase 3)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ---- 3.1 FormUsuario ----

  describe('3.1 FormUsuario', () => {
    test('mobile: card maxWidth 100%', () => {
      useBreakpoint.mockReturnValue({ isMobile: true, isTablet: false, isDesktop: false, breakpoint: 'xs', width: 375 });
      const { container } = render(
        <MemoryRouter><FormUsuario {...mockProps} /></MemoryRouter>
      );
      const card = container.querySelector('[data-testid="form-card-usuario"]');
      expect(card).toBeInTheDocument();
      expect(card.style.maxWidth).toBe('100%');
      expect(card.style.margin).toBe('0px auto');
    });

    test('desktop: card maxWidth 500px', () => {
      useBreakpoint.mockReturnValue({ isMobile: false, isTablet: false, isDesktop: true, breakpoint: 'xl', width: 1200 });
      const { container } = render(
        <MemoryRouter><FormUsuario {...mockProps} /></MemoryRouter>
      );
      const card = container.querySelector('[data-testid="form-card-usuario"]');
      expect(card.style.maxWidth).toBe('500px');
    });

    test('renders form title correctly', () => {
      useBreakpoint.mockReturnValue({ isMobile: false, isTablet: false, isDesktop: true, breakpoint: 'xl', width: 1200 });
      render(<MemoryRouter><FormUsuario {...mockProps} /></MemoryRouter>);
      expect(document.querySelector('h2')).toHaveTextContent('Crear Cuenta - Paso 1');
    });
  });

  // ---- 3.2 FormConsumidor ----

  describe('3.2 FormConsumidor', () => {
    test('mobile: card maxWidth 100%', () => {
      useBreakpoint.mockReturnValue({ isMobile: true, isTablet: false, isDesktop: false, breakpoint: 'xs', width: 375 });
      const { container } = render(
        <MemoryRouter><FormConsumidor {...mockProps} /></MemoryRouter>
      );
      const card = container.querySelector('[data-testid="form-card-consumidor"]');
      expect(card).toBeInTheDocument();
      expect(card.style.maxWidth).toBe('100%');
    });

    test('desktop: card maxWidth 500px', () => {
      useBreakpoint.mockReturnValue({ isMobile: false, isTablet: false, isDesktop: true, breakpoint: 'xl', width: 1200 });
      const { container } = render(
        <MemoryRouter><FormConsumidor {...mockProps} /></MemoryRouter>
      );
      const card = container.querySelector('[data-testid="form-card-consumidor"]');
      expect(card.style.maxWidth).toBe('500px');
    });

    test('renders form title', () => {
      useBreakpoint.mockReturnValue({ isMobile: false, isTablet: false, isDesktop: true, breakpoint: 'xl', width: 1200 });
      render(<MemoryRouter><FormConsumidor {...mockProps} /></MemoryRouter>);
      expect(document.querySelector('h2')).toHaveTextContent('Datos Consumidor');
    });
  });

  // ---- 3.3 FormEncargado ----

  describe('3.3 FormEncargado', () => {
    test('mobile: card maxWidth 100%', () => {
      useBreakpoint.mockReturnValue({ isMobile: true, isTablet: false, isDesktop: false, breakpoint: 'xs', width: 375 });
      const { container } = render(
        <MemoryRouter><FormEncargado {...mockProps} /></MemoryRouter>
      );
      const card = container.querySelector('[data-testid="form-card-encargado"]');
      expect(card).toBeInTheDocument();
      expect(card.style.maxWidth).toBe('100%');
    });

    test('desktop: card maxWidth 500px', () => {
      useBreakpoint.mockReturnValue({ isMobile: false, isTablet: false, isDesktop: true, breakpoint: 'xl', width: 1200 });
      const { container } = render(
        <MemoryRouter><FormEncargado {...mockProps} /></MemoryRouter>
      );
      const card = container.querySelector('[data-testid="form-card-encargado"]');
      expect(card.style.maxWidth).toBe('500px');
    });

    test('renders form title', () => {
      useBreakpoint.mockReturnValue({ isMobile: false, isTablet: false, isDesktop: true, breakpoint: 'xl', width: 1200 });
      render(<MemoryRouter><FormEncargado {...mockProps} /></MemoryRouter>);
      expect(document.querySelector('h2')).toHaveTextContent('Datos Encargado');
    });
  });

  // ---- 3.4 FormProductor ----

  describe('3.4 FormProductor', () => {
    test('mobile: card maxWidth 100%', () => {
      useBreakpoint.mockReturnValue({ isMobile: true, isTablet: false, isDesktop: false, breakpoint: 'xs', width: 375 });
      const { container } = render(
        <MemoryRouter><FormProductor {...mockProps} /></MemoryRouter>
      );
      const card = container.querySelector('[data-testid="form-card-productor"]');
      expect(card).toBeInTheDocument();
      expect(card.style.maxWidth).toBe('100%');
    });

    test('desktop: card maxWidth 500px', () => {
      useBreakpoint.mockReturnValue({ isMobile: false, isTablet: false, isDesktop: true, breakpoint: 'xl', width: 1200 });
      const { container } = render(
        <MemoryRouter><FormProductor {...mockProps} /></MemoryRouter>
      );
      const card = container.querySelector('[data-testid="form-card-productor"]');
      expect(card.style.maxWidth).toBe('500px');
    });

    test('renders form title', () => {
      useBreakpoint.mockReturnValue({ isMobile: false, isTablet: false, isDesktop: true, breakpoint: 'xl', width: 1200 });
      render(<MemoryRouter><FormProductor {...mockProps} /></MemoryRouter>);
      expect(document.querySelector('h2')).toHaveTextContent('Datos Productor');
    });
  });

  // ---- 3.5 FormRepartidor ----

  describe('3.5 FormRepartidor', () => {
    test('mobile: card maxWidth 100%', () => {
      useBreakpoint.mockReturnValue({ isMobile: true, isTablet: false, isDesktop: false, breakpoint: 'xs', width: 375 });
      const { container } = render(
        <MemoryRouter><FormRepartidor {...mockProps} /></MemoryRouter>
      );
      const card = container.querySelector('[data-testid="form-card-repartidor"]');
      expect(card).toBeInTheDocument();
      expect(card.style.maxWidth).toBe('100%');
    });

    test('desktop: card maxWidth 500px', () => {
      useBreakpoint.mockReturnValue({ isMobile: false, isTablet: false, isDesktop: true, breakpoint: 'xl', width: 1200 });
      const { container } = render(
        <MemoryRouter><FormRepartidor {...mockProps} /></MemoryRouter>
      );
      const card = container.querySelector('[data-testid="form-card-repartidor"]');
      expect(card.style.maxWidth).toBe('500px');
    });

    test('renders form title', () => {
      useBreakpoint.mockReturnValue({ isMobile: false, isTablet: false, isDesktop: true, breakpoint: 'xl', width: 1200 });
      render(<MemoryRouter><FormRepartidor {...mockProps} /></MemoryRouter>);
      expect(document.querySelector('h2')).toHaveTextContent('Datos Repartidor');
    });
  });
});
