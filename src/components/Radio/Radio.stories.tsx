import type { Meta, StoryObj } from '@storybook/react-vite';
import { Radio } from './Radio';

const meta = {
  title: 'Components/Radio',
  component: Radio,
  tags: ['autodocs'],
  args: {
    children: 'Radio',
    name: 'demo',
  },
} satisfies Meta<typeof Radio>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Group: Story = {
  render: () => (
    <>
      <Radio name="group" defaultChecked>
        One
      </Radio>
      <Radio name="group">Two</Radio>
      <Radio name="group">Three</Radio>
    </>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
