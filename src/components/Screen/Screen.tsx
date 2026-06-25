import type { ComponentPropsWithoutRef, Ref } from 'react';
import { cx } from '../../utils/cx';

export interface ScreenProps extends ComponentPropsWithoutRef<'div'> {
  ref?: Ref<HTMLDivElement>;
  size?: '640-480' | '800-600' | '1024-768';
  bordered?: boolean;
  centered?: boolean;
}

export function Screen({
  className,
  size = '800-600',
  bordered,
  centered,
  ref,
  ...props
}: ScreenProps) {
  return (
    <div
      ref={ref}
      className={cx(
        `tui-screen-${size}`,
        bordered && 'bordered',
        centered && 'centered',
        className,
      )}
      {...props}
    />
  );
}
