import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { UserContext } from '../components/ComponentesGenerales/UserContext';
import Chatbot from '../components/ComponentesLandingPage/ChatBot';

const renderChat = (user = { id: 4, nombre: 'Ana', tipoUsuario: 'consumidor' }) =>
  render(
    <MemoryRouter>
      <UserContext.Provider value={{ user }}>
        <Chatbot />
      </UserContext.Provider>
    </MemoryRouter>
  );

// Replaces fetch for one test. setupTests installs a console.error spy, so we must
// not call jest.restoreAllMocks() here: it would break that spy's afterAll cleanup.
const mockFetch = (impl) => {
  const original = global.fetch;
  global.fetch = jest.fn(impl);
  return () => {
    global.fetch = original;
  };
};

const ask = (text) => {
  const input = screen.getByPlaceholderText(/Escribí tu consulta/i);
  fireEvent.change(input, { target: { value: text } });
  fireEvent.click(screen.getByRole('button', { name: /Enviar/i }));
};

describe('Chatbot — message rendering', () => {
  test('renders the event link as a clickable anchor', async () => {
    const restore = mockFetch(async () => ({
      ok: true,
      json: async () => ({
        status: 'Activo',
        data: { chat_response: 'Mirá [Cosquín Rock](https://qf.app/listado-puestos/10).' },
      }),
    }));

    renderChat();
    ask('que eventos hay?');

    const link = await screen.findByRole('link', { name: 'Cosquín Rock' });
    expect(link).toHaveAttribute('href', 'https://qf.app/listado-puestos/10');
    restore();
  });

  test('renders markdown bold as styled <strong> instead of raw asterisks', async () => {
    const restore = mockFetch(async () => ({
      ok: true,
      json: async () => ({
        status: 'Activo',
        data: { chat_response: '## Detalles\n- **Fecha**: 27 de octubre\n- **Lugar**: Villa María' },
      }),
    }));

    renderChat();
    ask('detalles?');

    await waitFor(() => {
      const text = document.body.textContent;
      expect(text).toContain('Fecha');
      expect(text).not.toContain('**');
      expect(text).not.toContain('##');
    });

    // Bold is real styling now, not stripped text.
    const bold = await screen.findByText('Fecha');
    expect(bold.tagName).toBe('STRONG');
    restore();
  });

  test('renders bullets as a real list', async () => {
    const restore = mockFetch(async () => ({
      ok: true,
      json: async () => ({
        status: 'Activo',
        data: { chat_response: '- Choripán: 3500\n- Empanada: 1200' },
      }),
    }));

    renderChat();
    ask('que hay?');

    await waitFor(() => {
      const items = document.querySelectorAll('li');
      expect(items.length).toBeGreaterThanOrEqual(2);
    });
    restore();
  });

  test('sends the message with & and + intact (URLSearchParams encoding)', async () => {
    const restore = mockFetch(async () => ({
      ok: true,
      json: async () => ({ status: 'Activo', data: { chat_response: 'ok' } }),
    }));

    renderChat();
    ask('musica & comida 2+2');

    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    const body = global.fetch.mock.calls[0][1].body;
    expect(body.get('userMessage')).toBe('musica & comida 2+2');
    restore();
  });

  test('shows the backend error message instead of failing silently', async () => {
    const restore = mockFetch(async () => ({
      ok: false,
      status: 429,
      json: async () => ({ msg: 'Demasiadas consultas seguidas.' }),
    }));

    renderChat();
    ask('hola');

    expect(await screen.findByText(/Demasiadas consultas seguidas/i)).toBeInTheDocument();
    restore();
  });

  test('guest sees the greeting with login and register links', () => {
    renderChat(null);

    expect(screen.getByText(/Soy Foody/i)).toBeInTheDocument();
    expect(screen.getByText(/No detecto que estés logueado o registrado/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /loguearte/i })).toHaveAttribute('href', '/login');
    expect(screen.getByRole('link', { name: /crearte una cuenta/i })).toHaveAttribute(
      'href',
      '/seleccion-perfil'
    );
  });

  test('guest cannot send: input is disabled and no request is made', () => {
    const restore = mockFetch(async () => ({ ok: true, json: async () => ({}) }));

    renderChat(null);

    const input = screen.getByPlaceholderText(/Iniciá sesión para consultarme/i);
    expect(input).toBeDisabled();
    expect(screen.getByRole('button', { name: /Enviar/i })).toBeDisabled();
    expect(global.fetch).not.toHaveBeenCalled();

    restore();
  });
});
