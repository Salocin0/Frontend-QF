import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ListadoPedidosEncargado from '../components/ComponentesPedido/PedidosEncargado/ListadoPedidosEncargado';
import { UserContext } from '../components/ComponentesGenerales/UserContext';
const mockBoardMount = jest.fn();
jest.mock('../components/ComponentesGenerales/PageLayout', () => ({ children }) => <div>{children}</div>);
jest.mock('../components/ComponentesGenerales/Footer', () => () => null);
jest.mock('react-router-dom', () => ({ useParams: () => ({ id: '1' }), useLocation: () => ({ state: { id: 1, nombreCarro: 'Papas' } }), Link: ({ children, to }) => <a href={to}>{children}</a> }));
jest.mock('../components/ComponentesEPC/KanbanBoard', () => function Board() { const React = require('react'); React.useEffect(() => { mockBoardMount(); }, []); return <div>Tablero original</div>; });
const renderPanel = () => render(<UserContext.Provider value={{ user: { consumidorId: 7 } }}><ListadoPedidosEncargado /></UserContext.Provider>);
beforeEach(() => { jest.spyOn(global, 'fetch').mockResolvedValue({ json: async () => ({ data: [{ id: 1, total: 100, estado: 'Pendiente' }] }) }); });
afterEach(() => { global.fetch.mockRestore(); jest.clearAllMocks(); });

test('expands and exits without remounting the board or refetching orders', async () => {
  renderPanel();
  await screen.findByText('Tablero original');
  const button = screen.getByRole('button', { name: 'Pantalla completa' });
  fireEvent.click(button);
  expect(button).toHaveAttribute('aria-pressed', 'true');
  expect(button.closest('.qf-kanban-page')).toHaveClass('qf-kanban-page--expanded');
  fireEvent.click(screen.getByRole('button', { name: 'Salir de pantalla completa' }));
  expect(button).toHaveAttribute('aria-pressed', 'false');
  expect(mockBoardMount).toHaveBeenCalledTimes(1);
  expect(global.fetch).toHaveBeenCalledTimes(1);
});

test('Escape exits expanded view and restores focus to its control', async () => {
  renderPanel();
  await screen.findByText('Tablero original');
  fireEvent.click(screen.getByRole('button', { name: 'Pantalla completa' }));
  fireEvent.keyDown(document, { key: 'Escape' });
  expect(screen.getByRole('button', { name: 'Pantalla completa' })).toHaveFocus();
  expect(screen.getByRole('button', { name: 'Pantalla completa' })).toHaveAttribute('aria-pressed', 'false');
});
