import { createRef } from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Shortcut } from './Shortcut';

describe('Shortcut', () => {
  it('applies the tui-shortcut class', () => {
    render(<Shortcut data-testid="shortcut">F3</Shortcut>);
    expect(screen.getByTestId('shortcut')).toHaveClass('tui-shortcut');
  });

  it('renders children', () => {
    render(<Shortcut>F3</Shortcut>);
    expect(screen.getByText('F3')).toBeInTheDocument();
  });

  it('merges an additional className', () => {
    render(
      <Shortcut data-testid="shortcut" className="extra">
        F3
      </Shortcut>,
    );
    const shortcut = screen.getByTestId('shortcut');
    expect(shortcut).toHaveClass('tui-shortcut');
    expect(shortcut).toHaveClass('extra');
  });

  it('forwards ref to the underlying span element', () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Shortcut ref={ref}>F3</Shortcut>);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    expect(ref.current?.textContent).toBe('F3');
  });
});
