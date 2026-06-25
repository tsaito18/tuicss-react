import type { ComponentPropsWithoutRef, Ref } from 'react';
import { cx } from '../../utils/cx';

// background.scss に実在する tui-bg-{color}-{black|white} の組合せのみを許可する
export type TuiBackgroundColor =
  | 'blue-white'
  | 'blue-black'
  | 'green-white'
  | 'green-black'
  | 'cyan-white'
  | 'cyan-black'
  | 'red-white'
  | 'red-black'
  | 'purple-white'
  | 'purple-black'
  | 'yellow-white'
  | 'yellow-black'
  | 'orange-white'
  | 'orange-black';

export interface BackgroundProps extends ComponentPropsWithoutRef<'div'> {
  ref?: Ref<HTMLDivElement>;
  color: TuiBackgroundColor;
}

export function Background({ className, color, ref, ...props }: BackgroundProps) {
  return <div ref={ref} className={cx(`tui-bg-${color}`, className)} {...props} />;
}
