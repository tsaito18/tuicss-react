import type { Meta, StoryObj } from '@storybook/react-vite';
import { Fieldset } from './Fieldset';

const meta = {
  title: 'Components/Fieldset',
  component: Fieldset,
  tags: ['autodocs'],
} satisfies Meta<typeof Fieldset>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    legend: 'Fieldset',
    children: 'Some content inside the fieldset.',
  },
};

export const BorderDouble: Story = {
  args: {
    legend: 'Fieldset',
    className: 'tui-border-double',
    children: 'Some content inside the fieldset.',
  },
};

export const NoLegend: Story = {
  args: {
    children: 'A fieldset rendered without a legend.',
  },
};
