import { createRef } from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ScrollArea } from './ScrollArea';

describe('ScrollArea', () => {
  it('defaults to the tui-scroll-cyan class', () => {
    render(<ScrollArea data-testid="scroll" />);
    expect(screen.getByTestId('scroll')).toHaveClass('tui-scroll-cyan');
  });

  it('applies the requested color class', () => {
    render(<ScrollArea data-testid="scroll" color="green" />);
    const el = screen.getByTestId('scroll');
    expect(el).toHaveClass('tui-scroll-green');
    expect(el).not.toHaveClass('tui-scroll-cyan');
  });

  it('renders children', () => {
    render(
      <ScrollArea>
        <span>content</span>
      </ScrollArea>,
    );
    expect(screen.getByText('content')).toBeInTheDocument();
  });

  it('merges an additional className', () => {
    render(<ScrollArea data-testid="scroll" className="extra" />);
    const el = screen.getByTestId('scroll');
    expect(el).toHaveClass('tui-scroll-cyan');
    expect(el).toHaveClass('extra');
  });

  it('applies overflow auto by default and lets style override it', () => {
    render(<ScrollArea data-testid="scroll" />);
    expect(screen.getByTestId('scroll')).toHaveStyle({ overflow: 'auto' });
  });

  it('lets the user style override the default overflow', () => {
    render(
      <ScrollArea data-testid="scroll" style={{ overflow: 'hidden' }} />,
    );
    expect(screen.getByTestId('scroll')).toHaveStyle({ overflow: 'hidden' });
  });

  it('forwards ref to the underlying div element', () => {
    const ref = createRef<HTMLDivElement>();
    render(<ScrollArea ref={ref} data-testid="scroll" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toBe(screen.getByTestId('scroll'));
  });
});
