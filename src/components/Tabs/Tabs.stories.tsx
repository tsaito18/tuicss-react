import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tabs, TabList, Tab, TabPanel } from './Tabs';

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['autodocs'],
} satisfies Meta<typeof Tabs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="tab-1">
      <TabList>
        <Tab value="tab-1">Tab 1</Tab>
        <Tab value="tab-2">Tab 2</Tab>
        <Tab value="tab-3" disabled>
          Tab 3
        </Tab>
      </TabList>
      <TabPanel value="tab-1">Content of the first tab.</TabPanel>
      <TabPanel value="tab-2">Content of the second tab.</TabPanel>
      <TabPanel value="tab-3">Content of the third (disabled) tab.</TabPanel>
    </Tabs>
  ),
};
