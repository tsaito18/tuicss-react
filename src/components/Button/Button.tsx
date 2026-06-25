import type { ComponentPropsWithoutRef, Ref } from 'react';
import { cx } from '../../utils/cx';

export interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  ref?: Ref<HTMLButtonElement>;
}

export function Button({ className, ref, ...props }: ButtonProps) {
  return <button ref={ref} className={cx('tui-button', className)} {...props} />;
}
