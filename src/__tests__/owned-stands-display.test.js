import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ListadoPuestosEncargado, { filterOwnedStands } from '../components/ComponentesPuesto/ListadoPuestosEncargado';
import PuestoEncargado from '../components/ComponentesPuesto/PuestoEncargado';
import { UserContext } from '../components/ComponentesGenerales/UserContext';
import { toast } from 'react-toastify';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({ useNavigate: () => mockNavigate, Link: ({ children, to }) => <a href={to}>{children}</a> }));
jest.mock('../components/ComponentesGenerales/PageLayout', () => ({ children }) => <div>{children}</div>);
jest.mock('../components/ComponentesGenerales/Footer', () => () => null);
jest.mock('react-toastify', () => ({ toast: { success: jest.fn(), error: jest.fn() } }));
const stand = { id: 4, nombreCarro: 'Papas Demo', numeroCarro: 12, telefonoCarro: '351111222', estado: 'Creado' };
const renderList = () => render(<UserContext.Provider value={{ user: { id: 99, consumidorId: 7, tipoUsuario: 'encargado' } }}><ListadoPuestosEncargado /></UserContext.Provider>);
afterEach(() => { if (global.fetch.mockRestore) global.fetch.mockRestore(); jest.clearAllMocks(); });

test('filters only visible stand fields and combines name with status', () => {
  const stands = [stand, { ...stand, id: 5, nombreCarro: 'Pizza', estado: 'Deshabilitado', secret: 'Papas' }];
  expect(filterOwnedStands(stands, ' PAPAS ', '')).toEqual([stand]);
  expect(filterOwnedStands(stands, 'pizza', 'Creado')).toEqual([]);
  expect(filterOwnedStands(stands, '12', 'Deshabilitado')).toHaveLength(1);
});

test('loads owned stands with consumer id and allows clearing empty search', async () => {
  const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue({ ok: true, json: async () => ({ data: [stand] }) });
  renderList();
  await screen.findByRole('heading', { name: 'Papas Demo' });
  expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('puesto/creados'), expect.objectContaining({ headers: expect.objectContaining({ ConsumidorId: 7 }) }));
  fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'sin coincidencias' } });
  expect(screen.getByText('No encontramos puestos con esos filtros')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Limpiar filtros' }));
  expect(screen.getByRole('heading', { name: 'Papas Demo' })).toBeInTheDocument();
});

test('API empty response shows onboarding without crashing', async () => {
  jest.spyOn(global, 'fetch').mockResolvedValue({ ok: false, status: 404 });
  renderList();
  expect(await screen.findByText('Tu próximo puesto empieza acá')).toBeInTheDocument();
});

test('server failure offers retry instead of pretending the owner has no stands', async () => {
  const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValueOnce({ ok: false, status: 500 }).mockResolvedValueOnce({ ok: true, json: async () => ({ data: [stand] }) });
  renderList();
  fireEvent.click(await screen.findByRole('button', { name: 'Reintentar' }));
  expect(await screen.findByRole('heading', { name: 'Papas Demo' })).toBeInTheDocument();
  expect(fetchMock).toHaveBeenCalledTimes(2);
});

test('keeps product navigation and requires confirmation to disable a stand', async () => {
  const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue({ ok: true });
  const refresh = jest.fn();
  render(<PuestoEncargado carrito={stand} actualizarListado={refresh} />);
  fireEvent.click(screen.getByRole('button', { name: 'Productos' }));
  expect(mockNavigate).toHaveBeenCalledWith('/listado-productos/4', { state: stand });
  fireEvent.click(screen.getByRole('button', { name: 'Deshabilitar puesto' }));
  expect(fetchMock).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', { name: 'Confirmar' }));
  await waitFor(() => expect(refresh).toHaveBeenCalledTimes(1));
  expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('puesto/cambiarEstado/4/deshabilitar'), { method: 'POST' });
  expect(toast.success).toHaveBeenCalled();
});
