import type { Meta, StoryObj } from '@storybook/react-vite';
import { Navbar, NavbarItem } from './Navbar';

const meta = {
  title: 'Components/Navbar',
  component: Navbar,
  tags: ['autodocs'],
} satisfies Meta<typeof Navbar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Navbar>
      <NavbarItem href="#!">File</NavbarItem>
      <NavbarItem href="#!">Edit</NavbarItem>
      <NavbarItem href="#!">View</NavbarItem>
      <NavbarItem href="#!">Help</NavbarItem>
    </Navbar>
  ),
};

export const WithDropdown: Story = {
  render: () => (
    <Navbar>
      <NavbarItem href="#!">File</NavbarItem>
      <li className="tui-dropdown">
        <button className="tui-button">Edit</button>
        <div className="tui-dropdown-content">
          <ul>
            <li>
              <a href="#!">Undo</a>
            </li>
            <li>
              <a href="#!">Redo</a>
            </li>
          </ul>
        </div>
      </li>
      <NavbarItem href="#!">Help</NavbarItem>
    </Navbar>
  ),
};
