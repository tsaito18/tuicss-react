import type { ComponentPropsWithoutRef, Ref } from 'react';
import { cx } from '../../utils/cx';

export interface NavbarProps extends ComponentPropsWithoutRef<'nav'> {
  // ref はルートの nav.tui-nav へ転送される。
  ref?: Ref<HTMLElement>;
}

// TuiCss の navbar は nav.tui-nav > ul > li の構造。ul ラップは本コンポーネントが内部で行うため、
// children には li 要素(NavbarItem / 既存 Dropdown 等)を直接渡す。className は nav へマージする。
export function Navbar({ className, children, ref, ...navProps }: NavbarProps) {
  return (
    <nav ref={ref} className={cx('tui-nav', className)} {...navProps}>
      <ul>{children}</ul>
    </nav>
  );
}

export interface NavbarItemProps extends ComponentPropsWithoutRef<'a'> {
  // ref は内部の a(HTMLAnchorElement) へ転送される。
  ref?: Ref<HTMLAnchorElement>;
}

// Navbar の children として並べる項目。li > a の構造で描画し、href / onClick 等は a へ透過する。
// active 等の状態クラスは className 経由で a に付与する。
export function NavbarItem({ className, children, ref, ...anchorProps }: NavbarItemProps) {
  return (
    <li>
      <a ref={ref} className={cx(className) || undefined} {...anchorProps}>
        {children}
      </a>
    </li>
  );
}
