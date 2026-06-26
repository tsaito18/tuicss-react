import type { ComponentPropsWithoutRef, Ref } from 'react';
import { cx } from '../../utils/cx';

export interface RadioProps extends Omit<ComponentPropsWithoutRef<'input'>, 'type'> {
  // ref はラジオの input(HTMLInputElement) へ転送される。
  ref?: Ref<HTMLInputElement>;
  // className / labelClassName は共にルートの label.tui-radio へマージされる。
  labelClassName?: string;
}

// TuiCss は `label.tui-radio > (ラベルテキスト, input[type=radio], 空span)` の
// DOM構造でのみスタイルが当たるため、この並び順を厳守する。span は擬似ラジオ描画用の空要素。
// className 以外の input 標準属性(checked / defaultChecked / onChange / disabled / name / value 等)は input へ透過する。
// 同一 name でグループ化される。
export function Radio({ className, labelClassName, children, ref, ...inputProps }: RadioProps) {
  return (
    <label className={cx('tui-radio', labelClassName, className)}>
      {children}
      <input ref={ref} {...inputProps} type="radio" />
      <span />
    </label>
  );
}
