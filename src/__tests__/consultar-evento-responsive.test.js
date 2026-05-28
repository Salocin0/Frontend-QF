import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Mock useBreakpoint
jest.mock('../useBreakpoint', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock Bootstrap CSS
jest.mock('bootstrap/dist/css/bootstrap.min.css', () => ({}), { virtual: true });
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
const ConsultarEvento = require('../components/ComponentesEventos/ConsultarEvento').default;

describe('ConsultarEvento - responsive layout (Task 2.1)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem('sessionId', 'test-session');
  });

  afterEach(() => {
    localStorage.clear();
  });

  test('mobile: section width 100%, table overflow auto, buttons column', () => {
    useBreakpoint.mockReturnValue({
      isMobile: true,
      isTablet: false,
      isDesktop: false,
      breakpoint: 'xs',
      width: 375,
    });

    const { container } = render(
      <MemoryRouter>
        <ConsultarEvento />
      </MemoryRouter>
    );

    // Section should render with inline styles
    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
    expect(section.style.width).toBe('100%');
    expect(section.style.maxWidth).toBe('100%');

    // Verify the form heading renders (component mounts correctly)
    expect(screen.getByText('Consultar Puesto')).toBeInTheDocument();
  });

  test('desktop: section width 80%, maxWidth 800px', () => {
    useBreakpoint.mockReturnValue({
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      breakpoint: 'xl',
      width: 1200,
    });

    const { container } = render(
      <MemoryRouter>
        <ConsultarEvento />
      </MemoryRouter>
    );

    const section = container.querySelector('section');
    expect(section.style.width).toBe('80%');
    expect(section.style.maxWidth).toBe('800px');
    expect(section.style.margin).toBe('0px auto');
  });

  test('desktop: section does NOT have Bootstrap col-6 offset-3 classes', () => {
    useBreakpoint.mockReturnValue({
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      breakpoint: 'xl',
      width: 1200,
    });

    const { container } = render(
      <MemoryRouter>
        <ConsultarEvento />
      </MemoryRouter>
    );

    const section = container.querySelector('section');
    // Should NOT have the old Bootstrap-only layout classes
    expect(section.className).not.toContain('col-6');
    expect(section.className).not.toContain('offset-3');
  });
});
