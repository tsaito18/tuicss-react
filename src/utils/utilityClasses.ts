/**
 * 本家 TuiCss の装飾ユーティリティ (border / shadow / scrollbar) に対応する
 * 型付き className ヘルパ群。いずれも純関数で、実在しないクラスは型で弾く。
 *
 * 対応する vendor SCSS:
 * - vendor/tuicss/components/border.scss
 * - vendor/tuicss/components/shadow.scss
 * - vendor/tuicss/components/scrollbar.scss
 */

/** border.scss が定義する枠線スタイル。`tui-border-{style}` に対応する。 */
export type TuiBorderStyle = 'solid' | 'double' | 'dotted' | 'dashed';

/**
 * 枠線スタイルクラスを返す。
 *
 * @example
 * borderClass('double') // => 'tui-border-double'
 */
export function borderClass(style: TuiBorderStyle): string {
  return `tui-border-${style}`;
}

/** shadow の段階 (1〜5)。shadow.scss は各方向で 5 段階のみ定義する。 */
export type TuiShadowLevel = 1 | 2 | 3 | 4 | 5;

/** 影の方向。`right` は既定 (`tui-shadow*`)、`left` は `tui-shadow-left*`。 */
export type TuiShadowDirection = 'right' | 'left';

/**
 * {@link shadowClass} の入力。shadow.scss の実在クラスのみ表現できるよう設計している。
 *
 * - `none: true` を指定すると `tui-no-shadow` を返し、他のフィールドは無視される。
 * - `direction` 未指定 (または `'right'`) は右方向、`'left'` は左方向。
 * - `level` 未指定は基底クラス (`tui-shadow` / `tui-shadow-left`) を返す。
 *   `tui-shadow` と `tui-shadow-1`、`tui-shadow-left` と `tui-shadow-left-1` は
 *   それぞれ同一スタイルだが、基底クラス名を安定して返すため未指定時は番号を付けない。
 */
export interface TuiShadowInput {
  direction?: TuiShadowDirection;
  level?: TuiShadowLevel;
  none?: boolean;
}

/**
 * 影クラスを返す。
 *
 * @example
 * shadowClass()                          // => 'tui-shadow'
 * shadowClass({ level: 3 })              // => 'tui-shadow-3'
 * shadowClass({ direction: 'left' })     // => 'tui-shadow-left'
 * shadowClass({ direction: 'left', level: 2 }) // => 'tui-shadow-left-2'
 * shadowClass({ none: true })            // => 'tui-no-shadow'
 */
export function shadowClass(input: TuiShadowInput = {}): string {
  if (input.none) {
    return 'tui-no-shadow';
  }
  const base = input.direction === 'left' ? 'tui-shadow-left' : 'tui-shadow';
  return input.level === undefined ? base : `${base}-${input.level}`;
}

/**
 * scrollbar.scss が定義するスクロールバー配色。既定 (クラス未付与時) は cyan。
 * scrollbar.scss は cyan を含む 7 色のみ定義する (orange 等は存在しない)。
 */
export type TuiScrollbarColor =
  | 'cyan'
  | 'blue'
  | 'green'
  | 'red'
  | 'purple'
  | 'yellow'
  | 'white';

/**
 * スクロールバー配色クラスを返す。**Chrome (webkit) 専用** で、`::-webkit-scrollbar`
 * を持たないブラウザ (Firefox 等) では無視される。
 *
 * @example
 * scrollbarClass('green') // => 'tui-scroll-green'
 */
export function scrollbarClass(color: TuiScrollbarColor): string {
  return `tui-scroll-${color}`;
}
