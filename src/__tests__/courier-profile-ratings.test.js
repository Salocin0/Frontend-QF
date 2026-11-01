import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import ValoracionesRepartidor, { summarizeDeliveryRatings } from '../components/ComponentesConsumidor/estadisticasPerfil/ValoracionesRepartidor';
import RepartidorComponent from '../components/ComponentesConsumidor/FormRepartidorPerfil';
import { UserContext } from '../components/ComponentesGenerales/UserContext';
jest.mock('react-router-dom', () => ({ Link: ({ children, to, ...props }) => <a href={to} {...props}>{children}</a> }));
afterEach(() => global.fetch?.mockRestore?.());
test('summarizes actual ratings excluding missing or invalid scores', () => {
  expect(summarizeDeliveryRatings([{ puntuacion: 5 }, { puntuacion: '3' }, { puntuacion: null }, { puntuacion: 0 }, { puntuacion: 7 }])).toEqual({ count: 2, average: 4, distribution: [{ score: 5, count: 1 }, { score: 4, count: 0 }, { score: 3, count: 1 }, { score: 2, count: 0 }, { score: 1, count: 0 }] });
});
test('shows average and accessible distribution from current courier ratings', async () => {
  const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue({ ok: true, json: async () => ({ data: [{ puntuacion: 5 }, { puntuacion: 4 }, { puntuacion: 5 }] }) });
  render(<ValoracionesRepartidor consumidorId={3} />);
  expect(await screen.findByText('3 calificaciones recibidas')).toBeInTheDocument();
  expect(screen.getByText('4,7', { exact: false })).toBeInTheDocument();
  const rows = within(screen.getByRole('list', { name: 'Distribución de calificaciones' })).getAllByRole('listitem');
  expect(rows).toHaveLength(5);
  expect(rows[0]).toHaveTextContent('5 estrellas2 calificaciones');
  expect(fetchMock.mock.calls[0][0]).toContain('valoracion/user/3');
});
test('rating error allows retry and shows empty state without inventing a zero rating', async () => {
  jest.spyOn(global, 'fetch').mockResolvedValueOnce({ ok: false }).mockResolvedValue({ ok: true, json: async () => ({ data: [] }) });
  render(<ValoracionesRepartidor consumidorId={3} />);
  expect(await screen.findByRole('alert')).toHaveTextContent('No pudimos cargar tus valoraciones');
  fireEvent.click(screen.getByRole('button', { name: 'Reintentar' }));
  expect(await screen.findByText('Todavía no recibiste valoraciones.', { exact: false })).toBeInTheDocument();
  expect(screen.queryByRole('list')).not.toBeInTheDocument();
});
test('courier role offers correct shortcuts and preserves confirmation handler', async () => {
  jest.spyOn(global, 'fetch').mockResolvedValue({ ok: true, json: async () => ({ data: { repartidore: { habilitado: true } } }) });
  const confirm = jest.fn();
  const setShowModal = jest.fn();
  const props = { mostrarContenidoRepartidor: true, confirmarDeshabilitarR: confirm, showModal: false, setShowModal, setMostrarContenidoRepartidor: jest.fn(), setMostrarBotonHabilitarDeNuevoR: jest.fn() };
  const wrapper = ({ children }) => <UserContext.Provider value={{ user: { consumidorId: 3, tipoUsuario: 'repartidor' } }}>{children}</UserContext.Provider>;
  const { rerender } = render(<RepartidorComponent {...props} />, { wrapper });
  expect(screen.getByRole('link', { name: 'Mis asociaciones' })).toHaveAttribute('href', '/misAsociacionesR');
  expect(screen.getByRole('link', { name: 'Pedidos asignados' })).toHaveAttribute('href', '/pedidos-asignados');
  fireEvent.click(screen.getByRole('button', { name: 'Deshabilitar rol' }));
  expect(setShowModal).toHaveBeenCalledWith(true);
  expect(confirm).not.toHaveBeenCalled();
  rerender(<RepartidorComponent {...props} showModal />);
  fireEvent.click(screen.getByRole('button', { name: 'Deshabilitar' }));
  expect(confirm).toHaveBeenCalledTimes(1);
  await waitFor(() => expect(props.setMostrarContenidoRepartidor).toHaveBeenCalledWith(true));
});
