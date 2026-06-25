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
  const clamped = Math.min(Math.max(value, 0), max);
  const percent = max > 0 ? Math.round((clamped / max) * 100) : 0;

  return (
    <div
      ref={ref}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
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
