import { Button as MuiButton } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { toast, ToastContainer } from "react-toastify";
import * as VehicleService from "../../services/VehicleService";
import "./notemodal.css";

const initialFValues = {
  description: "",
};

function NoteModal(props) {
  const { title, openPopup, setOpenPopup, noteData, setCurrentPage } = props;

  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);
  const [noteStatus, setNoteStatus] = useState(0);
  const [addLoading, setAddLoading] = useState(false);
  const [openLoading, setOpenLoading] = useState(false);
  const [noteForm, setNoteForm] = useState(initialFValues);
  const [noteBoxs, setNoteBoxs] = useState([]);

  const handleClose = () => {
    setNoteForm(initialFValues);
    setOpenPopup(false);
  };

  useEffect(() => {
    setLoading(true);
    const getNote = () => {
      VehicleService.getNote(noteData.id)
        .then((res) => {
          setNoteBoxs(res.data.data);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    };
    setNoteStatus(noteData.note_status ? noteData.note_status.value : 0);
    getNote();
  }, [noteData]);

  const getNotes = () => {
    VehicleService.getNote(noteData.id)
      .then((res) => {
        setNoteBoxs(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNoteForm({
      ...noteForm,
      [name]: value,
    });
  };

  const addNote = () => {
    console.log(noteForm);
    if (!noteForm.description || noteForm.description.length === 0) {
      return false;
    }

    setAddLoading(true);
    VehicleService.addNote(noteData.id, noteForm)
      .then((res) => {
        getNotes();
        setNoteForm(initialFValues);
        setAddLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setAddLoading(false);
      });
  };

  const handelConversation = () => {
    setOpenLoading(true);

    let updated_status = noteStatus === 1 ? 2 : 1;

    VehicleService.changeConversation(noteData.id, {
      note_status: updated_status,
    })
      .then((res) => {
        setNoteStatus(updated_status);
        toastMessageShow("success", "Coversation change successfully");
        setCurrentPage(1);
        setOpenLoading(false);
      })
      .catch((err) => {
        console.log(err);
        toastMessageShow("error", "Something went wrong");
        setOpenLoading(false);
      });
  };

  const toastMessageShow = (type, message) => {
    toast[type](message, {
      position: "top-right",
      autoClose: 5000,
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
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-6">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Customer Name</th>
                    <td>{noteData.customer_name}</td>
                  </tr>
                </thead>
              </table>
            </div>
            <div className="col-md-6">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Vin</th>
                    <td>{noteData.vin}</td>
                  </tr>
                </thead>
              </table>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <textarea
                className="form-control"
                rows={3}
                placeholder="Vehicle Note"
                name="description"
                value={noteForm.description}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-md-2">
              <MuiButton
                variant="contained"
                size="medium"
                color="default"
                onClick={addNote}
              >
                {addLoading && <Spinner animation="border" size="sm" />}ADD NOTE
              </MuiButton>
            </div>
          </div>
          <hr />
          <div style={{ display: "flex", flexDirection: "row-reverse" }}>
            <div className="">
              <MuiButton
                variant="contained"
                size="medium"
                color="default"
                onClick={handelConversation}
              >
                {openLoading && <Spinner animation="border" size="sm" />}{" "}
                {noteStatus === 2 ? "CLOSED" : "OPEN"} CONVERSATION
              </MuiButton>
            </div>
          </div>
          <hr />
          <div className="" style={{ display: "flex", flexWrap: "wrap" }}>
            {noteBoxs &&
              noteBoxs.map((note, i) => (
                <div
                  key={i}
                  className="single-note"
                  style={{
                    background: "#2ba5b6",
                    color: "white",
                    height: "230px",
                    borderRadius: "5px",
                    padding: "10px",
                    textAlign: "right",
                    width: "200px",
                    margin: "10px",
                  }}
                >
                  <div>
                    {" "}
                    <strong>{note.created_by}</strong>{" "}
                  </div>
                  <div>{note.created_at}</div>
                  <div>{note.description}</div>
                </div>
              ))}
          </div>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
      <ToastContainer />
    </>
  );
}

export default NoteModal;
