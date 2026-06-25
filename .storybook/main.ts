import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  framework: '@storybook/react-vite',
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  // addon-docs drives autodocs; addon-a11y surfaces accessibility checks (TUI is high-contrast by design).
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  // Vite leaves the vendored url() paths unresolved relative to the scss source tree
  // (font -> styles/fonts, images -> components/images). Serve the real assets at those
  // paths so the DOS font and backgrounds load at runtime.
  staticDirs: [
    { from: '../vendor/tuicss/fonts', to: '/styles/fonts' },
    { from: '../vendor/tuicss/images', to: '/components/images' },
  ],
};

export default config;
