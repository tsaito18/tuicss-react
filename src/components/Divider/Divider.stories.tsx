import type { Meta, StoryObj } from '@storybook/react-vite';
import { Divider } from './Divider';

const meta = {
  title: 'Components/Divider',
  component: Divider,
  tags: ['autodocs'],
} satisfies Meta<typeof Divider>;

export default meta;

type Story = StoryObj<typeof meta>;

export const White: Story = {
  render: (args) => (
    <div>
      <p>Above the divider</p>
      <Divider {...args} />
      <p>Below the divider</p>
    </div>
  ),
};

export const Black: Story = {
  args: {
    color: 'black',
  },
  render: (args) => (
    <div style={{ backgroundColor: 'rgb(170, 170, 170)', padding: '0.5rem' }}>
      <p>Above the divider</p>
      <Divider {...args} />
      <p>Below the divider</p>
    </div>
  ),
};
