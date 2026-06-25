import type { Meta, StoryObj } from '@storybook/react-vite';
import { Textarea } from './Textarea';

const meta = {
  title: 'Components/Textarea',
  component: Textarea,
  tags: ['autodocs'],
} satisfies Meta<typeof Textarea>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    rows: 4,
    placeholder: 'Enter text...',
  },
};

export const Disabled: Story = {
  args: {
    rows: 4,
    placeholder: 'Enter text...',
    disabled: true,
  },
};
