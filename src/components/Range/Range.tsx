import type { ChangeEvent, ComponentPropsWithoutRef, Ref } from 'react';
import { useState } from 'react';
import { cx } from '../../utils/cx';
import type { TuiBackgroundColor } from '../Background';

// type は range 固定。差し替えたい場合は Input を使う。
export interface RangeProps extends Omit<ComponentPropsWithoutRef<'input'>, 'type'> {
  ref?: Ref<HTMLInputElement>;
  // 未到達部に敷くテクスチャ背景。トラックは擬似要素でクラスを付けられないため、
  // input 本体に tui-bg-* を当て、未到達部を透過させて透かせる(tuicss-react.scss)。
  trackBackground?: TuiBackgroundColor | false;
}

// input の min/max/value は string | number を取りうるので数値へ寄せる。
function toNumber(value: unknown, fallback: number): number {
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

// 到達部の塗り位置。max <= min のような異常値では 0% に落とす。
function toPercent(current: number, min: number, max: number): number {
  if (max <= min) return 0;
  const ratio = (current - min) / (max - min);
  return Math.min(Math.max(ratio, 0), 1) * 100;
}

// トラックの塗り分けはネイティブでは表現できないため、現在値から算出した割合を
// CSS カスタムプロパティで渡す(styles/tuicss-react.scss の linear-gradient が参照)。
// uncontrolled でも塗りを追従させるため内部 state を持ち、value 指定時は props を優先する。
export function Range({
  className,
  style,
  min = 0,
  max = 100,
  value,
  defaultValue,
  onChange,
  trackBackground = 'cyan-black',
  ref,
  ...props
}: RangeProps) {
  const numericMin = toNumber(min, 0);
  const numericMax = toNumber(max, 100);
  const [uncontrolledValue, setUncontrolledValue] = useState(() =>
    toNumber(defaultValue, numericMin),
  );

  const current = value !== undefined ? toNumber(value, numericMin) : uncontrolledValue;
  const percent = toPercent(current, numericMin, numericMax);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUncontrolledValue(toNumber(event.target.value, numericMin));
    onChange?.(event);
  };

  return (
    <input
      ref={ref}
      type="range"
      className={cx('tui-range', trackBackground && `tui-bg-${trackBackground}`, className)}
      style={{ ['--tui-range-percent' as string]: `${percent}%`, ...style }}
      min={min}
      max={max}
      value={value}
      defaultValue={defaultValue}
      onChange={handleChange}
      {...props}
    />
  );
}
