import { createRef } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Sidenav, SidenavButton } from './Sidenav';

describe('Sidenav', () => {
  it('applies the tui-sidenav class', () => {
    render(
      <Sidenav open data-testid="nav">
        <li>Item</li>
      </Sidenav>,
    );
    expect(screen.getByTestId('nav')).toHaveClass('tui-sidenav');
  });

  it('adds the active class when open', () => {
    render(
      <Sidenav open data-testid="nav">
        <li>Item</li>
      </Sidenav>,
    );
    expect(screen.getByTestId('nav')).toHaveClass('active');
  });

  it('omits the active class when closed', () => {
    render(
      <Sidenav open={false} data-testid="nav">
        <li>Item</li>
      </Sidenav>,
    );
    expect(screen.getByTestId('nav')).not.toHaveClass('active');
  });

  it('applies the left class by default', () => {
    render(
      <Sidenav open data-testid="nav">
        <li>Item</li>
      </Sidenav>,
    );
    expect(screen.getByTestId('nav')).toHaveClass('left');
  });

  it('applies the right class when position is right', () => {
    render(
      <Sidenav open position="right" data-testid="nav">
        <li>Item</li>
      </Sidenav>,
    );
    const nav = screen.getByTestId('nav');
    expect(nav).toHaveClass('right');
    expect(nav).not.toHaveClass('left');
  });

  it('renders children inside a ul', () => {
    render(
      <Sidenav open data-testid="nav">
        <li>
          <a href="#!">Home</a>
        </li>
      </Sidenav>,
    );
    const item = screen.getByRole('link', { name: 'Home' });
    expect(item.closest('ul')).not.toBeNull();
    expect(screen.getByTestId('nav').querySelector('ul')).toContainElement(item);
  });

  it('merges an additional className on the nav', () => {
    render(
      <Sidenav open className="extra" data-testid="nav">
        <li>Item</li>
      </Sidenav>,
    );
    const nav = screen.getByTestId('nav');
    expect(nav).toHaveClass('tui-sidenav');
    expect(nav).toHaveClass('extra');
  });

  it('forwards ref to the underlying nav element', () => {
    const ref = createRef<HTMLElement>();
    render(
      <Sidenav open ref={ref}>
        <li>Item</li>
      </Sidenav>,
    );
    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current?.tagName).toBe('NAV');
  });
});

describe('SidenavButton', () => {
  it('renders li.tui-sidenav-button', () => {
    render(<SidenavButton data-testid="btn">≡</SidenavButton>);
    const button = screen.getByTestId('btn');
    expect(button.tagName).toBe('LI');
    expect(button).toHaveClass('tui-sidenav-button');
    expect(button).toHaveAttribute('role', 'button');
    expect(button).toHaveAttribute('tabindex', '0');
  });

  it('fires onClick', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <SidenavButton onClick={onClick} data-testid="btn">
        ≡
      </SidenavButton>,
    );
    await user.click(screen.getByTestId('btn'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('fires onClick from Enter and Space', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <SidenavButton onClick={onClick} data-testid="btn">
        ≡
      </SidenavButton>,
    );
    const button = screen.getByTestId('btn');
    button.focus();

    await user.keyboard('{Enter}');
    await user.keyboard(' ');

    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('merges an additional className', () => {
    render(
      <SidenavButton className="extra" data-testid="btn">
        ≡
      </SidenavButton>,
    );
    const button = screen.getByTestId('btn');
    expect(button).toHaveClass('tui-sidenav-button');
    expect(button).toHaveClass('extra');
  });

  it('forwards ref to the underlying li element', () => {
    const ref = createRef<HTMLLIElement>();
    render(<SidenavButton ref={ref}>≡</SidenavButton>);
    expect(ref.current).toBeInstanceOf(HTMLLIElement);
  });
});
