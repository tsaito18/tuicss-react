import type { ComponentPropsWithoutRef, Ref } from 'react';
import { cx } from '../../utils/cx';

export interface StatusBarProps extends ComponentPropsWithoutRef<'div'> {
  // ref はルートの div.tui-statusbar へ転送される。
  ref?: Ref<HTMLDivElement>;
}

// TuiCss の statusbar はルート div.tui-statusbar が内部に ul を持ち、その中に li/divider を並べる構造。
// 利用者が children をフラットに渡せるよう ul ラップは内部で行う。
export function StatusBar({ className, children, ref, ...props }: StatusBarProps) {
  return (
    <div ref={ref} className={cx('tui-statusbar', className)} {...props}>
      <ul>{children}</ul>
    </div>
  );
}

export interface StatusBarItemProps extends ComponentPropsWithoutRef<'a'> {
  // ref は内部の a(HTMLAnchorElement) へ転送される。
  ref?: Ref<HTMLAnchorElement>;
}

// StatusBar の項目。li > a の構造で描画し、href / onClick 等は a へ透過する。
// children にショートカット表示（例: <span className="red-168-text">F1</span> Help）を入れて使う。
export function StatusBarItem({ className, children, ref, ...anchorProps }: StatusBarItemProps) {
  return (
    <li>
      <a ref={ref} className={cx(className) || undefined} {...anchorProps}>
        {children}
      </a>
    </li>
  );
}

export interface StatusBarDividerProps extends ComponentPropsWithoutRef<'span'> {
  // ref は span.tui-statusbar-divider へ転送される。
  ref?: Ref<HTMLSpanElement>;
}

// 項目間に縦罫線を引くための区切り要素。
export function StatusBarDivider({ className, ref, ...props }: StatusBarDividerProps) {
  return <span ref={ref} className={cx('tui-statusbar-divider', className)} {...props} />;
}
