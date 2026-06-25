import type { Meta, StoryObj } from '@storybook/react-vite';
import { Container, Row, Col } from './Grid';

const meta = {
  title: 'Components/Grid',
  component: Container,
  tags: ['autodocs'],
} satisfies Meta<typeof Container>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Container>
      <Row>
        <Col s={6}>
          <div className="tui-panel">
            <div className="tui-panel-content">s6</div>
          </div>
        </Col>
        <Col s={6}>
          <div className="tui-panel">
            <div className="tui-panel-content">s6</div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col s={4}>
          <div className="tui-panel">
            <div className="tui-panel-content">s4</div>
          </div>
        </Col>
        <Col s={4} offsetS={4}>
          <div className="tui-panel">
            <div className="tui-panel-content">s4 offset-s4</div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col s={3} m={6} l={4}>
          <div className="tui-panel">
            <div className="tui-panel-content">s3 m6 l4</div>
          </div>
        </Col>
        <Col s={9} m={6} l={8}>
          <div className="tui-panel">
            <div className="tui-panel-content">s9 m6 l8</div>
          </div>
        </Col>
      </Row>
    </Container>
  ),
};
