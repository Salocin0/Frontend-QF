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

// Mock react-router-dom hooks (keep MemoryRouter working)
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => jest.fn(),
    useParams: () => ({ id: '1' }),
  };
});

// Mock UserContext
const MockUserContext = React.createContext();
jest.mock('../components/ComponentesGenerales/UserContext', () => ({
  __esModule: true,
  UserContext: MockUserContext,
}));

// Mock react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
    info: jest.fn(),
  },
}));

// Mock react-icons
jest.mock('react-icons/fa', () => ({
  FaUser: () => <span data-testid="fa-user" />,
  FaTrash: () => <span data-testid="fa-trash" />,
  FaMinus: () => <span data-testid="fa-minus" />,
  FaPlus: () => <span data-testid="fa-plus" />,
  FaShoppingCart: () => <span data-testid="fa-cart" />,
  FaArrowRight: () => <span data-testid="fa-arrow" />,
  FaCheckCircle: () => <span data-testid="fa-check" />,
  FaCreditCard: () => <span data-testid="fa-credit-card" />,
  FaTimes: () => <span data-testid="fa-times" />,
  FaLock: () => <span data-testid="fa-lock" />,
  FaEye: () => <span data-testid="fa-eye" />,
  FaEyeSlash: () => <span data-testid="fa-eye-slash" />,
}));

// Mock child components for Preventa
jest.mock('../components/ComponentesGenerales/PageLayout', () => ({
  __esModule: true,
  default: ({ children }) => <div data-testid="page-layout">{children}</div>,
}));
jest.mock('../components/ComponentesGenerales/Footer', () => ({
  __esModule: true,
  default: () => <div data-testid="footer" />,
}));
jest.mock('../components/ComponentesEventos/CardCompraInstantanea', () => ({
  __esModule: true,
  default: ({ evento }) => <div data-testid="card-compra">{evento?.nombre || 'Compra'}</div>,
}));
jest.mock('../components/ComponentesEventos/CardPreCompra', () => ({
  __esModule: true,
  default: ({ evento }) => <div data-testid="card-precompra">{evento?.nombre || 'PreCompra'}</div>,
}));

// Mock date-fns
jest.mock('date-fns', () => ({
  format: () => '01/01/2026',
}));

// Mock image import for EventoPrueba
jest.mock('../components/ComponentesEventos/img/villa maria.png', () => 'mock-image-path', { virtual: true });

// Mock echarts-for-react for chart tests
jest.mock('echarts-for-react', () => ({
  __esModule: true,
  default: ({ option }) => <div data-testid="react-echarts">{option?.title?.text}</div>,
}));

const useBreakpoint = require('../useBreakpoint').default;
const ConfirmDialog = require('../components/ComponentesGenerales/ConfirmDialog').default;
const UserProfile = require('../components/ComponentesGenerales/UserProfile').default;
const DocumentUpload = require('../components/ComponentesGenerales/DocumentUpload').default;
const Preventa = require('../components/ComponentesEventos/Preventa').default;
const EventoPrueba = require('../components/ComponentesEventos/EventoPrueba').default;

// ============================================================
// Phase 5: Shared UI Components — Responsive Tests
// ============================================================

describe('Phase 5 — Shared UI Responsive', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ---- 5.1 ConfirmDialog ----

  describe('5.1 ConfirmDialog', () => {
    const defaultProps = {
      open: true,
      title: 'Confirmar acción',
      message: '¿Estás seguro?',
      onConfirm: jest.fn(),
      onCancel: jest.fn(),
    };

    test('mobile: positioned as bottom sheet (fixed, bottom:0, full-width)', () => {
      useBreakpoint.mockReturnValue({
        isMobile: true, isTablet: false, isDesktop: false,
        breakpoint: 'xs', width: 375,
      });

      const { container } = render(<ConfirmDialog {...defaultProps} />);

      const dialogs = container.querySelectorAll('div');
      // Find the dialog dialog div (not the backdrop). It has the conditionally styled props.
      const backdrop = dialogs[0]; // backdrop div
      const dialogDiv = dialogs[1]; // dialog content div

      expect(dialogDiv.style.position).toBe('fixed');
      expect(dialogDiv.style.bottom).toBe('0px');
      expect(dialogDiv.style.left).toBe('0px');
      expect(dialogDiv.style.width).toBe('100%');
      expect(dialogDiv.style.transform).toBe('none');
    });

    test('mobile: border-radius top only (12px 12px 0 0)', () => {
      useBreakpoint.mockReturnValue({
        isMobile: true, isTablet: false, isDesktop: false,
        breakpoint: 'xs', width: 375,
      });

      const { container } = render(<ConfirmDialog {...defaultProps} />);
      const dialogs = container.querySelectorAll('div');
      const dialogDiv = dialogs[1];

      expect(dialogDiv.style.borderRadius).toBe('12px 12px 0 0');
    });

    test('desktop: centered modal (translate transform, top 50%)', () => {
      useBreakpoint.mockReturnValue({
        isMobile: false, isTablet: false, isDesktop: true,
        breakpoint: 'xl', width: 1200,
      });

      const { container } = render(<ConfirmDialog {...defaultProps} />);
      const dialogs = container.querySelectorAll('div');
      const dialogDiv = dialogs[1];

      expect(dialogDiv.style.position).toBe('fixed');
      expect(dialogDiv.style.top).toBe('50%');
      expect(dialogDiv.style.left).toBe('50%');
      expect(dialogDiv.style.transform).toBe('translate(-50%,-50%)');
      expect(dialogDiv.style.maxWidth).toBe('400px');
    });

    test('renders title and message text', () => {
      useBreakpoint.mockReturnValue({
        isMobile: false, isTablet: false, isDesktop: true,
        breakpoint: 'xl', width: 1200,
      });

      render(<ConfirmDialog {...defaultProps} />);

      expect(screen.getByText('Confirmar acción')).toBeInTheDocument();
      expect(screen.getByText('¿Estás seguro?')).toBeInTheDocument();
    });

    test('returns null when open is false', () => {
      useBreakpoint.mockReturnValue({
        isMobile: false, isTablet: false, isDesktop: true,
        breakpoint: 'xl', width: 1200,
      });

      const { container } = render(<ConfirmDialog {...defaultProps} open={false} />);
      expect(container.firstChild).toBeNull();
    });
  });

  // ---- 5.2 UserProfile ----

  describe('5.2 UserProfile', () => {
    const mockUser = {
      id: 1,
      usuario: 'testuser',
      email: 'test@test.com',
      tipoUsuario: 'Consumidor',
      consumidorId: 1,
    };

    const wrapper = ({ children }) => (
      <MemoryRouter>
        <MockUserContext.Provider value={{ user: mockUser, updateUser: jest.fn() }}>
          {children}
        </MockUserContext.Provider>
      </MemoryRouter>
    );

    test('mobile: navItem position relative, bottom auto, width 100%', () => {
      useBreakpoint.mockReturnValue({
        isMobile: true, isTablet: false, isDesktop: false,
        breakpoint: 'xs', width: 375,
      });

      const { container } = render(<UserProfile haveRol={false} />, { wrapper });

      const li = container.querySelector('[data-testid="user-profile-nav"]');
      expect(li).toBeInTheDocument();
      expect(li.style.position).toBe('relative');
      expect(li.style.width).toBe('100%');
    });

    test('desktop: navItem position absolute, bottom 70px, width 85%', () => {
      useBreakpoint.mockReturnValue({
        isMobile: false, isTablet: false, isDesktop: true,
        breakpoint: 'xl', width: 1200,
      });

      const { container } = render(<UserProfile haveRol={false} />, { wrapper });

      const li = container.querySelector('[data-testid="user-profile-nav"]');
      expect(li.style.position).toBe('absolute');
      expect(li.style.bottom).toBe('70px');
      expect(li.style.width).toBe('85%');
    });

    test('renders Mi Perfil text', () => {
      useBreakpoint.mockReturnValue({
        isMobile: false, isTablet: false, isDesktop: true,
        breakpoint: 'xl', width: 1200,
      });

      render(<UserProfile haveRol={false} />, { wrapper });

      expect(screen.getByText('Mi Perfil')).toBeInTheDocument();
      expect(screen.getByText('Cerrar Sesión')).toBeInTheDocument();
    });
  });

  // ---- 5.3 DocumentUpload ----

  describe('5.3 DocumentUpload', () => {
    test('mobile: document upload container width 100%', () => {
      useBreakpoint.mockReturnValue({
        isMobile: true, isTablet: false, isDesktop: false,
        breakpoint: 'xs', width: 375,
      });

      const { container } = render(<DocumentUpload />);

      // The outermost div that wraps the input should have conditional width
      const wrapperDiv = container.querySelector('div');
      expect(wrapperDiv).toBeInTheDocument();
      expect(wrapperDiv.style.width).toBe('100%');
    });

    test('desktop: document upload container width auto', () => {
      useBreakpoint.mockReturnValue({
        isMobile: false, isTablet: false, isDesktop: true,
        breakpoint: 'xl', width: 1200,
      });

      const { container } = render(<DocumentUpload />);

      const wrapperDiv = container.querySelector('div');
      expect(wrapperDiv.style.width).toBe('auto');
    });

    test('renders title and file input', () => {
      useBreakpoint.mockReturnValue({
        isMobile: false, isTablet: false, isDesktop: true,
        breakpoint: 'xl', width: 1200,
      });

      const { container } = render(<DocumentUpload />);

      expect(screen.getByText('Cargar y Descargar Documento')).toBeInTheDocument();
      const fileInput = container.querySelector('input[type="file"]');
      expect(fileInput).toBeInTheDocument();
    });
  });

  // ---- 5.4 Preventa ----

  describe('5.4 Preventa', () => {
    test('mobile: option cards grid 1 column', () => {
      useBreakpoint.mockReturnValue({
        isMobile: true, isTablet: false, isDesktop: false,
        breakpoint: 'xs', width: 375,
      });

      const { container } = render(
        <MemoryRouter>
          <MockUserContext.Provider value={{ user: { consumidorId: 1, tipoUsuario: 'Consumidor' } }}>
            <Preventa />
          </MockUserContext.Provider>
        </MemoryRouter>
      );

      const gridContainer = container.querySelector('[data-testid="preventa-cards-grid"]');
      expect(gridContainer).toBeInTheDocument();
      expect(gridContainer.style.gridTemplateColumns).toBe('1fr');
    });

    test('tablet: option cards grid 2 columns', () => {
      useBreakpoint.mockReturnValue({
        isMobile: false, isTablet: true, isDesktop: false,
        breakpoint: 'md', width: 800,
      });

      const { container } = render(
        <MemoryRouter>
          <MockUserContext.Provider value={{ user: { consumidorId: 1, tipoUsuario: 'Consumidor' } }}>
            <Preventa />
          </MockUserContext.Provider>
        </MemoryRouter>
      );

      const gridContainer = container.querySelector('[data-testid="preventa-cards-grid"]');
      expect(gridContainer.style.gridTemplateColumns).toBe('repeat(2, 1fr)');
    });

    test('desktop: option cards grid 3 columns', () => {
      useBreakpoint.mockReturnValue({
        isMobile: false, isTablet: false, isDesktop: true,
        breakpoint: 'xl', width: 1200,
      });

      const { container } = render(
        <MemoryRouter>
          <MockUserContext.Provider value={{ user: { consumidorId: 1, tipoUsuario: 'Consumidor' } }}>
            <Preventa />
          </MockUserContext.Provider>
        </MemoryRouter>
      );

      const gridContainer = container.querySelector('[data-testid="preventa-cards-grid"]');
      expect(gridContainer.style.gridTemplateColumns).toBe('repeat(3, 1fr)');
    });
  });

  // ---- 5.5 EventoPrueba ----

  describe('5.5 EventoPrueba', () => {
    const mockSession = { tipoUsuario: 'Consumidor' };

    test('mobile: event sections stacked (flexDirection column)', () => {
      useBreakpoint.mockReturnValue({
        isMobile: true, isTablet: false, isDesktop: false,
        breakpoint: 'xs', width: 375,
      });

      const { container } = render(
        <MemoryRouter>
          <EventoPrueba session={mockSession} />
        </MemoryRouter>
      );

      // The main card container (div with col-md-7) should have flex column on mobile
      const cardContainer = container.querySelector('[data-testid="evento-prueba-container"]');
      expect(cardContainer).toBeInTheDocument();
      expect(cardContainer.style.flexDirection).toBe('column');
    });

    test('desktop: event sections in row layout', () => {
      useBreakpoint.mockReturnValue({
        isMobile: false, isTablet: false, isDesktop: true,
        breakpoint: 'xl', width: 1200,
      });

      const { container } = render(
        <MemoryRouter>
          <EventoPrueba session={mockSession} />
        </MemoryRouter>
      );

      const cardContainer = container.querySelector('[data-testid="evento-prueba-container"]');
      expect(cardContainer.style.flexDirection).toBe('row');
    });

    test('renders event name and city', () => {
      useBreakpoint.mockReturnValue({
        isMobile: false, isTablet: false, isDesktop: true,
        breakpoint: 'xl', width: 1200,
      });

      render(
        <MemoryRouter>
          <EventoPrueba session={mockSession} />
        </MemoryRouter>
      );

      expect(screen.getByText('Festival Internacional de Peñas')).toBeInTheDocument();
      expect(screen.getByText('Villa María')).toBeInTheDocument();
    });
  });
});
