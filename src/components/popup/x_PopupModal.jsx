import React from "react";
import Modal from "react-bootstrap/Modal";
import Controls from "../controls/Controls";
export default function PopupModal(props) {
  const { title, children, openPopup, setOpenPopup, onSubmitClik } = props;

  const handleClose = () => {
    setOpenPopup(false);
  };

  return (
    <Modal
      size="xl"
      show={openPopup}
      onHide={handleClose}
      dialogClassName="modal-90w"
      scrollable="true"
    >
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
      <Modal.Footer>
        <Controls.Button
          text="Close"
          size="medium"
          color="secondary"
          onClick={handleClose}
        />
        <Controls.Button
          text="Save"
          size="medium"
          color="primary"
          onClick={onSubmitClik}
        />
      </Modal.Footer>
    </Modal>
  );
}
