import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { ToastContainer } from "react-toastify";
import * as VehicleService from "../../services/VehicleService";
import "./vehicleConditionModal.css";

function VehicleConditionModal(props) {
  const { title, openPopup, setOpenPopup, vehicle } = props;

  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);
  const [conditionModalHtml, setConditionModalHtml] = useState();

  const handleClose = () => {
    setOpenPopup(false);
  };

  useEffect(() => {
    setLoading(true);
    const getVehicleCondition = () => {
      VehicleService.getVehicleCondition(vehicle.id)
        .then((res) => {
          console.log(res);
          setConditionModalHtml(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    };

    if (vehicle.id) {
      getVehicleCondition();
    }
  }, [vehicle]);

  const showPdf = () => {
    const baseUrl = process.env.REACT_APP_API_BASE_URL;
    const final_url = `${baseUrl}/vehicles/condition-report-pdf/${vehicle.id}`;
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
            <button className="modal_button btn btn-danger" onClick={showPdf}>
              Open as pdf
            </button>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div dangerouslySetInnerHTML={{ __html: conditionModalHtml }}></div>
          </div>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
      <ToastContainer />
    </>
  );
}

export default VehicleConditionModal;
