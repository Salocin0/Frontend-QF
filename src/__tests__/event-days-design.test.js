import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegistrarEvento4 from '../components/ComponentesEventos/RegistrarEvento4';
import { UserContext } from '../components/ComponentesGenerales/UserContext';
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({ useNavigate: () => mockNavigate, useLocation: () => ({ state: { eventoId: 19 } }), useParams: () => ({ diferenciaDiasEvento: '2' }) }));
jest.mock('../components/ComponentesGenerales/PageLayout', () => ({ children }) => <div>{children}</div>);
jest.mock('../components/ComponentesGenerales/Footer', () => () => null);
jest.mock('react-toastify', () => ({ toast: { success: jest.fn(), error: jest.fn() } }));
const renderPage = () => render(<UserContext.Provider value={{ user: { consumidorId: 7 } }}><RegistrarEvento4 /></UserContext.Provider>);
beforeEach(() => { localStorage.setItem('eventoDatos', JSON.stringify({ fechaInicio: '2099-01-01T10:00:00Z', fechaFin: '2099-01-03T10:00:00Z', tienePreventa: true })); });
afterEach(() => { if (global.fetch.mockRestore) global.fetch.mockRestore(); localStorage.clear(); jest.clearAllMocks(); });

test('renders one card per day and marks the third step', () => {
  renderPage();
  expect(screen.getByLabelText('Progreso del registro').querySelector('[aria-current="step"]')).toHaveTextContent('Días del evento');
  expect(screen.getByRole('heading', { name: 'Día 1' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Día 2' })).toBeInTheDocument();
  expect(screen.getByLabelText('Fecha y Hora de Inicio - Día 1*')).toBeInTheDocument();
  expect(screen.getByLabelText('Fecha y Hora de Fin - Día 2*')).toBeInTheDocument();
});

test('keeps each day editable independently and saves UTC dates to the same endpoint', async () => {
  const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue({ ok: true, json: async () => ({}) });
  renderPage();
  const first = screen.getByLabelText('Fecha y Hora de Inicio - Día 1*').value;
  fireEvent.change(screen.getByLabelText('Fecha y Hora de Inicio - Día 2*'), { target: { value: '2099-01-02T11:30' } });
  expect(screen.getByLabelText('Fecha y Hora de Inicio - Día 1*')).toHaveValue(first);
  fireEvent.click(screen.getByRole('button', { name: 'Siguiente' }));
  await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/registrar-evento5/19/2'));
  expect(fetchMock.mock.calls[0][0]).toContain('evento/preparacion/19');
  expect(fetchMock.mock.calls[0][1].method).toBe('PUT');
  const data = JSON.parse(fetchMock.mock.calls[0][1].body);
  expect(data.diferenciaDiasEvento).toBe('2');
  expect(data.diasEvento).toHaveLength(2);
  expect(data.diasEvento[1]).toEqual(expect.objectContaining({ dia: 2, horaInicio: new Date('2099-01-02T11:30').toISOString(), tienePreventa: true }));
});

test('back retains the current draft id', () => {
  renderPage();
  fireEvent.click(screen.getByRole('button', { name: 'Volver' }));
  expect(mockNavigate).toHaveBeenCalledWith('/registrar-evento3', { state: { eventoId: 19 } });
});
