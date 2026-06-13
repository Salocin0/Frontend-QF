import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, Navigate } from 'react-router-dom';
import { UserContext } from '../components/ComponentesGenerales/UserContext';
import PrivateRoute from '../components/ComponentesGenerales/PrivateRoute';

const renderWithContext = (ui, { userValue = null } = {}) => {
  const Wrapper = ({ children }) => (
    <UserContext.Provider value={{ user: userValue, updateUser: jest.fn() }}>
      {children}
    </UserContext.Provider>
  );
  return render(ui, { wrapper: Wrapper });
};

describe('PrivateRoute', () => {
  // ── S1: No auth → /login ──
  test('S1: redirects to /login when user is null (no auth)', () => {
    const TestApp = () => (
      <MemoryRouter initialEntries={['/inicio']}>
        <Routes>
          <Route
            path="/inicio"
            element={
              <PrivateRoute requiredRoles={['consumidor']}>
                <div>Inicio Page</div>
              </PrivateRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );
    renderWithContext(<TestApp />, { userValue: null });
    const navEl = screen.getByTestId('mock-navigate');
    expect(navEl).toHaveAttribute('data-to', '/login');
    expect(navEl).toHaveAttribute('data-replace', 'true');
    expect(screen.queryByText('Inicio Page')).not.toBeInTheDocument();
  });

  // ── S1: user without tipoUsuario → /login ──
  test('S1: redirects to /login when user has no tipoUsuario (empty object)', () => {
    const TestApp = () => (
      <MemoryRouter initialEntries={['/inicio']}>
        <Routes>
          <Route
            path="/inicio"
            element={
              <PrivateRoute requiredRoles={['consumidor']}>
                <div>Inicio Page</div>
              </PrivateRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );
    renderWithContext(<TestApp />, { userValue: {} });
    const navEl = screen.getByTestId('mock-navigate');
    expect(navEl).toHaveAttribute('data-to', '/login');
    expect(screen.queryByText('Inicio Page')).not.toBeInTheDocument();
  });

  // ── S2: Auth válida → render ──
  test('S2: renders children when user has matching role', () => {
    const TestApp = () => (
      <MemoryRouter initialEntries={['/inicio']}>
        <Routes>
          <Route
            path="/inicio"
            element={
              <PrivateRoute requiredRoles={['consumidor']}>
                <div>Inicio Page</div>
              </PrivateRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );
    renderWithContext(<TestApp />, { userValue: { tipoUsuario: 'consumidor', nombre: 'Test' } });
    expect(screen.getByText('Inicio Page')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-navigate')).not.toBeInTheDocument();
  });

  // ── S4: Rol incorrecto → /inicio ──
  test('S4: redirects to /inicio when user role does not match requiredRoles', () => {
    const TestApp = () => (
      <MemoryRouter initialEntries={['/pedidos-asignados']}>
        <Routes>
          <Route
            path="/pedidos-asignados"
            element={
              <PrivateRoute requiredRoles={['repartidor']}>
                <div>Pedidos Asignados</div>
              </PrivateRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );
    renderWithContext(<TestApp />, { userValue: { tipoUsuario: 'consumidor' } });
    const navEl = screen.getByTestId('mock-navigate');
    expect(navEl).toHaveAttribute('data-to', '/inicio');
    expect(screen.queryByText('Pedidos Asignados')).not.toBeInTheDocument();
  });

  // ── S5: Rol correcto exacto → render ──
  test('S5: renders children for exact role match', () => {
    const TestApp = () => (
      <MemoryRouter initialEntries={['/pedidos-asignados']}>
        <Routes>
          <Route
            path="/pedidos-asignados"
            element={
              <PrivateRoute requiredRoles={['repartidor']}>
                <div>Pedidos Asignados</div>
              </PrivateRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );
    renderWithContext(<TestApp />, { userValue: { tipoUsuario: 'repartidor' } });
    expect(screen.getByText('Pedidos Asignados')).toBeInTheDocument();
  });

  // ── S6: Multi-rol incluye al usuario → render ──
  test('S6: renders children when user role is in multi-role array', () => {
    const TestApp = () => (
      <MemoryRouter initialEntries={['/inicio']}>
        <Routes>
          <Route
            path="/inicio"
            element={
              <PrivateRoute requiredRoles={['consumidor', 'repartidor', 'encargado', 'productor']}>
                <div>Inicio Dashboard</div>
              </PrivateRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );
    renderWithContext(<TestApp />, { userValue: { tipoUsuario: 'consumidor' } });
    expect(screen.getByText('Inicio Dashboard')).toBeInTheDocument();
  });

  // ── TRIANGULATE: another role in multi-role array ──
  test('S6 triangulate: renders children for encargado in multi-role array', () => {
    const TestApp = () => (
      <MemoryRouter initialEntries={['/inicio']}>
        <Routes>
          <Route
            path="/inicio"
            element={
              <PrivateRoute requiredRoles={['consumidor', 'repartidor', 'encargado', 'productor']}>
                <div>Inicio Dashboard</div>
              </PrivateRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );
    renderWithContext(<TestApp />, { userValue: { tipoUsuario: 'encargado' } });
    expect(screen.getByText('Inicio Dashboard')).toBeInTheDocument();
  });

  // ── TRIANGULATE: productor in multi-role ──
  test('S6 triangulate: renders children for productor in multi-role array', () => {
    const TestApp = () => (
      <MemoryRouter initialEntries={['/inicio']}>
        <Routes>
          <Route
            path="/inicio"
            element={
              <PrivateRoute requiredRoles={['consumidor', 'repartidor', 'encargado', 'productor']}>
                <div>Inicio Dashboard</div>
              </PrivateRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );
    renderWithContext(<TestApp />, { userValue: { tipoUsuario: 'productor' } });
    expect(screen.getByText('Inicio Dashboard')).toBeInTheDocument();
  });

  // ── edge: custom redirectTo prop ──
  test('uses custom redirectTo path when provided', () => {
    const TestApp = () => (
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route
            path="/protected"
            element={
              <PrivateRoute requiredRoles={['admin']} redirectTo="/custom-login">
                <div>Protected</div>
              </PrivateRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );
    renderWithContext(<TestApp />, { userValue: null });
    const navEl = screen.getByTestId('mock-navigate');
    expect(navEl).toHaveAttribute('data-to', '/custom-login');
  });

  // ── edge: no requiredRoles → renders children ──
  test('renders children when no requiredRoles specified', () => {
    const TestApp = () => (
      <MemoryRouter initialEntries={['/inicio']}>
        <Routes>
          <Route
            path="/inicio"
            element={
              <PrivateRoute>
                <div>Inicio Page</div>
              </PrivateRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );
    renderWithContext(<TestApp />, { userValue: { tipoUsuario: 'consumidor' } });
    expect(screen.getByText('Inicio Page')).toBeInTheDocument();
  });
});
