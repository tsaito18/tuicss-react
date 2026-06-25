import type { ComponentPropsWithoutRef, Ref } from 'react';
import { cx } from '../../utils/cx';

export interface WindowProps extends ComponentPropsWithoutRef<'div'> {
  ref?: Ref<HTMLDivElement>;
}

export function Window({ className, ref, ...props }: WindowProps) {
  return <div ref={ref} className={cx('tui-window', className)} {...props} />;
}
