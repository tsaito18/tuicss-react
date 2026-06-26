import { createRef } from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Radio } from './Radio';

describe('Radio', () => {
  it('renders the TuiCss DOM structure: label.tui-radio > (text, input[type=radio], span)', () => {
    const { container } = render(<Radio>Default</Radio>);
    const label = container.querySelector('label')!;
    expect(label).toHaveClass('tui-radio');

    const input = label.querySelector('input')!;
    expect(input).toHaveAttribute('type', 'radio');
    expect(label.querySelector('span')).toBeInTheDocument();

    // children(ラベルテキスト) は input より前に描画される。
    const children = Array.from(label.childNodes);
    const textIndex = children.findIndex((n) => n.textContent === 'Default' && n.nodeName !== 'INPUT');
    const inputIndex = children.indexOf(input);
    expect(textIndex).toBeGreaterThanOrEqual(0);
    expect(textIndex).toBeLessThan(inputIndex);
  });

  it('merges className and labelClassName onto the label', () => {
    const { container } = render(
      <Radio className="extra" labelClassName="from-label">
        Default
      </Radio>,
    );
    const label = container.querySelector('label')!;
    expect(label).toHaveClass('tui-radio');
    expect(label).toHaveClass('from-label');
    expect(label).toHaveClass('extra');
  });

  it('forwards ref to the underlying input element', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Radio ref={ref}>Default</Radio>);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current?.type).toBe('radio');
  });

  it('groups radios by name so selecting one unselects another', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Radio name="group">One</Radio>
        <Radio name="group">Two</Radio>
      </>,
    );
    const one = screen.getByRole('radio', { name: 'One' });
    const two = screen.getByRole('radio', { name: 'Two' });

    await user.click(one);
    expect(one).toBeChecked();
    expect(two).not.toBeChecked();

    await user.click(two);
    expect(two).toBeChecked();
    expect(one).not.toBeChecked();
  });

  it('forwards the disabled attribute', () => {
    render(<Radio disabled>Default</Radio>);
    expect(screen.getByRole('radio', { name: 'Default' })).toBeDisabled();
  });

  it('keeps the input type fixed when unsafe props include type', () => {
    const unsafeProps = { type: 'checkbox' };
    render(<Radio {...unsafeProps}>Default</Radio>);
    expect(screen.getByRole('radio', { name: 'Default' })).toHaveAttribute('type', 'radio');
  });
});
