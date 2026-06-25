import type { ComponentPropsWithoutRef, Ref } from 'react';
import { cx } from '../../utils/cx';

export interface PanelProps extends ComponentPropsWithoutRef<'div'> {
  ref?: Ref<HTMLDivElement>;
}

// ルートコンテナ。子に PanelHeader / PanelContent を並べて使う。
export function Panel({ className, ref, ...props }: PanelProps) {
  return <div ref={ref} className={cx('tui-panel', className)} {...props} />;
}

export interface PanelHeaderProps extends ComponentPropsWithoutRef<'div'> {
  ref?: Ref<HTMLDivElement>;
}

export function PanelHeader({ className, ref, ...props }: PanelHeaderProps) {
  return <div ref={ref} className={cx('tui-panel-header', className)} {...props} />;
}

export interface PanelContentProps extends ComponentPropsWithoutRef<'div'> {
  ref?: Ref<HTMLDivElement>;
}

export function PanelContent({ className, ref, ...props }: PanelContentProps) {
  return <div ref={ref} className={cx('tui-panel-content', className)} {...props} />;
}
