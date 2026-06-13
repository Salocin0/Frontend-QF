import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { UserProvider } from '../components/ComponentesGenerales/UserContext';

// Mock ALL component imports used by Main.js with simple test components
// Paths are from src/__tests__/ perspective
jest.mock('../components/ComponenteRegister/ProcesoRegistro/ProcesoRegistro', () => () => <div data-testid="comp-ProcesoRegistro">ProcesoRegistro</div>);
jest.mock('../components/ComponenteRegister/RegistrarEncargado', () => () => <div data-testid="comp-RegistroEncargado">RegistroEncargado</div>);
jest.mock('../components/ComponenteRegister/RegistrarProductor', () => () => <div data-testid="comp-RegistroProductor">RegistroProductor</div>);
jest.mock('../components/ComponenteRegister/RegistrarRepartidor', () => () => <div data-testid="comp-RegistroRepartidor">RegistroRepartidor</div>);
jest.mock('../components/ComponenteRegister/SeleccionRegister', () => () => <div data-testid="comp-SeleccionRegister">SeleccionRegister</div>);
jest.mock('../components/ComponenteRepartidor/AdquirirNuevoRolR', () => () => <div data-testid="comp-AdquirirNuevoRolR">AdquirirNuevoRolR</div>);
jest.mock('../components/ComponenteRepartidor/AsociarRepartidorAEvento', () => () => <div data-testid="comp-AsociarRepartidorAEvento">AsociarRepartidorAEvento</div>);
jest.mock('../components/ComponenteRepartidor/FormDinamicoRestricciones', () => () => <div data-testid="comp-FormDinamicoRestricciones">FormDinamicoRestricciones</div>);
jest.mock('../components/ComponenteRepartidor/VerAsociacionesR', () => () => <div data-testid="comp-AsociacionesR">AsociacionesR</div>);
jest.mock('../components/ComponentesCarrito/Carrito', () => () => <div data-testid="comp-Carrito">Carrito</div>);
jest.mock('../components/ComponentesConsumidor/ConsultarUsuarioPrueba', () => () => <div data-testid="comp-ConsultarUsuarioPrueba">ConsultarUsuarioPrueba</div>);
jest.mock('../components/ComponentesConsumidor/Notificaciones', () => () => <div data-testid="comp-Notificaciones">Notificaciones</div>);
jest.mock('../components/ComponentesEPC/AdquirirNuevoRolEPC', () => () => <div data-testid="comp-AdquirirNuevoRolEPC">AdquirirNuevoRolEPC</div>);
jest.mock('../components/ComponentesEPC/AsociacionesEPC', () => () => <div data-testid="comp-AsociacionesEPC">AsociacionesEPC</div>);
jest.mock('../components/ComponentesEventos/ConsultarEvento', () => () => <div data-testid="comp-ConsultarEvento">ConsultarEvento</div>);
jest.mock('../components/ComponentesEventos/EventoPrueba', () => () => <div data-testid="comp-EventoPrueba">EventoPrueba</div>);
jest.mock('../components/ComponentesEventos/ListadoEventoUsers', () => () => <div data-testid="comp-ListadoEventosUsers">ListadoEventosUsers</div>);
jest.mock('../components/ComponentesEventos/ListadoEventosProductor', () => () => <div data-testid="comp-ListadoEventosProductor">ListadoEventosProductor</div>);
jest.mock('../components/ComponentesEventos/RegistrarEvento', () => () => <div data-testid="comp-RegistrarEvento">RegistrarEvento</div>);
jest.mock('../components/ComponentesEventos/RegistrarEvento2', () => () => <div data-testid="comp-RegistrarEvento2">RegistrarEvento2</div>);
jest.mock('../components/ComponentesEventos/RegistrarEvento3', () => () => <div data-testid="comp-RegistrarEvento3">RegistrarEvento3</div>);
jest.mock('../components/ComponentesEventos/RegistrarEvento4', () => () => <div data-testid="comp-RegistrarEvento4">RegistrarEvento4</div>);
jest.mock('../components/ComponentesEventos/RegistrarEvento5', () => () => <div data-testid="comp-RegistrarEvento5">RegistrarEvento5</div>);
jest.mock('../components/ComponentesEventos/VerSolicitudes', () => () => <div data-testid="comp-VerSolicitudesEvento">VerSolicitudesEvento</div>);
jest.mock('../components/ComponentesLandingPage/LandingPage', () => () => <div data-testid="comp-LandingPage">LandingPage</div>);
jest.mock('../components/ComponentesLogin/CambiarContraseña', () => () => <div data-testid="comp-CambiarContrasenia">CambiarContrasenia</div>);
jest.mock('../components/ComponentesLogin/HabilitarUsuario', () => () => <div data-testid="comp-HabilitarUsuario">HabilitarUsuario</div>);
jest.mock('../components/ComponentesLogin/Login', () => () => <div data-testid="comp-Login">Login</div>);
jest.mock('../components/ComponentesLogin/RecuperarContraseña', () => () => <div data-testid="comp-RecuperarContrasenia">RecuperarContrasenia</div>);
jest.mock('../components/ComponentesLogin/ValidarEmail', () => () => <div data-testid="comp-ValidarEmail">ValidarEmail</div>);
jest.mock('../components/ComponentesLogin/ValidarUsuario', () => () => <div data-testid="comp-ValidarUsuario">ValidarUsuario</div>);
jest.mock('../components/ComponentesPedido/ListadoPedidos', () => () => <div data-testid="comp-ListadoPedidos">ListadoPedidos</div>);
jest.mock('../components/ComponentesPedido/PedidosEncargado/ListadoPedidosEncargado', () => () => <div data-testid="comp-ListadoPedidosEncargado">ListadoPedidosEncargado</div>);
jest.mock('../components/ComponentesPedido/PedidosRepartidor/ListadoPedidosRepartidor', () => () => <div data-testid="comp-ListadoPedidosRepartidor">ListadoPedidosRepartidor</div>);
jest.mock('../components/ComponentesProducto/ConsultarProducto', () => () => <div data-testid="comp-ConsultarProducto">ConsultarProducto</div>);
jest.mock('../components/ComponentesProducto/ListadoProducto', () => () => <div data-testid="comp-ListadoProducto">ListadoProducto</div>);
jest.mock('../components/ComponentesProducto/ListadoProductoDeshabilitado', () => () => <div data-testid="comp-ListadoProductoDeshabilitado">ListadoProductoDeshabilitado</div>);
jest.mock('../components/ComponentesProducto/ListadoProductoUser', () => () => <div data-testid="comp-ListadoProductoUser">ListadoProductoUser</div>);
jest.mock('../components/ComponentesProducto/RegistrarProductos', () => () => <div data-testid="comp-RegistrarProductos">RegistrarProductos</div>);
jest.mock('../components/ComponentesProductorDeEventos/AdquirirNuevoRolPE', () => () => <div data-testid="comp-AdquirirNuevoRolPE">AdquirirNuevoRolPE</div>);
jest.mock('../components/ComponentesPuesto/AsociarPuestoAEvento', () => () => <div data-testid="comp-AsociarPuestoAEvento">AsociarPuestoAEvento</div>);
jest.mock('../components/ComponentesPuesto/ConsultarPuesto', () => () => <div data-testid="comp-ConsultarPuesto">ConsultarPuesto</div>);
jest.mock('../components/ComponentesPuesto/ConsultarPuestoSolicitud', () => () => <div data-testid="comp-ConsultarPuestoSolicitud">ConsultarPuestoSolicitud</div>);
jest.mock('../components/ComponentesPuesto/CrearPuesto', () => () => <div data-testid="comp-CrearNuevoPuesto">CrearNuevoPuesto</div>);
jest.mock('../components/ComponentesPuesto/ListadoPuestosEncargado', () => () => <div data-testid="comp-ListadoPuestosEncargado">ListadoPuestosEncargado</div>);
jest.mock('../components/ComponentesPuesto/ListadoPuestosUser', () => () => <div data-testid="comp-ListadoPuestosUser">ListadoPuestosUser</div>);
jest.mock('../components/ComponentesPuesto/PuestoDeshabilitados', () => () => <div data-testid="comp-ListadoPuestosDeshabilitados">ListadoPuestosDeshabilitados</div>);
jest.mock('../components/PanelesDatos/PanelEncargado/PanelEncargado', () => () => <div data-testid="comp-PanelEncargado">PanelEncargado</div>);
jest.mock('../components/PanelesDatos/PanelProductor/PanelProductor', () => () => <div data-testid="comp-PanelProductor">PanelProductor</div>);
jest.mock('../components/ComponentesGenerales/DocumentUpload', () => () => <div data-testid="comp-DocumentUpload">DocumentUpload</div>);
jest.mock('../components/ComponentesGenerales/Inicio', () => () => <div data-testid="comp-Inicio">Inicio</div>);
jest.mock('../components/ComponentesGenerales/Sidebar', () => () => <div data-testid="comp-Sidebar">Sidebar</div>);
jest.mock('../components/ComponentesEventos/Preventa', () => () => <div data-testid="comp-Preventa">Preventa</div>);

// Dynamic import AFTER mocks
let Main;
beforeAll(() => {
  Main = require('../components/ComponentesGenerales/Main').default;
});

describe('Main — route protection', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const renderRoute = (initialRoute, userValue) => {
    if (userValue) {
      localStorage.setItem('user', JSON.stringify(userValue));
    }
    return render(
      <UserProvider>
        <MemoryRouter initialEntries={[initialRoute]}>
          <Main />
        </MemoryRouter>
      </UserProvider>
    );
  };

  // ── Public routes render without auth ──
  test('public route /login renders Login component without auth', () => {
    renderRoute('/login', null);
    expect(screen.getByTestId('comp-Login')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-navigate')).not.toBeInTheDocument();
  });

  test('public route / renders LandingPage without auth', () => {
    renderRoute('/', null);
    expect(screen.getByTestId('comp-LandingPage')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-navigate')).not.toBeInTheDocument();
  });

  test('public route /seleccion-perfil renders without auth', () => {
    renderRoute('/seleccion-perfil', null);
    expect(screen.getByTestId('comp-SeleccionRegister')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-navigate')).not.toBeInTheDocument();
  });

  test('public route /registrarse/:tipoUsuario renders ProcesoRegistro without auth', () => {
    renderRoute('/registrarse/consumidor', null);
    expect(screen.getByTestId('comp-ProcesoRegistro')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-navigate')).not.toBeInTheDocument();
  });

  // ── Protected: /inicio redirects to /login when no user ──
  test('protected route /inicio redirects to /login when no user', () => {
    renderRoute('/inicio', null);
    expect(screen.getByTestId('mock-navigate')).toHaveAttribute('data-to', '/login');
    expect(screen.queryByTestId('comp-Inicio')).not.toBeInTheDocument();
  });

  // ── Protected: /inicio renders when authenticated ──
  test('protected route /inicio renders Inicio for consumidor', () => {
    renderRoute('/inicio', { tipoUsuario: 'consumidor', nombre: 'Test' });
    expect(screen.getByTestId('comp-Inicio')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-navigate')).not.toBeInTheDocument();
  });

  // ── Consumidor-exclusive: /pedidos ──
  test('protected route /pedidos redirects for wrong role (repartidor)', () => {
    renderRoute('/pedidos', { tipoUsuario: 'repartidor', nombre: 'Test' });
    expect(screen.getByTestId('mock-navigate')).toHaveAttribute('data-to', '/inicio');
    expect(screen.queryByTestId('comp-ListadoPedidos')).not.toBeInTheDocument();
  });

  test('protected route /pedidos renders for consumidor', () => {
    renderRoute('/pedidos', { tipoUsuario: 'consumidor', nombre: 'Test' });
    expect(screen.getByTestId('comp-ListadoPedidos')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-navigate')).not.toBeInTheDocument();
  });

  // ── Repartidor-exclusive ──
  test('protected route /pedidos-asignados renders for repartidor', () => {
    renderRoute('/pedidos-asignados', { tipoUsuario: 'repartidor', nombre: 'Test' });
    expect(screen.getByTestId('comp-ListadoPedidosRepartidor')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-navigate')).not.toBeInTheDocument();
  });

  // ── Productor-exclusive ──
  test('protected route /registrar-evento renders for productor', () => {
    renderRoute('/registrar-evento', { tipoUsuario: 'productor', nombre: 'Test' });
    expect(screen.getByTestId('comp-RegistrarEvento')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-navigate')).not.toBeInTheDocument();
  });

  // ── Encargado-exclusive ──
  test('protected route /crear-puesto renders for encargado', () => {
    renderRoute('/crear-puesto', { tipoUsuario: 'encargado', nombre: 'Test' });
    expect(screen.getByTestId('comp-CrearNuevoPuesto')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-navigate')).not.toBeInTheDocument();
  });
});
