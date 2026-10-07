import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';

jest.mock('../useBreakpoint', () => ({
  __esModule: true,
  default: () => ({ isMobile: false, isTablet: false, isDesktop: true, breakpoint: 'lg', width: 1200 }),
}));
jest.mock('../components/sass/main.scss', () => ({}), { virtual: true });
jest.mock('../components/ComponentesGenerales/PageLayout', () => ({
  __esModule: true,
  default: ({ children }) => <div>{children}</div>,
}));
jest.mock('../components/ComponentesGenerales/Footer', () => ({ __esModule: true, default: () => <div /> }));
jest.mock('../components/ComponentesGenerales/Breadcrumb', () => ({ __esModule: true, default: () => <nav /> }));

const RegistrarEvento2 = require('../components/ComponentesEventos/RegistrarEvento2').default;

const KEY = 'eventoCreacionId';

const mockFetch = (eventoResponse) => {
  global.fetch = jest.fn((url) => {
    if (String(url).includes('georef')) {
      return Promise.resolve({ json: () => Promise.resolve({ provincias: [] }) });
    }
    return eventoResponse();
  });
};

describe('RegistrarEvento2 - saved draft handling', () => {
  beforeEach(() => {
    process.env.REACT_APP_BACK_URL = 'http://127.0.0.1:8000/';
    localStorage.clear();
    localStorage.setItem(KEY, '19');
  });

  test('offers continue/discard for an unfinished draft and does not prefill until chosen', async () => {
    mockFetch(() =>
      Promise.resolve({ json: () => Promise.resolve({ data: { id: 19, nombre: 'Mi borrador', estado: 'EnPreparacion2' } }) })
    );
    render(<RegistrarEvento2 />);

    expect(await screen.findByText(/Tenés un borrador sin terminar/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Nombre Del Evento/i).value).toBe('');

    fireEvent.click(screen.getByText('Continuar borrador'));
    expect(screen.getByLabelText(/Nombre Del Evento/i).value).toBe('Mi borrador');
    expect(localStorage.getItem(KEY)).toBe('19');
  });

  test('"Empezar uno nuevo" discards the stored draft id', async () => {
    mockFetch(() =>
      Promise.resolve({ json: () => Promise.resolve({ data: { id: 19, nombre: 'Mi borrador', estado: 'EnPreparacion1' } }) })
    );
    render(<RegistrarEvento2 />);

    fireEvent.click(await screen.findByText('Empezar uno nuevo'));
    expect(localStorage.getItem(KEY)).toBeNull();
    expect(screen.queryByText(/Tenés un borrador sin terminar/i)).not.toBeInTheDocument();
  });

  test('a completed event (EnPreparacion) is not offered as draft and its id is dropped', async () => {
    mockFetch(() =>
      Promise.resolve({ json: () => Promise.resolve({ data: { id: 19, nombre: 'Completo', estado: 'EnPreparacion' } }) })
    );
    render(<RegistrarEvento2 />);

    await waitFor(() => expect(localStorage.getItem(KEY)).toBeNull());
    expect(screen.queryByText(/Tenés un borrador sin terminar/i)).not.toBeInTheDocument();
  });

  test('an orphan id (event not found) is dropped', async () => {
    mockFetch(() => Promise.resolve({ json: () => Promise.resolve({ status: 'Error', data: {} }) }));
    render(<RegistrarEvento2 />);

    await waitFor(() => expect(localStorage.getItem(KEY)).toBeNull());
  });

  test('a failed draft check discards the stale id instead of reusing it', async () => {
    mockFetch(() => Promise.reject(new Error('network')));
    render(<RegistrarEvento2 />);

    await waitFor(() => expect(localStorage.getItem(KEY)).toBeNull());
  });
});
