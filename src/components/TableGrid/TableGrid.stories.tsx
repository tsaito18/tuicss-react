import type { Meta, StoryObj } from '@storybook/react-vite';
import { TableGrid } from './TableGrid';

const meta = {
  title: 'Components/TableGrid',
  component: TableGrid,
  tags: ['autodocs'],
} satisfies Meta<typeof TableGrid>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <TableGrid {...args}>
      <tbody>
        <tr>
          <td colSpan={3}>Phoenix BIOS Setup Utility</td>
        </tr>
        <tr>
          <td rowSpan={3} width="30%">
            Main
          </td>
          <td width="40%">System Time</td>
          <td>10:30:25</td>
        </tr>
        <tr>
          <td>System Date</td>
          <td>06/25/2026</td>
        </tr>
        <tr>
          <td>System Memory</td>
          <td>640 KB</td>
        </tr>
      </tbody>
    </TableGrid>
  ),
};
