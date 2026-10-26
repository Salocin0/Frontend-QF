import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Foody calls a paid LLM, so the floating button must not open the panel for
// anonymous visitors: it sends them to /login instead.
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('../components/ComponentesLandingPage/ChatPanel', () => ({
  __esModule: true,
  default: () => <div data-testid="chat-panel">panel</div>,
}));

import FloatingButton from '../components/ComponentesLandingPage/FloatingButton';

const renderButton = () =>
  render(
    <MemoryRouter>
      <FloatingButton />
    </MemoryRouter>
  );

describe('FloatingButton — chatbot gating', () => {
  beforeEach(() => {
    localStorage.clear();
    mockNavigate.mockClear();
  });

  test('anonymous visitor is redirected to /login and the panel never opens', () => {
    renderButton();
    fireEvent.click(screen.getByRole('button', { name: /Consultas Foody/i }));

    expect(mockNavigate).toHaveBeenCalledWith('/login');
    expect(screen.queryByTestId('chat-panel')).not.toBeInTheDocument();
  });

  test('signed-in user opens the panel', () => {
    localStorage.setItem('user', JSON.stringify({ id: 4, tipoUsuario: 'consumidor' }));
    renderButton();
    fireEvent.click(screen.getByRole('button', { name: /Consultas Foody/i }));

    expect(mockNavigate).not.toHaveBeenCalled();
    expect(screen.getByTestId('chat-panel')).toBeInTheDocument();
  });

  test('clicking again closes the panel', () => {
    localStorage.setItem('user', JSON.stringify({ id: 4, tipoUsuario: 'consumidor' }));
    renderButton();
    const button = screen.getByRole('button', { name: /Consultas Foody/i });

    fireEvent.click(button);
    expect(screen.getByTestId('chat-panel')).toBeInTheDocument();

    fireEvent.click(button);
    expect(screen.queryByTestId('chat-panel')).not.toBeInTheDocument();
  });
});
