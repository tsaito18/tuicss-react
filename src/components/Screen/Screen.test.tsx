import { createRef } from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Screen } from './Screen';

describe('Screen', () => {
  it('applies the default tui-screen-800-600 class', () => {
    render(<Screen data-testid="screen" />);
    expect(screen.getByTestId('screen')).toHaveClass('tui-screen-800-600');
  });

  it('switches the size class with the size prop', () => {
    render(<Screen size="640-480" data-testid="screen" />);
    const el = screen.getByTestId('screen');
    expect(el).toHaveClass('tui-screen-640-480');
    expect(el).not.toHaveClass('tui-screen-800-600');
  });

  it('supports the 1024-768 size', () => {
    render(<Screen size="1024-768" data-testid="screen" />);
    expect(screen.getByTestId('screen')).toHaveClass('tui-screen-1024-768');
  });

  it('adds the bordered class only when bordered is set', () => {
    const { rerender } = render(<Screen data-testid="screen" />);
    expect(screen.getByTestId('screen')).not.toHaveClass('bordered');
    rerender(<Screen bordered data-testid="screen" />);
    expect(screen.getByTestId('screen')).toHaveClass('bordered');
  });

  it('adds the centered class only when centered is set', () => {
    const { rerender } = render(<Screen data-testid="screen" />);
    expect(screen.getByTestId('screen')).not.toHaveClass('centered');
    rerender(<Screen centered data-testid="screen" />);
    expect(screen.getByTestId('screen')).toHaveClass('centered');
  });

  it('renders children', () => {
    render(
      <Screen>
        <span>content</span>
      </Screen>,
    );
    expect(screen.getByText('content')).toBeInTheDocument();
  });

  it('merges an additional className', () => {
    render(<Screen className="extra" data-testid="screen" />);
    const el = screen.getByTestId('screen');
    expect(el).toHaveClass('tui-screen-800-600');
    expect(el).toHaveClass('extra');
  });

  it('forwards ref to the underlying div element', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Screen ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
