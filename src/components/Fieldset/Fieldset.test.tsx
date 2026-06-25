import { createRef } from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Fieldset } from './Fieldset';

describe('Fieldset', () => {
  it('renders a fieldset with the tui-fieldset class', () => {
    const { container } = render(<Fieldset />);
    const fieldset = container.querySelector('fieldset');
    expect(fieldset).not.toBeNull();
    expect(fieldset).toHaveClass('tui-fieldset');
  });

  it('renders a legend when the legend prop is provided', () => {
    render(<Fieldset legend="My Legend" />);
    const legend = screen.getByText('My Legend');
    expect(legend.tagName).toBe('LEGEND');
  });

  it('omits the legend element when no legend prop is given', () => {
    const { container } = render(<Fieldset>content</Fieldset>);
    expect(container.querySelector('legend')).toBeNull();
  });

  it('renders children', () => {
    render(<Fieldset>Inside content</Fieldset>);
    expect(screen.getByText('Inside content')).toBeInTheDocument();
  });

  it('merges an additional className onto the fieldset', () => {
    const { container } = render(<Fieldset className="tui-border-double" />);
    const fieldset = container.querySelector('fieldset');
    expect(fieldset).toHaveClass('tui-fieldset');
    expect(fieldset).toHaveClass('tui-border-double');
  });

  it('applies legendClassName to the legend', () => {
    render(<Fieldset legend="Centered" legendClassName="center" />);
    expect(screen.getByText('Centered')).toHaveClass('center');
  });

  it('forwards ref to the underlying fieldset element', () => {
    const ref = createRef<HTMLFieldSetElement>();
    render(<Fieldset ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLFieldSetElement);
  });
});
