import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FormPuestoEditar from '../components/ComponentesPuesto/FormPuestoEditar';
import ConsultarPuestoSolicitud from '../components/ComponentesPuesto/ConsultarPuestoSolicitud';
import { toast } from 'react-toastify';
jest.mock('react-toastify', () => ({ toast: { success: jest.fn(), error: jest.fn() } }));
jest.mock('../components/ComponentesGenerales/PageLayout', () => ({ children }) => <div>{children}</div>);
jest.mock('../components/ComponentesGenerales/Footer', () => () => null);
jest.mock('react-router-dom', () => ({ useLocation: () => ({ state: null }), useParams: () => ({ id: '1' }), Link: ({ children, to }) => <a href={to}>{children}</a> }));
const stand = { id: 1, nombreCarro: 'Puesto Cuarteto', numeroCarro: 12, tipoNegocio: 'Comida', telefonoCarro: '351123' };
afterEach(() => { if (global.fetch.mockRestore) global.fetch.mockRestore(); jest.clearAllMocks(); });

test('cancel restores the original saved fields', () => {
  render(<FormPuestoEditar carrito={stand} />);
  const name = screen.getByLabelText('Nombre Carro');
  expect(name).toBeDisabled();
  fireEvent.click(screen.getByRole('button', { name: 'Editar' }));
  fireEvent.change(name, { target: { name: 'nombreCarro', value: 'Otro' } });
  fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
  expect(name).toHaveValue('Puesto Cuarteto');
  expect(name).toBeDisabled();
});

test('save keeps the API contract without mutating the original stand', async () => {
  const original = Object.freeze({ ...stand });
  const onSaved = jest.fn();
  const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue({ ok: true });
  render(<FormPuestoEditar carrito={original} onSaved={onSaved} />);
  fireEvent.click(screen.getByRole('button', { name: 'Editar' }));
  fireEvent.change(screen.getByLabelText('Nombre Carro'), { target: { name: 'nombreCarro', value: 'Puesto nuevo' } });
  fireEvent.click(screen.getByRole('button', { name: 'Guardar' }));
  await waitFor(() => expect(onSaved).toHaveBeenCalled());
  expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({ puesto: { numeroCarro: '12', nombreCarro: 'Puesto nuevo', tipoNegocio: 'Comida', telefonoCarro: '351123' } });
  expect(original.nombreCarro).toBe('Puesto Cuarteto');
  expect(screen.getByLabelText('Nombre Carro')).toBeDisabled();
});

test('failed save keeps edited values available for retry', async () => {
  jest.spyOn(global, 'fetch').mockRejectedValue(new Error('Sin conexión'));
  render(<FormPuestoEditar carrito={stand} />);
  fireEvent.click(screen.getByRole('button', { name: 'Editar' }));
  fireEvent.change(screen.getByLabelText('Nombre Carro'), { target: { name: 'nombreCarro', value: 'Puesto nuevo' } });
  fireEvent.click(screen.getByRole('button', { name: 'Guardar' }));
  await waitFor(() => expect(toast.error).toHaveBeenCalled());
  expect(screen.getByLabelText('Nombre Carro')).toHaveValue('Puesto nuevo');
  expect(screen.getByLabelText('Nombre Carro')).toBeEnabled();
  expect(screen.getByRole('button', { name: 'Guardar' })).toBeEnabled();
});

test('opening the URL directly fetches the stand instead of relying on navigation state', async () => {
  const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue({ ok: true, json: async () => ({ data: stand }) });
  render(<ConsultarPuestoSolicitud />);
  expect(await screen.findByLabelText('Nombre Carro')).toHaveValue('Puesto Cuarteto');
  expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('puesto/consultar/1'), expect.any(Object));
});
