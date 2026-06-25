import { createRef } from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Background } from './Background';

describe('Background', () => {
  it('applies the tui-bg-blue-black class', () => {
    render(<Background color="blue-black" data-testid="bg" />);
    expect(screen.getByTestId('bg')).toHaveClass('tui-bg-blue-black');
  });

  it('applies the tui-bg-red-white class', () => {
    render(<Background color="red-white" data-testid="bg" />);
    expect(screen.getByTestId('bg')).toHaveClass('tui-bg-red-white');
  });

  it('applies the tui-bg-orange-black class', () => {
    render(<Background color="orange-black" data-testid="bg" />);
    expect(screen.getByTestId('bg')).toHaveClass('tui-bg-orange-black');
  });

  it('renders children', () => {
    render(
      <Background color="green-white">
        <span>content</span>
      </Background>,
    );
    expect(screen.getByText('content')).toBeInTheDocument();
  });

  it('merges an additional className', () => {
    render(<Background color="cyan-black" className="extra" data-testid="bg" />);
    const el = screen.getByTestId('bg');
    expect(el).toHaveClass('tui-bg-cyan-black');
    expect(el).toHaveClass('extra');
  });

  it('forwards ref to the underlying div element', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Background color="purple-white" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
