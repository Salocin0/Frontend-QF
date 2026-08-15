import React from 'react';
import { render } from '@testing-library/react';

// Mock useBreakpoint to control breakpoint values independently
jest.mock('../useBreakpoint', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Dynamic import AFTER mock is set up
const useBreakpoint = require('../useBreakpoint').default;
const Sidebar = require('../components/ComponentesGenerales/Sidebar').default;

describe('Sidebar - responsive widths (Task 1.1)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Nota: el ancho responsive del sidebar se resuelve por CSS (variable
  // --qf-sidebar-width consumida en el layout), no por estilo inline en
  // este componente, así que estos tests verifican el comportamiento
  // observable por breakpoint en vez de un width inline inexistente.

  test('renders on desktop (isDesktop=true) without the mobile close button', () => {
    useBreakpoint.mockReturnValue({
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      breakpoint: 'xl',
      width: 1200,
    });

    const { container } = render(<Sidebar tipoUsuario="consumidor" onClose={() => {}} />);
    const sidebar = container.querySelector('.sidebar');
    expect(sidebar).toBeInTheDocument();
    expect(container.querySelector('.sidebar-close-btn')).not.toBeInTheDocument();
  });

  test('renders on tablet (isTablet=true) without the mobile close button', () => {
    useBreakpoint.mockReturnValue({
      isMobile: false,
      isTablet: true,
      isDesktop: false,
      breakpoint: 'md',
      width: 800,
    });

    const { container } = render(<Sidebar tipoUsuario="productor" onClose={() => {}} />);
    expect(container.querySelector('.sidebar')).toBeInTheDocument();
    expect(container.querySelector('.sidebar-close-btn')).not.toBeInTheDocument();
  });

  test('renders on mobile (isMobile=true) with the mobile close button', () => {
    useBreakpoint.mockReturnValue({
      isMobile: true,
      isTablet: false,
      isDesktop: false,
      breakpoint: 'xs',
      width: 375,
    });

    const { container } = render(<Sidebar tipoUsuario="encargado" onClose={() => {}} />);
    expect(container.querySelector('.sidebar')).toBeInTheDocument();
    expect(container.querySelector('.sidebar-close-btn')).toBeInTheDocument();
  });
});
