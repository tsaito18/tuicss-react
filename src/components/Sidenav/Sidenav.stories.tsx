import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Sidenav, SidenavButton, SidenavItem } from './Sidenav';

const meta = {
  title: 'Components/Sidenav',
  component: Sidenav,
  tags: ['autodocs'],
  args: {
    open: false,
  },
} satisfies Meta<typeof Sidenav>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <SidenavButton onClick={() => setOpen((value) => !value)}>≡</SidenavButton>
        <Sidenav {...args} open={open}>
          <SidenavItem href="#!">Item 1</SidenavItem>
          <SidenavItem href="#!">Item 2</SidenavItem>
          <SidenavItem href="#!">Item 3</SidenavItem>
        </Sidenav>
      </>
    );
  },
};

export const Right: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <SidenavButton onClick={() => setOpen((value) => !value)}>≡</SidenavButton>
        <Sidenav {...args} open={open} position="right">
          <SidenavItem href="#!">Item 1</SidenavItem>
          <SidenavItem href="#!">Item 2</SidenavItem>
          <SidenavItem href="#!">Item 3</SidenavItem>
        </Sidenav>
      </>
    );
  },
};
