import { createRef } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './Input';

describe('Input', () => {
  it('applies the tui-input class', () => {
    render(<Input placeholder="name" />);
    expect(screen.getByPlaceholderText('name')).toHaveClass('tui-input');
  });

  it('merges an additional className', () => {
    render(<Input className="tui-input-red" placeholder="name" />);
    const input = screen.getByPlaceholderText('name');
    expect(input).toHaveClass('tui-input');
    expect(input).toHaveClass('tui-input-red');
  });

  it('works as a controlled input', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Input value="" onChange={onChange} placeholder="name" />);
    await user.type(screen.getByPlaceholderText('name'), 'a');
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('forwards standard attributes such as type, disabled and placeholder', () => {
    render(<Input type="password" disabled placeholder="secret" />);
    const input = screen.getByPlaceholderText('secret');
    expect(input).toHaveAttribute('type', 'password');
    expect(input).toBeDisabled();
  });

  it('forwards ref to the underlying input element', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input ref={ref} defaultValue="hello" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current?.value).toBe('hello');
  });
});
