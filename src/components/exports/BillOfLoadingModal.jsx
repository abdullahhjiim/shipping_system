import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { ToastContainer } from "react-toastify";
import * as ExportService from "../../services/ExportService";

function BillOfLoading(props) {
  const { title, openPopup, setOpenPopup, exports } = props;

  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);
  const [billOfLoadingModalHtml, setBillOfLoadingModalHtml] = useState();

  const handleClose = () => {
    setOpenPopup(false);
  };

  const baseUrl = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    setLoading(true);
    const getBillOfLoading = () => {
      ExportService.getBillOfLoading(exports.id)
        .then((res) => {
          console.log(res);
          setBillOfLoadingModalHtml(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    };

    if (exports.id) {
      getBillOfLoading();
    }
  }, [exports]);

  const showPdf = () => {
    const final_url = `${baseUrl}/exports/bill-of-loading-pdf/${exports.id}`;
    window.open(final_url, "_blank");
  };

  return (
    <>
      <Modal
        size="xl"
        show={openPopup}
        onHide={handleClose}
        dialogClassName="modal-90w"
        scrollable="true"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {/* <button className="modal_button btn btn-success">Print</button>
            <button className="modal_button btn btn-info">Email</button> */}
            <button className="modal_button btn btn-info" onClick={showPdf}>
              Open as pdf
            </button>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div
              dangerouslySetInnerHTML={{ __html: billOfLoadingModalHtml }}
            ></div>
          </div>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
      <ToastContainer />
    </>
  );
}

export default BillOfLoading;
