import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { toast } from 'react-toastify';
import CheckoutAll from '../components/ComponentesCarrito/CheckoutAll';

jest.mock('react-toastify', () => ({ toast: { success: jest.fn(), error: jest.fn() } }));
// The payment sheet (Stripe) is replaced by buttons that drive the callbacks CheckoutAll relies on.
jest.mock('../components/ComponentesCarrito/DialogWithPatmentSheet', () => (props) => (
  <div role="dialog" aria-label="Pago">
    <button type="button" onClick={() => props.onCartCheckoutReady({ checkoutId: 'chk_1' })}>sheet-ready</button>
    <button type="button" onClick={() => props.onCartCheckoutReady({ checkoutId: 'chk_1', paid: true })}>sheet-already-paid</button>
    <button type="button" onClick={() => props.handleCloseCompra()}>sheet-paid</button>
    <button type="button" onClick={() => props.onClose()}>sheet-close</button>
  </div>
));

const KEY = 'qf-cart-checkout-4';
const json = (ok, body) => ({ ok, json: async () => body });
let onComplete;
let onLockChange;

const renderCheckout = (props = {}) => render(<CheckoutAll consumerId={4} disabled={false} onComplete={onComplete} onLockChange={onLockChange} {...props} />);
const buy = () => screen.getByRole('button', { name: /Comprar todo|Retomar compra|Completar compra|Registrando/ });

beforeEach(() => {
  process.env.REACT_APP_BACK_URL = 'http://api';
  sessionStorage.clear();
  onComplete = jest.fn();
  onLockChange = jest.fn();
});
afterEach(() => { if (global.fetch.mockRestore) global.fetch.mockRestore(); jest.clearAllMocks(); });

test('the buy button is disabled while the cart groups are not ready', () => {
  renderCheckout({ disabled: true });
  expect(buy()).toBeDisabled();
});

test('happy path: pay, register the orders once, clear the stored checkout and refresh the cart', async () => {
  const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue(json(true, { orderIds: [152], amount: 1495000 }));
  renderCheckout();
  fireEvent.click(buy());
  fireEvent.click(screen.getByText('sheet-ready'));
  expect(sessionStorage.getItem(KEY)).toBe('chk_1');
  fireEvent.click(screen.getByText('sheet-paid'));
  await waitFor(() => expect(onComplete).toHaveBeenCalledTimes(1));
  expect(fetchMock).toHaveBeenCalledTimes(1);
  expect(fetchMock).toHaveBeenCalledWith('http://api/payment-sheet/cart/chk_1/complete', { method: 'POST', headers: { ConsumidorId: 4 } });
  expect(toast.success).toHaveBeenCalledWith('Todos tus pedidos quedaron registrados');
  expect(sessionStorage.getItem(KEY)).toBeNull();
  expect(screen.getByRole('button', { name: 'Comprar todo' })).toBeInTheDocument();
});

test('locks the cart while paying and releases it after the purchase', async () => {
  jest.spyOn(global, 'fetch').mockResolvedValue(json(true, {}));
  renderCheckout();
  expect(onLockChange).toHaveBeenLastCalledWith(false);
  fireEvent.click(buy());
  expect(onLockChange).toHaveBeenLastCalledWith(true);
  fireEvent.click(screen.getByText('sheet-ready'));
  fireEvent.click(screen.getByText('sheet-paid'));
  await waitFor(() => expect(onLockChange).toHaveBeenLastCalledWith(false));
});

test('if registering fails after paying, it explains that no second charge will happen and can be retried', async () => {
  const fetchMock = jest.spyOn(global, 'fetch')
    .mockResolvedValueOnce(json(false, { error: 'El pago todavía no está confirmado' }))
    .mockResolvedValue(json(true, {}));
  renderCheckout();
  fireEvent.click(buy());
  fireEvent.click(screen.getByText('sheet-ready'));
  fireEvent.click(screen.getByText('sheet-paid'));
  expect(await screen.findByRole('alert')).toHaveTextContent('El pago todavía no está confirmado Reintentá completar la compra; no se hará otro cobro.');
  expect(onComplete).not.toHaveBeenCalled();
  expect(sessionStorage.getItem(KEY)).toBe('chk_1');
  const retry = screen.getByRole('button', { name: 'Completar compra' });
  fireEvent.click(retry);
  await waitFor(() => expect(onComplete).toHaveBeenCalledTimes(1));
  expect(fetchMock).toHaveBeenCalledTimes(2);
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
});

test('a network failure while registering is reported and keeps the paid checkout for a retry', async () => {
  jest.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Failed to fetch')).mockResolvedValue(json(true, {}));
  renderCheckout();
  fireEvent.click(buy());
  fireEvent.click(screen.getByText('sheet-ready'));
  fireEvent.click(screen.getByText('sheet-paid'));
  expect(await screen.findByRole('alert')).toHaveTextContent('no se hará otro cobro');
  fireEvent.click(screen.getByRole('button', { name: 'Completar compra' }));
  await waitFor(() => expect(onComplete).toHaveBeenCalledTimes(1));
});

test('a rejected response without error text still gives a readable message', async () => {
  jest.spyOn(global, 'fetch').mockResolvedValue(json(false, {}));
  renderCheckout();
  fireEvent.click(buy());
  fireEvent.click(screen.getByText('sheet-ready'));
  fireEvent.click(screen.getByText('sheet-paid'));
  expect(await screen.findByRole('alert')).toHaveTextContent('No pudimos registrar los pedidos todavía.');
});

test('double clicking the retry button registers the orders only once', async () => {
  let release;
  const fetchMock = jest.spyOn(global, 'fetch').mockImplementation(() => new Promise((resolve) => { release = () => resolve(json(true, {})); }));
  renderCheckout();
  fireEvent.click(buy());
  fireEvent.click(screen.getByText('sheet-ready'));
  fireEvent.click(screen.getByText('sheet-paid'));
  fireEvent.click(screen.getByRole('button', { name: /Registrando/ }));
  fireEvent.click(screen.getByRole('button', { name: /Registrando/ }));
  expect(fetchMock).toHaveBeenCalledTimes(1);
  await act(async () => { release(); });
  await waitFor(() => expect(onComplete).toHaveBeenCalledTimes(1));
});

test('closing the payment sheet before paying discards the checkout so the cart can be edited', () => {
  renderCheckout();
  fireEvent.click(buy());
  fireEvent.click(screen.getByText('sheet-ready'));
  expect(sessionStorage.getItem(KEY)).toBe('chk_1');
  fireEvent.click(screen.getByText('sheet-close'));
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(sessionStorage.getItem(KEY)).toBeNull();
  expect(screen.getByRole('button', { name: 'Comprar todo' })).toBeInTheDocument();
});

test('a checkout that was already paid is registered automatically when the sheet reports it', async () => {
  const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue(json(true, {}));
  renderCheckout();
  fireEvent.click(buy());
  fireEvent.click(screen.getByText('sheet-already-paid'));
  await waitFor(() => expect(onComplete).toHaveBeenCalledTimes(1));
  expect(fetchMock).toHaveBeenCalledTimes(1);
});

test('after reloading the page an unfinished checkout is offered as "Retomar compra", even if the cart is not ready', () => {
  sessionStorage.setItem(KEY, 'chk_9');
  renderCheckout({ disabled: true });
  expect(buy()).toBeEnabled();
  expect(buy()).toHaveTextContent('Retomar compra');
  expect(onLockChange).toHaveBeenLastCalledWith(true);
});

test('checkouts are stored per consumer', () => {
  sessionStorage.setItem('qf-cart-checkout-5', 'chk_other');
  renderCheckout();
  expect(buy()).toHaveTextContent('Comprar todo');
});
