import { createRef } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('renders the TuiCss DOM structure: label.tui-checkbox > text, input[type=checkbox], span', () => {
    const { container } = render(<Checkbox>Default</Checkbox>);
    const label = container.querySelector('label.tui-checkbox');
    expect(label).not.toBeNull();

    const input = label!.querySelector('input[type="checkbox"]');
    const span = label!.querySelector('span');
    expect(input).not.toBeNull();
    expect(span).not.toBeNull();
    expect(span!.textContent).toBe('');

    // ラベルテキスト(children) は input より前に描画される。
    const children = Array.from(label!.childNodes);
    const textIndex = children.findIndex((n) => n.textContent === 'Default' && n.nodeType === Node.TEXT_NODE);
    const inputIndex = children.indexOf(input!);
    const spanIndex = children.indexOf(span!);
    expect(textIndex).toBeGreaterThanOrEqual(0);
    expect(textIndex).toBeLessThan(inputIndex);
    expect(inputIndex).toBeLessThan(spanIndex);
  });

  it('merges className into the label', () => {
    const { container } = render(<Checkbox className="tui-checkbox-red">Default</Checkbox>);
    const label = container.querySelector('label');
    expect(label).toHaveClass('tui-checkbox');
    expect(label).toHaveClass('tui-checkbox-red');
  });

  it('merges labelClassName into the label', () => {
    const { container } = render(<Checkbox labelClassName="extra">Default</Checkbox>);
    const label = container.querySelector('label');
    expect(label).toHaveClass('tui-checkbox');
    expect(label).toHaveClass('extra');
  });

  it('forwards ref to the underlying input element', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Checkbox ref={ref}>Default</Checkbox>);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current?.type).toBe('checkbox');
  });

  it('fires onChange when clicked (controlled)', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Checkbox checked={false} onChange={onChange}>
        Default
      </Checkbox>,
    );
    await user.click(screen.getByRole('checkbox'));
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('forwards disabled to the input', () => {
    render(<Checkbox disabled>Default</Checkbox>);
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });

  it('keeps the input type fixed when unsafe props include type', () => {
    const unsafeProps = { type: 'text' };
    render(<Checkbox {...unsafeProps}>Default</Checkbox>);
    expect(screen.getByRole('checkbox')).toHaveAttribute('type', 'checkbox');
  });
});
