import type { Preview } from '@storybook/react-vite';

// Vite compiles the vendored SCSS via sass so components render with the DOS aesthetic.
// url('./fonts/...') / url('./images/...') resolve relative to vendor/tuicss/ (the scss location).
import '../vendor/tuicss/tuicss.scss';

const preview: Preview = {
  parameters: {
    // TUI assumes a high-contrast dark canvas; default the preview to black.
    backgrounds: {
      options: {
        dos: { name: 'DOS', value: '#000000' },
      },
    },
  },
  initialGlobals: {
    backgrounds: { value: 'dos' },
  },
  tags: ['autodocs'],
};

export default preview;
