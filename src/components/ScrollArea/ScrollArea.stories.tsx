import type { Meta, StoryObj } from '@storybook/react-vite';
import { ScrollArea } from './ScrollArea';

const LongContent = () => (
  <div style={{ padding: '8px' }}>
    {Array.from({ length: 40 }, (_, i) => (
      <p key={i}>Line {i + 1}: scroll down to see the styled scrollbar.</p>
    ))}
  </div>
);

const meta = {
  title: 'Components/ScrollArea',
  component: ScrollArea,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Scrollbar colors use the webkit scrollbar pseudo-elements and are Chrome-only.',
      },
    },
  },
  args: {
    style: { height: 200, width: 320, border: '2px solid currentColor' },
    children: <LongContent />,
  },
} satisfies Meta<typeof ScrollArea>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Green: Story = {
  args: { color: 'green' },
};

export const Red: Story = {
  args: { color: 'red' },
};

export const Purple: Story = {
  args: { color: 'purple' },
};
