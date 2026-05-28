import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock useBreakpoint
jest.mock('../useBreakpoint', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const useBreakpoint = require('../useBreakpoint').default;
const Inicio = require('../components/ComponentesConsumidor/Inicio').default;

describe('Inicio - responsive grid (Task 1.3)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('desktop: no grid overrides (unchanged)', () => {
    useBreakpoint.mockReturnValue({
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      breakpoint: 'xl',
      width: 1200,
    });

    render(<Inicio />);
    const container = screen.getByTestId('inicio-container');
    expect(container).toBeInTheDocument();
    // Desktop: no display grid, no column override
    expect(container.style.display).not.toBe('grid');
    expect(container.style.gridTemplateColumns).not.toBe('repeat(2,1fr)');
    // Content still renders
    expect(screen.getByText('Inicio')).toBeInTheDocument();
  });

  test('tablet: 2-column grid', () => {
    useBreakpoint.mockReturnValue({
      isMobile: false,
      isTablet: true,
      isDesktop: false,
      breakpoint: 'md',
      width: 800,
    });

    render(<Inicio />);
    const container = screen.getByTestId('inicio-container');
    expect(container.style.display).toBe('grid');
    expect(container.style.gridTemplateColumns).toBe('repeat(2,1fr)');
    expect(container.style.gridTemplateAreas).toBe('none');
  });

  test('mobile: flex column', () => {
    useBreakpoint.mockReturnValue({
      isMobile: true,
      isTablet: false,
      isDesktop: false,
      breakpoint: 'xs',
      width: 375,
    });

    render(<Inicio />);
    const container = screen.getByTestId('inicio-container');
    expect(container.style.display).toBe('flex');
    expect(container.style.flexDirection).toBe('column');
  });
});
