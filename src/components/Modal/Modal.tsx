import type { ComponentPropsWithoutRef, ReactNode, Ref } from 'react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { cx } from '../../utils/cx';

export interface ModalProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
  // ref は div.tui-modal へ転送される。
  ref?: Ref<HTMLDivElement>;
  // controlled な開閉状態。本家同様 .active の有無で CSS 表示を切り替える。
  open: boolean;
  // overlap クリック / Escape で要求される閉じる操作。controlled なので state 反映は利用者責務。
  onClose?: () => void;
  // overlap(暗幕)クリックで onClose を呼ぶか。
  closeOnOverlapClick?: boolean;
  // Escape キーで onClose を呼ぶか。
  closeOnEsc?: boolean;
  // tui-modal 内に描画する内容(利用者が tui-window を入れる想定)。
  children?: ReactNode;
}

// TuiCss の modal は .active が無いと display:none(modal.scss)。open のとき overlap と modal に active を付与する。
// z-index/スタッキングを安定させるため document.body 直下へ createPortal する。
// SSR では document が無いため null を返し、マウント後(useEffect で mounted=true)に初めて portal を張る。
export function Modal({
  open,
  onClose,
  closeOnOverlapClick = true,
  closeOnEsc = true,
  className,
  children,
  ref,
  ...divProps
}: ModalProps) {
  const [mounted, setMounted] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const setModalRef = (node: HTMLDivElement | null) => {
    modalRef.current = node;
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  };

  useEffect(() => {
    if (!open || !mounted) return;
    previouslyFocusedRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const focusable = modalRef.current?.querySelector<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    (focusable ?? modalRef.current)?.focus();

    return () => {
      previouslyFocusedRef.current?.focus();
      previouslyFocusedRef.current = null;
    };
  }, [open, mounted]);

  useEffect(() => {
    // open 中のみ keydown を購読し、閉じた/アンマウント時に必ず解除する。
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && closeOnEsc) {
        onClose?.();
        return;
      }

      if (event.key !== 'Tab') return;

      const focusable = Array.from(
        modalRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      ).filter((element) => !element.hasAttribute('disabled') && element.getAttribute('aria-hidden') !== 'true');

      if (focusable.length === 0) {
        event.preventDefault();
        modalRef.current?.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, closeOnEsc, onClose]);

  if (!mounted || typeof document === 'undefined') return null;

  const handleOverlapClick = () => {
    if (closeOnOverlapClick) onClose?.();
  };

  return createPortal(
    <>
      <div className={cx('tui-overlap', open && 'active')} onClick={handleOverlapClick} />
      <div
        ref={setModalRef}
        className={cx('tui-modal', open && 'active', className)}
        role="dialog"
        aria-modal={open}
        tabIndex={-1}
        {...divProps}
      >
        {children}
      </div>
    </>,
    document.body,
  );
}

export interface ModalCloseButtonProps extends ComponentPropsWithoutRef<'button'> {
  // ref は button(HTMLButtonElement) へ転送される。
  ref?: Ref<HTMLButtonElement>;
}

// 閉じるボタン。閉じる動作自体は利用者が onClick(→ onClose)で行う薄いラッパ。
export function ModalCloseButton({ className, ref, ...props }: ModalCloseButtonProps) {
  return <button ref={ref} type="button" className={cx('tui-button', 'tui-modal-close-button', className)} {...props} />;
}
