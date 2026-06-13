import React, { useContext } from 'react';
import { render, screen, act } from '@testing-library/react';
import { UserContext, UserProvider } from '../components/ComponentesGenerales/UserContext';

// Helper component to interact with UserContext in tests
const TestConsumer = ({ onContext }) => {
  const ctx = useContext(UserContext);
  React.useEffect(() => { if (onContext) onContext(ctx); }, [ctx, onContext]);
  return (
    <div>
      <span data-testid="user-value">{ctx.user ? ctx.user.tipoUsuario || JSON.stringify(ctx.user) : 'null'}</span>
      <button data-testid="clear-btn" onClick={() => ctx.clearUser()}>Clear</button>
      <button data-testid="update-btn" onClick={() => ctx.updateUser({ tipoUsuario: 'consumidor', nombre: 'Test' })}>Update</button>
    </div>
  );
};

describe('UserContext — clearUser', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  // ── RED: clearUser sets user to null and removes from localStorage ──
  test('clearUser sets user to null and removes from localStorage', () => {
    // First set a user via localStorage
    localStorage.setItem('user', JSON.stringify({ tipoUsuario: 'consumidor', nombre: 'Test' }));

    render(
      <UserProvider>
        <TestConsumer />
      </UserProvider>
    );

    // User should be loaded from localStorage
    expect(screen.getByTestId('user-value')).toHaveTextContent('consumidor');

    // Call clearUser
    act(() => {
      screen.getByTestId('clear-btn').click();
    });

    // User should be null
    expect(screen.getByTestId('user-value')).toHaveTextContent('null');
    // localStorage should be cleared
    expect(localStorage.getItem('user')).toBeNull();
  });

  // ── TRIANGULATE: clearUser when user is already null (no-op) ──
  test('clearUser when user is already null does not error', () => {
    render(
      <UserProvider>
        <TestConsumer />
      </UserProvider>
    );

    // User starts as null (no localStorage)
    expect(screen.getByTestId('user-value')).toHaveTextContent('null');

    // Calling clearUser should not error
    act(() => {
      screen.getByTestId('clear-btn').click();
    });

    // Still null
    expect(screen.getByTestId('user-value')).toHaveTextContent('null');
    expect(localStorage.getItem('user')).toBeNull();
  });

  // ── TRIANGULATE: updateUser still works after clearUser ──
  test('updateUser still works after clearUser', () => {
    render(
      <UserProvider>
        <TestConsumer />
      </UserProvider>
    );

    // Set user
    act(() => {
      screen.getByTestId('update-btn').click();
    });
    expect(screen.getByTestId('user-value')).toHaveTextContent('consumidor');
    expect(localStorage.getItem('user')).not.toBeNull();

    // Clear
    act(() => {
      screen.getByTestId('clear-btn').click();
    });
    expect(screen.getByTestId('user-value')).toHaveTextContent('null');

    // Set again
    act(() => {
      screen.getByTestId('update-btn').click();
    });
    expect(screen.getByTestId('user-value')).toHaveTextContent('consumidor');
    expect(localStorage.getItem('user')).not.toBeNull();
  });

  // ── clearUser is exposed in context value ──
  test('clearUser is available in context value', () => {
    let capturedCtx = null;
    render(
      <UserProvider>
        <TestConsumer onContext={(ctx) => { capturedCtx = ctx; }} />
      </UserProvider>
    );
    expect(capturedCtx).not.toBeNull();
    expect(typeof capturedCtx.clearUser).toBe('function');
    expect(typeof capturedCtx.updateUser).toBe('function');
    expect(capturedCtx.user).toBeNull();
  });
});
