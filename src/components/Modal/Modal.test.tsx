import { createRef } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
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

  it('sets dialog semantics and accepts accessible labelling props', () => {
    render(
      <Modal open aria-label="Settings">
        <div>content</div>
      </Modal>,
    );
    const dialog = screen.getByRole('dialog', { name: 'Settings' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  it('moves focus into the modal and restores previous focus when closed', () => {
    const { rerender } = render(
      <>
        <button type="button">Before</button>
        <Modal open={false}>
          <button type="button">Inside</button>
        </Modal>
      </>,
    );
    const before = screen.getByRole('button', { name: 'Before' });
    before.focus();

    rerender(
      <>
        <button type="button">Before</button>
        <Modal open>
          <button type="button">Inside</button>
        </Modal>
      </>,
    );
    expect(screen.getByRole('button', { name: 'Inside' })).toHaveFocus();

    rerender(
      <>
        <button type="button">Before</button>
        <Modal open={false}>
          <button type="button">Inside</button>
        </Modal>
      </>,
    );
    expect(before).toHaveFocus();
  });

  it('traps Tab focus inside the modal', async () => {
    const user = userEvent.setup();
    render(
      <Modal open>
        <button type="button">First</button>
        <button type="button">Last</button>
      </Modal>,
    );
    const first = screen.getByRole('button', { name: 'First' });
    const last = screen.getByRole('button', { name: 'Last' });
    await waitFor(() => expect(first).toHaveFocus());

    await user.tab();
    expect(last).toHaveFocus();

    await user.tab();
    expect(first).toHaveFocus();
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

  it('defaults type to button and honors an explicit type', () => {
    render(
      <>
        <ModalCloseButton>Default</ModalCloseButton>
        <ModalCloseButton type="submit">Submit</ModalCloseButton>
      </>,
    );
    expect(screen.getByRole('button', { name: 'Default' })).toHaveAttribute('type', 'button');
    expect(screen.getByRole('button', { name: 'Submit' })).toHaveAttribute('type', 'submit');
  });
});
