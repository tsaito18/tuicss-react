import { createRef } from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import {
  Chart,
  ChartDisplay,
  ChartValue,
  ChartXAxis,
  ChartYAxis,
  ChartLegend,
  ChartData,
} from './Chart';

describe('Chart', () => {
  it('renders tui-chart-vertical by default', () => {
    const { container } = render(<Chart />);
    expect(container.querySelector('div.tui-chart-vertical')).not.toBeNull();
  });

  it('renders tui-chart-horizontal for orientation="horizontal"', () => {
    const { container } = render(<Chart orientation="horizontal" />);
    expect(container.querySelector('div.tui-chart-horizontal')).not.toBeNull();
    expect(container.querySelector('div.tui-chart-vertical')).toBeNull();
  });

  it('merges className into the root', () => {
    const { container } = render(<Chart className="extra" />);
    const root = container.firstElementChild!;
    expect(root).toHaveClass('tui-chart-vertical');
    expect(root).toHaveClass('extra');
  });

  it('forwards ref to the root div', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Chart ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveClass('tui-chart-vertical');
  });

  it('propagates noXAxis / noYAxis to ChartDisplay via context', () => {
    const { container } = render(
      <Chart noXAxis noYAxis>
        <ChartDisplay />
      </Chart>,
    );
    const display = container.querySelector('.tui-chart-display')!;
    expect(display).toHaveClass('no-x-axis');
    expect(display).toHaveClass('no-y-axis');
  });
});

describe('ChartDisplay', () => {
  it('renders tui-chart-display', () => {
    const { container } = render(<ChartDisplay />);
    expect(container.querySelector('div.tui-chart-display')).not.toBeNull();
  });

  it('applies no-x-axis / no-y-axis from explicit props (override context)', () => {
    const { container } = render(
      <Chart noXAxis={false} noYAxis={false}>
        <ChartDisplay noXAxis noYAxis />
      </Chart>,
    );
    const display = container.querySelector('.tui-chart-display')!;
    expect(display).toHaveClass('no-x-axis');
    expect(display).toHaveClass('no-y-axis');
  });

  it('omits modifiers when not requested', () => {
    const { container } = render(<ChartDisplay />);
    const display = container.querySelector('.tui-chart-display')!;
    expect(display).not.toHaveClass('no-x-axis');
    expect(display).not.toHaveClass('no-y-axis');
  });

  it('merges className and forwards ref', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<ChartDisplay ref={ref} className="extra" />);
    expect(container.querySelector('.tui-chart-display')).toHaveClass('extra');
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe('ChartValue', () => {
  it('renders tui-chart-value with the color class', () => {
    const { container } = render(<ChartValue value={80} color="red-168" />);
    const bar = container.querySelector('.tui-chart-value')!;
    expect(bar).toHaveClass('red-168');
  });

  it('sets inline height% for vertical orientation (default)', () => {
    const { container } = render(<ChartValue value={80} />);
    const bar = container.querySelector('.tui-chart-value') as HTMLElement;
    expect(bar.style.height).toBe('80%');
    expect(bar.style.width).toBe('');
  });

  it('sets inline width% for horizontal orientation', () => {
    const { container } = render(<ChartValue value={60} orientation="horizontal" />);
    const bar = container.querySelector('.tui-chart-value') as HTMLElement;
    expect(bar.style.width).toBe('60%');
    expect(bar.style.height).toBe('');
  });

  it('inherits orientation from the parent Chart context', () => {
    const { container } = render(
      <Chart orientation="horizontal">
        <ChartDisplay>
          <ChartValue value={40} />
        </ChartDisplay>
      </Chart>,
    );
    const bar = container.querySelector('.tui-chart-value') as HTMLElement;
    expect(bar.style.width).toBe('40%');
  });

  it('clamps value above 100', () => {
    const { container } = render(<ChartValue value={150} />);
    const bar = container.querySelector('.tui-chart-value') as HTMLElement;
    expect(bar.style.height).toBe('100%');
  });

  it('clamps value below 0', () => {
    const { container } = render(<ChartValue value={-20} />);
    const bar = container.querySelector('.tui-chart-value') as HTMLElement;
    expect(bar.style.height).toBe('0%');
  });

  it('renders children as the bar label', () => {
    const { container } = render(<ChartValue value={50}>50%</ChartValue>);
    expect(container.querySelector('.tui-chart-value')!.textContent).toBe('50%');
  });

  it('preserves user-supplied style alongside the size style', () => {
    const { container } = render(
      <ChartValue value={50} style={{ color: 'rgb(255, 0, 0)' }} />,
    );
    const bar = container.querySelector('.tui-chart-value') as HTMLElement;
    expect(bar.style.height).toBe('50%');
    expect(bar.style.color).toBe('rgb(255, 0, 0)');
  });

  it('merges className and forwards ref', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<ChartValue ref={ref} value={10} className="extra" />);
    expect(container.querySelector('.tui-chart-value')).toHaveClass('extra');
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe('ChartXAxis / ChartYAxis / ChartLegend', () => {
  it('renders tui-chart-x-axis', () => {
    const { container } = render(<ChartXAxis />);
    expect(container.querySelector('div.tui-chart-x-axis')).not.toBeNull();
  });

  it('renders tui-chart-y-axis', () => {
    const { container } = render(<ChartYAxis />);
    expect(container.querySelector('div.tui-chart-y-axis')).not.toBeNull();
  });

  it('renders tui-chart-legend with content', () => {
    const { container } = render(<ChartLegend>100%</ChartLegend>);
    const legend = container.querySelector('div.tui-chart-legend')!;
    expect(legend.textContent).toBe('100%');
  });

  it('merges className and forwards refs', () => {
    const xRef = createRef<HTMLDivElement>();
    const yRef = createRef<HTMLDivElement>();
    const legendRef = createRef<HTMLDivElement>();
    const { container } = render(
      <>
        <ChartXAxis ref={xRef} className="x" />
        <ChartYAxis ref={yRef} className="y" />
        <ChartLegend ref={legendRef} className="l" />
      </>,
    );
    expect(container.querySelector('.tui-chart-x-axis')).toHaveClass('x');
    expect(container.querySelector('.tui-chart-y-axis')).toHaveClass('y');
    expect(container.querySelector('.tui-chart-legend')).toHaveClass('l');
    expect(xRef.current).toBeInstanceOf(HTMLDivElement);
    expect(yRef.current).toBeInstanceOf(HTMLDivElement);
    expect(legendRef.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe('ChartData', () => {
  const data = [
    { value: 80, color: 'red-168' as const, label: '80%' },
    { value: 30, color: 'green-168' as const, label: '30%' },
    { value: 50, color: 'blue-168' as const, label: '50%' },
  ];

  it('renders one tui-chart-value per data entry with correct value/color', () => {
    const { container } = render(<ChartData orientation="vertical" data={data} />);
    const bars = container.querySelectorAll('.tui-chart-display > .tui-chart-value');
    expect(bars).toHaveLength(3);
    expect(bars[0]).toHaveClass('red-168');
    expect((bars[0] as HTMLElement).style.height).toBe('80%');
    expect(bars[1]).toHaveClass('green-168');
    expect((bars[2] as HTMLElement).style.height).toBe('50%');
    expect(bars[0].textContent).toBe('80%');
  });

  it('uses width% for horizontal data charts', () => {
    const { container } = render(<ChartData orientation="horizontal" data={data} />);
    const bars = container.querySelectorAll('.tui-chart-value');
    expect((bars[0] as HTMLElement).style.width).toBe('80%');
  });

  it('renders x-axis and y-axis legends when provided', () => {
    const { container } = render(
      <ChartData
        data={data}
        xAxis={['t1', 't2', 't3']}
        yAxis={['100%', '50%']}
      />,
    );
    const xLegends = container.querySelectorAll('.tui-chart-x-axis > .tui-chart-legend');
    const yLegends = container.querySelectorAll('.tui-chart-y-axis > .tui-chart-legend');
    expect(xLegends).toHaveLength(3);
    expect(yLegends).toHaveLength(2);
    expect(xLegends[0].textContent).toBe('t1');
  });

  it('omits axes when not provided', () => {
    const { container } = render(<ChartData data={data} />);
    expect(container.querySelector('.tui-chart-x-axis')).toBeNull();
    expect(container.querySelector('.tui-chart-y-axis')).toBeNull();
  });
});
