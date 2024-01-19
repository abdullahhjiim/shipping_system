import React from "react";
import Modal from "react-bootstrap/Modal";
import ImageGallery from "react-image-gallery";
import "./vehiclesModal.css";

export default function GalleryModal({
  openPopup,
  setOpenPopup,
  title,
  items,
}) {
  return (
    <>
      <Modal
        size="xl"
        show={openPopup}
        onHide={() => setOpenPopup(false)}
        dialogClassName="modal-90w"
        scrollable="true"
      >
        <Modal.Header closeButton>
          <Modal.Title>{title ?? `Photo Gallery`}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {items && items.length > 0 ? <ImageGallery items={items} /> : null}
        </Modal.Body>
      </Modal>
    </>
  );
}
