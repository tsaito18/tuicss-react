import type { Meta, StoryObj } from '@storybook/react-vite';
import { Screen } from './Screen';

const meta = {
  title: 'Components/Screen',
  component: Screen,
  tags: ['autodocs'],
  args: {
    size: '800-600',
    bordered: true,
    centered: true,
    children: 'TUI SCREEN',
  },
} satisfies Meta<typeof Screen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Small: Story = {
  args: {
    size: '640-480',
    children: '640 x 480',
  },
};

export const Large: Story = {
  args: {
    size: '1024-768',
    children: '1024 x 768',
  },
};
