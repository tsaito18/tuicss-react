import { createRef, useState } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { Range } from './Range';

const percentOf = (element: HTMLElement) => element.style.getPropertyValue('--tui-range-percent');

describe('Range', () => {
  it('renders input[type=range] with the tui-range class', () => {
    render(<Range aria-label="volume" />);
    const input = screen.getByLabelText('volume');
    expect(input).toHaveAttribute('type', 'range');
    expect(input).toHaveClass('tui-range');
  });

  it('merges className and forwards ref', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Range aria-label="volume" className="extra" ref={ref} />);
    const input = screen.getByLabelText('volume');
    expect(input).toHaveClass('tui-range');
    expect(input).toHaveClass('extra');
    expect(ref.current).toBe(input);
  });

  it('gives the unfilled track a textured background by default', () => {
    render(<Range aria-label="volume" />);
    expect(screen.getByLabelText('volume')).toHaveClass('tui-bg-cyan-black');
  });

  it('honors an explicit trackBackground color', () => {
    render(<Range aria-label="volume" trackBackground="red-black" />);
    const input = screen.getByLabelText('volume');
    expect(input).toHaveClass('tui-bg-red-black');
    expect(input).not.toHaveClass('tui-bg-cyan-black');
  });

  it('leaves the track untextured when trackBackground is false', () => {
    render(<Range aria-label="volume" trackBackground={false} />);
    expect(screen.getByLabelText('volume').className).toBe('tui-range');
  });

  it('passes min, max, step and disabled through', () => {
    render(<Range aria-label="volume" min={10} max={20} step={2} disabled />);
    const input = screen.getByLabelText('volume');
    expect(input).toHaveAttribute('min', '10');
    expect(input).toHaveAttribute('max', '20');
    expect(input).toHaveAttribute('step', '2');
    expect(input).toBeDisabled();
  });

  it('exposes the fill ratio of a controlled value as a custom property', () => {
    render(<Range aria-label="volume" value={25} onChange={() => {}} />);
    expect(percentOf(screen.getByLabelText('volume'))).toBe('25%');
  });

  it('computes the fill ratio against min and max', () => {
    render(<Range aria-label="volume" min={10} max={20} value={15} onChange={() => {}} />);
    expect(percentOf(screen.getByLabelText('volume'))).toBe('50%');
  });

  it('clamps the fill ratio for out-of-range values', () => {
    const { rerender } = render(<Range aria-label="volume" value={-50} onChange={() => {}} />);
    expect(percentOf(screen.getByLabelText('volume'))).toBe('0%');

    rerender(<Range aria-label="volume" value={500} onChange={() => {}} />);
    expect(percentOf(screen.getByLabelText('volume'))).toBe('100%');
  });

  it('falls back to 0% when max is not greater than min', () => {
    render(<Range aria-label="volume" min={5} max={5} value={5} onChange={() => {}} />);
    expect(percentOf(screen.getByLabelText('volume'))).toBe('0%');
  });

  // jsdom は range の矢印キー操作を実装しないため、値の変更は change イベントで再現する。
  it('tracks an uncontrolled value from defaultValue', () => {
    render(<Range aria-label="volume" defaultValue={40} />);
    const input = screen.getByLabelText<HTMLInputElement>('volume');
    expect(percentOf(input)).toBe('40%');

    fireEvent.change(input, { target: { value: '41' } });
    expect(input.value).toBe('41');
    expect(percentOf(input)).toBe('41%');
  });

  it('calls onChange while staying controlled by the value prop', () => {
    const onChange = vi.fn();

    function Controlled() {
      const [value, setValue] = useState(10);
      return (
        <Range
          aria-label="volume"
          value={value}
          onChange={(event) => {
            onChange(event.target.value);
            setValue(Number(event.target.value));
          }}
        />
      );
    }

    render(<Controlled />);
    const input = screen.getByLabelText<HTMLInputElement>('volume');

    fireEvent.change(input, { target: { value: '11' } });
    expect(onChange).toHaveBeenCalledWith('11');
    expect(input.value).toBe('11');
    expect(percentOf(input)).toBe('11%');
  });

  it('keeps a caller-supplied style alongside the fill ratio', () => {
    render(<Range aria-label="volume" value={50} onChange={() => {}} style={{ width: '300px' }} />);
    const input = screen.getByLabelText('volume');
    expect(percentOf(input)).toBe('50%');
    expect(input).toHaveStyle({ width: '300px' });
  });
});
