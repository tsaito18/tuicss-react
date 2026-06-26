import type { ComponentPropsWithoutRef, ReactNode, Ref } from 'react';
import { cx } from '../../utils/cx';

export interface ProgressBarProps extends ComponentPropsWithoutRef<'div'> {
  ref?: Ref<HTMLDivElement>;
  value?: number;
  max?: number;
  indeterminate?: boolean;
  label?: boolean | ReactNode;
  progressClassName?: string;
}

function normalizeMax(max: number): number {
  return Number.isFinite(max) && max > 0 ? max : 100;
}

function normalizeValue(value: number, max: number): number {
  if (Number.isNaN(value) || value === -Infinity) {
    return 0;
  }

  if (value === Infinity) {
    return max;
  }

  return Math.min(Math.max(value, 0), max);
}

export function ProgressBar({
  className,
  value = 0,
  max = 100,
  indeterminate = false,
  label,
  progressClassName,
  ref,
  ...props
}: ProgressBarProps) {
  const normalizedMax = normalizeMax(max);
  const clamped = normalizeValue(value, normalizedMax);
  const percent = Math.round((clamped / normalizedMax) * 100);

  return (
    <div
      ref={ref}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={normalizedMax}
      // indeterminate時は進捗が不明なため aria-valuenow を省略する
      aria-valuenow={indeterminate ? undefined : clamped}
      className={cx('tui-progress-bar', className)}
      {...props}
    >
      {indeterminate ? (
        <span className={cx('tui-indeterminate', progressClassName)} />
      ) : (
        <span
          className={cx('tui-progress', progressClassName)}
          style={{ width: `${percent}%` }}
        />
      )}
      {label !== undefined && label !== false && (
        <span className="tui-progress-label">{label === true ? `${percent}%` : label}</span>
      )}
    </div>
  );
}
