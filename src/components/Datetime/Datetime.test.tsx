import { createRef } from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, act } from '@testing-library/react';
import { Datetime } from './Datetime';
import { formatDatetime } from './formatDatetime';

describe('formatDatetime', () => {
  // 2026-06-25 (Thursday) 09:08:07 を基準にトークン仕様を検証する。
  // getDay()=4 (木) なので e は 4+1=05。
  const morning = new Date(2026, 5, 25, 9, 8, 7);

  it('formats 12-hour time with AM (h non-zero-padded, a=AM)', () => {
    expect(formatDatetime(morning, 'h:m:s a')).toBe('9:08:07 AM');
  });

  it('formats 24-hour time zero-padded (H)', () => {
    expect(formatDatetime(morning, 'H:m:s')).toBe('09:08:07');
  });

  it('formats year-month-day (y is 4 digits, M/d zero-padded)', () => {
    expect(formatDatetime(morning, 'y-M-d')).toBe('2026-06-25');
  });

  it('formats day of week as getDay()+1 zero-padded (e)', () => {
    // 木曜 -> getDay()=4 -> 05
    expect(formatDatetime(morning, 'e')).toBe('05');
  });

  it('uses PM and 12-hour wrap for afternoon', () => {
    const afternoon = new Date(2026, 5, 25, 13, 5, 0);
    expect(formatDatetime(afternoon, 'h:m a')).toBe('1:05 PM');
  });

  it('wraps midnight to 12 AM', () => {
    const midnight = new Date(2026, 0, 1, 0, 0, 0);
    expect(formatDatetime(midnight, 'h:m:s a')).toBe('12:00:00 AM');
  });

  it('wraps noon to 12 PM', () => {
    const noon = new Date(2026, 0, 1, 12, 0, 0);
    expect(formatDatetime(noon, 'h:m:s a')).toBe('12:00:00 PM');
  });

  it('replaces only the first occurrence of a token (upstream string replace)', () => {
    // 本家は String.replace を文字列引数で呼ぶため 2 個目の H は置換されない。
    expect(formatDatetime(morning, 'H H')).toBe('09 H');
  });
});

describe('Datetime', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 5, 25, 9, 8, 7));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('applies the tui-datetime class', () => {
    const { container } = render(<Datetime />);
    expect(container.querySelector('span')).toHaveClass('tui-datetime');
  });

  it('renders empty before mount effect runs, then shows the time after mount', () => {
    let container!: HTMLElement;
    act(() => {
      ({ container } = render(<Datetime format="H:m:s" />));
    });
    expect(container.querySelector('span')?.textContent).toBe('09:08:07');
  });

  it('updates the displayed time as timers advance', () => {
    let container!: HTMLElement;
    act(() => {
      ({ container } = render(<Datetime format="H:m:s" />));
    });
    expect(container.querySelector('span')?.textContent).toBe('09:08:07');

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(container.querySelector('span')?.textContent).toBe('09:08:08');
  });

  it('honors a custom intervalMs', () => {
    let container!: HTMLElement;
    act(() => {
      ({ container } = render(<Datetime format="H:m:s" intervalMs={5000} />));
    });

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    // 5000ms 間隔なので 1 秒では更新されない。
    expect(container.querySelector('span')?.textContent).toBe('09:08:07');

    act(() => {
      vi.advanceTimersByTime(4000);
    });
    expect(container.querySelector('span')?.textContent).toBe('09:08:12');
  });

  it.each([Number.NaN, Infinity, 0, -1])('normalizes invalid intervalMs %s to 1000ms', (intervalMs) => {
    let container!: HTMLElement;
    act(() => {
      ({ container } = render(<Datetime format="H:m:s" intervalMs={intervalMs} />));
    });

    act(() => {
      vi.advanceTimersByTime(999);
    });
    expect(container.querySelector('span')?.textContent).toBe('09:08:07');

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(container.querySelector('span')?.textContent).toBe('09:08:08');
  });

  it('clears the interval on unmount (no timers left)', () => {
    const { unmount } = render(<Datetime />);
    expect(vi.getTimerCount()).toBeGreaterThan(0);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('merges an additional className', () => {
    const { container } = render(<Datetime className="tui-datetime-extra" />);
    const span = container.querySelector('span');
    expect(span).toHaveClass('tui-datetime');
    expect(span).toHaveClass('tui-datetime-extra');
  });

  it('forwards ref to the underlying span element', () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Datetime ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it('forwards standard span attributes', () => {
    const { container } = render(<Datetime data-testid="clock" id="clock-1" />);
    const span = container.querySelector('span');
    expect(span).toHaveAttribute('data-testid', 'clock');
    expect(span).toHaveAttribute('id', 'clock-1');
  });
});
