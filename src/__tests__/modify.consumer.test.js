import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ConsultarUsuario from '../components/ComponentesConsumidor/ConsultarUsuario';
import { MemoryRouter } from 'react-router-dom';
import { server } from '../mocks';
import { rest } from 'msw';
import { UserContext } from '../components/ComponentesGenerales/UserContext';

describe('Modificar Usuario (Consumidor) - integracion', () => {
  beforeEach(() => {
    localStorage.setItem('sessionId', 'test-session');
    process.env.REACT_APP_BACK_URL = 'http://127.0.0.1:8000/';
  });
  beforeEach(() => {
    localStorage.setItem('sessionId', 'test-session');
  });

  test('renderiza datos actuales', async () => {
    server.use(
      rest.post('http://127.0.0.1:8000/user/session', (req, res, ctx) => {
        return res(ctx.json({ code: 200, data: { consumidorId: 1, tipoUsuario: 'Usuario' } }));
      }),
      rest.get('http://127.0.0.1:8000/consumidor/1', (req, res, ctx) => {
        return res(ctx.json({ code: 200, data: { nombre: 'Juan', apellido: '', fechaNacimiento: '', dni: '', localidad: '', telefono: '' } }));
      })
    );

    render(
      <UserContext.Provider value={{ user: { consumidorId: 1, usuario: 'test' } }}>
        <MemoryRouter>
          <ConsultarUsuario />
        </MemoryRouter>
      </UserContext.Provider>
    );

    await waitFor(() => expect(screen.getByDisplayValue('test')).toBeInTheDocument());
  });

  test('editar usuario y guardar (PATCH) - éxito', async () => {
    server.use(
      rest.post('http://127.0.0.1:8000/user/session', (req, res, ctx) => {
        return res(ctx.json({ code: 200, data: { consumidorId: 1, tipoUsuario: 'Usuario' } }));
      }),
      rest.get('http://127.0.0.1:8000/consumidor/1', (req, res, ctx) => {
        return res(ctx.json({ code: 200, data: { nombre: 'Juan', apellido: '', fechaNacimiento: '', dni: '', localidad: '', telefono: '' } }));
      }),
      rest.patch('http://127.0.0.1:8000/user/', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({ code: 200 }));
      })
    );

    render(
      <UserContext.Provider value={{ user: { consumidorId: 1, usuario: 'test' } }}>
        <MemoryRouter>
          <ConsultarUsuario />
        </MemoryRouter>
      </UserContext.Provider>
    );

    // esperar datos, editar y guardar
    await waitFor(() => expect(screen.queryByText(/Cargando/i)).not.toBeInTheDocument());
    fireEvent.click(screen.getByText('Editar'));
    const input = screen.getByLabelText('Nombre');
    fireEvent.change(input, { target: { value: 'NuevoNombre' } });
    fireEvent.click(screen.getByText('Guardar Cambios'));

    await waitFor(() => expect(screen.getByText('Editar')).toBeInTheDocument());
  });
});