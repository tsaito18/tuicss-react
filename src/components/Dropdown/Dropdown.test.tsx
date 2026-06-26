import { createRef } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Dropdown, DropdownItem } from './Dropdown';

describe('Dropdown', () => {
  it('renders the TuiCss DOM structure: li.tui-dropdown > button.tui-button + div.tui-dropdown-content > ul', () => {
    const { container } = render(<Dropdown label="Menu" />);
    const root = container.querySelector('li.tui-dropdown');
    expect(root).not.toBeNull();

    const button = root!.querySelector('button.tui-button');
    expect(button).not.toBeNull();
    expect(button!.textContent).toBe('Menu');

    const content = root!.querySelector('div.tui-dropdown-content');
    expect(content).not.toBeNull();
    expect(content!.querySelector('ul')).not.toBeNull();
  });

  it('renders DropdownItem children as li > a inside the content ul', () => {
    const { container } = render(
      <Dropdown label="Menu">
        <DropdownItem href="#one">Option 1</DropdownItem>
        <DropdownItem href="#two">Option 2</DropdownItem>
      </Dropdown>,
    );
    const ul = container.querySelector('div.tui-dropdown-content > ul');
    expect(ul).not.toBeNull();

    const anchors = ul!.querySelectorAll(':scope > li > a');
    expect(anchors).toHaveLength(2);
    expect(anchors[0].textContent).toBe('Option 1');
    expect(anchors[0].getAttribute('href')).toBe('#one');
  });

  it('merges className into the root li', () => {
    const { container } = render(<Dropdown className="extra" label="Menu" />);
    const root = container.querySelector('li');
    expect(root).toHaveClass('tui-dropdown');
    expect(root).toHaveClass('extra');
  });

  it('forwards buttonProps to the trigger button', () => {
    render(<Dropdown label="Menu" buttonProps={{ className: 'tui-button-red', disabled: true }} />);
    const button = screen.getByRole('button', { name: 'Menu' });
    expect(button).toHaveClass('tui-button');
    expect(button).toHaveClass('tui-button-red');
    expect(button).toBeDisabled();
  });

  it('defaults the trigger type to button and honors an explicit type', () => {
    render(<Dropdown label="Menu" buttonProps={{ type: 'submit' }} />);
    expect(screen.getByRole('button', { name: 'Menu' })).toHaveAttribute('type', 'submit');
  });

  it('exposes popup state and toggles open on click', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Dropdown label="Menu">
        <DropdownItem href="#one">Option 1</DropdownItem>
      </Dropdown>,
    );
    const button = screen.getByRole('button', { name: 'Menu' });
    const root = container.querySelector('li.tui-dropdown');
    expect(button).toHaveAttribute('aria-haspopup', 'menu');
    expect(button).toHaveAttribute('aria-expanded', 'false');

    await user.click(button);

    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(root).toHaveClass('active');
    expect(container.querySelector('.tui-dropdown-content')).toHaveStyle({ display: 'block' });
  });

  it('opens with ArrowDown, focuses the first item, and closes with Escape', async () => {
    const user = userEvent.setup();
    render(
      <Dropdown label="Menu">
        <DropdownItem href="#one">Option 1</DropdownItem>
      </Dropdown>,
    );
    const button = screen.getByRole('button', { name: 'Menu' });
    button.focus();

    await user.keyboard('{ArrowDown}');

    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('link', { name: 'Option 1' })).toHaveFocus();

    button.focus();
    await user.keyboard('{Escape}');

    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('forwards ref to the root li element', () => {
    const ref = createRef<HTMLLIElement>();
    render(<Dropdown ref={ref} label="Menu" />);
    expect(ref.current).toBeInstanceOf(HTMLLIElement);
    expect(ref.current).toHaveClass('tui-dropdown');
  });
});

describe('DropdownItem', () => {
  it('renders li > a and forwards href', () => {
    const { container } = render(<DropdownItem href="#target">Go</DropdownItem>);
    const anchor = container.querySelector('li > a');
    expect(anchor).not.toBeNull();
    expect(anchor!.textContent).toBe('Go');
    expect(anchor!.getAttribute('href')).toBe('#target');
  });

  it('fires onClick on the anchor', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<DropdownItem onClick={onClick}>Go</DropdownItem>);
    await user.click(screen.getByText('Go'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('merges className into the anchor', () => {
    const { container } = render(<DropdownItem className="active">Go</DropdownItem>);
    expect(container.querySelector('a')).toHaveClass('active');
  });

  it('omits the class attribute when no className is given', () => {
    const { container } = render(<DropdownItem>Go</DropdownItem>);
    expect(container.querySelector('a')!.hasAttribute('class')).toBe(false);
  });

  it('forwards ref to the anchor element', () => {
    const ref = createRef<HTMLAnchorElement>();
    render(
      <DropdownItem ref={ref} href="#x">
        Go
      </DropdownItem>,
    );
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
  });
});
