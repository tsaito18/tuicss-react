import type { ComponentPropsWithoutRef, ReactNode, Ref } from 'react';
import { useEffect, useState } from 'react';
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

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // open 中のみ keydown を購読し、閉じた/アンマウント時に必ず解除する。
    if (!open || !closeOnEsc) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose?.();
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
      <div ref={ref} className={cx('tui-modal', open && 'active', className)} {...divProps}>
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
  return <button ref={ref} className={cx('tui-button', 'tui-modal-close-button', className)} {...props} />;
}
