import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProgressBar } from './ProgressBar';

const meta = {
  title: 'Components/ProgressBar',
  component: ProgressBar,
  tags: ['autodocs'],
  args: {
    value: 50,
    max: 100,
  },
} satisfies Meta<typeof ProgressBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithLabel: Story = {
  args: {
    value: 70,
    label: true,
  },
};

export const Indeterminate: Story = {
  args: {
    indeterminate: true,
  },
};

export const Colored: Story = {
  args: {
    value: 40,
    progressClassName: 'red-168',
  },
};

export const UntexturedTrack: Story = {
  args: {
    value: 50,
    trackBackground: false,
  },
};

// テクスチャは不透明なので、トラックを色クラスで塗るには trackBackground={false} が要る。
export const ColoredTrack: Story = {
  args: {
    value: 50,
    trackBackground: false,
    className: 'green-168',
  },
};
