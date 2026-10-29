import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Foody calls a paid LLM, so anonymous visitors must not reach the backend.
// The panel still opens (so the button does not look broken) and explains why.
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
  beforeEach(() => localStorage.clear());

  test('anonymous visitor still opens the panel (button is not broken)', () => {
    renderButton();
    fireEvent.click(screen.getByRole('button', { name: /Abrir chat con Foody/i }));
    expect(screen.getByTestId('chat-panel')).toBeInTheDocument();
  });

  test('signed-in user opens the panel', () => {
    localStorage.setItem('user', JSON.stringify({ id: 4, tipoUsuario: 'consumidor' }));
    renderButton();
    fireEvent.click(screen.getByRole('button', { name: /Abrir chat con Foody/i }));
    expect(screen.getByTestId('chat-panel')).toBeInTheDocument();
  });

  test('clicking again minimizes the panel and retains the conversation', () => {
    renderButton();
    const button = screen.getByRole('button', { name: /Abrir chat con Foody/i });

    fireEvent.click(button);
    expect(screen.getByTestId('chat-panel')).toBeInTheDocument();

    fireEvent.click(button);
    expect(screen.getByTestId('chat-panel')).not.toBeVisible();
    fireEvent.click(button);
    expect(screen.getByTestId('chat-panel')).toBeVisible();
  });
});
