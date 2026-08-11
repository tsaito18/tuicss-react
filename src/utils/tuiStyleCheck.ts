export interface TuiStyleCheckOptions {
  /** 判定対象の TuiCss クラス名。例: `'tui-modal'` */
  className: string;
  /** 警告文に出すコンポーネント名。例: `'Modal'` */
  componentName: string;
  /** プローブ要素のタグ名。既定は `'div'` */
  tagName?: string;
}

// プロセス全体で最初の1件だけ警告する。多数のコンポーネントが同一原因(スタイル未読込)で
// 連続して呼ぶため、componentName/className が異なっても2件目以降は握りつぶす。
let hasWarned = false;

// className ごとの判定結果をキャッシュし、同じクラスを持つコンポーネントを多数マウントしても
// そのたびに強制レイアウトを起こさないようにする。
const probeResults = new Map<string, boolean>();

/**
 * `@tsaito18/tuicss-react/styles.css` が読み込まれているかを、開発時のみ簡易判定する。
 *
 * 実際にレンダリングされた要素(例えば開いている Modal)は `.active` で
 * `display:block` になるため測定対象にできない。素の className だけを持つ
 * 使い捨てのプローブ要素を DOM に挿入し、それが本来の `display:none` を
 * 継承しているかで判定する。
 */
export function warnIfTuiStylesMissing({ className, componentName, tagName }: TuiStyleCheckOptions): void {
  if (typeof document === 'undefined') return;
  if (hasWarned) return;

  let stylesLoaded = probeResults.get(className);
  if (stylesLoaded === undefined) {
    const el = document.createElement(tagName ?? 'div');
    el.className = className;
    document.body.appendChild(el);
    let display: string;
    try {
      display = window.getComputedStyle(el).display;
    } finally {
      el.remove();
    }
    stylesLoaded = display === 'none';
    probeResults.set(className, stylesLoaded);

    if (!stylesLoaded) {
      hasWarned = true;
      console.warn(
        `[tuicss-react] ${componentName}: ".${className}" computes to display: "${display}" instead of "none". "@tsaito18/tuicss-react/styles.css" may not be loaded.`,
      );
    }
  }
}
