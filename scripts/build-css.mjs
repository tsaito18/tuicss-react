import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { mkdirSync, writeFileSync, cpSync } from 'node:fs';
import * as sass from 'sass';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const vendorDir = join(root, 'vendor', 'tuicss');
const entry = join(vendorDir, 'tuicss.scss');
const ownEntry = join(root, 'styles', 'tuicss-react.scss');
const distDir = join(root, 'dist');
const thirdPartyTuiCssDir = join(distDir, 'third-party', 'tuicss');

mkdirSync(distDir, { recursive: true });
mkdirSync(thirdPartyTuiCssDir, { recursive: true });

// 公開する CSS は styles.css 1 本のまま。本家の後ろへ自前レイヤーを連結することで、
// 同名クラスが衝突した場合も自前定義が勝つ。
const result = sass.compile(entry, { style: 'expanded' });
const own = sass.compile(ownEntry, { style: 'expanded' });
const css = `${result.css}\n${own.css}`;
writeFileSync(join(distDir, 'styles.css'), css);

// fonts/images must sit beside styles.css because the vendored @font-face and
// background url() references use output-relative paths (./fonts, images/...).
cpSync(join(vendorDir, 'fonts'), join(distDir, 'fonts'), { recursive: true });
cpSync(join(vendorDir, 'images'), join(distDir, 'images'), { recursive: true });
cpSync(join(vendorDir, 'LICENSE'), join(thirdPartyTuiCssDir, 'LICENSE'));
cpSync(join(vendorDir, 'NOTICE.md'), join(thirdPartyTuiCssDir, 'NOTICE.md'));

console.log(`build:css done -> ${join(distDir, 'styles.css')} (${css.length} bytes)`);
