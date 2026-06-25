import { createRef } from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Table } from './Table';

describe('Table', () => {
  it('renders a table.tui-table', () => {
    const { container } = render(<Table />);
    const table = container.querySelector('table');
    expect(table).not.toBeNull();
    expect(table).toHaveClass('tui-table');
  });

  it('renders children (thead/tbody/tr/td)', () => {
    const { container } = render(
      <Table>
        <thead>
          <tr>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Alice</td>
          </tr>
        </tbody>
      </Table>,
    );
    expect(container.querySelector('thead')).not.toBeNull();
    expect(container.querySelector('tbody')).not.toBeNull();
    expect(container.querySelector('th')?.textContent).toBe('Name');
    expect(container.querySelector('td')?.textContent).toBe('Alice');
  });

  it('applies hovered-{color} when hovered is set', () => {
    const { container } = render(<Table hovered="cyan" />);
    expect(container.querySelector('table')).toHaveClass('tui-table', 'hovered-cyan');
  });

  it('applies striped-{color} when striped is set', () => {
    const { container } = render(<Table striped="green" />);
    expect(container.querySelector('table')).toHaveClass('tui-table', 'striped-green');
  });

  it('applies both hovered and striped modifiers together', () => {
    const { container } = render(<Table hovered="red" striped="blue" />);
    expect(container.querySelector('table')).toHaveClass(
      'tui-table',
      'hovered-red',
      'striped-blue',
    );
  });

  it('merges className', () => {
    const { container } = render(<Table className="custom" striped="yellow" />);
    expect(container.querySelector('table')).toHaveClass(
      'tui-table',
      'striped-yellow',
      'custom',
    );
  });

  it('forwards ref to the table element', () => {
    const ref = createRef<HTMLTableElement>();
    render(<Table ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLTableElement);
  });
});
