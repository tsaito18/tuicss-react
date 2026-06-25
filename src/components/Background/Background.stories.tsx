import type { Meta, StoryObj } from '@storybook/react-vite';
import { Background } from './Background';

const meta = {
  title: 'Components/Background',
  component: Background,
  tags: ['autodocs'],
  args: {
    color: 'blue-black',
  },
} satisfies Meta<typeof Background>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Background {...args} style={{ padding: '2rem', minHeight: '12rem' }}>
      <div className="tui-window full-width">
        <fieldset className="tui-fieldset">
          <legend>Background</legend>
          <p>The textured PNG background tiles behind this window.</p>
        </fieldset>
      </div>
    </Background>
  ),
};

export const RedWhite: Story = {
  args: {
    color: 'red-white',
  },
  render: Default.render,
};

export const GreenBlack: Story = {
  args: {
    color: 'green-black',
  },
  render: Default.render,
};

export const Swatches: Story = {
  render: () => {
    const colors = [
      'blue-white',
      'blue-black',
      'green-white',
      'green-black',
      'cyan-white',
      'cyan-black',
      'red-white',
      'red-black',
      'purple-white',
      'purple-black',
      'yellow-white',
      'yellow-black',
      'orange-white',
      'orange-black',
    ] as const;
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
        {colors.map((color) => (
          <Background
            key={color}
            color={color}
            style={{ padding: '1rem', minHeight: '4rem' }}
          >
            tui-bg-{color}
          </Background>
        ))}
      </div>
    );
  },
};
