import type { ComponentPropsWithoutRef, ReactNode, Ref } from 'react';
import { cx } from '../../utils/cx';

export interface DropdownProps extends ComponentPropsWithoutRef<'li'> {
  // ref はルートの li.tui-dropdown へ転送される。
  ref?: Ref<HTMLLIElement>;
  // トリガーボタンの内容。
  label: ReactNode;
  // トリガーボタン(button.tui-button)へ追加で渡す props。
  buttonProps?: ComponentPropsWithoutRef<'button'>;
}

// TuiCss の dropdown はルートが li で、開閉は純CSS(hover/focus)で行うため JS の state は持たない。
// navbar(ul.tui-nav)内では li がそのまま並ぶが、単体表示時は利用者側で ul でラップする必要がある。
// 標準の li 属性(className 含む)はルート li へ透過する。
export function Dropdown({ className, label, buttonProps, children, ref, ...liProps }: DropdownProps) {
  const { className: buttonClassName, ...restButtonProps } = buttonProps ?? {};
  return (
    <li ref={ref} className={cx('tui-dropdown', className)} {...liProps}>
      <button className={cx('tui-button', buttonClassName)} {...restButtonProps}>
        {label}
      </button>
      <div className="tui-dropdown-content">
        <ul>{children}</ul>
      </div>
    </li>
  );
}

export interface DropdownItemProps extends ComponentPropsWithoutRef<'a'> {
  // ref は内部の a(HTMLAnchorElement) へ転送される。
  ref?: Ref<HTMLAnchorElement>;
}

// Dropdown の children として並べる項目。li > a の構造で描画し、href / onClick 等は a へ透過する。
export function DropdownItem({ className, children, ref, ...anchorProps }: DropdownItemProps) {
  return (
    <li>
      <a ref={ref} className={cx(className) || undefined} {...anchorProps}>
        {children}
      </a>
    </li>
  );
}
