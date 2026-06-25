import type { Meta, StoryObj } from '@storybook/react-vite';
import { Panel, PanelHeader, PanelContent } from './Panel';

const meta = {
  title: 'Components/Panel',
  component: Panel,
  tags: ['autodocs'],
} satisfies Meta<typeof Panel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Panel>
      <PanelHeader>Panel Header</PanelHeader>
      <PanelContent>Panel content goes here.</PanelContent>
    </Panel>
  ),
};
