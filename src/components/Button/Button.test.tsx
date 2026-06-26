import { createRef } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('applies the tui-button class', () => {
    render(<Button>OK</Button>);
    expect(screen.getByRole('button', { name: 'OK' })).toHaveClass('tui-button');
  });

  it('merges an additional className', () => {
    render(<Button className="tui-button-red">OK</Button>);
    const button = screen.getByRole('button', { name: 'OK' });
    expect(button).toHaveClass('tui-button');
    expect(button).toHaveClass('tui-button-red');
  });

  it('fires onClick', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>OK</Button>);
    await user.click(screen.getByRole('button', { name: 'OK' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('forwards standard attributes such as disabled', () => {
    render(<Button disabled>OK</Button>);
    expect(screen.getByRole('button', { name: 'OK' })).toBeDisabled();
  });

  it('defaults type to button and honors an explicit type', () => {
    render(
      <>
        <Button>Default</Button>
        <Button type="submit">Submit</Button>
      </>,
    );
    expect(screen.getByRole('button', { name: 'Default' })).toHaveAttribute('type', 'button');
    expect(screen.getByRole('button', { name: 'Submit' })).toHaveAttribute('type', 'submit');
  });

  it('forwards ref to the underlying button element', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref}>OK</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current?.textContent).toBe('OK');
  });
});
