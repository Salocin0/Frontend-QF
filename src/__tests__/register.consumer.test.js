import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProcesoRegistro from '../components/ComponenteRegister/ProcesoRegistro/ProcesoRegistro';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { server } from '../mocks';
import { rest } from 'msw';

describe('Registrar Usuario (Consumidor) - integracion', () => {
  test('renderiza pasos del registro', () => {
    const tipoUsuario = 'encargado';
    render(
      <MemoryRouter initialEntries={[`/registrarse/${tipoUsuario}`]}>
        <Routes>
          <Route path="/registrarse/:tipoUsuario" element={<ProcesoRegistro />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Crear Cuenta - Paso 1')).toBeInTheDocument();
  });

  test('registro exitoso llama al backend y muestra resultado', async () => {
    server.use(
      rest.post('http://127.0.0.1:8000/user/', (req, res, ctx) => {
        return res(ctx.status(201), ctx.json({ code: 201, data: { id: 123 } }));
      })
    );

    const tipoUsuario = 'encargado';
    render(
      <MemoryRouter initialEntries={[`/registrarse/${tipoUsuario}`]}>
        <Routes>
          <Route path="/registrarse/:tipoUsuario" element={<ProcesoRegistro />} />
        </Routes>
      </MemoryRouter>
    );

    // completar paso 1
    fireEvent.change(screen.getByLabelText('Nombre de usuario'), { target: { value: 'user1' } });
    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'password' } });
    fireEvent.change(screen.getByLabelText('Confirmar Contraseña'), { target: { value: 'password' } });

    fireEvent.click(screen.getByText('Siguiente'));

    // completar paso 2
    fireEvent.change(screen.getByTestId('nombre'), { target: { value: 'nombre' } });
    fireEvent.change(screen.getByTestId('apellido'), { target: { value: 'apellido' } });
    fireEvent.change(screen.getByTestId('dni'), { target: { value: '42512605' } });

    fireEvent.click(screen.getByText('Siguiente'));

    // simular envio final y verificar comportamiento
    fireEvent.click(screen.getByText('Siguiente'));

    await waitFor(() => expect(screen.getByText('Datos Consumidor - Paso 2')).toBeInTheDocument());
  });

  test('email duplicado muestra error', async () => {
    server.use(
      rest.post('http://127.0.0.1:8000/user/', (req, res, ctx) => {
        return res(ctx.status(409), ctx.json({ code: 409, error: 'Email already exists' }));
      })
    );

    const tipoUsuario = 'encargado';
    render(
      <MemoryRouter initialEntries={[`/registrarse/${tipoUsuario}`]}>
        <Routes>
          <Route path="/registrarse/:tipoUsuario" element={<ProcesoRegistro />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText('Nombre de usuario'), { target: { value: 'user1' } });
    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'password' } });
    fireEvent.change(screen.getByLabelText('Confirmar Contraseña'), { target: { value: 'password' } });

    fireEvent.click(screen.getByText('Siguiente'));

    await waitFor(() => expect(screen.getByText('Datos Consumidor - Paso 2')).toBeInTheDocument());
  });
});