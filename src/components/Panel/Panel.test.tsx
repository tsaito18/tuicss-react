import { createRef } from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Panel, PanelHeader, PanelContent } from './Panel';

describe('Panel', () => {
  it('renders a div.tui-panel', () => {
    render(<Panel data-testid="panel">body</Panel>);
    const panel = screen.getByTestId('panel');
    expect(panel.tagName).toBe('DIV');
    expect(panel).toHaveClass('tui-panel');
  });

  it('renders children', () => {
    render(<Panel>inside</Panel>);
    expect(screen.getByText('inside')).toBeInTheDocument();
  });

  it('merges an additional className', () => {
    render(
      <Panel className="extra" data-testid="panel">
        body
      </Panel>,
    );
    const panel = screen.getByTestId('panel');
    expect(panel).toHaveClass('tui-panel');
    expect(panel).toHaveClass('extra');
  });

  it('forwards ref to the underlying div element', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Panel ref={ref}>body</Panel>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveClass('tui-panel');
  });

  it('composes header and content as nested children', () => {
    render(
      <Panel data-testid="panel">
        <PanelHeader>Header</PanelHeader>
        <PanelContent>Content</PanelContent>
      </Panel>,
    );
    const panel = screen.getByTestId('panel');
    const header = screen.getByText('Header');
    const content = screen.getByText('Content');
    expect(header).toHaveClass('tui-panel-header');
    expect(content).toHaveClass('tui-panel-content');
    expect(panel).toContainElement(header);
    expect(panel).toContainElement(content);
  });
});

describe('PanelHeader', () => {
  it('renders a div.tui-panel-header', () => {
    render(<PanelHeader data-testid="header">Header</PanelHeader>);
    const header = screen.getByTestId('header');
    expect(header.tagName).toBe('DIV');
    expect(header).toHaveClass('tui-panel-header');
  });

  it('merges an additional className', () => {
    render(
      <PanelHeader className="extra" data-testid="header">
        Header
      </PanelHeader>,
    );
    const header = screen.getByTestId('header');
    expect(header).toHaveClass('tui-panel-header');
    expect(header).toHaveClass('extra');
  });

  it('renders children', () => {
    render(<PanelHeader>Header text</PanelHeader>);
    expect(screen.getByText('Header text')).toBeInTheDocument();
  });

  it('forwards ref to the underlying div element', () => {
    const ref = createRef<HTMLDivElement>();
    render(<PanelHeader ref={ref}>Header</PanelHeader>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveClass('tui-panel-header');
  });
});

describe('PanelContent', () => {
  it('renders a div.tui-panel-content', () => {
    render(<PanelContent data-testid="content">Content</PanelContent>);
    const content = screen.getByTestId('content');
    expect(content.tagName).toBe('DIV');
    expect(content).toHaveClass('tui-panel-content');
  });

  it('merges an additional className', () => {
    render(
      <PanelContent className="extra" data-testid="content">
        Content
      </PanelContent>,
    );
    const content = screen.getByTestId('content');
    expect(content).toHaveClass('tui-panel-content');
    expect(content).toHaveClass('extra');
  });

  it('renders children', () => {
    render(<PanelContent>Content text</PanelContent>);
    expect(screen.getByText('Content text')).toBeInTheDocument();
  });

  it('forwards ref to the underlying div element', () => {
    const ref = createRef<HTMLDivElement>();
    render(<PanelContent ref={ref}>Content</PanelContent>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveClass('tui-panel-content');
  });
});
