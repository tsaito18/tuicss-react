import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Range } from './Range';

const meta = {
  title: 'Components/Range',
  component: Range,
  tags: ['autodocs'],
  args: {
    min: 0,
    max: 100,
    defaultValue: 40,
  },
} satisfies Meta<typeof Range>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState(60);
    return (
      <div className="tui-window full-width">
        <fieldset className="tui-fieldset">
          <legend>Volume</legend>
          <Range {...args} value={value} onChange={(event) => setValue(Number(event.target.value))} />
          <p>{value}%</p>
        </fieldset>
      </div>
    );
  },
};

export const Stepped: Story = {
  args: {
    min: 0,
    max: 10,
    step: 1,
    defaultValue: 7,
  },
};

export const UntexturedTrack: Story = {
  args: {
    trackBackground: false,
  },
};

export const RedTrack: Story = {
  args: {
    trackBackground: 'red-black',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
