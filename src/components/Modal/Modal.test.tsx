import { createRef } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal, ModalCloseButton } from './Modal';

describe('Modal', () => {
  it('renders into a portal under document.body', () => {
    render(
      <Modal open>
        <div className="tui-window">Hello</div>
      </Modal>,
    );
    const modal = document.querySelector('.tui-modal');
    expect(modal).not.toBeNull();
    expect(modal!.closest('body')).toBe(document.body);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('does not apply the active class when open is false', () => {
    render(
      <Modal open={false}>
        <div>content</div>
      </Modal>,
    );
    expect(document.querySelector('.tui-modal')).not.toHaveClass('active');
    expect(document.querySelector('.tui-overlap')).not.toHaveClass('active');
  });

  it('applies the active class to modal and overlap when open is true', () => {
    render(
      <Modal open>
        <div>content</div>
      </Modal>,
    );
    expect(document.querySelector('.tui-modal')).toHaveClass('active');
    expect(document.querySelector('.tui-overlap')).toHaveClass('active');
  });

  it('calls onClose when the overlap is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose}>
        <div>content</div>
      </Modal>,
    );
    await user.click(document.querySelector('.tui-overlap')!);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose on overlap click when closeOnOverlapClick is false', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} closeOnOverlapClick={false}>
        <div>content</div>
      </Modal>,
    );
    await user.click(document.querySelector('.tui-overlap')!);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('calls onClose when Escape is pressed', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose}>
        <div>content</div>
      </Modal>,
    );
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose on Escape when closeOnEsc is false', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} closeOnEsc={false}>
        <div>content</div>
      </Modal>,
    );
    await user.keyboard('{Escape}');
    expect(onClose).not.toHaveBeenCalled();
  });

  it('does not listen for Escape when closed', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <Modal open={false} onClose={onClose}>
        <div>content</div>
      </Modal>,
    );
    await user.keyboard('{Escape}');
    expect(onClose).not.toHaveBeenCalled();
  });

  it('merges className into the tui-modal element', () => {
    render(
      <Modal open className="extra">
        <div>content</div>
      </Modal>,
    );
    const modal = document.querySelector('.tui-modal');
    expect(modal).toHaveClass('tui-modal');
    expect(modal).toHaveClass('extra');
  });

  it('forwards ref to the tui-modal element', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Modal open ref={ref}>
        <div>content</div>
      </Modal>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveClass('tui-modal');
  });
});

describe('ModalCloseButton', () => {
  it('renders button.tui-button.tui-modal-close-button and fires onClick', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<ModalCloseButton onClick={onClick}>Close</ModalCloseButton>);
    const button = screen.getByRole('button', { name: 'Close' });
    expect(button).toHaveClass('tui-button');
    expect(button).toHaveClass('tui-modal-close-button');
    await user.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
