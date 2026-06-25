import { createRef } from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { TableGrid } from './TableGrid';

describe('TableGrid', () => {
  it('renders a table with the tui-table-grid class', () => {
    const { container } = render(<TableGrid />);
    const table = container.querySelector('table');
    expect(table).not.toBeNull();
    expect(table).toHaveClass('tui-table-grid');
  });

  it('renders native tbody/tr/td children with span and width attributes', () => {
    const { container } = render(
      <TableGrid>
        <tbody>
          <tr>
            <td rowSpan={2} width="60%">
              Left
            </td>
            <td>Right</td>
          </tr>
          <tr>
            <td>Bottom</td>
          </tr>
        </tbody>
      </TableGrid>,
    );
    const spannedCell = container.querySelector('td[rowspan="2"]');
    expect(spannedCell).not.toBeNull();
    expect(spannedCell).toHaveAttribute('width', '60%');
    expect(spannedCell?.textContent).toBe('Left');
    expect(container.querySelectorAll('tr')).toHaveLength(2);
  });

  it('merges an additional className', () => {
    const { container } = render(<TableGrid className="extra" />);
    const table = container.querySelector('table');
    expect(table).toHaveClass('tui-table-grid');
    expect(table).toHaveClass('extra');
  });

  it('forwards ref to the underlying table element', () => {
    const ref = createRef<HTMLTableElement>();
    render(<TableGrid ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLTableElement);
  });
});
