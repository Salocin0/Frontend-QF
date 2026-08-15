import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Mock useBreakpoint
jest.mock('../useBreakpoint', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock react-router-dom
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => jest.fn(),
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
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock react-icons
jest.mock('react-icons/fa', () => ({
  FaTrash: () => <span data-testid="fa-trash" />,
  FaMinus: () => <span data-testid="fa-minus" />,
  FaPlus: () => <span data-testid="fa-plus" />,
  FaShoppingCart: () => <span data-testid="fa-cart" />,
  FaArrowRight: () => <span data-testid="fa-arrow" />,
  FaCheckCircle: () => <span data-testid="fa-check" />,
  FaCreditCard: () => <span data-testid="fa-credit-card" />,
  FaTimes: () => <span data-testid="fa-times" />,
  FaLock: () => <span data-testid="fa-lock" />,
}));

// Mock MUI
jest.mock('@mui/material', () => {
  const actual = jest.requireActual('@mui/material');
  return {
    ...actual,
    Dialog: ({ open, onClose, fullScreen, children, maxWidth, fullWidth }) => (
      <div data-testid="mui-dialog" data-fullscreen={fullScreen} data-maxwidth={maxWidth} data-fullwidth={fullWidth}>
        {children}
      </div>
    ),
    DialogContent: ({ children, style }) => (
      <div data-testid="mui-dialog-content" style={style}>{children}</div>
    ),
    CircularProgress: () => <div data-testid="circular-progress" />,
  };
});

// Mock Stripe
jest.mock('@stripe/react-stripe-js', () => ({
  useStripe: () => null,
  useElements: () => null,
  CardElement: () => <div data-testid="card-element" />,
  Elements: ({ children }) => <div data-testid="stripe-elements">{children}</div>,
}));
jest.mock('@stripe/stripe-js', () => ({
  loadStripe: () => Promise.resolve({}),
}));

// Mock DialogWithPatmentSheet (will be tested separately)
jest.mock('../components/ComponentesCarrito/DialogWithPatmentSheet', () => ({
  __esModule: true,
  default: ({ isOpen, onClose }) => (
    <div data-testid="dialog-with-payment">{isOpen ? 'open' : 'closed'}</div>
  ),
}));

const useBreakpoint = require('../useBreakpoint').default;
const RenderizarTarjeta = require('../components/ComponentesCarrito/Tarjeta').default;
const PaymentSheet = require('../components/ComponentesCarrito/PaymentSheet').default;

// ---- Test Data ----
const mockProductos = [
  {
    producto: {
      id: 1,
      nombre: 'Hamburguesa',
      precio: 1500,
      puestoId: 10,
      img: null,
      puesto: { nombreCarro: 'Puesto 1' },
      aderezos: [],
    },
    cantidad: 2,
    productoId: 1,
    fecha: '2026-05-27',
    eventoId: 1,
    evento: { id: 1, nombre: 'Festival' },
  },
];

// ============================================================
// Phase 6: Payment Components — Responsive Tests
// ============================================================

// Tarjeta mide su propio ancho (container query) con ResizeObserver en vez
// de leer el width de useBreakpoint, así que para simular mobile/desktop
// hay que controlar el ancho que reporta el contenedor medido.
const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
const mockContainerWidth = (width) => {
  Element.prototype.getBoundingClientRect = jest.fn(() => ({
    width, height: 0, top: 0, left: 0, right: width, bottom: 0, x: 0, y: 0, toJSON: () => {},
  }));
};

describe('Phase 6 — Payment Responsive', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
  });

  const mockUser = {
    id: 1,
    usuario: 'testuser',
    email: 'test@test.com',
    consumidorId: 1,
  };

  const paymentWrapper = ({ children }) => (
    <MemoryRouter>
      <MockUserContext.Provider value={{ user: mockUser, updateUser: jest.fn() }}>
        {children}
      </MockUserContext.Provider>
    </MemoryRouter>
  );

  // ---- 6.1 Tarjeta (RenderizarTarjeta) ----

  describe('6.1 Tarjeta', () => {
    const defaultProps = {
      productos: mockProductos,
      recargarComponente: jest.fn(),
      evento: { id: 1, nombre: 'Festival' },
    };

    test('mobile: contentWrapper flexDirection column', () => {
      useBreakpoint.mockReturnValue({
        isMobile: true, isTablet: false, isDesktop: false,
        breakpoint: 'xs', width: 375,
      });
      mockContainerWidth(375);

      const { container } = render(
        <RenderizarTarjeta {...defaultProps} />,
        { wrapper: paymentWrapper }
      );

      const contentWrapper = container.querySelector('[data-testid="cart-content-wrapper"]');
      expect(contentWrapper).toBeInTheDocument();
      expect(contentWrapper.style.flexDirection).toBe('column');
    });

    test('mobile: rightSection width 100%', () => {
      useBreakpoint.mockReturnValue({
        isMobile: true, isTablet: false, isDesktop: false,
        breakpoint: 'xs', width: 375,
      });
      mockContainerWidth(375);

      const { container } = render(
        <RenderizarTarjeta {...defaultProps} />,
        { wrapper: paymentWrapper }
      );

      const rightSection = container.querySelector('[data-testid="cart-right-section"]');
      expect(rightSection).toBeInTheDocument();
      expect(rightSection.style.width).toBe('100%');
    });

    test('mobile: productCard flexDirection column', () => {
      useBreakpoint.mockReturnValue({
        isMobile: true, isTablet: false, isDesktop: false,
        breakpoint: 'xs', width: 375,
      });
      mockContainerWidth(375);

      const { container } = render(
        <RenderizarTarjeta {...defaultProps} />,
        { wrapper: paymentWrapper }
      );

      const productCard = container.querySelector('[data-testid="cart-product-card"]');
      expect(productCard).toBeInTheDocument();
      expect(productCard.style.flexDirection).toBe('column');
    });

    test('desktop: contentWrapper flexDirection row', () => {
      useBreakpoint.mockReturnValue({
        isMobile: false, isTablet: false, isDesktop: true,
        breakpoint: 'xl', width: 1200,
      });
      mockContainerWidth(1200);

      const { container } = render(
        <RenderizarTarjeta {...defaultProps} />,
        { wrapper: paymentWrapper }
      );

      const contentWrapper = container.querySelector('[data-testid="cart-content-wrapper"]');
      expect(contentWrapper.style.flexDirection).toBe('row');
    });

    test('desktop: rightSection width 320px', () => {
      useBreakpoint.mockReturnValue({
        isMobile: false, isTablet: false, isDesktop: true,
        breakpoint: 'xl', width: 1200,
      });
      mockContainerWidth(1200);

      const { container } = render(
        <RenderizarTarjeta {...defaultProps} />,
        { wrapper: paymentWrapper }
      );

      const rightSection = container.querySelector('[data-testid="cart-right-section"]');
      expect(rightSection.style.width).toBe('320px');
    });

    test('renders product name and price', () => {
      useBreakpoint.mockReturnValue({
        isMobile: false, isTablet: false, isDesktop: true,
        breakpoint: 'xl', width: 1200,
      });
      mockContainerWidth(1200);

      render(
        <RenderizarTarjeta {...defaultProps} />,
        { wrapper: paymentWrapper }
      );

      expect(screen.getByText('Hamburguesa')).toBeInTheDocument();
      expect(screen.getByText('$1500 c/u')).toBeInTheDocument();
    });
  });

  // ---- 6.3 PaymentSheet ----

  describe('6.3 PaymentSheet', () => {
    const defaultProps = {
      handleCloseCompra: jest.fn(),
      handleClose: jest.fn(),
      amount: 150000,
      clientSecret: 'pi_test_secret',
      paymentIntent: 'pi_test_secret',
    };

    test('mobile: payment container maxWidth 100%', () => {
      useBreakpoint.mockReturnValue({
        isMobile: true, isTablet: false, isDesktop: false,
        breakpoint: 'xs', width: 375,
      });

      const { container } = render(
        <PaymentSheet {...defaultProps} />,
        { wrapper: paymentWrapper }
      );

      const paymentContainer = container.querySelector('[data-testid="payment-sheet-container"]');
      expect(paymentContainer).toBeInTheDocument();
      expect(paymentContainer.style.maxWidth).toBe('100%');
    });

    test('desktop: payment container maxWidth 450px', () => {
      useBreakpoint.mockReturnValue({
        isMobile: false, isTablet: false, isDesktop: true,
        breakpoint: 'xl', width: 1200,
      });

      const { container } = render(
        <PaymentSheet {...defaultProps} />,
        { wrapper: paymentWrapper }
      );

      const paymentContainer = container.querySelector('[data-testid="payment-sheet-container"]');
      expect(paymentContainer.style.maxWidth).toBe('450px');
    });

    test('renders Pago Seguro title', () => {
      useBreakpoint.mockReturnValue({
        isMobile: false, isTablet: false, isDesktop: true,
        breakpoint: 'xl', width: 1200,
      });

      render(
        <PaymentSheet {...defaultProps} />,
        { wrapper: paymentWrapper }
      );

      expect(screen.getByText('Pago Seguro')).toBeInTheDocument();
    });
  });
});
