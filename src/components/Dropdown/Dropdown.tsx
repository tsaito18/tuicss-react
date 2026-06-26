import type { ComponentPropsWithoutRef, KeyboardEventHandler, MouseEventHandler, ReactNode, Ref } from 'react';
import { useId, useRef, useState } from 'react';
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
  const [open, setOpen] = useState(false);
  const contentId = useId();
  const rootRef = useRef<HTMLLIElement | null>(null);
  const {
    className: buttonClassName,
    onClick: buttonOnClick,
    onKeyDown: buttonOnKeyDown,
    ...restButtonProps
  } = buttonProps ?? {};

  const setRootRef = (node: HTMLLIElement | null) => {
    rootRef.current = node;
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  };

  const focusFirstItem = () => {
    const firstItem = rootRef.current?.querySelector<HTMLElement>(
      '.tui-dropdown-content a, .tui-dropdown-content button, .tui-dropdown-content [tabindex]:not([tabindex="-1"])',
    );
    firstItem?.focus();
  };

  const handleButtonClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    buttonOnClick?.(event);
    if (!event.defaultPrevented) setOpen((current) => !current);
  };

  const handleButtonKeyDown: KeyboardEventHandler<HTMLButtonElement> = (event) => {
    buttonOnKeyDown?.(event);
    if (event.defaultPrevented) return;

    if (event.key === 'Escape') {
      setOpen(false);
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setOpen(true);
      window.setTimeout(focusFirstItem, 0);
    }
  };

  return (
    <li ref={setRootRef} className={cx('tui-dropdown', open && 'active', className)} {...liProps}>
      <button
        type="button"
        className={cx('tui-button', buttonClassName)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={contentId}
        onClick={handleButtonClick}
        onKeyDown={handleButtonKeyDown}
        {...restButtonProps}
      >
        {label}
      </button>
      <div id={contentId} className={cx('tui-dropdown-content', open && 'active')} style={open ? { display: 'block' } : undefined}>
        <ul role="menu">{children}</ul>
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
