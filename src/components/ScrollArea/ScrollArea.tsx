import type { ComponentPropsWithoutRef, Ref } from 'react';
import { cx } from '../../utils/cx';
import {
  scrollbarClass,
  type TuiScrollbarColor,
} from '../../utils/utilityClasses';

export interface ScrollAreaProps extends ComponentPropsWithoutRef<'div'> {
  ref?: Ref<HTMLDivElement>;
  /** スクロールバー配色。既定は本家既定色の cyan。 */
  color?: TuiScrollbarColor;
}

/**
 * 本家 TuiCss のスクロールバー配色を適用するスクロール可能コンテナの薄いラッパ。
 *
 * **Chrome (webkit) 専用**: 配色は `::-webkit-scrollbar` 擬似要素で実現されるため、
 * Firefox 等の非 webkit ブラウザでは色は反映されない (スクロール自体は機能する)。
 *
 * webkit のスクロールバー擬似要素は要素が実際にスクロールしないと現れないため、
 * 既定で `overflow: 'auto'` を付与する。利用者の `style.overflow*` が優先される
 * (本 prop はスプレッド前に展開しているため、`style` で上書き可能)。
 */
export function ScrollArea({
  className,
  color = 'cyan',
  style,
  ref,
  ...props
}: ScrollAreaProps) {
  return (
    <div
      ref={ref}
      className={cx(scrollbarClass(color), className)}
      style={{ overflow: 'auto', ...style }}
      {...props}
    />
  );
}
