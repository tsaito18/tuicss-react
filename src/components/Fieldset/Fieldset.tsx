import type { ComponentPropsWithoutRef, ReactNode, Ref } from 'react';
import { cx } from '../../utils/cx';

export interface FieldsetProps extends ComponentPropsWithoutRef<'fieldset'> {
  ref?: Ref<HTMLFieldSetElement>;
  legend?: ReactNode;
  legendClassName?: string;
}

export function Fieldset({
  className,
  legend,
  legendClassName,
  children,
  ref,
  ...props
}: FieldsetProps) {
  return (
    <fieldset ref={ref} className={cx('tui-fieldset', className)} {...props}>
      {legend != null && <legend className={cx(legendClassName)}>{legend}</legend>}
      {children}
    </fieldset>
  );
}
