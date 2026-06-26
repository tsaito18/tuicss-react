import type { Meta, StoryObj } from '@storybook/react-vite';
import { Dropdown, DropdownItem } from './Dropdown';

// Dropdown のルートは li のため、単体表示では ul でラップする(navbar 外で使う場合の標準パターン)。
const meta: Meta<typeof Dropdown> = {
  title: 'Components/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ul style={{ display: 'inline-block' }}>
        <Story />
      </ul>
    ),
  ],
  args: {
    label: 'Dropdown',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <>
        <DropdownItem href="#!">Option 1</DropdownItem>
        <DropdownItem href="#!">Option 2</DropdownItem>
        <DropdownItem href="#!">Option 3</DropdownItem>
      </>
    ),
  },
};
