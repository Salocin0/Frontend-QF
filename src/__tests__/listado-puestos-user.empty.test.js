import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';

jest.mock('../components/sass/main.scss', () => ({}), { virtual: true });
jest.mock('../components/ComponentesGenerales/PageLayout', () => ({
  __esModule: true,
  default: ({ children }) => <div data-testid="page-layout">{children}</div>,
}));
jest.mock('../components/ComponentesGenerales/Footer', () => ({
  __esModule: true,
  default: () => <div data-testid="footer" />,
}));
jest.mock('../components/ComponentesPuesto/PuestoUser', () => ({
  __esModule: true,
  default: () => <div data-testid="puesto-user" />,
}));
jest.mock('../components/ComponentesGenerales/Breadcrumb', () => ({
  __esModule: true,
  default: () => <nav />,
}));
jest.mock('../components/Filtros y Buscadores/filtersPuestosConsumidor', () => ({
  __esModule: true,
  default: () => <div />,
}));
jest.mock('../components/Filtros y Buscadores/BuscadorPuestosConsumidor', () => ({
  __esModule: true,
  default: () => <div />,
}));

const ListadoPuestosUser = require('../components/ComponentesPuesto/ListadoPuestosUser').default;

describe('ListadoPuestosUser - evento sin puestos', () => {
  beforeEach(() => {
    process.env.REACT_APP_BACK_URL = 'http://127.0.0.1:8000/';
    global.ResizeObserver = class {
      observe() {}
      disconnect() {}
    };
  });

  afterEach(() => {
    delete global.ResizeObserver;
  });

  const mockFetch = (puestosPayload, eventoPayload) => {
    global.fetch = jest.fn((url) => {
      const payload = String(url).includes('puesto/evento') ? puestosPayload : eventoPayload;
      return Promise.resolve({ json: () => Promise.resolve(payload) });
    });
  };

  test('renders the empty state (not a blank page) when the backend answers with an error payload', async () => {
    mockFetch(
      { status: 'Error', msg: 'puestos not found', data: {} },
      { status: 'success', data: { id: 9, nombre: 'Evento 9' } }
    );

    render(<ListadoPuestosUser />);

    await waitFor(() =>
      expect(screen.getByText(/No hay puestos en este momento/i)).toBeInTheDocument()
    );
  });

  test('renders the empty state when the event request returns nothing', async () => {
    mockFetch({ status: 'success', data: [] }, {});

    render(<ListadoPuestosUser />);

    await waitFor(() =>
      expect(screen.getByText(/No hay puestos en este momento/i)).toBeInTheDocument()
    );
  });

  test('renders the stands returned by the backend', async () => {
    mockFetch(
      { status: 'success', data: [{ id: 1, nombreCarro: 'Carro 1' }] },
      { status: 'success', data: { id: 1, nombre: 'Evento 1' } }
    );

    render(<ListadoPuestosUser />);

    await waitFor(() => expect(screen.getByTestId('puesto-user')).toBeInTheDocument());
  });
});
