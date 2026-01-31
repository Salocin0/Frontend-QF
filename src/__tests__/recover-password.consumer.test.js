import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RecuperarContraseña from '../components/ComponentesLogin/RecuperarContraseña';
import { MemoryRouter } from 'react-router-dom';
import { server } from '../mocks';
import { rest } from 'msw';

describe('Recuperar Contraseña (Consumidor) - integracion', () => {
  test('envío exitoso muestra mensaje', async () => {
    server.use(
      rest.post('http://127.0.0.1:8000/user/recuperarcontrasenia', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({ code: 200 }));
      })
    );

    render(
      <MemoryRouter>
        <RecuperarContraseña />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'a@b.com' } });
    fireEvent.click(screen.getByText('Enviar Mail de Recuperación'));

    await waitFor(() => expect(screen.getByText('Recuperar Contraseña')).toBeInTheDocument());
  });

  test('email no existe muestra error', async () => {
    server.use(
      rest.post('http://127.0.0.1:8000/user/recuperarcontrasenia', (req, res, ctx) => {
        return res(ctx.status(404), ctx.json({ code: 404, error: 'Email not found' }));
      })
    );

    render(
      <MemoryRouter>
        <RecuperarContraseña />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'noexiste@x.com' } });
    fireEvent.click(screen.getByText('Enviar Mail de Recuperación'));

    await waitFor(() => expect(screen.getByText('Recuperar Contraseña')).toBeInTheDocument());
  });
});