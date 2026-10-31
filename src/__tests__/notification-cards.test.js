import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { toast } from 'react-toastify';
import CardNotificaciones from '../components/ComponentesConsumidor/CardNotificaicones';

jest.mock('react-toastify', () => ({ toast: { error: jest.fn() } }));
const notification = { id: 8, titulo: 'Tu pedido está listo', descripcion: 'Podés retirarlo en el puesto.', estado: 'pendiente', fecha: '2026-10-31T18:00:00Z' };

afterEach(() => { jest.clearAllMocks(); });

test('marks an unread notification and reloads only after the server accepts it', async () => {
  const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue({ ok: true });
  const reload = jest.fn();
  render(<CardNotificaciones notificacion={notification} recargarComponente={reload} />);
  fireEvent.click(screen.getByRole('button', { name: /marcar como leída/i }));
  expect(screen.getByRole('button', { name: /guardando/i })).toBeDisabled();
  await waitFor(() => expect(reload).toHaveBeenCalledTimes(1));
  expect(fetchSpy).toHaveBeenCalledWith(expect.stringContaining('notificaciones/8'), expect.objectContaining({ method: 'PUT' }));
  fetchSpy.mockRestore();
});

test('keeps a failed update unread and lets the user retry', async () => {
  const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue({ ok: false });
  const reload = jest.fn();
  render(<CardNotificaciones notificacion={notification} recargarComponente={reload} />);
  fireEvent.click(screen.getByRole('button', { name: /marcar como leída/i }));
  await waitFor(() => expect(toast.error).toHaveBeenCalled());
  expect(reload).not.toHaveBeenCalled();
  expect(screen.getByRole('button', { name: /marcar como leída/i })).toBeEnabled();
  fetchSpy.mockRestore();
});

test('read notifications have no action and invalid dates are omitted', () => {
  render(<CardNotificaciones notificacion={{ ...notification, estado: 'visto', fecha: 'invalid' }} recargarComponente={jest.fn()} />);
  expect(screen.getByText('Leída')).toBeInTheDocument();
  expect(screen.queryByRole('button')).not.toBeInTheDocument();
  expect(screen.queryByText(/Invalid Date/)).not.toBeInTheDocument();
});
