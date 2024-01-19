import axios from "axios";
import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import "react-dropzone-uploader/dist/styles.css";
import { toast, ToastContainer } from "react-toastify";
import Controls from "../controls/Controls";

export default function VehicleImportModal(props) {
  const [fileObject, setFileObject] = useState("");
  const [backErrorMessage, setBackendErros] = useState({});
  const [loading, setLoading] = useState(false);
  const { openPopup, setOpenPopup } = props;

  const handleClose = () => {
    setOpenPopup(false);
    setBackendErros({});
  };

  const submitClick = async () => {
    if (!fileObject) {
      return;
    }

    setLoading(true);
    setBackendErros({});
    const _token = localStorage.getItem("_token");
    const final_url = process.env.REACT_APP_API_BASE_URL + "/vehicles/import";
    const formData = new FormData();
    formData.append("file", fileObject);

    try {
      const response = await axios.post(final_url, formData, {
        headers: { Authorization: `Bearer ${_token}` },
      });
      console.log(response);
      if (response.status === 200) {
        toastMessageShow("success", response.data.message);
      } else {
      }
      setLoading(false);
    } catch (error) {
      if (error.response.status === 422) {
        console.log(error.response.data.errors);
        setBackendErros(Object.values(error.response.data.errors));
      }
      setLoading(false);
    }
  };

  const handleFiles = (e) => {
    setFileObject(e.target.files[0]);
  };

  const toastMessageShow = (type, message) => {
    toast[type](message, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
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
          <Modal.Title>Vehicle Excel Import</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="row">
              <div className="col-8">
                <div className="col-8 offset-4">
                  <input
                    type="file"
                    onChange={handleFiles}
                    accept=".xls,.xlsx"
                  />
                </div>
              </div>
              <div className="col-4">
                <a
                  href={`${process.env.REACT_APP_BASE_URL}/public/sample_vehicle_import.xlsx`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Download Sample File
                </a>
              </div>
            </div>
          </form>

          <div className="" style={{ marginTop: "10px" }}>
            {backErrorMessage &&
              backErrorMessage?.length > 0 &&
              backErrorMessage.map((e, i) => (
                <p className="alert alert-danger" key={i}>
                  {e[0]}
                </p>
              ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          {loading && <Spinner animation="border" size="sm" />}
          <Controls.Button
            text="Submit"
            size="medium"
            disabled={loading}
            color="primary"
            onClick={submitClick}
          />
        </Modal.Footer>
      </Modal>
      <ToastContainer />
    </>
  );
}
