import { createRef } from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Divider } from './Divider';

describe('Divider', () => {
  it('applies tui-divider by default', () => {
    const { container } = render(<Divider data-testid="divider" />);
    expect(container.firstChild).toHaveClass('tui-divider');
  });

  it('applies tui-divider when color is white', () => {
    const { container } = render(<Divider color="white" />);
    expect(container.firstChild).toHaveClass('tui-divider');
    expect(container.firstChild).not.toHaveClass('tui-black-divider');
  });

  it('applies tui-black-divider when color is black', () => {
    const { container } = render(<Divider color="black" />);
    expect(container.firstChild).toHaveClass('tui-black-divider');
    expect(container.firstChild).not.toHaveClass('tui-divider');
  });

  it('merges an additional className', () => {
    const { container } = render(<Divider className="extra" />);
    expect(container.firstChild).toHaveClass('tui-divider');
    expect(container.firstChild).toHaveClass('extra');
  });

  it('forwards ref to the underlying div element', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Divider ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
