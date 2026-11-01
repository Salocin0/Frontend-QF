import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PedidoDetalleDialog from '../components/ComponentesEPC/PedidoDetalleDialog';
const task = { id: 'task-7', fecha: '2026-10-31T18:00:00Z', total: 3450, estado: 'EnPreparacion' };
const infoDialog = { open: true, task };
const details = { ...task, codigoEntrega: 'QF123', Consumidor: { nombre: 'Ana', apellido: 'Demo', telefono: '351123', usuario: { email: 'ana@demo.com' } }, repartidor: { Consumidor: { nombre: 'Juan', apellido: 'Demo' } }, Evento: { Productor: { nombre: 'Productor Demo' } }, detalles: [{ id: 1, cantidad: 2, precio: '1500.00', producto: { nombre: 'Papas' } }] };

test('shows the order total, status, delivery code, products and contacts in an accessible dialog', () => {
  render(<PedidoDetalleDialog infoDialog={infoDialog} detailData={details} onClose={jest.fn()} />);
  expect(screen.getByRole('dialog', { name: 'Pedido #7' })).toBeInTheDocument();
  expect(screen.getByText('En Preparacion')).toBeInTheDocument();
  expect(screen.getByText('QF123')).toBeInTheDocument();
  expect(screen.getByText('Papas')).toBeInTheDocument();
  expect(screen.getByText('2×')).toBeInTheDocument();
  expect(screen.getByText('Ana Demo')).toBeInTheDocument();
  expect(screen.getByText('Juan Demo')).toBeInTheDocument();
  expect(screen.getByText('Productor Demo')).toBeInTheDocument();
  expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
});

test('both close controls and Escape dismiss the detail', () => {
  const close = jest.fn();
  render(<PedidoDetalleDialog infoDialog={infoDialog} detailData={details} onClose={close} />);
  screen.getAllByRole('button', { name: 'Cerrar detalle' }).forEach((button) => fireEvent.click(button));
  fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape', code: 'Escape' });
  expect(close).toHaveBeenCalledTimes(3);
});

test('summary remains available while additional data loads', () => {
  render(<PedidoDetalleDialog infoDialog={infoDialog} detailData={null} onClose={jest.fn()} />);
  expect(screen.getByText('Pedido #7')).toBeInTheDocument();
  expect(screen.getByRole('status')).toHaveTextContent('Cargando información adicional');
  expect(screen.queryByText('Consumidor')).not.toBeInTheDocument();
});

test('closed detail renders nothing', () => {
  render(<PedidoDetalleDialog infoDialog={{ open: false }} detailData={null} onClose={jest.fn()} />);
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});
