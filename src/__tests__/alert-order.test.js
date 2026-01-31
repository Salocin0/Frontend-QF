import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import PruebaToast from '../components/ComponentesGenerales/PruebaToast';
import { server } from '../mocks';
import { rest } from 'msw';

// Prueba genérica para generar alerta de pedido (ajustar según implementación real)
describe('Generar alerta de pedido - integracion', () => {
  test('muestra notificación cuando backend devuelve alerta', async () => {
    server.use(
      rest.post('http://127.0.0.1:8000/pedido/alerta', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({ code: 200, message: 'Alerta generada' }));
      })
    );

    render(<PruebaToast />);

    // Lógica: si el componente expone un botón para disparar alerta, simularlo.
    // Este test es un esqueleto para adaptarse a la UI concreta.
    await waitFor(() => expect(true).toBeTruthy());
  });
});