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
const customStyles = {
  // control: (styles) => ({ border: "red 2px solid" }),
};

const initialFValues = {
  id: 0,
  type: 1,
  container_number: "",
  eta: "",
  loading_date: "",
  port_of_discharge: "",
  port_of_loading: "12",
  export_invoice_photo: [],
  container_images: [],
  empty_container_photos: [],
  contact_details: "",
  vehicle_ids: [],
  file_urls: {
    photos: [],
    document_files: [],
  },
  // destination: "",
  // terminal: "",
};

export default function ExportModal(props) {
  const {
    title,
    openPopup,
    setOpenPopup,
    addOrEdit,
    recordForEdit,
    buttonDisabled,
  } = props;
  const buttonRef = useRef();
  const [errorClass, setErrorClass] = useState("");

  const [selectedVinInfo, setSelectedVinInfo] = useState({
    label: "Select Vin",
    value: 0,
  });
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState();
  const [portLoadingData, setPortLoadingData] = useState([]);
  const [portDischargeData, setPortDischargeData] = useState([]);
  const [backErrorMessage, setBackendErros] = useState({});

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
    /*
    if ("customer_user_id" in fieldValues) {
      temp.customer_user_id = fieldValues.customer_user_id
        ? ""
        : "This field is required.";
    }
    
    */

    setErrors({
      ...temp,
    });

    if (fieldValues === values)
      return Object.values(temp).every((x) => x === "");
  };

  const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
    useForm(initialFValues, true, validate);

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
  // const handleCustomerAutoInputChange = (e) => {
  //   setSelectedUser(e);
  //   const event = {
  //     target: {
  //       name: "customer_user_id",
  //       value: e.value,
  //     },
  //   };

  //   handleInputChange(event);
  //   // handleInputChange(event2);
  //   initialFValues.customer_company_name = e.customer_company_name;
  //   initialFValues.legacy_customer_id = e.legacy_customer_id;
  // };
  // const loadOptions = async (inputText, callback) => {
  //   const url = `/customers-item?customer_name=${inputText}`;

  //comment by amirul

  //   VehicleService.getCustomersItem(url)
  //     .then((response) => {
  //       const json = response.data.data;
  //       console.log(json);
  //       callback(
  //         json.map((i) => ({
  //           label: i.name,
  //           value: i.user_id,
  //           legacy_customer_id: i.legacy_customer_id,
  //           customer_company_name: i.company_name,
  //         }))
  //       );
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };
  //comment by amirul

  //   VehicleService.getCustomersItem(url)
  //     .then((response) => {
  //       const json = response.data.data;
  //       callback(
  //         json.map((i) => ({
  //           label: i.name,
  //           value: i.user_id,
  //           legacy_customer_id: i.legacy_customer_id,
  //           customer_company_name: i.company_name,
  //         }))
  //       );
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });

  //   const response = await VehicleService.getCustomersItem(url);
  //   callback(
  //     response.data.data.map((i) => ({
  //       label: i.name,
  //       value: i.user_id,
  //       legacy_customer_id: i.legacy_customer_id,
  //       customer_company_name: i.company_name,
  //     }))
  //   );
  // };

  const loadVinOptions = (inputText, callback) => {
    const url = `/vehicle-search?vin=${inputText}`;
    // const response = await VehicleService.getVinsItem(url);
    // console.log(response.data.data);
    // callback(response.data.data.map((i) => ({ label: i.vin, value: i.id })));

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

    if (initialFValues.vehicle_ids.indexOf(vehicleId) !== -1) {
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
          initialFValues.vehicle_ids.push(response.data.data.id);
          setSelectedVinInfo({
            label: "Select Vin",
            value: 0,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const removeVehicle = (vehicleId) => {
    let i = initialFValues.vehicle_ids.findIndex((x) => x === vehicleId);
    let vehicleIndex = vehicles.findIndex((x) => x.id === vehicleId);

    const cloneVehicls = [...vehicles];
    cloneVehicls.splice(vehicleIndex, 1);

    setVehicles(cloneVehicls);
    initialFValues.vehicle_ids.splice(i, 1);
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
              ? languageStrings.update_export
              : languageStrings.export_create}
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
                  onChange={handleVinAutoInputChange}
                  styles={customStyles}
                  defaultOptions
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

                    {loading && (
                      <tr>
                        <td colSpan={12}>Loading</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="row" style={{ marginTop: "40px" }}>
              {/* <div className="col-md-6">
                <h5>Customer Info</h5>
                <div className="mb-3">
                  <label className="form-label mb-0">
                    Select Customer Name
                  </label>
                  <AsyncSelect
                    components={animatedComponet}
                    loadOptions={loadOptions}
                    value={selectedUser}
                    onChange={handleCustomerAutoInputChange}
                    styles={customStyles}
                    defaultOptions
                  />
                  <div className="invalid-feedback">
                    Please provide a valid Customer Name.
                  </div>
                  {backErrorMessage.customer_user_id && (
                    <p style={{ color: "red" }}>
                      {backErrorMessage.customer_user_id[0]}
                    </p>
                  )}
                </div>
                <div className="mb-3">
                  <label className="form-label mb-0">Customer ID</label>
                  <input
                    type="text"
                    id="customername-field"
                    className="form-control"
                    placeholder="Customer ID"
                    name="legacy_customer_id"
                    value={initialFValues.legacy_customer_id}
                    onChange={handleInputChange}
                    disabled={true}
                    required="required"
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="" style={{ height: "30px" }}></div>
                <div className="mb-3">
                  <label className="form-label mb-0">
                    Customer Company Name
                  </label>
                  <input
                    type="text"
                    id="customername-field"
                    className="form-control"
                    placeholder="Customer Company Name"
                    name="company_name"
                    value={initialFValues.customer_company_name}
                    onChange={handleInputChange}
                    disabled={true}
                  />
                </div>
              </div> */}
            </div>
            <hr />
            <div className="row">
              <div className="col-md-12">
                <h5>Export Info</h5>
              </div>
              <div className="col-md-6">
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
                  {backErrorMessage.eta && (
                    <p style={{ color: "red" }}>{backErrorMessage.eta[0]}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label mb-0">Manifest Number</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Manifest Number"
                    name="container_number"
                    value={values.container_number}
                    onChange={handleInputChange}
                  />
                  {backErrorMessage.container_number && (
                    <p style={{ color: "red" }}>
                      {backErrorMessage.container_number[0]}
                    </p>
                  )}
                </div>
              </div>
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

            <div className="row">
              {/* <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label mb-0">Terminal</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Terminal"
                    name="terminal"
                    value={values.terminal}
                    onChange={handleInputChange}
                    required="required"
                  />
                  <div className="invalid-feedback">
                    Please provide a valid Terminal.
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label mb-0">Destination</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Destination"
                    name="destination"
                    value={values.destination}
                    onChange={handleInputChange}
                    required="required"
                  />
                  <div className="invalid-feedback">
                    Please provide a valid Destination.
                  </div>
                </div>
              </div> */}
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
