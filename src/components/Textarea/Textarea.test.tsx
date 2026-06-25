import { createRef, useState } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Textarea } from './Textarea';

describe('Textarea', () => {
  it('applies the tui-textarea class', () => {
    render(<Textarea aria-label="message" />);
    expect(screen.getByLabelText('message')).toHaveClass('tui-textarea');
  });

  it('merges an additional className', () => {
    render(<Textarea aria-label="message" className="tui-textarea-error" />);
    const textarea = screen.getByLabelText('message');
    expect(textarea).toHaveClass('tui-textarea');
    expect(textarea).toHaveClass('tui-textarea-error');
  });

  it('forwards standard attributes such as rows and disabled', () => {
    render(<Textarea aria-label="message" rows={6} disabled />);
    const textarea = screen.getByLabelText('message');
    expect(textarea).toHaveAttribute('rows', '6');
    expect(textarea).toBeDisabled();
  });

  it('forwards ref to the underlying textarea element', () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<Textarea aria-label="message" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });

  it('works as a controlled component', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    function Controlled() {
      const [value, setValue] = useState('');
      return (
        <Textarea
          aria-label="message"
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            onChange(event.target.value);
          }}
        />
      );
    }

    render(<Controlled />);
    const textarea = screen.getByLabelText('message');
    await user.type(textarea, 'hi');
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(textarea).toHaveValue('hi');
  });
});
