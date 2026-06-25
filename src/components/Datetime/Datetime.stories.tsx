import type { Meta, StoryObj } from '@storybook/react-vite';
import { Datetime } from './Datetime';

const meta = {
  title: 'Components/Datetime',
  component: Datetime,
  tags: ['autodocs'],
} satisfies Meta<typeof Datetime>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    format: 'h:m:s a',
  },
};

export const Date: Story = {
  args: {
    format: 'y-M-d',
  },
};

export const TwentyFourHour: Story = {
  args: {
    format: 'H:m:s',
  },
};

export const DateAndTime: Story = {
  args: {
    format: 'y-M-d H:m:s',
  },
};
