import { createRef } from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Container, Row, Col } from './Grid';

describe('Container', () => {
  it('renders a div.container', () => {
    render(<Container data-testid="container">body</Container>);
    const el = screen.getByTestId('container');
    expect(el.tagName).toBe('DIV');
    expect(el).toHaveClass('container');
  });

  it('renders children', () => {
    render(<Container>inside</Container>);
    expect(screen.getByText('inside')).toBeInTheDocument();
  });

  it('merges an additional className', () => {
    render(
      <Container className="extra" data-testid="container">
        body
      </Container>,
    );
    const el = screen.getByTestId('container');
    expect(el).toHaveClass('container');
    expect(el).toHaveClass('extra');
  });

  it('forwards ref to the underlying div element', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Container ref={ref}>body</Container>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveClass('container');
  });
});

describe('Row', () => {
  it('renders a div.row', () => {
    render(<Row data-testid="row">body</Row>);
    const el = screen.getByTestId('row');
    expect(el.tagName).toBe('DIV');
    expect(el).toHaveClass('row');
  });

  it('renders children', () => {
    render(<Row>inside</Row>);
    expect(screen.getByText('inside')).toBeInTheDocument();
  });

  it('merges an additional className', () => {
    render(
      <Row className="extra" data-testid="row">
        body
      </Row>,
    );
    const el = screen.getByTestId('row');
    expect(el).toHaveClass('row');
    expect(el).toHaveClass('extra');
  });

  it('forwards ref to the underlying div element', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Row ref={ref}>body</Row>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveClass('row');
  });
});

describe('Col', () => {
  it('renders a div.col', () => {
    render(<Col data-testid="col">body</Col>);
    const el = screen.getByTestId('col');
    expect(el.tagName).toBe('DIV');
    expect(el).toHaveClass('col');
  });

  it('renders children', () => {
    render(<Col>inside</Col>);
    expect(screen.getByText('inside')).toBeInTheDocument();
  });

  it('converts s/m/l props to width classes', () => {
    render(
      <Col s={6} m={4} l={3} data-testid="col">
        body
      </Col>,
    );
    const el = screen.getByTestId('col');
    expect(el).toHaveClass('col');
    expect(el).toHaveClass('s6');
    expect(el).toHaveClass('m4');
    expect(el).toHaveClass('l3');
  });

  it('converts offset props to offset classes', () => {
    render(
      <Col offsetS={2} offsetM={1} offsetL={5} data-testid="col">
        body
      </Col>,
    );
    const el = screen.getByTestId('col');
    expect(el).toHaveClass('offset-s2');
    expect(el).toHaveClass('offset-m1');
    expect(el).toHaveClass('offset-l5');
  });

  it('combines width and offset classes', () => {
    render(
      <Col s={6} m={4} l={3} offsetM={1} data-testid="col">
        body
      </Col>,
    );
    const el = screen.getByTestId('col');
    expect(el.className).toBe('col s6 m4 l3 offset-m1');
  });

  it('does not add classes for unspecified props', () => {
    render(
      <Col s={6} data-testid="col">
        body
      </Col>,
    );
    const el = screen.getByTestId('col');
    expect(el).toHaveClass('s6');
    expect(el.className).not.toMatch(/\bm\d/);
    expect(el.className).not.toMatch(/\bl\d/);
    expect(el.className).not.toMatch(/offset-/);
  });

  it('merges an additional className', () => {
    render(
      <Col className="extra" data-testid="col">
        body
      </Col>,
    );
    const el = screen.getByTestId('col');
    expect(el).toHaveClass('col');
    expect(el).toHaveClass('extra');
  });

  it('forwards ref to the underlying div element', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Col ref={ref}>body</Col>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveClass('col');
  });
});

describe('Grid composition', () => {
  it('composes Container > Row > Col', () => {
    render(
      <Container data-testid="container">
        <Row data-testid="row">
          <Col s={6} data-testid="col-a">
            A
          </Col>
          <Col s={6} data-testid="col-b">
            B
          </Col>
        </Row>
      </Container>,
    );
    const container = screen.getByTestId('container');
    const row = screen.getByTestId('row');
    const colA = screen.getByTestId('col-a');
    const colB = screen.getByTestId('col-b');
    expect(container).toContainElement(row);
    expect(row).toContainElement(colA);
    expect(row).toContainElement(colB);
    expect(colA).toHaveClass('col', 's6');
    expect(colB).toHaveClass('col', 's6');
  });
});
