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
