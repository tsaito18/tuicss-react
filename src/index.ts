// 公開 API の集約点。各コンポーネントとその Props 型、色ヘルパ/色の型のみを公開する。
// cx は内部ユーティリティのため意図的に非公開 (./utils/index.ts を直接束ねない)。

// コンポーネント (+ サブコンポーネント・Props 型)
export * from './components/Button';
export * from './components/Input';
export * from './components/Textarea';
export * from './components/Checkbox';
export * from './components/Radio';
export * from './components/Fieldset';
export * from './components/Dropdown';
export * from './components/Tabs';
export * from './components/Modal';
export * from './components/Sidenav';
export * from './components/Datetime';
export * from './components/Window';
export * from './components/Panel';
export * from './components/Screen';
export * from './components/Navbar';
export * from './components/StatusBar';
export * from './components/Shortcut';
export * from './components/Table';
export * from './components/TableGrid';
export * from './components/ProgressBar';
export * from './components/Chart';
export * from './components/Grid';
export * from './components/Divider';
export * from './components/Background';
export * from './components/ScrollArea';

// 色ヘルパ (cx を除き、色 API のみを選択的に公開)
export { tuiColorClasses, tuiColor } from './utils/color';
export type { TuiColorInput } from './utils/color';

// 装飾ユーティリティ (border / shadow / scrollbar の className ヘルパと型)。
// cx は内部用のため引き続き非公開 (./utils/index.ts は束ねない)。
export * from './utils/utilityClasses';

// 色の型
export * from './types/colors';
