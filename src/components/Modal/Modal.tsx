import type { ComponentPropsWithoutRef, ReactNode, Ref } from 'react';
import { Children, Fragment, isValidElement, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { cx } from '../../utils/cx';
import { lockBodyScroll, unlockBodyScroll } from '../../utils/bodyScrollLock';
import { warnIfTuiStylesMissing } from '../../utils/tuiStyleCheck';
import { Background } from '../Background';
import type { TuiBackgroundColor } from '../Background';
import { Divider } from '../Divider';

export interface ModalProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
  // ref は div.tui-modal へ転送される。
  ref?: Ref<HTMLDivElement>;
  // controlled な開閉状態。本家同様 .active の有無で CSS 表示を切り替える。
  open: boolean;
  // overlap クリック / Escape で要求される閉じる操作。controlled なので state 反映は利用者責務。
  onClose?: () => void;
  // Escape と overlay クリックの両方をまとめて無効化する(既定は true)。
  // 個別プロパティを明示した場合はそちらが優先される。
  dismissable?: boolean;
  // overlay(暗幕)クリックで onClose を呼ぶか。
  closeOnOverlayClick?: boolean;
  /** @deprecated `closeOnOverlayClick` を使用する。 */
  closeOnOverlapClick?: boolean;
  // Escape キーで onClose を呼ぶか。
  closeOnEsc?: boolean;
  // overlap(暗幕)に敷くテクスチャ背景。透明な暗幕(TuiCss 本家の挙動)に戻したい場合は false。
  overlapBackground?: TuiBackgroundColor | false;
  // 暗幕の不透明度。bg-*.png 自体は完全不透明なので、背後を透かすにはここで下げる。
  // overlapBackground が false のときは適用しない(本家と同一の DOM を保つ)。
  overlapOpacity?: number;
  // ModalHeader/Body/Footer 利用時に自動生成される div.tui-window へ渡す追加クラス
  // (red-168 等の配色クラスを利用者が当てられるようにするため)。
  windowClassName?: string;
  // tui-modal 内に描画する内容(利用者が tui-window を入れる想定)。
  children?: ReactNode;
}

// TuiCss の modal は .active が無いと display:none(modal.scss)。open のとき overlap と modal に active を付与する。
// z-index/スタッキングを安定させるため document.body 直下へ createPortal する。
// SSR では document が無いため null を返し、マウント後(useEffect で mounted=true)に初めて portal を張る。
export function Modal({
  open,
  onClose,
  dismissable,
  closeOnOverlayClick,
  closeOnOverlapClick,
  closeOnEsc,
  overlapBackground = 'blue-black',
  overlapOpacity = 0.8,
  windowClassName,
  className,
  children,
  ref,
  ...divProps
}: ModalProps) {
  const [mounted, setMounted] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  const dismiss = dismissable ?? true;
  const escEnabled = closeOnEsc ?? dismiss;
  const overlayEnabled = closeOnOverlayClick ?? closeOnOverlapClick ?? dismiss;

  useEffect(() => {
    setMounted(true);
    // 未バンドルの ESM をそのまま読む環境では process 自体が存在しないため typeof で保護する。
    // バンドラが process.env.NODE_ENV を "production" に置換すると分岐ごと除去され、
    // 併せて未使用になった import も落ちる(package.json の sideEffects 指定が前提)。
    if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
      warnIfTuiStylesMissing({ className: 'tui-modal', componentName: 'Modal' });
    }
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
    // open 中は背後のページがスクロールしないよう body を固定する。
    // lock/unlock は参照カウント方式なので、多重オープンや StrictMode の二重実行でも整合する。
    if (!open || !mounted) return;
    lockBodyScroll();
    return unlockBodyScroll;
  }, [open, mounted]);

  useEffect(() => {
    // open 中のみ keydown を購読し、閉じた/アンマウント時に必ず解除する。
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && escEnabled) {
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
  }, [open, escEnabled, onClose]);

  if (!mounted || typeof document === 'undefined') return null;

  const handleOverlapClick = () => {
    if (overlayEnabled) onClose?.();
  };

  const overlapClassName = cx('tui-overlap', open && 'active');

  // ModalHeader/Body/Footer が使われたときだけ tui-window + tui-fieldset を生成する。
  // 従来どおり利用者が自前の tui-window を渡すケースでは DOM を一切変えない。
  const content = containsModalSection(children) ? (
    <div className={cx('tui-window', windowClassName)}>
      <fieldset className="tui-fieldset">{children}</fieldset>
    </div>
  ) : (
    children
  );

  return createPortal(
    <>
      {overlapBackground === false ? (
        <div className={overlapClassName} onClick={handleOverlapClick} />
      ) : (
        <Background
          color={overlapBackground}
          className={overlapClassName}
          style={{ opacity: overlapOpacity }}
          onClick={handleOverlapClick}
        />
      )}
      <div
        ref={setModalRef}
        className={cx('tui-modal', open && 'active', className)}
        role="dialog"
        aria-modal={open}
        tabIndex={-1}
        {...divProps}
      >
        {content}
      </div>
    </>,
    document.body,
  );
}

// 関数宣言は巻き上げられるため、実体の定義より前でも参照できる。
const modalSections = new Set<unknown>([ModalHeader, ModalBody, ModalFooter]);

// コンポーネント関数の同一性で判定する。目印プロパティを持たせる方式だと
// 生成される .d.ts に内部実装が露出し、利用者の補完に現れてしまうため。
// また Children.toArray は Fragment を平坦化しないので、条件分岐で Fragment に
// 包まれたセクションを取りこぼさないよう再帰する。
function containsModalSection(children: ReactNode): boolean {
  return Children.toArray(children).some((child) => {
    if (!isValidElement(child)) return false;
    if (child.type === Fragment) {
      return containsModalSection((child.props as { children?: ReactNode }).children);
    }
    return modalSections.has(child.type);
  });
}

export interface ModalCloseButtonProps extends ComponentPropsWithoutRef<'button'> {
  // ref は button(HTMLButtonElement) へ転送される。
  ref?: Ref<HTMLButtonElement>;
}

// 閉じるボタン。閉じる動作自体は利用者が onClick(→ onClose)で行う薄いラッパ。
export function ModalCloseButton({ className, ref, ...props }: ModalCloseButtonProps) {
  return <button ref={ref} type="button" className={cx('tui-button', 'tui-modal-close-button', className)} {...props} />;
}

export interface ModalHeaderProps extends ComponentPropsWithoutRef<'legend'> {
  // ref は legend(HTMLLegendElement) へ転送される。
  ref?: Ref<HTMLLegendElement>;
}

// 自動生成される tui-fieldset の legend。tui-modal-header 自体にスタイルは無く、利用者向けのフックとして残す。
export function ModalHeader({ className, ref, ...props }: ModalHeaderProps) {
  return <legend ref={ref} className={cx('tui-modal-header', className)} {...props} />;
}

export interface ModalBodyProps extends ComponentPropsWithoutRef<'div'> {
  // ref は div(HTMLDivElement) へ転送される。
  ref?: Ref<HTMLDivElement>;
}

export function ModalBody({ className, ref, ...props }: ModalBodyProps) {
  return <div ref={ref} className={cx('tui-modal-body', className)} {...props} />;
}

export interface ModalFooterProps extends ComponentPropsWithoutRef<'div'> {
  // ref は div(HTMLDivElement) へ転送される。
  ref?: Ref<HTMLDivElement>;
  // 本文との区切り線を自動で挿入する。既に自前で罫線を置いている場合は false。
  divider?: boolean;
}

export function ModalFooter({ className, divider = true, ref, ...props }: ModalFooterProps) {
  return (
    <>
      {divider && <Divider />}
      <div ref={ref} className={cx('tui-modal-footer', className)} {...props} />
    </>
  );
}
