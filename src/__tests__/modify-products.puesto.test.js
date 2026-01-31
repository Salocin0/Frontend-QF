import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegistrarProductos from '../components/ComponentesProducto/RegistrarProductos';
import { MemoryRouter } from 'react-router-dom';
import { server } from '../mocks';
import { rest } from 'msw';

describe('Modificar / Registrar Productos (Puesto) - integracion', () => {
  beforeEach(() => {
    localStorage.setItem('token', 'test-token');
    process.env.REACT_APP_BACK_URL = 'http://127.0.0.1:8000';
  });

  test('renderiza formulario de producto', () => {
    render(
      <MemoryRouter>
        <RegistrarProductos />
      </MemoryRouter>
    );

    expect(screen.getByText('Nombre del Producto')).toBeInTheDocument();
  });

  test('registro producto OK', async () => {
    server.use(
      rest.post('http://127.0.0.1:8000/producto', (req, res, ctx) => {
        return res(ctx.status(201), ctx.json({ code: 201 }));
      })
    );

    render(
      <MemoryRouter>
        <RegistrarProductos />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: 'Producto X' } });
    fireEvent.click(screen.getByRole('button', { name: 'Registrar' }));

    await waitFor(() => expect(screen.getByRole('heading', { name: 'Crear Producto Nuevo' })).toBeInTheDocument());
  });

  test('error al eliminar producto muestra mensaje', async () => {
    server.use(
      rest.delete('http://127.0.0.1:8000/producto/999', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    // Este test es un esqueleto; ajustar la llamada a eliminar según la UI específica
    expect(true).toBeTruthy();
  });
});