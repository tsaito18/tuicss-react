import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { mkdirSync, writeFileSync, cpSync } from 'node:fs';
import * as sass from 'sass';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const vendorDir = join(root, 'vendor', 'tuicss');
const entry = join(vendorDir, 'tuicss.scss');
const distDir = join(root, 'dist');

mkdirSync(distDir, { recursive: true });

const result = sass.compile(entry, { style: 'expanded' });
writeFileSync(join(distDir, 'styles.css'), result.css);

// fonts/images must sit beside styles.css because the vendored @font-face and
// background url() references use output-relative paths (./fonts, images/...).
cpSync(join(vendorDir, 'fonts'), join(distDir, 'fonts'), { recursive: true });
cpSync(join(vendorDir, 'images'), join(distDir, 'images'), { recursive: true });

console.log(`build:css done -> ${join(distDir, 'styles.css')} (${result.css.length} bytes)`);
