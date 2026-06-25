import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Chart,
  ChartDisplay,
  ChartValue,
  ChartXAxis,
  ChartYAxis,
  ChartLegend,
  ChartData,
} from './Chart';

// tui-chart-* は position:relative の枠内で子を absolute 配置するため、
// 視覚的にバーを見せるには明示的な width/height が必要。
const meta = {
  title: 'Components/Chart',
  component: Chart,
  tags: ['autodocs'],
} satisfies Meta<typeof Chart>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Vertical: Story = {
  render: () => (
    <Chart orientation="vertical" style={{ width: 500, height: 200 }}>
      <ChartDisplay>
        <ChartValue value={80} color="red-168">
          80%
        </ChartValue>
        <ChartValue value={30} color="green-168">
          30%
        </ChartValue>
        <ChartValue value={50} color="blue-168">
          50%
        </ChartValue>
      </ChartDisplay>
      <ChartYAxis>
        <ChartLegend>100%</ChartLegend>
        <ChartLegend>75%</ChartLegend>
        <ChartLegend>50%</ChartLegend>
        <ChartLegend>25%</ChartLegend>
      </ChartYAxis>
      <ChartXAxis>
        <ChartLegend>t1</ChartLegend>
        <ChartLegend>t2</ChartLegend>
        <ChartLegend>t3</ChartLegend>
      </ChartXAxis>
    </Chart>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <Chart orientation="horizontal" style={{ width: 500, height: 200 }}>
      <ChartDisplay>
        <ChartValue value={80} color="red-168">
          80%
        </ChartValue>
        <ChartValue value={60} color="green-168">
          60%
        </ChartValue>
        <ChartValue value={100} color="blue-168">
          100%
        </ChartValue>
      </ChartDisplay>
      <ChartYAxis>
        <ChartLegend>2018</ChartLegend>
        <ChartLegend>2019</ChartLegend>
        <ChartLegend>2020</ChartLegend>
      </ChartYAxis>
      <ChartXAxis>
        <ChartLegend>25%</ChartLegend>
        <ChartLegend>50%</ChartLegend>
        <ChartLegend>75%</ChartLegend>
        <ChartLegend>100%</ChartLegend>
      </ChartXAxis>
    </Chart>
  ),
};

export const NoYAxis: Story = {
  render: () => (
    <Chart orientation="vertical" noYAxis style={{ width: 500, height: 200 }}>
      <ChartDisplay>
        <ChartValue value={40} color="cyan-168">
          40%
        </ChartValue>
        <ChartValue value={90} color="purple-168">
          90%
        </ChartValue>
        <ChartValue value={65} color="yellow-168">
          65%
        </ChartValue>
      </ChartDisplay>
      <ChartXAxis>
        <ChartLegend>a</ChartLegend>
        <ChartLegend>b</ChartLegend>
        <ChartLegend>c</ChartLegend>
      </ChartXAxis>
    </Chart>
  ),
};

export const FromData: Story = {
  render: () => (
    <ChartData
      orientation="vertical"
      style={{ width: 500, height: 200 }}
      data={[
        { value: 80, color: 'red-168', label: '80%' },
        { value: 30, color: 'green-168', label: '30%' },
        { value: 50, color: 'blue-168', label: '50%' },
        { value: 95, color: 'orange-168', label: '95%' },
      ]}
      yAxis={['100%', '75%', '50%', '25%']}
      xAxis={['t1', 't2', 't3', 't4']}
    />
  ),
};
