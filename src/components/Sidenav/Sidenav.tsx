import type { ComponentPropsWithoutRef, KeyboardEventHandler, Ref } from 'react';
import { cx } from '../../utils/cx';

export interface SidenavProps extends ComponentPropsWithoutRef<'nav'> {
  /** Open state. When true the `active` class is applied (TuiCss toggles `display` via `.active`). */
  open: boolean;
  /** Side the panel is anchored to. `left` is the TuiCss default; `right` flips it. */
  position?: 'left' | 'right';
  ref?: Ref<HTMLElement>;
}

/**
 * Controlled sidenav panel.
 *
 * Open/close is fully driven by the `open` prop; pair it with `SidenavButton`
 * (or any control) on the consumer side to toggle state.
 *
 * `children` are wrapped in the `<ul>` that TuiCss styles, so consumers pass
 * `<li><a>` items (or `SidenavItem`) directly without repeating the list markup.
 */
export function Sidenav({
  open,
  position = 'left',
  className,
  children,
  ref,
  ...props
}: SidenavProps) {
  return (
    <nav
      ref={ref}
      className={cx('tui-sidenav', open && 'active', position, className)}
      {...props}
    >
      <ul>{children}</ul>
    </nav>
  );
}

export interface SidenavButtonProps extends ComponentPropsWithoutRef<'li'> {
  ref?: Ref<HTMLLIElement>;
}

/**
 * Toggle control for a {@link Sidenav}. Renders `li.tui-sidenav-button`.
 * Wire `onClick` to flip the `open` state owned by the consumer.
 */
export function SidenavButton({ className, onKeyDown, tabIndex, role, ...props }: SidenavButtonProps) {
  const handleKeyDown: KeyboardEventHandler<HTMLLIElement> = (event) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      event.currentTarget.click();
    }
  };

  return (
    <li
      className={cx('tui-sidenav-button', className)}
      role={role ?? 'button'}
      tabIndex={tabIndex ?? 0}
      onKeyDown={handleKeyDown}
      {...props}
    />
  );
}

export interface SidenavItemProps extends ComponentPropsWithoutRef<'a'> {
  ref?: Ref<HTMLAnchorElement>;
}

/**
 * Convenience shortcut for a sidenav entry: `<li><a>{children}</a></li>`.
 * Optional — consumers may pass their own `<li><a>` markup instead.
 */
export function SidenavItem({ ref, children, ...props }: SidenavItemProps) {
  return (
    <li>
      <a ref={ref} {...props}>
        {children}
      </a>
    </li>
  );
}
