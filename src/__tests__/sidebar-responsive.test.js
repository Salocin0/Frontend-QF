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

  test('renders width 250px on desktop (isDesktop=true)', () => {
    useBreakpoint.mockReturnValue({
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      breakpoint: 'xl',
      width: 1200,
    });

    const { container } = render(<Sidebar tipoUsuario="consumidor" />);
    const sidebar = container.querySelector('.sidebar');
    expect(sidebar).toBeInTheDocument();
    expect(sidebar.style.width).toBe('250px');
  });

  test('renders width 200px on tablet (isTablet=true)', () => {
    useBreakpoint.mockReturnValue({
      isMobile: false,
      isTablet: true,
      isDesktop: false,
      breakpoint: 'md',
      width: 800,
    });

    const { container } = render(<Sidebar tipoUsuario="productor" />);
    const sidebar = container.querySelector('.sidebar');
    expect(sidebar.style.width).toBe('200px');
  });

  test('renders width 100% on mobile (isMobile=true)', () => {
    useBreakpoint.mockReturnValue({
      isMobile: true,
      isTablet: false,
      isDesktop: false,
      breakpoint: 'xs',
      width: 375,
    });

    const { container } = render(<Sidebar tipoUsuario="encargado" />);
    const sidebar = container.querySelector('.sidebar');
    expect(sidebar.style.width).toBe('100%');
  });
});
