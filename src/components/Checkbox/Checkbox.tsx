import type { ComponentPropsWithoutRef, Ref } from 'react';
import { cx } from '../../utils/cx';

export interface CheckboxProps extends Omit<ComponentPropsWithoutRef<'input'>, 'type'> {
  // ref はチェックボックスの input(HTMLInputElement) へ転送される。
  ref?: Ref<HTMLInputElement>;
  // className / labelClassName は共にルートの label.tui-checkbox へマージされる。
  labelClassName?: string;
}

// TuiCss は `label.tui-checkbox > (ラベルテキスト, input[type=checkbox], 空span)` の
// DOM構造でのみスタイルが当たるため、この並び順を厳守する。span は擬似チェックマーク描画用の空要素。
// className 以外の input 標準属性(checked / defaultChecked / onChange / disabled / name / value 等)は input へ透過する。
export function Checkbox({ className, labelClassName, children, ref, ...inputProps }: CheckboxProps) {
  return (
    <label className={cx('tui-checkbox', labelClassName, className)}>
      {children}
      <input ref={ref} {...inputProps} type="checkbox" />
      <span />
    </label>
  );
}
