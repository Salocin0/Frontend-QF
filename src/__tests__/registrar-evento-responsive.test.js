import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Mock useBreakpoint
jest.mock('../useBreakpoint', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock CSS
jest.mock('../components/sass/main.scss', () => ({}), { virtual: true });

// Mock child components
jest.mock('../components/ComponentesGenerales/PageLayout', () => ({
  __esModule: true,
  default: ({ children }) => <div data-testid="page-layout">{children}</div>,
}));
jest.mock('../components/ComponentesGenerales/Footer', () => ({
  __esModule: true,
  default: () => <div data-testid="footer" />,
}));
jest.mock('../components/ComponentesGenerales/Utils/base64', () => ({
  fileToBase64: jest.fn(),
}));

const useBreakpoint = require('../useBreakpoint').default;
const RegistrarEvento = require('../components/ComponentesEventos/RegistrarEvento').default;

describe('RegistrarEvento - responsive layout (Task 2.3)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem('sessionId', 'test-session');
  });

  afterEach(() => {
    localStorage.clear();
  });

  test('mobile: section width 100%, maxWidth 100%', () => {
    useBreakpoint.mockReturnValue({
      isMobile: true,
      isTablet: false,
      isDesktop: false,
      breakpoint: 'xs',
      width: 375,
    });

    const { container } = render(
      <MemoryRouter>
        <RegistrarEvento />
      </MemoryRouter>
    );

    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
    expect(section.style.width).toBe('100%');
    expect(section.style.maxWidth).toBe('100%');
  });

  test('desktop: section width 80%, maxWidth 800px, centered', () => {
    useBreakpoint.mockReturnValue({
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      breakpoint: 'xl',
      width: 1200,
    });

    const { container } = render(
      <MemoryRouter>
        <RegistrarEvento />
      </MemoryRouter>
    );

    const section = container.querySelector('section');
    expect(section.style.width).toBe('80%');
    expect(section.style.maxWidth).toBe('800px');
    expect(section.style.margin).toBe('0px auto');
  });

  test('desktop: section does NOT have Bootstrap col-8 class', () => {
    useBreakpoint.mockReturnValue({
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      breakpoint: 'xl',
      width: 1200,
    });

    const { container } = render(
      <MemoryRouter>
        <RegistrarEvento />
      </MemoryRouter>
    );

    const section = container.querySelector('section');
    expect(section.className).not.toContain('col-8');
  });

  test('renders form title on mobile', () => {
    useBreakpoint.mockReturnValue({
      isMobile: true,
      isTablet: false,
      isDesktop: false,
      breakpoint: 'xs',
      width: 375,
    });

    render(
      <MemoryRouter>
        <RegistrarEvento />
      </MemoryRouter>
    );

    expect(screen.getByText('Registrar Evento')).toBeInTheDocument();
  });
});
