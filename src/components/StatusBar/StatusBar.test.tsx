import { createRef } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StatusBar, StatusBarItem, StatusBarDivider } from './StatusBar';

describe('StatusBar', () => {
  it('renders the TuiCss DOM structure: div.tui-statusbar > ul with children inside the ul', () => {
    const { container } = render(
      <StatusBar>
        <StatusBarItem href="#!">Help</StatusBarItem>
      </StatusBar>,
    );
    const ul = container.querySelector('div.tui-statusbar > ul');
    expect(ul).not.toBeNull();
    expect(ul!.querySelector(':scope > li > a')).not.toBeNull();
  });

  it('merges className into the root div', () => {
    const { container } = render(<StatusBar className="extra" />);
    const root = container.querySelector('div');
    expect(root).toHaveClass('tui-statusbar');
    expect(root).toHaveClass('extra');
  });

  it('forwards ref to the root div element', () => {
    const ref = createRef<HTMLDivElement>();
    render(<StatusBar ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveClass('tui-statusbar');
  });
});

describe('StatusBarItem', () => {
  it('renders li > a and forwards href', () => {
    const { container } = render(<StatusBarItem href="#target">Go</StatusBarItem>);
    const anchor = container.querySelector('li > a');
    expect(anchor).not.toBeNull();
    expect(anchor!.textContent).toBe('Go');
    expect(anchor!.getAttribute('href')).toBe('#target');
  });

  it('fires onClick on the anchor', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<StatusBarItem onClick={onClick}>Go</StatusBarItem>);
    await user.click(screen.getByText('Go'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('merges className into the anchor', () => {
    const { container } = render(<StatusBarItem className="active">Go</StatusBarItem>);
    expect(container.querySelector('a')).toHaveClass('active');
  });

  it('omits the class attribute when no className is given', () => {
    const { container } = render(<StatusBarItem>Go</StatusBarItem>);
    expect(container.querySelector('a')!.hasAttribute('class')).toBe(false);
  });

  it('forwards ref to the anchor element', () => {
    const ref = createRef<HTMLAnchorElement>();
    render(
      <StatusBarItem ref={ref} href="#x">
        Go
      </StatusBarItem>,
    );
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
  });
});

describe('StatusBarDivider', () => {
  it('renders li > span.tui-statusbar-divider', () => {
    const { container } = render(
      <StatusBar>
        <StatusBarDivider />
      </StatusBar>,
    );
    const span = container.querySelector('ul > li > span.tui-statusbar-divider');
    expect(span).not.toBeNull();
  });

  it('merges className into the span', () => {
    const { container } = render(<StatusBarDivider className="extra" />);
    const span = container.querySelector('span');
    expect(span).toHaveClass('tui-statusbar-divider');
    expect(span).toHaveClass('extra');
  });

  it('forwards ref to the li element', () => {
    const ref = createRef<HTMLLIElement>();
    render(<StatusBarDivider ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLLIElement);
    expect(ref.current?.querySelector('span')).toHaveClass('tui-statusbar-divider');
  });
});
