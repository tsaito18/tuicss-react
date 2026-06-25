import type { ComponentPropsWithoutRef, Ref } from 'react';
import { cx } from '../../utils/cx';

export interface ShortcutProps extends ComponentPropsWithoutRef<'span'> {
  ref?: Ref<HTMLSpanElement>;
}

export function Shortcut({ className, ref, ...props }: ShortcutProps) {
  return <span ref={ref} className={cx('tui-shortcut', className)} {...props} />;
}
