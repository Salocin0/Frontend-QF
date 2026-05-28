import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';

// Mock useBreakpoint
jest.mock('../useBreakpoint', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock CSS imports
jest.mock('../components/sass/main.scss', () => ({}), { virtual: true });

// Mock react-icons
jest.mock('react-icons/fa', () => ({
  FaEye: () => <span data-testid="fa-eye" />,
  FaEyeSlash: () => <span data-testid="fa-eye-slash" />,
}));

// Mock MUI
jest.mock('@mui/material', () => ({
  CircularProgress: () => <div data-testid="circular-progress" />,
}));

// Mock echarts-for-react
jest.mock('echarts-for-react', () => ({
  __esModule: true,
  default: () => <div data-testid="react-echarts" />,
}));

// Mock react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

const useBreakpoint = require('../useBreakpoint').default;
const GraficaBarras = require('../components/PanelesDatos/GraficaBarras').default;
const GraficaLineas = require('../components/PanelesDatos/GraficaLineas').default;
const GraficaTorta = require('../components/PanelesDatos/GraficaTorta').default;
const GraficaTortaProductos = require('../components/PanelesDatos/GraficaTortaProductos').default;

// ============================================================
// Phase 7: Charts — Responsive Tests
// ============================================================

describe('Phase 7 — Charts Responsive', () => {
  // ---- 7.1 GraficaBarras ----

  describe('7.1 GraficaBarras', () => {
    test('mobile: wrapper maxWidth 100%', async () => {
      global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ data: [{ diaevento: '2026-05-27', nombrepuesto: 'Puesto 1', totalrecaudado: '1000' }] }) }));
      useBreakpoint.mockReturnValue({
        isMobile: true, isTablet: false, isDesktop: false,
        breakpoint: 'xs', width: 375,
      });

      const { container } = render(<GraficaBarras eventId="1" />);
      const wrapper = await waitFor(() => {
        const el = container.querySelector('[data-testid="grafica-wrapper"]');
        if (!el) throw new Error('not found');
        return el;
      }, { timeout: 5000, interval: 100 });
      expect(wrapper).toBeInTheDocument();
      expect(wrapper.style.maxWidth).toBe('100%');
    });

    test('desktop: wrapper maxWidth 800px', async () => {
      global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ data: [{ diaevento: '2026-05-27', nombrepuesto: 'Puesto 1', totalrecaudado: '1000' }] }) }));
      useBreakpoint.mockReturnValue({
        isMobile: false, isTablet: false, isDesktop: true,
        breakpoint: 'xl', width: 1200,
      });

      const { container } = render(<GraficaBarras eventId="1" />);
      const wrapper = await waitFor(() => {
        const el = container.querySelector('[data-testid="grafica-wrapper"]');
        if (!el) throw new Error('not found');
        return el;
      }, { timeout: 5000, interval: 100 });
      expect(wrapper.style.maxWidth).toBe('800px');
    });

    test('renders chart with echarts component', async () => {
      global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ data: [{ diaevento: '2026-05-27', nombrepuesto: 'Puesto 1', totalrecaudado: '1000' }] }) }));
      useBreakpoint.mockReturnValue({
        isMobile: false, isTablet: false, isDesktop: true,
        breakpoint: 'xl', width: 1200,
      });

      const { container } = render(<GraficaBarras eventId="1" />);
      const echarts = await waitFor(() => {
        const el = container.querySelector('[data-testid="react-echarts"]');
        if (!el) throw new Error('not found');
        return el;
      }, { timeout: 5000, interval: 100 });
      expect(echarts).toBeInTheDocument();
    });
  });

  // ---- 7.2 GraficaLineas ----

  describe('7.2 GraficaLineas', () => {
    test('mobile: wrapper maxWidth 100%', async () => {
      global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ data: [{ diaevento: '2026-05-27', nombrepuesto: 'Puesto 1', totalrecaudado: '1000' }] }) }));
      useBreakpoint.mockReturnValue({
        isMobile: true, isTablet: false, isDesktop: false,
        breakpoint: 'xs', width: 375,
      });

      const { container } = render(<GraficaLineas eventId="1" />);
      const wrapper = await waitFor(() => {
        const el = container.querySelector('[data-testid="grafica-wrapper"]');
        if (!el) throw new Error('not found');
        return el;
      }, { timeout: 5000, interval: 100 });
      expect(wrapper).toBeInTheDocument();
      expect(wrapper.style.maxWidth).toBe('100%');
    });

    test('desktop: wrapper maxWidth 800px', async () => {
      global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ data: [{ diaevento: '2026-05-27', nombrepuesto: 'Puesto 1', totalrecaudado: '1000' }] }) }));
      useBreakpoint.mockReturnValue({
        isMobile: false, isTablet: false, isDesktop: true,
        breakpoint: 'xl', width: 1200,
      });

      const { container } = render(<GraficaLineas eventId="1" />);
      const wrapper = await waitFor(() => {
        const el = container.querySelector('[data-testid="grafica-wrapper"]');
        if (!el) throw new Error('not found');
        return el;
      }, { timeout: 5000, interval: 100 });
      expect(wrapper.style.maxWidth).toBe('800px');
    });
  });

  // ---- 7.3 GraficaTorta ----

  describe('7.3 GraficaTorta', () => {
    test('mobile: wrapper maxWidth 100%', async () => {
      global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ status: 'success', data: [{ total: '1000', nombre: 'Puesto 1' }] }) }));
      useBreakpoint.mockReturnValue({
        isMobile: true, isTablet: false, isDesktop: false,
        breakpoint: 'xs', width: 375,
      });

      const { container } = render(<GraficaTorta id="1" />);
      const wrapper = await waitFor(() => {
        const el = container.querySelector('[data-testid="grafica-wrapper"]');
        if (!el) throw new Error('not found');
        return el;
      }, { timeout: 5000, interval: 100 });
      expect(wrapper).toBeInTheDocument();
      expect(wrapper.style.maxWidth).toBe('100%');
    });

    test('desktop: wrapper maxWidth 800px', async () => {
      global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ status: 'success', data: [{ total: '1000', nombre: 'Puesto 1' }] }) }));
      useBreakpoint.mockReturnValue({
        isMobile: false, isTablet: false, isDesktop: true,
        breakpoint: 'xl', width: 1200,
      });

      const { container } = render(<GraficaTorta id="1" />);
      const wrapper = await waitFor(() => {
        const el = container.querySelector('[data-testid="grafica-wrapper"]');
        if (!el) throw new Error('not found');
        return el;
      }, { timeout: 5000, interval: 100 });
      expect(wrapper.style.maxWidth).toBe('800px');
    });
  });

  // ---- 7.4 GraficaTortaProductos ----

  describe('7.4 GraficaTortaProductos', () => {
    const mockProductos = [
      { nombre: 'Producto A', dinero: 5000 },
      { nombre: 'Producto B', dinero: 3000 },
    ];

    test('mobile: wrapper maxWidth 100%', () => {
      useBreakpoint.mockReturnValue({
        isMobile: true, isTablet: false, isDesktop: false,
        breakpoint: 'xs', width: 375,
      });

      const { container } = render(<GraficaTortaProductos productos={mockProductos} />);
      const wrapper = container.querySelector('[data-testid="grafica-wrapper"]');
      expect(wrapper).toBeInTheDocument();
      expect(wrapper.style.maxWidth).toBe('100%');
    });

    test('desktop: wrapper maxWidth 800px', () => {
      useBreakpoint.mockReturnValue({
        isMobile: false, isTablet: false, isDesktop: true,
        breakpoint: 'xl', width: 1200,
      });

      const { container } = render(<GraficaTortaProductos productos={mockProductos} />);
      const wrapper = container.querySelector('[data-testid="grafica-wrapper"]');
      expect(wrapper.style.maxWidth).toBe('800px');
    });
  });
});
