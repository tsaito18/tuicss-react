import { createRef } from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProgressBar } from './ProgressBar';

describe('ProgressBar', () => {
  it('renders div.tui-progress-bar containing span.tui-progress', () => {
    const { container } = render(<ProgressBar value={50} />);
    const bar = container.querySelector('div.tui-progress-bar');
    expect(bar).toBeInTheDocument();
    const progress = bar?.querySelector('span.tui-progress');
    expect(progress).toBeInTheDocument();
  });

  it('sets inner width from value/max as a percentage', () => {
    const { container } = render(<ProgressBar value={50} max={100} />);
    const progress = container.querySelector('span.tui-progress') as HTMLElement;
    expect(progress.style.width).toBe('50%');
  });

  it('computes percentage relative to a custom max', () => {
    const { container } = render(<ProgressBar value={1} max={4} />);
    const progress = container.querySelector('span.tui-progress') as HTMLElement;
    expect(progress.style.width).toBe('25%');
  });

  it('clamps values above max to 100%', () => {
    const { container } = render(<ProgressBar value={150} max={100} />);
    const progress = container.querySelector('span.tui-progress') as HTMLElement;
    expect(progress.style.width).toBe('100%');
  });

  it('clamps negative values to 0%', () => {
    const { container } = render(<ProgressBar value={-20} max={100} />);
    const progress = container.querySelector('span.tui-progress') as HTMLElement;
    expect(progress.style.width).toBe('0%');
  });

  it('renders an indeterminate element instead of a width-based progress', () => {
    const { container } = render(<ProgressBar indeterminate value={50} />);
    expect(container.querySelector('span.tui-indeterminate')).toBeInTheDocument();
    expect(container.querySelector('span.tui-progress')).not.toBeInTheDocument();
  });

  it('renders a percentage label when label is true', () => {
    render(<ProgressBar value={30} label />);
    const label = screen.getByText('30%');
    expect(label).toHaveClass('tui-progress-label');
  });

  it('renders a custom ReactNode label', () => {
    render(<ProgressBar value={30} label={<strong>Loading</strong>} />);
    const label = screen.getByText('Loading');
    expect(label.closest('.tui-progress-label')).toBeInTheDocument();
  });

  it('does not render a label by default', () => {
    const { container } = render(<ProgressBar value={30} />);
    expect(container.querySelector('.tui-progress-label')).not.toBeInTheDocument();
  });

  it('exposes progressbar role and aria values', () => {
    render(<ProgressBar value={50} max={100} />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '50');
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
  });

  it('omits aria-valuenow when indeterminate', () => {
    render(<ProgressBar indeterminate />);
    const bar = screen.getByRole('progressbar');
    expect(bar).not.toHaveAttribute('aria-valuenow');
  });

  it('merges an additional className onto the root', () => {
    render(<ProgressBar value={50} className="my-bar" />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveClass('tui-progress-bar');
    expect(bar).toHaveClass('my-bar');
  });

  it('applies progressClassName to the inner progress element', () => {
    const { container } = render(<ProgressBar value={50} progressClassName="red-168" />);
    const progress = container.querySelector('span.tui-progress');
    expect(progress).toHaveClass('red-168');
  });

  it('forwards ref to the underlying div element', () => {
    const ref = createRef<HTMLDivElement>();
    render(<ProgressBar value={50} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveClass('tui-progress-bar');
  });
});
