import type { Meta, StoryObj } from '@storybook/react-vite';
import { Shortcut } from './Shortcut';

const meta = {
  title: 'Components/Shortcut',
  component: Shortcut,
  tags: ['autodocs'],
  args: {
    children: 'F3',
  },
} satisfies Meta<typeof Shortcut>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const InMenuItem: Story = {
  render: (args) => (
    <ul className="tui-menu" style={{ width: 200 }}>
      <li className="tui-menu-item">
        Open
        <Shortcut {...args} />
      </li>
    </ul>
  ),
};
