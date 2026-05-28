import React, { useContext } from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { UserContext } from '../components/ComponentesGenerales/UserContext';

// Mock leaflet PNG/CSS imports (virtual modules not handled by Jest config)
jest.mock('leaflet/dist/images/marker-icon-2x.png', () => 'mock-icon-2x', { virtual: true });
jest.mock('leaflet/dist/images/marker-icon.png', () => 'mock-icon', { virtual: true });
jest.mock('leaflet/dist/images/marker-shadow.png', () => 'mock-shadow', { virtual: true });
jest.mock('leaflet/dist/leaflet.css', () => ({}), { virtual: true });

// Mock heavy external deps
jest.mock('leaflet', () => ({
  Icon: { Default: { prototype: { _getIconUrl: () => {} }, mergeOptions: jest.fn() } },
}));

jest.mock('react-leaflet', () => ({
  MapContainer: ({ children }) => <div data-testid="map-container">{children}</div>,
  TileLayer: () => <div data-testid="tile-layer" />,
  Marker: () => <div data-testid="marker" />,
  useMap: () => ({ setView: jest.fn(), getZoom: () => 14 }),
  useMapEvents: () => null,
}));

jest.mock('react-toastify', () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

jest.mock('../components/ComponentesGenerales/PageLayout', () => ({
  __esModule: true,
  default: ({ children, sidebarProps }) => (
    <div data-testid="page-layout" data-sidebar-props={JSON.stringify(sidebarProps)}>
      {children}
    </div>
  ),
}));

jest.mock('../components/ComponentesGenerales/Footer', () => ({
  __esModule: true,
  default: () => <div data-testid="footer" />,
}));

jest.mock('../components/ComponentesGenerales/Breadcrumb', () => ({
  __esModule: true,
  default: ({ items }) => <div data-testid="breadcrumb" data-items={JSON.stringify(items)} />,
}));

jest.mock('../useBreakpoint', () => ({
  __esModule: true,
  default: () => ({ isMobile: false, isTablet: false, isDesktop: true, breakpoint: 'xl', width: 1200 }),
}));

// Load RegistrarEvento5 AFTER mocks are set up
const RegistrarEvento5 = require('../components/ComponentesEventos/RegistrarEvento5').default;

describe('RegistrarEvento5 - sidebarProps fix (Task 1.2)', () => {
  beforeEach(() => {
    localStorage.setItem('sessionId', 'test-session');
  });

  afterEach(() => {
    localStorage.clear();
  });

  test('passes tipoUsuario from UserContext to PageLayout sidebarProps', () => {
    const mockUser = { tipoUsuario: 'productor', consumidorId: 1, nombre: 'Test' };

    render(
      <MemoryRouter>
        <UserContext.Provider value={{ user: mockUser, updateUser: jest.fn() }}>
          <RegistrarEvento5 />
        </UserContext.Provider>
      </MemoryRouter>
    );

    const pageLayout = screen.getByTestId('page-layout');
    const sidebarProps = JSON.parse(pageLayout.getAttribute('data-sidebar-props'));
    expect(sidebarProps.tipoUsuario).toBe('productor');
  });

  test('passes undefined tipoUsuario when user is null (no crash)', () => {
    render(
      <MemoryRouter>
        <UserContext.Provider value={{ user: null, updateUser: jest.fn() }}>
          <RegistrarEvento5 />
        </UserContext.Provider>
      </MemoryRouter>
    );

    const pageLayout = screen.getByTestId('page-layout');
    const sidebarProps = JSON.parse(pageLayout.getAttribute('data-sidebar-props'));
    expect(sidebarProps.tipoUsuario).toBeUndefined();
  });
});
