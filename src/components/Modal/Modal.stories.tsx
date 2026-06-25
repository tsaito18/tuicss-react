import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Modal, ModalCloseButton } from './Modal';

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
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <button className="tui-button" onClick={() => setOpen(true)}>
          Open Modal
        </button>
        <Modal open={open} onClose={() => setOpen(false)}>
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
