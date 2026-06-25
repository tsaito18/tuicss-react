import type {
  TuiColorToken,
  TuiBgClass,
  TuiTextClass,
  TuiBorderClass,
  TuiBgHoverClass,
  TuiTextHoverClass,
  TuiBorderHoverClass,
  TuiColorClass,
} from '../types/colors';
import { cx } from './cx';

/**
 * 色クラス生成の入力。各スロットに {@link TuiColorToken} を渡すと、本家 TuiCss の
 * 対応するクラス名 (背景=素のトークン / 文字=`-text` / 枠線=`-border` および各 `-hover`)
 * に変換される。すべて任意で、指定したスロットのみ出力される。
 */
export interface TuiColorInput {
  /** 背景色。例: `'blue-168'` → `blue-168` */
  bg?: TuiColorToken;
  /** 文字色。例: `'white'` → `white-text` */
  text?: TuiColorToken;
  /** 枠線色。例: `'red-255'` → `red-255-border` */
  border?: TuiColorToken;
  /** hover 時の背景色。例: `'green-255'` → `green-255-hover` */
  bgHover?: TuiColorToken;
  /** hover 時の文字色。例: `'primary'` → `primary-text-hover` */
  textHover?: TuiColorToken;
  /** hover 時の枠線色。例: `'danger'` → `danger-border-hover` */
  borderHover?: TuiColorToken;
}

const bgClass = (t: TuiColorToken): TuiBgClass => t;
const textClass = (t: TuiColorToken): TuiTextClass => `${t}-text`;
const borderClass = (t: TuiColorToken): TuiBorderClass => `${t}-border`;
const bgHoverClass = (t: TuiColorToken): TuiBgHoverClass => `${t}-hover`;
const textHoverClass = (t: TuiColorToken): TuiTextHoverClass => `${t}-text-hover`;
const borderHoverClass = (t: TuiColorToken): TuiBorderHoverClass =>
  `${t}-border-hover`;

/**
 * 色指定オブジェクトを TuiCss の色クラス文字列にまとめて変換する純関数。
 *
 * @example
 * tuiColorClasses({ bg: 'blue-168', text: 'white', border: 'red-255' })
 * // => 'blue-168 white-text red-255-border'
 *
 * 出力順は bg → text → border → bgHover → textHover → borderHover で安定。
 * 不正なトークンは型レベルで弾かれる前提のため、実行時バリデーションは行わない
 * (未指定スロットは cx により自動的に除去される)。
 */
export function tuiColorClasses(input: TuiColorInput): string {
  return cx(
    input.bg && bgClass(input.bg),
    input.text && textClass(input.text),
    input.border && borderClass(input.border),
    input.bgHover && bgHoverClass(input.bgHover),
    input.textHover && textHoverClass(input.textHover),
    input.borderHover && borderHoverClass(input.borderHover),
  );
}

/**
 * 個別スロット用のクラス名ビルダ。コンポーネントが単一の色 prop を扱う際に、
 * 余分なオブジェクトを組まず直接クラス名を得られるようにする。
 */
export const tuiColor = {
  bg: bgClass,
  text: textClass,
  border: borderClass,
  bgHover: bgHoverClass,
  textHover: textHoverClass,
  borderHover: borderHoverClass,
} satisfies Record<keyof TuiColorInput, (t: TuiColorToken) => TuiColorClass>;
