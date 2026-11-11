import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('../useBreakpoint', () => ({ __esModule: true, default: () => ({ isMobile: false, isTablet: false, isDesktop: true, breakpoint: 'xl' }) }));
jest.mock('../components/ComponentesGenerales/Sidebar', () => () => <nav>sidebar</nav>);
jest.mock('../components/ComponentesLandingPage/FloatingButton', () => () => null);

const PageLayout = require('../components/ComponentesGenerales/PageLayout').default;
const layout = (container) => container.querySelector('.page-layout');

describe('PageLayout — the desktop sidebar keeps its collapsed state across pages', () => {
  beforeEach(() => localStorage.clear());

  test('collapsing the sidebar is remembered by the next page (menu links reload the page)', () => {
    const first = render(<PageLayout><p>Eventos</p></PageLayout>);
    expect(layout(first.container)).not.toHaveClass('page-layout--collapsed');
    fireEvent.click(screen.getByRole('button', { name: 'Colapsar sidebar' }));
    expect(layout(first.container)).toHaveClass('page-layout--collapsed');
    first.unmount();

    const next = render(<PageLayout><p>Pedidos</p></PageLayout>);
    expect(layout(next.container)).toHaveClass('page-layout--collapsed');
    expect(screen.getByRole('button', { name: 'Expandir sidebar' })).toBeInTheDocument();
  });

  test('expanding it again is remembered too', () => {
    localStorage.setItem('qf-sidebar-collapsed', 'true');
    const first = render(<PageLayout><p>Eventos</p></PageLayout>);
    fireEvent.click(screen.getByRole('button', { name: 'Expandir sidebar' }));
    first.unmount();
    const next = render(<PageLayout><p>Pedidos</p></PageLayout>);
    expect(layout(next.container)).not.toHaveClass('page-layout--collapsed');
  });

  test('without a saved preference it starts expanded, as before', () => {
    const { container } = render(<PageLayout><p>Inicio</p></PageLayout>);
    expect(layout(container)).not.toHaveClass('page-layout--collapsed');
  });
});
