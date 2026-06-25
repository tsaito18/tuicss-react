import type { ComponentPropsWithoutRef, Ref } from 'react';
import { cx } from '../../utils/cx';

// TuiCss は 12 カラムグリッド (grid.scss の $num-cols)。
export type ColSpan = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export interface ContainerProps extends ComponentPropsWithoutRef<'div'> {
  ref?: Ref<HTMLDivElement>;
}

export function Container({ className, ref, ...props }: ContainerProps) {
  return <div ref={ref} className={cx('container', className)} {...props} />;
}

export interface RowProps extends ComponentPropsWithoutRef<'div'> {
  ref?: Ref<HTMLDivElement>;
}

export function Row({ className, ref, ...props }: RowProps) {
  return <div ref={ref} className={cx('row', className)} {...props} />;
}

export interface ColProps extends ComponentPropsWithoutRef<'div'> {
  s?: ColSpan;
  m?: ColSpan;
  l?: ColSpan;
  offsetS?: ColSpan;
  offsetM?: ColSpan;
  offsetL?: ColSpan;
  ref?: Ref<HTMLDivElement>;
}

export function Col({
  s,
  m,
  l,
  offsetS,
  offsetM,
  offsetL,
  className,
  ref,
  ...props
}: ColProps) {
  return (
    <div
      ref={ref}
      className={cx(
        'col',
        s && `s${s}`,
        m && `m${m}`,
        l && `l${l}`,
        offsetS && `offset-s${offsetS}`,
        offsetM && `offset-m${offsetM}`,
        offsetL && `offset-l${offsetL}`,
        className,
      )}
      {...props}
    />
  );
}
