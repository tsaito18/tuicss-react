import {
  createContext,
  useCallback,
  useContext,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { ComponentPropsWithoutRef, ReactNode, Ref } from 'react';
import { cx } from '../../utils/cx';

// アクティブな value と切替関数、パネルとタブを関連付ける id を Context で配下に供給する。
interface TabsContextValue {
  activeValue: string | undefined;
  setActiveValue: (value: string) => void;
  // defaultValue 未指定時に最初の Tab を既定アクティブにするための登録窓口。
  registerTab: (value: string) => void;
  baseId: string;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext(component: string): TabsContextValue {
  const ctx = useContext(TabsContext);
  if (ctx === null) {
    throw new Error(`<${component}> must be used within <Tabs>.`);
  }
  return ctx;
}

export interface TabsProps extends ComponentPropsWithoutRef<'div'> {
  ref?: Ref<HTMLDivElement>;
  // 制御モード: 親がアクティブ value を保持する。指定時は内部 state を無視する。
  value?: string;
  // 非制御モードの初期アクティブ value。未指定なら最初の Tab が既定で選択される。
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children?: ReactNode;
}

export function Tabs({
  value,
  defaultValue,
  onValueChange,
  className,
  children,
  ref,
  ...divProps
}: TabsProps) {
  const baseId = useId();
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState<string | undefined>(defaultValue);

  // 最初に登録された Tab を記録し、defaultValue も制御 value も無いときの既定アクティブにする。
  const firstRegistered = useRef<string | undefined>(undefined);
  const [fallbackValue, setFallbackValue] = useState<string | undefined>(undefined);

  const registerTab = useCallback((tabValue: string) => {
    if (firstRegistered.current === undefined) {
      firstRegistered.current = tabValue;
      setFallbackValue(tabValue);
    }
  }, []);

  const resolvedUncontrolled = uncontrolledValue ?? fallbackValue;
  const activeValue = isControlled ? value : resolvedUncontrolled;

  const setActiveValue = useCallback(
    (next: string) => {
      if (!isControlled) {
        setUncontrolledValue(next);
      }
      onValueChange?.(next);
    },
    [isControlled, onValueChange],
  );

  const contextValue = useMemo<TabsContextValue>(
    () => ({ activeValue, setActiveValue, registerTab, baseId }),
    [activeValue, setActiveValue, registerTab, baseId],
  );

  return (
    <TabsContext.Provider value={contextValue}>
      <div ref={ref} className={cx(className) || undefined} {...divProps}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export interface TabListProps extends ComponentPropsWithoutRef<'div'> {
  ref?: Ref<HTMLDivElement>;
  children?: ReactNode;
}

// 本家マークアップの div.tui-tabs > ul を描画し、Tab(li) を children として並べる。
export function TabList({ className, children, ref, ...divProps }: TabListProps) {
  return (
    <div ref={ref} className={cx('tui-tabs', className)} role="tablist" {...divProps}>
      <ul>{children}</ul>
    </div>
  );
}

export interface TabProps extends ComponentPropsWithoutRef<'a'> {
  ref?: Ref<HTMLAnchorElement>;
  // 本家の data-tab-content に相当する識別子。対応する TabPanel の value と一致させる。
  value: string;
  disabled?: boolean;
  children?: ReactNode;
}

export function Tab({ value, disabled = false, className, children, onClick, ref, ...anchorProps }: TabProps) {
  const { activeValue, setActiveValue, registerTab, baseId } = useTabsContext('Tab');
  const active = activeValue === value;

  // 描画ごとに登録窓口へ通知し、defaultValue 未指定時の既定アクティブ解決に使う。
  registerTab(value);

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (disabled || event.defaultPrevented) return;
    setActiveValue(value);
  };

  return (
    <li>
      <a
        ref={ref}
        className={cx('tui-tab', active && 'active', disabled && 'disabled', className)}
        role="tab"
        aria-selected={active}
        aria-disabled={disabled || undefined}
        aria-controls={`${baseId}-panel-${value}`}
        id={`${baseId}-tab-${value}`}
        onClick={handleClick}
        {...anchorProps}
      >
        {children}
      </a>
    </li>
  );
}

export interface TabPanelProps extends ComponentPropsWithoutRef<'div'> {
  ref?: Ref<HTMLDivElement>;
  // 表示条件となる識別子。対応する Tab の value と一致させる。
  value: string;
  children?: ReactNode;
}

// .tui-tab-content はグローバル CSS で display:none のため、アクティブ時のみ inline display:block で表示する
// (本家 JS が対象 content にインライン display を付与する挙動の再現)。非アクティブパネルは描画しない。
export function TabPanel({ value, className, children, style, ref, ...divProps }: TabPanelProps) {
  const { activeValue, baseId } = useTabsContext('TabPanel');
  const active = activeValue === value;

  if (!active) return null;

  return (
    <div
      ref={ref}
      className={cx('tui-tab-content', className)}
      role="tabpanel"
      id={`${baseId}-panel-${value}`}
      aria-labelledby={`${baseId}-tab-${value}`}
      style={{ display: 'block', ...style }}
      {...divProps}
    >
      {children}
    </div>
  );
}
