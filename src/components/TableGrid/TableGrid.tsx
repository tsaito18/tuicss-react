import type { ComponentPropsWithoutRef, Ref } from 'react';
import { cx } from '../../utils/cx';

export interface TableGridProps extends ComponentPropsWithoutRef<'table'> {
  ref?: Ref<HTMLTableElement>;
}

export function TableGrid({ className, ref, ...props }: TableGridProps) {
  return <table ref={ref} className={cx('tui-table-grid', className)} {...props} />;
}
