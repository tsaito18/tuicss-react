import { createRef } from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal, ModalBody, ModalCloseButton, ModalFooter, ModalHeader } from './Modal';
import { warnIfTuiStylesMissing } from '../../utils/tuiStyleCheck';

vi.mock('../../utils/tuiStyleCheck', () => ({ warnIfTuiStylesMissing: vi.fn() }));

const mockedWarnIfTuiStylesMissing = vi.mocked(warnIfTuiStylesMissing);

// jsdom はレイアウトを行わず documentElement.clientWidth が常に 0 になるため、
// スクロールバー幅が window.innerWidth と等しくなってしまう。現実的な差分を明示的に作る。
const stubScrollbarWidth = (width: number) => {
  Object.defineProperty(document.documentElement, 'clientWidth', {
    value: window.innerWidth - width,
    configurable: true,
  });
};

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  Reflect.deleteProperty(document.documentElement, 'clientWidth');
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';
});

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

  it('gives the overlap a translucent textured background by default', () => {
    render(
      <Modal open>
        <div>content</div>
      </Modal>,
    );
    const overlap = document.querySelector<HTMLElement>('.tui-overlap')!;
    expect(overlap).toHaveClass('tui-bg-blue-black');
    expect(overlap.style.opacity).toBe('0.8');
  });

  it('honors an explicit overlapOpacity', () => {
    render(
      <Modal open overlapOpacity={0.5}>
        <div>content</div>
      </Modal>,
    );
    expect(document.querySelector<HTMLElement>('.tui-overlap')!.style.opacity).toBe('0.5');
  });

  it('honors an explicit overlapBackground color', () => {
    render(
      <Modal open overlapBackground="green-white">
        <div>content</div>
      </Modal>,
    );
    const overlap = document.querySelector('.tui-overlap');
    expect(overlap).toHaveClass('tui-bg-green-white');
    expect(overlap).not.toHaveClass('tui-bg-blue-black');
  });

  it('renders a plain transparent overlap when overlapBackground is false', () => {
    render(
      <Modal open overlapBackground={false}>
        <div>content</div>
      </Modal>,
    );
    const overlap = document.querySelector<HTMLElement>('.tui-overlap')!;
    expect(overlap.className).toBe('tui-overlap active');
    expect(overlap.getAttribute('style')).toBeNull();
  });

  it('still closes on overlap click when overlapBackground is false', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} overlapBackground={false}>
        <div>content</div>
      </Modal>,
    );
    await user.click(document.querySelector('.tui-overlap')!);
    expect(onClose).toHaveBeenCalledTimes(1);
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

describe('Modal dismiss options', () => {
  it('disables both Escape and overlay click when dismissable is false', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} dismissable={false}>
        <div>content</div>
      </Modal>,
    );
    await user.keyboard('{Escape}');
    await user.click(document.querySelector('.tui-overlap')!);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('lets an explicit closeOnEsc win over dismissable being false', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} dismissable={false} closeOnEsc>
        <div>content</div>
      </Modal>,
    );
    await user.click(document.querySelector('.tui-overlap')!);
    expect(onClose).not.toHaveBeenCalled();

    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('lets an explicit closeOnOverlayClick win over dismissable being false', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} dismissable={false} closeOnOverlayClick>
        <div>content</div>
      </Modal>,
    );
    await user.keyboard('{Escape}');
    expect(onClose).not.toHaveBeenCalled();

    await user.click(document.querySelector('.tui-overlap')!);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose on overlap click when closeOnOverlayClick is false', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} closeOnOverlayClick={false}>
        <div>content</div>
      </Modal>,
    );
    await user.click(document.querySelector('.tui-overlap')!);
    expect(onClose).not.toHaveBeenCalled();

    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('lets closeOnOverlayClick win over the deprecated closeOnOverlapClick', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const { unmount } = render(
      <Modal open onClose={onClose} closeOnOverlayClick={false} closeOnOverlapClick>
        <div>content</div>
      </Modal>,
    );
    await user.click(document.querySelector('.tui-overlap')!);
    expect(onClose).not.toHaveBeenCalled();
    unmount();

    render(
      <Modal open onClose={onClose} closeOnOverlayClick closeOnOverlapClick={false}>
        <div>content</div>
      </Modal>,
    );
    await user.click(document.querySelector('.tui-overlap')!);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('still honors the deprecated closeOnOverlapClick without warning at runtime', async () => {
    const user = userEvent.setup();
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} closeOnOverlapClick={false}>
        <div>content</div>
      </Modal>,
    );
    await user.click(document.querySelector('.tui-overlap')!);
    expect(onClose).not.toHaveBeenCalled();
    expect(warnSpy).not.toHaveBeenCalled();
    warnSpy.mockRestore();
  });
});

describe('ModalHeader / ModalBody / ModalFooter', () => {
  it('wraps children in tui-window > tui-fieldset and renders the header as a legend', () => {
    render(
      <Modal open>
        <ModalHeader>Title</ModalHeader>
        <ModalBody>Body</ModalBody>
        <ModalFooter>Footer</ModalFooter>
      </Modal>,
    );
    const modal = document.querySelector('.tui-modal')!;
    const window_ = modal.firstElementChild!;
    expect(window_).toHaveClass('tui-window');

    const fieldset = window_.firstElementChild!;
    expect(fieldset.tagName).toBe('FIELDSET');
    expect(fieldset).toHaveClass('tui-fieldset');

    const header = screen.getByText('Title');
    expect(header.tagName).toBe('LEGEND');
    expect(header).toHaveClass('tui-modal-header');
    expect(header.closest('fieldset.tui-fieldset')).toBe(fieldset);
  });

  it('leaves children directly under tui-modal when no subcomponent is used', () => {
    render(
      <Modal open>
        <div className="custom">content</div>
      </Modal>,
    );
    const modal = document.querySelector('.tui-modal')!;
    expect(modal.querySelector('.tui-window')).toBeNull();
    expect(modal.querySelector('.tui-fieldset')).toBeNull();
    expect(modal.firstElementChild).toHaveClass('custom');
  });

  it('inserts a divider immediately before the footer', () => {
    render(
      <Modal open>
        <ModalBody>Body</ModalBody>
        <ModalFooter>Footer</ModalFooter>
      </Modal>,
    );
    const footer = document.querySelector('.tui-modal-footer')!;
    expect(footer.previousElementSibling).toHaveClass('tui-divider');
  });

  it('renders no divider when the footer opts out', () => {
    render(
      <Modal open>
        <ModalBody>Body</ModalBody>
        <ModalFooter divider={false}>Footer</ModalFooter>
      </Modal>,
    );
    expect(document.querySelector('.tui-divider')).toBeNull();
    expect(document.querySelector('.tui-modal-footer')!.previousElementSibling).toHaveClass('tui-modal-body');
  });

  it('renders the body as div.tui-modal-body and merges className', () => {
    render(
      <Modal open>
        <ModalBody className="extra">Body</ModalBody>
      </Modal>,
    );
    const body = screen.getByText('Body');
    expect(body.tagName).toBe('DIV');
    expect(body).toHaveClass('tui-modal-body');
    expect(body).toHaveClass('extra');
  });

  it('detects a subcomponent nested inside a fragment', () => {
    render(
      <Modal open>
        <>
          <ModalBody>Body</ModalBody>
        </>
      </Modal>,
    );
    expect(document.querySelector('.tui-modal > .tui-window > .tui-fieldset > .tui-modal-body')).not.toBeNull();
  });

  it('merges windowClassName onto the generated window and className onto the modal', () => {
    render(
      <Modal open className="modal-extra" windowClassName="red-168">
        <ModalBody>Body</ModalBody>
      </Modal>,
    );
    const modal = document.querySelector('.tui-modal')!;
    expect(modal).toHaveClass('modal-extra');
    expect(modal).not.toHaveClass('red-168');
    expect(modal.firstElementChild).toHaveClass('tui-window');
    expect(modal.firstElementChild).toHaveClass('red-168');
  });

  it('forwards refs from the header, body and footer', () => {
    const headerRef = createRef<HTMLLegendElement>();
    const bodyRef = createRef<HTMLDivElement>();
    const footerRef = createRef<HTMLDivElement>();
    render(
      <Modal open>
        <ModalHeader ref={headerRef}>Title</ModalHeader>
        <ModalBody ref={bodyRef}>Body</ModalBody>
        <ModalFooter ref={footerRef}>Footer</ModalFooter>
      </Modal>,
    );
    expect(headerRef.current).toBeInstanceOf(HTMLLegendElement);
    expect(bodyRef.current).toBeInstanceOf(HTMLDivElement);
    expect(footerRef.current).toBeInstanceOf(HTMLDivElement);
    expect(bodyRef.current).toHaveClass('tui-modal-body');
    expect(footerRef.current).toHaveClass('tui-modal-footer');
  });
});

describe('Modal body scroll lock', () => {
  it('locks the body and compensates for the scrollbar width while open', () => {
    stubScrollbarWidth(20);
    render(
      <Modal open>
        <div>content</div>
      </Modal>,
    );
    expect(document.body.style.overflow).toBe('hidden');
    expect(document.body.style.paddingRight).toBe('20px');
  });

  it('restores the body styles when the modal closes', () => {
    stubScrollbarWidth(20);
    const { rerender } = render(
      <Modal open>
        <div>content</div>
      </Modal>,
    );
    expect(document.body.style.overflow).toBe('hidden');

    rerender(
      <Modal open={false}>
        <div>content</div>
      </Modal>,
    );
    expect(document.body.style.overflow).toBe('');
    expect(document.body.style.paddingRight).toBe('');
  });

  it('restores the body styles when an open modal unmounts', () => {
    stubScrollbarWidth(20);
    const { unmount } = render(
      <Modal open>
        <div>content</div>
      </Modal>,
    );
    expect(document.body.style.overflow).toBe('hidden');

    unmount();
    expect(document.body.style.overflow).toBe('');
    expect(document.body.style.paddingRight).toBe('');
  });

  it('keeps the body locked until every open modal is closed', () => {
    stubScrollbarWidth(20);
    const { rerender } = render(
      <>
        <Modal open>
          <div>first</div>
        </Modal>
        <Modal open>
          <div>second</div>
        </Modal>
      </>,
    );
    expect(document.body.style.overflow).toBe('hidden');

    rerender(
      <>
        <Modal open={false}>
          <div>first</div>
        </Modal>
        <Modal open>
          <div>second</div>
        </Modal>
      </>,
    );
    expect(document.body.style.overflow).toBe('hidden');
    expect(document.body.style.paddingRight).toBe('20px');

    rerender(
      <>
        <Modal open={false}>
          <div>first</div>
        </Modal>
        <Modal open={false}>
          <div>second</div>
        </Modal>
      </>,
    );
    expect(document.body.style.overflow).toBe('');
    expect(document.body.style.paddingRight).toBe('');
  });

  it('never locks the body for a modal rendered closed', () => {
    stubScrollbarWidth(20);
    render(
      <Modal open={false}>
        <div>content</div>
      </Modal>,
    );
    expect(document.body.style.overflow).toBe('');
    expect(document.body.style.paddingRight).toBe('');
  });
});

describe('Modal stylesheet self-check', () => {
  it('checks the stylesheet once on mount and not again on rerender', () => {
    const { rerender } = render(
      <Modal open>
        <div>content</div>
      </Modal>,
    );
    expect(mockedWarnIfTuiStylesMissing).toHaveBeenCalledTimes(1);
    expect(mockedWarnIfTuiStylesMissing).toHaveBeenCalledWith({ className: 'tui-modal', componentName: 'Modal' });

    rerender(
      <Modal open>
        <div>changed</div>
      </Modal>,
    );
    expect(mockedWarnIfTuiStylesMissing).toHaveBeenCalledTimes(1);
  });
});
