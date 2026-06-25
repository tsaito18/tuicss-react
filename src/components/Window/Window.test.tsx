import { createRef } from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Window } from './Window';

describe('Window', () => {
  it('applies the tui-window class', () => {
    render(<Window data-testid="window" />);
    expect(screen.getByTestId('window')).toHaveClass('tui-window');
  });

  it('renders children', () => {
    render(
      <Window>
        <span>content</span>
      </Window>,
    );
    expect(screen.getByText('content')).toBeInTheDocument();
  });

  it('merges an additional className including a color class', () => {
    render(<Window data-testid="window" className="red-168" />);
    const window = screen.getByTestId('window');
    expect(window).toHaveClass('tui-window');
    expect(window).toHaveClass('red-168');
  });

  it('forwards ref to the underlying div element', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Window ref={ref} data-testid="window" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toBe(screen.getByTestId('window'));
  });
});
