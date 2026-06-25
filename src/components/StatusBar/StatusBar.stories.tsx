import type { Meta, StoryObj } from '@storybook/react-vite';
import { StatusBar, StatusBarItem, StatusBarDivider } from './StatusBar';

const meta = {
  title: 'Components/StatusBar',
  component: StatusBar,
  tags: ['autodocs'],
} satisfies Meta<typeof StatusBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <StatusBar>
      <StatusBarItem href="#!">
        <span className="red-168-text">F1</span> Help
      </StatusBarItem>
      <StatusBarDivider />
      <StatusBarItem href="#!">
        <span className="red-168-text">F2</span> Menu
      </StatusBarItem>
      <StatusBarDivider />
      <StatusBarItem href="#!">
        <span className="red-168-text">F3</span> View
      </StatusBarItem>
    </StatusBar>
  ),
};
