import type { ComponentPropsWithoutRef, Ref } from 'react';
import { cx } from '../../utils/cx';

export interface DividerProps extends ComponentPropsWithoutRef<'div'> {
  ref?: Ref<HTMLDivElement>;
  color?: 'white' | 'black';
}

export function Divider({ className, color = 'white', ref, ...props }: DividerProps) {
  return (
    <div
      ref={ref}
      className={cx(color === 'black' ? 'tui-black-divider' : 'tui-divider', className)}
      {...props}
    />
  );
}
