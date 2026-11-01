import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ConsultarProducto from '../components/ComponentesProducto/ConsultarProducto';
import RegistrarProductos from '../components/ComponentesProducto/RegistrarProductos';
import ListadoProductoDeshabilitado from '../components/ComponentesProducto/ListadoProductoDeshabilitado';
import ListadoProducto from '../components/ComponentesProducto/ListadoProducto';
import Producto from '../components/ComponentesProducto/Producto';
import { UserContext } from '../components/ComponentesGenerales/UserContext';
import { toast } from 'react-toastify';
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({ useNavigate: () => mockNavigate, useParams: () => ({ id: '4' }), useLocation: () => ({ state: { nombreCarro: 'Papas Demo' } }), Link: ({ children, to, className }) => <a href={to} className={className}>{children}</a> }));
jest.mock('../components/ComponentesGenerales/PageLayout', () => ({ children }) => <div>{children}</div>);
jest.mock('../components/ComponentesGenerales/Footer', () => () => null);
jest.mock('react-toastify', () => ({ toast: { success: jest.fn(), error: jest.fn() } }));
const wrapper = ({ children }) => <UserContext.Provider value={{ user: { consumidorId: 7 } }}>{children}</UserContext.Provider>;
afterEach(() => { if (global.fetch.mockRestore) global.fetch.mockRestore(); jest.clearAllMocks(); });

test.each([['false', false], ['true', true]])('register sends actual availability %s and prevents duplicate requests', async (selected, expected) => {
  let resolve;
  const fetchMock = jest.spyOn(global, 'fetch').mockImplementation(() => new Promise((done) => { resolve = done; }));
  const readerSpy = jest.spyOn(FileReader.prototype, 'readAsDataURL').mockImplementation(function () { Object.defineProperty(this, 'result', { value: 'data:image/png;base64,AAAA' }); this.onload(); });
  render(<RegistrarProductos />, { wrapper });
  fireEvent.change(screen.getByLabelText('Nombre del Producto'), { target: { value: 'Papas' } });
  fireEvent.change(screen.getByLabelText('Precio'), { target: { value: '1500' } });
  fireEvent.change(screen.getByLabelText('Descripción'), { target: { value: 'Papas grandes' } });
  fireEvent.change(screen.getByLabelText('Aderezos'), { target: { value: 'Sin aderezos' } });
  fireEvent.change(screen.getByLabelText('Imagen del producto'), { target: { files: [new File(['image'], 'papas.png', { type: 'image/png' })] } });
  fireEvent.change(screen.getByLabelText('Disponibilidad'), { target: { value: selected } });
  expect(screen.getByAltText('Vista previa del producto')).toBeInTheDocument();
  const button = screen.getByRole('button', { name: 'Registrar' });
  fireEvent.click(button);
  fireEvent.click(button);
  expect(fetchMock).toHaveBeenCalledTimes(1);
  expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual(expect.objectContaining({ nombre: 'Papas', estado: expected, precio: 1500, puestoId: 4 }));
  resolve({ ok: true, json: async () => ({ code: 200 }) });
  await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/listado-productos/4', expect.any(Object)));
  readerSpy.mockRestore();
});

test('listing tolerates an empty API payload and provides a create link', async () => {
  jest.spyOn(global, 'fetch').mockResolvedValue({ ok: true, json: async () => ({ data: {} }) });
  render(<ListadoProducto />, { wrapper });
  expect(await screen.findByText('Todavía no agregaste productos')).toBeInTheDocument();
  expect(screen.getAllByRole('link', { name: /agregar producto/i })[0]).toHaveAttribute('href', '/registrar-productos/4');
});

test('failed disable action reports the error and retains the product', async () => {
  jest.spyOn(global, 'fetch').mockResolvedValue({ ok: false });
  const reload = jest.fn();
  render(<Producto producto={{ id: 8, nombre: 'Papas', precio: 1500 }} recargar={reload} />, { wrapper });
  fireEvent.click(screen.getByRole('button', { name: 'Deshabilitar' }));
  fireEvent.click(screen.getByRole('button', { name: 'Confirmar' }));
  await waitFor(() => expect(toast.error).toHaveBeenCalled());
  expect(reload).not.toHaveBeenCalled();
  expect(screen.getByRole('button', { name: 'Deshabilitar' })).toBeEnabled();
});

const existingProduct = { id: 4, puestoId: 1, nombre: 'Papas', descripcion: 'Papas grandes', aderezos: 'Mayonesa', precio: 1500, estado: true };
test('edit form starts read-only and cancel restores all original values', async () => {
  jest.spyOn(global, 'fetch').mockResolvedValue({ ok: true, json: async () => ({ data: existingProduct }) });
  render(<ConsultarProducto />, { wrapper });
  const name = await screen.findByLabelText('Nombre');
  expect(name).toBeDisabled();
  expect(screen.getByRole('link', { name: 'Volver' })).toHaveAttribute('href', '/listado-productos/1');
  fireEvent.click(screen.getByRole('button', { name: 'Editar' }));
  expect(name).toBeEnabled();
  fireEvent.change(name, { target: { name: 'nombre', value: 'Otro nombre' } });
  fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
  expect(name).toHaveValue('Papas');
  expect(name).toBeDisabled();
});

test('edit saves typed price and boolean status with existing product details', async () => {
  const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValueOnce({ ok: true, json: async () => ({ data: existingProduct }) }).mockResolvedValueOnce({ ok: true });
  render(<ConsultarProducto />, { wrapper });
  fireEvent.click(await screen.findByRole('button', { name: 'Editar' }));
  fireEvent.change(screen.getByLabelText('Precio'), { target: { name: 'precio', value: '0' } });
  fireEvent.change(screen.getByLabelText('Estado'), { target: { name: 'estado', value: 'false' } });
  fireEvent.click(screen.getByRole('button', { name: 'Guardar Cambios' }));
  await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/listado-productos/1'));
  const body = JSON.parse(fetchMock.mock.calls[1][1].body);
  expect(body.producto).toEqual({ ...existingProduct, precio: 0, estado: false });
});

test('disabled listing enables a product through the existing endpoint and refreshes the list', async () => {
  const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValueOnce({ ok: true, json: async () => ({ data: [{ id: 8, nombre: 'Pizza', descripcion: 'Mozzarella', precio: 1500 }] }) }).mockResolvedValueOnce({ ok: true }).mockResolvedValueOnce({ ok: true, json: async () => ({ data: [] }) });
  render(<ListadoProductoDeshabilitado />, { wrapper });
  fireEvent.click(await screen.findByRole('button', { name: 'Habilitar' }));
  expect(await screen.findByText('No tenés productos deshabilitados')).toBeInTheDocument();
  expect(fetchMock.mock.calls[0][0]).toContain('producto/4/deshabilitados');
  expect(fetchMock.mock.calls[1][0]).toContain('producto/8/habilitar');
  expect(fetchMock.mock.calls[1][1].method).toBe('PUT');
  expect(screen.getByRole('link', { name: 'Ver productos habilitados' })).toHaveAttribute('href', '/listado-productos/4');
});

test('disabled listing differentiates empty search and allows clearing it', async () => {
  jest.spyOn(global, 'fetch').mockResolvedValue({ ok: true, json: async () => ({ data: [{ id: 8, nombre: 'Pizza', precio: 1500 }] }) });
  render(<ListadoProductoDeshabilitado />, { wrapper });
  await screen.findByRole('heading', { name: 'Pizza' });
  fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'papas' } });
  expect(screen.getByText('No encontramos ese producto')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Limpiar búsqueda' }));
  expect(screen.getByRole('heading', { name: 'Pizza' })).toBeInTheDocument();
});
