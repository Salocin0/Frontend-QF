import React from 'react';
import { render, screen, fireEvent, within, waitFor } from '@testing-library/react';
import RegistrarEvento3 from '../components/ComponentesEventos/RegistrarEvento3';
import { UserContext } from '../components/ComponentesGenerales/UserContext';
import { toast } from 'react-toastify';
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({ useNavigate: () => mockNavigate, useLocation: () => ({ state: { eventoId: 19 } }), useParams: () => ({}) }));
jest.mock('../components/ComponentesGenerales/PageLayout', () => ({ children }) => <div>{children}</div>);
jest.mock('../components/ComponentesGenerales/Footer', () => () => null);
jest.mock('react-toastify', () => ({ toast: { success: jest.fn(), error: jest.fn() } }));
const renderPage = () => render(<UserContext.Provider value={{ user: { consumidorId: 7 } }}><RegistrarEvento3 /></UserContext.Provider>);
afterEach(() => { if (global.fetch.mockRestore) global.fetch.mockRestore(); localStorage.clear(); jest.clearAllMocks(); });

test('shows step two and preserves blocked seating and delivery choices', () => {
  renderPage();
  expect(screen.getByLabelText('Progreso del registro').querySelector('[aria-current="step"]')).toHaveTextContent('Configuración');
  const seating = within(screen.getByRole('group', { name: '¿El evento tiene butacas?*' }));
  expect(seating.getByRole('radio', { name: 'Sí' })).toBeDisabled();
  expect(seating.getByRole('radio', { name: 'No' })).toBeChecked();
  const delivery = within(screen.getByRole('group', { name: '¿El evento tiene repartidores?*' }));
  expect(delivery.getByRole('radio', { name: 'Sí' })).toBeChecked();
  expect(delivery.getByRole('radio', { name: 'No' })).toBeDisabled();
});

test('presale reveals the existing date field and daily restriction', () => {
  renderPage();
  expect(screen.queryByLabelText('¿Cuándo iniciará la preventa?*')).not.toBeInTheDocument();
  fireEvent.click(within(screen.getByRole('group', { name: 'Preventa*' })).getByRole('radio', { name: 'Sí' }));
  expect(screen.getByLabelText('¿Cuándo iniciará la preventa?*')).toBeInTheDocument();
  expect(within(screen.getByRole('group', { name: '¿La preventa será todos los días?*' })).getByRole('radio', { name: 'No' })).toBeDisabled();
});

test('saves the same draft endpoint, configuration values and next step', async () => {
  const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue({ ok: true, json: async () => ({}) });
  renderPage();
  fireEvent.change(screen.getByLabelText('Fecha Inicio Evento*'), { target: { value: '2099-01-01T10:00' } });
  fireEvent.change(screen.getByLabelText('Fecha Fin Evento*'), { target: { value: '2099-01-02T10:00' } });
  fireEvent.change(screen.getByLabelText('Capacidad Máxima'), { target: { value: '500' } });
  fireEvent.click(screen.getByRole('button', { name: 'Siguiente' }));
  await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/registrar-evento4/1', { state: { eventoId: 19 } }));
  expect(fetchMock.mock.calls[0][0]).toContain('evento/preparacion/19');
  expect(fetchMock.mock.calls[0][1].method).toBe('PUT');
  expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual(expect.objectContaining({ tienePreventa: false, conButaca: false, conRepartidor: true, capacidadMaxima: '500', cantidadDiasEvento: 1 }));
});

test('invalid chronological dates keep the existing validation and do not save', () => {
  const fetchMock = jest.spyOn(global, 'fetch');
  renderPage();
  fireEvent.change(screen.getByLabelText('Fecha Inicio Evento*'), { target: { value: '2099-01-02T10:00' } });
  fireEvent.change(screen.getByLabelText('Fecha Fin Evento*'), { target: { value: '2099-01-01T10:00' } });
  fireEvent.click(screen.getByRole('button', { name: 'Siguiente' }));
  expect(toast.error).toHaveBeenCalledWith('La fecha de fin del evento debe ser posterior a la fecha de inicio.');
  expect(fetchMock).not.toHaveBeenCalled();
});
