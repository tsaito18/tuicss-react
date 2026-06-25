import { createRef } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Navbar, NavbarItem } from './Navbar';

describe('Navbar', () => {
  it('renders nav.tui-nav > ul and places children inside the ul', () => {
    const { container } = render(
      <Navbar>
        <NavbarItem href="#one">One</NavbarItem>
        <NavbarItem href="#two">Two</NavbarItem>
      </Navbar>,
    );
    const ul = container.querySelector('nav.tui-nav > ul');
    expect(ul).not.toBeNull();

    const anchors = ul!.querySelectorAll(':scope > li > a');
    expect(anchors).toHaveLength(2);
    expect(anchors[0].textContent).toBe('One');
  });

  it('merges className into the nav element', () => {
    const { container } = render(<Navbar className="extra" />);
    const nav = container.querySelector('nav');
    expect(nav).toHaveClass('tui-nav');
    expect(nav).toHaveClass('extra');
  });

  it('forwards ref to the nav element', () => {
    const ref = createRef<HTMLElement>();
    render(<Navbar ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current).toHaveClass('tui-nav');
  });

  it('accepts a raw li (e.g. Dropdown) child inside the ul', () => {
    const { container } = render(
      <Navbar>
        <li className="tui-dropdown">trigger</li>
      </Navbar>,
    );
    const li = container.querySelector('nav.tui-nav > ul > li.tui-dropdown');
    expect(li).not.toBeNull();
  });
});

describe('NavbarItem', () => {
  it('renders li > a and forwards href', () => {
    const { container } = render(<NavbarItem href="#target">Go</NavbarItem>);
    const anchor = container.querySelector('li > a');
    expect(anchor).not.toBeNull();
    expect(anchor!.textContent).toBe('Go');
    expect(anchor!.getAttribute('href')).toBe('#target');
  });

  it('fires onClick on the anchor', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<NavbarItem onClick={onClick}>Go</NavbarItem>);
    await user.click(screen.getByText('Go'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('merges className into the anchor', () => {
    const { container } = render(<NavbarItem className="tui-nav-active">Go</NavbarItem>);
    expect(container.querySelector('a')).toHaveClass('tui-nav-active');
  });

  it('omits the class attribute when no className is given', () => {
    const { container } = render(<NavbarItem>Go</NavbarItem>);
    expect(container.querySelector('a')!.hasAttribute('class')).toBe(false);
  });

  it('forwards ref to the anchor element', () => {
    const ref = createRef<HTMLAnchorElement>();
    render(
      <NavbarItem ref={ref} href="#x">
        Go
      </NavbarItem>,
    );
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
  });
});
