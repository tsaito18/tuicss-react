import type { Meta, StoryObj } from '@storybook/react-vite';
import { Table } from './Table';

const meta = {
  title: 'Components/Table',
  component: Table,
  tags: ['autodocs'],
} satisfies Meta<typeof Table>;

export default meta;

type Story = StoryObj<typeof meta>;

const sampleRows = (
  <>
    <thead>
      <tr>
        <th>Name</th>
        <th>Role</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Alice</td>
        <td>Admin</td>
        <td>Active</td>
      </tr>
      <tr>
        <td>Bob</td>
        <td>User</td>
        <td>Active</td>
      </tr>
      <tr>
        <td>Carol</td>
        <td>User</td>
        <td>Inactive</td>
      </tr>
      <tr>
        <td>Dave</td>
        <td>Guest</td>
        <td>Active</td>
      </tr>
    </tbody>
  </>
);

export const Default: Story = {
  render: (args) => <Table {...args}>{sampleRows}</Table>,
};

export const Striped: Story = {
  args: {
    striped: 'cyan',
  },
  render: (args) => <Table {...args}>{sampleRows}</Table>,
};

export const Hovered: Story = {
  args: {
    hovered: 'cyan',
  },
  render: (args) => <Table {...args}>{sampleRows}</Table>,
};
