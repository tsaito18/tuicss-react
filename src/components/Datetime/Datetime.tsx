import type { ComponentPropsWithoutRef, Ref } from 'react';
import { useEffect, useState } from 'react';
import { cx } from '../../utils/cx';
import { formatDatetime } from './formatDatetime';

export interface DatetimeProps extends ComponentPropsWithoutRef<'span'> {
  ref?: Ref<HTMLSpanElement>;
  format?: string;
  intervalMs?: number;
}

function normalizeIntervalMs(intervalMs: number): number {
  return Number.isFinite(intervalMs) && intervalMs > 0 ? intervalMs : 1000;
}

export function Datetime({
  className,
  ref,
  format = 'h:m:s a',
  intervalMs = 1000,
  ...props
}: DatetimeProps) {
  // SSR/ハイドレーション不一致を避けるため初期値は空。マウント後に実時刻をセットする。
  const [text, setText] = useState('');
  const normalizedIntervalMs = normalizeIntervalMs(intervalMs);

  useEffect(() => {
    setText(formatDatetime(new Date(), format));

    const id = setInterval(() => {
      setText(formatDatetime(new Date(), format));
    }, normalizedIntervalMs);

    // アンマウント・依存変化時に必ず解除（本家のメモリリーク修正に相当）。
    return () => clearInterval(id);
  }, [format, normalizedIntervalMs]);

  return (
    <span ref={ref} className={cx('tui-datetime', className)} {...props}>
      {text}
    </span>
  );
}
