import DeleteIcon from "@material-ui/icons/Delete";
import React, { useEffect, useRef, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import "react-dropzone-uploader/dist/styles.css";
import makeAnimated from "react-select/animated";
import AsyncSelect from "react-select/async";
import { ToastContainer, toast } from "react-toastify";
import languageStrings from "../../localization/language";
import * as PortService from "../../services/PortService";
import * as VehicleService from "../../services/VehicleService";
import Controls from "../controls/Controls";
import FileZone from "../file/FileZone";
import { Form, useForm } from "../useForm/UseForm";

const animatedComponet = makeAnimated();

const corgoItems = [
  { title: "Train", id: 1 },
  { title: "Truck", id: 2 },
];

const initialFValues = {
  id: 0,
  type: 2,
  booking_number: "",
  container_number: "",
  cargo_by: "1",
  eta: "",
  cmr_date: "",
  loading_date: null,
  port_of_discharge: "24",
  port_of_loading: "",
  arrived_to_border_date: "",
  arrived_to_destination_date: "",
  export_images: [],
  export_invoice_photo: [],
  container_images: [],
  empty_container_photos: [],
  contact_details: "",
  vehicle_ids: [],
  file_urls: {
    photos: [],
    document_files: [],
  },
};

export default function DestinationExportModal(props) {
  const { openPopup, setOpenPopup, addOrEdit, recordForEdit, buttonDisabled } =
    props;
  const buttonRef = useRef();
  const [errorClass, setErrorClass] = useState("");

  const [selectedVinInfo, setSelectedVinInfo] = useState({
    label: "Select Vin",
    value: 0,
  });
  const [vehicles, setVehicles] = useState([]);
  const [backErrorMessage, setBackendErros] = useState({});
  const [portLoadingData, setPortLoadingData] = useState([]);
  const [portDischargeData, setPortDischargeData] = useState([]);

  const handleClose = () => {
    setOpenPopup(false);
    setErrorClass("");
    resetForm();
    setVehicles([]);

    setSelectedVinInfo({
      label: "Select Vin",
      value: 0,
    });
    initialFValues.vehicle_ids = [];
  };

  const validate = (fieldValues = values) => {
    let temp = { ...errors };

    setErrors({
      ...temp,
    });

    if (fieldValues === values)
      return Object.values(temp).every((x) => x === "");
  };

  const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
    useForm(initialFValues, true, validate);

  useEffect(() => {
    PortService.getPortItems(1)
      .then((response) => {
        setPortLoadingData(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
    PortService.getPortItems(2)
      .then((response) => {
        setPortDischargeData(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (recordForEdit != null && recordForEdit.export_details) {
      const newArray = {
        photos: [],
        document_files: [],
      };

      if (recordForEdit.export_details.container_images) {
        recordForEdit.export_details.container_images.forEach((element) => {
          newArray.photos.push(element.uploaded_name);
        });
      }
      recordForEdit.export_details.file_urls = newArray;
      const newDocumentArray = [];

      if (recordForEdit.export_details.documents) {
        recordForEdit.export_details.documents.forEach((element) => {
          newDocumentArray.push(element.uploaded_name);
        });
      }
      recordForEdit.export_details.file_urls.document_files = newDocumentArray;

      setValues({
        ...recordForEdit.export_details,
        vehicle_ids: [...recordForEdit.export_details.vehicle_ids],
      });
      setVehicles(recordForEdit.vehicles);
    } else {
      setVehicles([]);
    }
    setBackendErros({});
  }, [recordForEdit, setValues]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      addOrEdit(values, resetForm, setErrorClass, setBackendErros);
      setBackendErros({});
    }
  };

  const submitClick = () => {
    if (vehicles.length === 0) {
      toastMessageShow("error", "No vin selected ! Please select a vin");
      return;
    }
    setErrorClass("was-validated");
    buttonRef.current.click();
  };

  const handleVinAutoInputChange = (e) => {
    setSelectedVinInfo(e);
  };

  const loadVinOptions = (inputText, callback) => {
    const url = `/vehicle-search?vin=${inputText}&status=10`;

    VehicleService.getCustomersItem(url)
      .then((response) => {
        const json = response.data.data;

        callback(json.map((i) => ({ label: i.vin, value: i.id })));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const addVehicleInfoByVin = () => {
    const vehicleId = selectedVinInfo.value;

    if (values.vehicle_ids.indexOf(vehicleId) !== -1) {
      toastMessageShow("error", "Vehicle already exists! ");
      return;
    }

    VehicleService.getVehicleById(vehicleId)
      .then((response) => {
        if (response.data && response.data.data) {
          if (
            vehicles.length &&
            vehicles[0].location_id !== response.data.data.location_id
          ) {
            toastMessageShow(
              "error",
              "Multiple location vehicle not allowed in one container!"
            );

            return;
          }

          const newVehicleArray = [...vehicles];
          newVehicleArray.push(response.data.data);
          setVehicles(newVehicleArray);
          setSelectedVinInfo({
            label: "Select Vin",
            value: 0,
          });
          const colneValues = { ...values };
          colneValues.vehicle_ids.push(response.data.data.id);
          setValues(colneValues);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const removeVehicle = (vehicleId) => {
    let i = values.vehicle_ids.findIndex((x) => x === vehicleId);
    let vehicleIndex = vehicles.findIndex((x) => x.id === vehicleId);
    const cloneVehicls = [...vehicles];
    cloneVehicls.splice(vehicleIndex, 1);

    setVehicles(cloneVehicls);
    const colneValues = { ...values };
    colneValues.vehicle_ids.splice(i, 1);
    setValues(colneValues);
  };

  const storeSuccess = (fileName) => {
    if (recordForEdit != null) {
      const colneValues = { ...values };
      colneValues.file_urls.photos.push(fileName);
      setValues(colneValues);
    } else {
      initialFValues.file_urls.photos.push(fileName);
    }
  };

  const removeFile = (fileName) => {
    if (recordForEdit != null) {
      const colneValues = { ...values };

      let index = colneValues.file_urls.photos
        ? colneValues.file_urls.photos.findIndex((x) => x === fileName)
        : -1;
      colneValues.file_urls.photos.splice(index, 1);
      setValues(colneValues);
    } else {
      let index = initialFValues.file_urls.photos
        ? initialFValues.file_urls.photos.findIndex((x) => x === fileName)
        : -1;
      initialFValues.file_urls.photos.splice(index, 1);
    }
  };

  const storeDocumentSuccess = (fileName) => {
    if (recordForEdit != null) {
      const colneValues = { ...values };
      colneValues.file_urls.document_files.push(fileName);
      setValues(colneValues);
    } else {
      initialFValues.file_urls.document_files.push(fileName);
    }
  };

  const removeDocumentFile = (fileName) => {
    if (recordForEdit != null) {
      const colneValues = { ...values };

      let index = colneValues.file_urls.document_files
        ? colneValues.file_urls.document_files.findIndex((x) => x === fileName)
        : -1;
      colneValues.file_urls.document_files.splice(index, 1);
      setValues(colneValues);
    } else {
      let index = initialFValues.file_urls.document_files
        ? initialFValues.file_urls.document_files.findIndex(
            (x) => x === fileName
          )
        : -1;
      initialFValues.file_urls.document_files.splice(index, 1);
    }
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
          <Modal.Title>
            {recordForEdit
              ? languageStrings.update_destination_export
              : languageStrings.create_destination_export}
          </Modal.Title>
        </Modal.Header>
        <hr />
        <Modal.Body>
          <Form
            onSubmit={handleSubmit}
            className={`needs-validation ${errorClass}`}
          >
            <div className="row">
              <div className="col-md-6">
                <AsyncSelect
                  components={animatedComponet}
                  loadOptions={loadVinOptions}
                  value={selectedVinInfo}
                  defaultOptions
                  onChange={handleVinAutoInputChange}
                />
              </div>
              <div className="col-md-6">
                <div className="btn btn-info" onClick={addVehicleInfoByVin}>
                  {languageStrings.add}
                </div>
              </div>
            </div>
            <br />
            <div className="row">
              <div className="col-md-12">
                <table className="table table-wrap">
                  <thead className="vehicle-status-table-head">
                    <tr>
                      <th scope="col">Year</th>
                      <th scope="col">Make</th>
                      <th scope="col">Model </th>
                      <th scope="col">Vin</th>
                      <th scope="col">Status</th>
                      <th scope="col">Location</th>
                      <th scope="col">Lot No</th>
                      <th scope="col" style={{ minWidth: "100px" }}>
                        Agent Name
                      </th>
                      <th scope="col" style={{ minWidth: "100px" }}>
                        Customer Name
                      </th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehicles &&
                      vehicles.map((vehicle, index) => (
                        <tr key={index}>
                          <td>{vehicle.year}</td>
                          <td>{vehicle.make}</td>
                          <td>{vehicle.model}</td>
                          <td>{vehicle.vin}</td>
                          <td>{vehicle.status_name}</td>
                          <td>{vehicle.location_name}</td>
                          <td>{vehicle.lot_number}</td>
                          <td>{vehicle.agent_name}</td>
                          <td>{vehicle.customer_name}</td>
                          <td>
                            <DeleteIcon
                              style={{
                                margin: "7px",
                                cursor: "pointer",
                                color: "red",
                              }}
                              onClick={(e) => removeVehicle(vehicle.id)}
                            />
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="row" style={{ marginTop: "40px" }}></div>
            <hr />
            <div className="row">
              <div className="col-md-6">
                <h5>Export Info</h5>
                <div className="mb-3">
                  <label className="form-label mb-0">Loading Date</label>
                  <input
                    type="date"
                    className="form-control"
                    placeholder="Loading Date"
                    name="loading_date"
                    value={values.loading_date}
                    onChange={handleInputChange}
                  />
                  {backErrorMessage.loading_date && (
                    <p style={{ color: "red" }}>
                      {backErrorMessage.loading_date[0]}
                    </p>
                  )}
                </div>
              </div>

              <div className="col-md-6 mt-4">
                <div className="mb-3">
                  <label className="form-label mb-0">Booking Number</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Booking Number"
                    name="booking_number"
                    value={values.booking_number}
                    onChange={handleInputChange}
                    required="required"
                  />
                  <div className="invalid-feedback">
                    Please provide a valid Booking No.
                  </div>
                  {backErrorMessage.booking_number && (
                    <p style={{ color: "red" }}>
                      {backErrorMessage.booking_number[0]}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="row"></div>
            <div className="row">
              <div className="col-md-6">
                <label className="form-label mb-0">Loaded By</label>
                <select
                  className="form-select form-control"
                  data-trigger
                  id="status-field"
                  name="cargo_by"
                  value={values.cargo_by}
                  onChange={handleInputChange}
                  required="required"
                >
                  {corgoItems.map((item, index) => (
                    <option value={item.id} key={index}>
                      {item.title}
                    </option>
                  ))}
                </select>
                <div className="invalid-feedback">
                  Please provide a valid corgo by.
                </div>
                {backErrorMessage.cargo_by && (
                  <p style={{ color: "red" }}>{backErrorMessage.cargo_by[0]}</p>
                )}
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label mb-0">
                    {values.cargo_by === "1" ? "CMR" : "Truck"} Number
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder={
                      values.cargo_by === "1" ? "CMR number" : "Truck Number"
                    }
                    name="container_number"
                    value={values.container_number}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label mb-0">Eta date</label>
                  <input
                    type="date"
                    className="form-control"
                    placeholder="Eta Date"
                    name="eta"
                    value={values.eta}
                    onChange={handleInputChange}
                  />
                  {/* <DatePicker className="form-control" placeholderText="Eta Date" selected={values.eta}  dateFormat="dd/MM/yyyy"  onChange={(date:Date) => handleDateChange(date, 'eta')} /> */}
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label mb-0">CMR Date</label>
                  <input
                    type="date"
                    className="form-control"
                    placeholder="CMR Date"
                    name="cmr_date"
                    value={values.cmr_date}
                    onChange={handleInputChange}
                  />
                  {backErrorMessage.cmr_date && (
                    <p style={{ color: "red" }}>
                      {backErrorMessage.cmr_date[0]}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label mb-0">Contact Details</label>
                  <textarea
                    className="form-control"
                    id="exampleFormControlTextarea5"
                    name="contact_details"
                    placeholder="Contact Details"
                    value={values.contact_details}
                    onChange={handleInputChange}
                    rows="2"
                  ></textarea>
                </div>
              </div>
            </div>

            <hr />
            <div className="row">
              <div className="col-md-6">
                <h5>Additional Info</h5>
                <div className="mb-3">
                  <label className="form-label mb-0">Port Of Loading</label>
                  <select
                    className="form-select form-control"
                    data-trigger
                    id="status-field"
                    name="port_of_loading"
                    value={values.port_of_loading}
                    onChange={handleInputChange}
                    required="required"
                  >
                    <option value="">Select Loading Port</option>
                    {portLoadingData.map((item, index) => (
                      <option value={item.id} key={index}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  <div className="invalid-feedback">
                    Please provide a valid Port of loading.
                  </div>
                  {backErrorMessage.port_of_loading && (
                    <p style={{ color: "red" }}>
                      {backErrorMessage.port_of_loading[0]}
                    </p>
                  )}
                </div>
              </div>
              <div className="col-md-6">
                <div className="" style={{ height: "30px" }}></div>
                <div className="mb-3">
                  <label className="form-label mb-0">Port of Discharge</label>
                  <select
                    className="form-select form-control"
                    data-trigger
                    id="status-field"
                    name="port_of_discharge"
                    value={values.port_of_discharge}
                    onChange={handleInputChange}
                    required="required"
                  >
                    <option value="">Select Discharge Port</option>
                    {portDischargeData.map((item, index) => (
                      <option value={item.id} key={index}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  <div className="invalid-feedback">
                    Please provide a valid port of discharge.
                  </div>
                  {backErrorMessage.port_of_discharge && (
                    <p style={{ color: "red" }}>
                      {backErrorMessage.port_of_discharge[0]}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label mb-0">
                    Arrived to Final Destination Date
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    placeholder="Destination Date"
                    name="arrived_to_destination_date"
                    value={values.arrived_to_destination_date}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            <br />
            <FileZone
              title="CMR Photos"
              url="/exports/photo-upload"
              storeSuccess={storeSuccess}
              removeFile={removeFile}
              existingFilesArray={
                recordForEdit
                  ? recordForEdit.export_details.container_images
                  : []
              }
            />
            <br />
            <br />
            <FileZone
              title="CMR doc"
              url="/exports/document-upload"
              storeSuccess={storeDocumentSuccess}
              removeFile={removeDocumentFile}
              existingFilesArray={
                recordForEdit ? recordForEdit.export_details.documents : []
              }
            />

            <button hidden type="submit" ref={buttonRef}></button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {buttonDisabled && <Spinner animation="border" size="sm" />}

          <Controls.Button
            text={recordForEdit ? languageStrings.update : languageStrings.save}
            size="medium"
            color="primary"
            disabled={buttonDisabled}
            onClick={submitClick}
          />
        </Modal.Footer>
      </Modal>
      <ToastContainer />
    </>
  );
}
