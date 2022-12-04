import Modal from "react-modal";
import React from "react";

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
  overlay: {
    zIndex: 1000
  }
};

export type MessageDialogProps = {
  isOpen: boolean
  message: string
  closeModal: () => void
}

function MessageDialog(props: MessageDialogProps) {
  return <Modal
    isOpen={props.isOpen}
    style={customStyles}
    contentLabel="Message Dialog"
  >
    <div>
      {props.message}

      <div className="dialog-bottom-buttons">
        <button onClick={props.closeModal}>Close</button>
      </div>
    </div>
  </Modal>
}

export default MessageDialog;
