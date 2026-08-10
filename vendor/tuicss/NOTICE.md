# NOTICE — Vendored TuiCss source

このディレクトリ (`vendor/tuicss/`) 配下のファイルは、サードパーティ製ライブラリ
**TuiCss** のソース成果物（SCSS ソース・フォント・画像・ライセンス）を、本プロジェクト
（`@tsaito18/tuicss-react`）の CSS ビルドに利用するためにベンダリング（取り込み）したものです。

これらのファイルは本プロジェクトのオリジナル著作物ではなく、下記の第三者著作物です。

## 取得元

- リポジトリ: https://github.com/vinibiavatti1/TuiCss
- 作者: Vinicius Reif Biavatti (Vinícius Reif Biavatti)
- ライセンス: MIT License（全文は同ディレクトリの `LICENSE` を参照）
- 著作権表記: Copyright (c) 2019 Vinicius Reif Biavatti

## 取得バージョン

- バージョン / タグ: **v2.1.2**
- コミットハッシュ: **6a021ecc2abb1fbe6da62bd370d1f2a764da1195**
- 取得日: **2026-06-25**

## 取り込み範囲

本家リポジトリの `src/` 配下のうち、CSS ビルドに必要なソースのみを取り込んでいます。

- SCSS ソース一式: `tuicss.scss`（エントリポイント）, `variables.scss`, `mixins.scss`,
  `styles/`, `components/`, `plugins/`
- フォント: `fonts/`（`.ttf` および説明テキスト `dos437.txt`）
- 画像アセット: `images/`（背景テクスチャ・スクロールバー用 `.png`）
- ライセンス: `LICENSE`（本家 `LICENSE.md` をリネームして配置）

本家のコンパイル済み `dist/`、デモ用 `examples/`、`resources/`、対話用 JavaScript
（`src/js/tuicss.js`）、ビルド設定（`gulpfile.js` 等）は取り込んでいません。

## 改変方針

ベンダリングしたファイルは原則として無改変で保持します。アップストリーム更新時は、
上記のタグ／コミットハッシュ／取得日を更新したうえで再取得してください。

やむを得ず改変する場合は、下記「ローカル改変一覧」に必ず記録してください。再取得時は
この一覧の差分を再適用する必要があります（記録がないと無言で失われます）。

## ローカル改変一覧

### `components/scrollbar.scss` — `.tui-scroll-*` を子孫セレクタから自要素セレクタへ

本家は `.tui-scroll-blue { ::-webkit-scrollbar-track { ... } }` と記述しており、これは
`.tui-scroll-blue ::-webkit-scrollbar-track`（子孫）にコンパイルされるため、クラスを
付与した要素**自身**のスクロールバーには適用されません。本プロジェクトの `ScrollArea`
は `tui-scroll-*` をスクロールする要素自身に付与する API のため、`&::-webkit-scrollbar-*`
に変更して自要素へ適用されるようにしています。

### `components/checkbox.scss`, `components/radio.scss` — マーカーとラベルの間隔

本家は `padding-left: 30px`。マーカー（`[√]` / `(•)`）は 3 文字あり、既定フォント
（Lucida Console 18px）では約 32px あるため、ラベル文字列がマーカーに接触・微妙に重なります。
`padding-left: 4ch` に変更し、マーカー 3 文字 + 1 文字分の間隔を常に確保しています。`ch` 単位に
したのは、Lucida Console が無い環境で monospace にフォールバックしても崩れないようにするためです。

### `components/modal.scss` — ダイアログを画面中央に配置

本家は `.tui-modal` が `position: absolute; top: 100px; left: 0; right: 0` で左上寄せ固定です。
`position: fixed` + `top/left: 50%` + `translate(-50%, -50%)` に変更してビューポート中央へ寄せています。
幅は指定せず shrink-to-fit のままにしてあり、ダイアログ本体の外側は `.tui-overlap` が
クリックを受け取ります（`Modal` の `closeOnOverlapClick` を壊さないため）。あわせて
`.tui-overlap` も `position: fixed` にし、スクロール中も全面を覆うようにしています。

### `components/sidenav.scss` — `.tui-sidenav-button` の行頭記号を打ち消す

`.tui-sidenav-button` は `li` 要素で、本家デモでは常に `.tui-nav` の `ul` 内に置かれます。
本プロジェクトの `SidenavButton` は単独配置も許すため、既定の `display: list-item` のままだと
行頭記号（•）が描画されます。`display: inline-block` を追加して打ち消しています（`.tui-nav ul li`
も元々 `inline-block` なので、`ul` 内に置いた場合の見た目は変わりません）。
