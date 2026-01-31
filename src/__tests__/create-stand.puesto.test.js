import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CrearPuesto from '../components/ComponentesPuesto/CrearPuesto';
import { MemoryRouter } from 'react-router-dom';
import { server } from '../mocks';
import { rest } from 'msw';

describe('Crear Puesto de comida - integracion', () => {
  beforeEach(() => {
    localStorage.setItem('token', 'test-token');
    process.env.REACT_APP_BACK_URL = 'http://127.0.0.1:8000';
  });

  test('form y creación exitosa', async () => {
    server.use(
      rest.post('http://127.0.0.1:8000/puesto', (req, res, ctx) => {
        return res(ctx.status(201), ctx.json({ code: 201, data: { id: 10 } }));
      })
    );

    render(
      <MemoryRouter>
        <CrearPuesto />
      </MemoryRouter>
    );

    expect(screen.getByText('Crear un Puesto')).toBeInTheDocument();
  });
});