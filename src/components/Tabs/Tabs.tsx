import {
  Children,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useId,
  useMemo,
  useState,
} from 'react';
import type { ComponentPropsWithoutRef, KeyboardEventHandler, MouseEventHandler, ReactNode, Ref } from 'react';
import { cx } from '../../utils/cx';

interface TabRegistration {
  value: string;
  disabled: boolean;
}

// アクティブな value と切替関数、パネルとタブを関連付ける id を Context で配下に供給する。
interface TabsContextValue {
  activeValue: string | undefined;
  setActiveValue: (value: string) => void;
  tabValues: TabRegistration[];
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

  const tabValues = useMemo(() => collectTabValues(children), [children]);
  const firstEnabledValue = tabValues.find((tab) => !tab.disabled)?.value;
  const activeValue = isControlled
    ? value
    : resolveTabValue(uncontrolledValue, tabValues) ?? firstEnabledValue;

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
    () => ({ activeValue, setActiveValue, tabValues, baseId }),
    [activeValue, setActiveValue, tabValues, baseId],
  );

  return (
    <TabsContext.Provider value={contextValue}>
      <div ref={ref} className={cx(className) || undefined} {...divProps}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

function collectTabValues(children: ReactNode): TabRegistration[] {
  const tabs: TabRegistration[] = [];

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;

    if (child.type === Tab) {
      const props = child.props as Pick<TabProps, 'value' | 'disabled'>;
      tabs.push({ value: props.value, disabled: props.disabled ?? false });
      return;
    }

    const props = child.props as { children?: ReactNode };
    if (props.children !== undefined) {
      tabs.push(...collectTabValues(props.children));
    }
  });

  return tabs;
}

function resolveTabValue(value: string | undefined, tabs: TabRegistration[]): string | undefined {
  if (value === undefined) return undefined;
  const matchingTab = tabs.find((tab) => tab.value === value);
  if (!matchingTab || matchingTab.disabled) return undefined;
  return value;
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

export function Tab({ value, disabled = false, className, children, onClick, onKeyDown, ref, ...anchorProps }: TabProps) {
  const { activeValue, setActiveValue, tabValues, baseId } = useTabsContext('Tab');
  const active = activeValue === value;

  const handleClick: MouseEventHandler<HTMLAnchorElement> = (event) => {
    onClick?.(event);
    if (disabled || event.defaultPrevented) return;
    setActiveValue(value);
  };

  const handleKeyDown: KeyboardEventHandler<HTMLAnchorElement> = (event) => {
    onKeyDown?.(event);
    if (disabled || event.defaultPrevented) return;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setActiveValue(value);
      return;
    }

    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;

    const enabledTabs = tabValues.filter((tab) => !tab.disabled);
    const currentIndex = enabledTabs.findIndex((tab) => tab.value === value);
    if (currentIndex === -1) return;

    event.preventDefault();
    const nextIndex =
      event.key === 'ArrowRight'
        ? (currentIndex + 1) % enabledTabs.length
        : (currentIndex - 1 + enabledTabs.length) % enabledTabs.length;
    const nextValue = enabledTabs[nextIndex]?.value;
    if (nextValue === undefined) return;

    setActiveValue(nextValue);
    document.getElementById(`${baseId}-tab-${nextValue}`)?.focus();
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
        tabIndex={active ? 0 : -1}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
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
