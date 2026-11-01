import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { UserContext } from '../components/ComponentesGenerales/UserContext';
import Chatbot from '../components/ComponentesLandingPage/ChatBot';

// Foody calls a paid LLM; these tests only assert what the UI offers, so the
// network is never touched.
const renderChat = (user) =>
  render(
    <MemoryRouter>
      <UserContext.Provider value={{ user, updateUser: () => {}, clearUser: () => {} }}>
        <Chatbot />
      </UserContext.Provider>
    </MemoryRouter>
  );

describe('Chatbot — suggested questions', () => {
  test('a signed-in user is not offered "¿Cómo me registro?"', () => {
    renderChat({ id: 4, nombre: 'Consumidor', tipoUsuario: 'consumidor' });

    expect(screen.getByRole('button', { name: /¿Qué eventos hay\?/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /¿Cómo hago un pedido\?/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /registro/i })).not.toBeInTheDocument();
  });

  test('a signed-in user is greeted by name and can type', () => {
    renderChat({ id: 4, nombre: 'Consumidor', tipoUsuario: 'consumidor' });

    expect(screen.getByText(/Hola, Consumidor/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Escribí tu consulta/i)).toBeEnabled();
  });

  test('a guest sees the login prompt and a disabled composer', () => {
    renderChat(null);

    expect(screen.getByText(/No detecto que estés logueado o registrado/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Iniciá sesión para consultarme/i)).toBeDisabled();
    expect(screen.queryByRole('button', { name: /¿Qué eventos hay\?/i })).not.toBeInTheDocument();
  });
});
