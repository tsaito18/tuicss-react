// 本家 TuiCss (vendor/tuicss/styles/color.scss) のクラス命名規則を型で表現する。
// 命名規則:
//   - 7 色 (blue/green/cyan/red/purple/yellow/orange) は強度サフィックス必須: `${color}-${168|255}`
//   - black/white は強度なしの素トークン (.black / .white)
//   - semantic テーマ (primary 等) は強度なし
//   - 変種: 背景=サフィックスなし / -text / -border、それぞれ -hover 版あり

/** 強度サフィックスを取る 7 つの有彩色。 */
export type TuiChromaticColor =
  | 'blue'
  | 'green'
  | 'cyan'
  | 'red'
  | 'purple'
  | 'yellow'
  | 'orange';

/** black/white を含む基本 9 色。 */
export type TuiColor = TuiChromaticColor | 'black' | 'white';

/** 強度2段階: 168=低強度(DOS風) / 255=高強度。 */
export type TuiIntensity = 168 | 255;

/** semantic テーマ 6 種 (強度なし)。 */
export type TuiSemantic =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info';

/**
 * 色の指定トークン。強度を持つ概念をひとまとめにした論理的な「色名」。
 * 有彩色は強度必須、black/white/semantic は強度なし。
 */
export type TuiColorToken =
  | `${TuiChromaticColor}-${TuiIntensity}`
  | 'black'
  | 'white'
  | TuiSemantic;

/** 背景クラス名 (例: `blue-168`, `black`, `primary`)。トークンと同形。 */
export type TuiBgClass = TuiColorToken;

/** 文字色クラス名 (例: `blue-168-text`, `white-text`, `primary-text`)。 */
export type TuiTextClass = `${TuiColorToken}-text`;

/** 枠線色クラス名 (例: `red-255-border`, `black-border`, `danger-border`)。 */
export type TuiBorderClass = `${TuiColorToken}-border`;

/** hover 時に適用される各変種クラス名。 */
export type TuiBgHoverClass = `${TuiColorToken}-hover`;
export type TuiTextHoverClass = `${TuiColorToken}-text-hover`;
export type TuiBorderHoverClass = `${TuiColorToken}-border-hover`;

/** 生成され得る全色クラス名の union。 */
export type TuiColorClass =
  | TuiBgClass
  | TuiTextClass
  | TuiBorderClass
  | TuiBgHoverClass
  | TuiTextHoverClass
  | TuiBorderHoverClass;
