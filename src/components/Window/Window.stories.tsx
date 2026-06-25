import type { Meta, StoryObj } from '@storybook/react-vite';
import { Window } from './Window';

const meta = {
  title: 'Components/Window',
  component: Window,
  tags: ['autodocs'],
  args: {
    children: (
      <fieldset className="tui-fieldset">
        <legend>Window</legend>
        <p>Window content goes here.</p>
      </fieldset>
    ),
  },
} satisfies Meta<typeof Window>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Colored: Story = {
  args: {
    className: 'red-168',
  },
};
