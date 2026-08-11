import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Modal, ModalBody, ModalCloseButton, ModalFooter, ModalHeader } from './Modal';

const meta = {
  title: 'Components/Modal',
  component: Modal,
  tags: ['autodocs'],
  args: {
    open: false,
  },
} satisfies Meta<typeof Modal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <button className="tui-button" onClick={() => setOpen(true)}>
          Open Modal
        </button>
        <Modal {...args} open={open} onClose={() => setOpen(false)}>
          <div className="tui-window red-168">
            <fieldset className="tui-fieldset">
              <legend>Modal</legend>
              <p>This is a modal rendered into a portal under document.body.</p>
              <ModalCloseButton onClick={() => setOpen(false)}>Close</ModalCloseButton>
            </fieldset>
          </div>
        </Modal>
      </>
    );
  },
};

export const GreenOverlap: Story = {
  args: {
    overlapBackground: 'green-black',
  },
  render: Default.render,
};

export const OpaqueOverlap: Story = {
  args: {
    overlapOpacity: 1,
  },
  render: Default.render,
};

// TuiCss 本家の挙動: 暗幕は透明で、背後の画面がそのまま見える。
export const TransparentOverlap: Story = {
  args: {
    overlapBackground: false,
  },
  render: Default.render,
};

export const ConfirmDialog: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <button className="tui-button" onClick={() => setOpen(true)}>
          Delete File
        </button>
        <Modal {...args} open={open} onClose={() => setOpen(false)} windowClassName="red-168">
          {/* ModalHeader/Body/Footer を子に含めると tui-window + tui-fieldset は自動生成されるため、ここでは書かない。 */}
          <ModalHeader>Confirm</ModalHeader>
          <ModalBody>
            <p>Delete file?</p>
          </ModalBody>
          <ModalFooter>
            <button className="tui-button" onClick={() => setOpen(false)}>
              Cancel
            </button>
            <button className="tui-button" onClick={() => setOpen(false)}>
              OK
            </button>
          </ModalFooter>
        </Modal>
      </>
    );
  },
};

export const ScrollingContent: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <button className="tui-button" onClick={() => setOpen(true)}>
          Open Long Modal
        </button>
        <Modal {...args} open={open} onClose={() => setOpen(false)}>
          <ModalHeader>Terms of Service</ModalHeader>
          <ModalBody>
            {Array.from({ length: 30 }, (_, index) => (
              <p key={index}>
                Paragraph {index + 1}: This is placeholder text demonstrating that .tui-modal-body scrolls
                internally while the surrounding dialog chrome stays fixed within the viewport.
              </p>
            ))}
          </ModalBody>
          <ModalFooter>
            <ModalCloseButton onClick={() => setOpen(false)}>Close</ModalCloseButton>
          </ModalFooter>
        </Modal>
      </>
    );
  },
};

export const WithoutFooter: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <button className="tui-button" onClick={() => setOpen(true)}>
          Open Modal
        </button>
        <Modal {...args} open={open} onClose={() => setOpen(false)}>
          <ModalHeader>Notice</ModalHeader>
          <ModalBody>
            <p>ModalFooter is optional — each subcomponent can be used independently.</p>
            <ModalCloseButton onClick={() => setOpen(false)}>Close</ModalCloseButton>
          </ModalBody>
        </Modal>
      </>
    );
  },
};
