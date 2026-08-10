import type { Preview } from '@storybook/react-vite';

// Vite compiles the vendored SCSS via sass so components render with the DOS aesthetic.
// url('./fonts/...') / url('./images/...') resolve relative to vendor/tuicss/ (the scss location).
import '../vendor/tuicss/tuicss.scss';
import './preview.css';

const preview: Preview = {
  parameters: {
    // TuiCss components assume a colored "screen" backdrop. A black canvas hides
    // both the hardcoded-black box-shadows and any default (black) text, so the
    // DOS blue screen is the default; gray/black stay available in the toolbar.
    backgrounds: {
      options: {
        dosBlue: { name: 'DOS Blue', value: 'rgb(0, 0, 168)' },
        darkGray: { name: 'Dark Gray', value: '#2a2a2a' },
        black: { name: 'Black', value: '#000000' },
      },
    },
  },
  initialGlobals: {
    backgrounds: { value: 'dosBlue' },
  },
  decorators: [
    (Story) => (
      <div className="sb-tui-surface">
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
};

export default preview;
