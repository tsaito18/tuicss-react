import type { ComponentPropsWithoutRef, Ref } from 'react';
import { cx } from '../../utils/cx';

// 本家 TuiCss (vendor/tuicss/components/table.scss) の hovered-/striped- modifier は
// 強度サフィックス (-168/-255) を持たない素の色名で、semantic 色も black も非対応。
// このため `TuiColorToken` は流用できず、SCSS に実在するクラスのみを許す専用 union を定義する。
/** `.tui-table` の hovered-/striped- modifier が受け付ける色名。 */
export type TuiTableColor =
  | 'blue'
  | 'green'
  | 'cyan'
  | 'red'
  | 'purple'
  | 'yellow'
  | 'white'
  | 'orange';

export interface TableProps extends ComponentPropsWithoutRef<'table'> {
  ref?: Ref<HTMLTableElement>;
  /**
   * 行ホバー時のハイライト色 (`hovered-{color}` を付与)。
   * SCSS に存在する色のみ有効 (black/semantic 色・強度サフィックスは非対応)。
   */
  hovered?: TuiTableColor;
  /**
   * 偶数行のストライプ色 (`striped-{color}` を付与)。
   * SCSS に存在する色のみ有効 (black/semantic 色・強度サフィックスは非対応)。
   */
  striped?: TuiTableColor;
}

export function Table({ className, hovered, striped, ref, ...props }: TableProps) {
  return (
    <table
      ref={ref}
      className={cx(
        'tui-table',
        hovered && `hovered-${hovered}`,
        striped && `striped-${striped}`,
        className,
      )}
      {...props}
    />
  );
}
