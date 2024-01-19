import React, { useEffect, useRef, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import "react-dropzone-uploader/dist/styles.css";
import makeAnimated from "react-select/animated";
import AsyncSelect from "react-select/async";
import { ToastContainer, toast } from "react-toastify";
import languageStrings from "../../localization/language";
import * as VehicleService from "../../services/VehicleService";
import Controls from "../controls/Controls";
import FileZone from "../file/FileZone";
import { Form, useForm } from "../useForm/UseForm";
import "./vehiclesModal.css";

const animatedComponet = makeAnimated();
const customStyles = {
  // control: (styles) => ({ border: "red 2px solid" }),
};
// // specify upload params and url for your files
// const getUploadParams = ({ meta }) => {
//   // console.log(meta);
//   return { url: "https://httpbin.org/post" };
// };

// // called every time a file's `status` changes
// const handleChangeStatus = ({ meta, file }, status) => {
//   // console.log("handle submit");
//   // console.log(status, meta, file);
// };

// // receives array of files that are done uploading when submit button is clicked
// const handleDropZoneSubmit = (files) => {
//   // console.log("handle submit");
//   console.log(files.map((f) => f.meta));
// };

const imageTest =
  "https://image.shutterstock.com/image-photo/mountains-under-mist-morning-amazing-260nw-1725825019.jpg";

const vehicleTypeItems = [
  { title: "Select vehicle", id: "" },
  { title: "Sedan", id: "Sedan" },
  { title: "Van", id: "Van" },
  { title: "Pickup", id: "Pickup" },
  { title: "Truck", id: "Truck" },
  { title: "Mortorcycle", id: "Mortorcycle" },
  { title: "JEEP", id: "JEEP" },
  { title: "CROSSOVER", id: "CROSSOVER" },
  { title: "PASSENGER CAR", id: "PASSENGER CAR" },
];

// const locationItems = [
//   { title: "Select location", id: "" },
//   { title: "LAee", id: 1 },
//   { title: "LA", id: 1 },
//   { title: "GA", id: 2 },
//   { title: "NY", id: 3 },
//   { title: "TX", id: 4 },
//   { title: "BALTIMORE", id: 5 },
//   { title: "NEWJ-2", id: 6 },
//   { title: "TEXAS", id: 7 },
//   { title: "NJ", id: 8 },
// ];

const statusItems = [
  { title: "Select status", id: "" },
  { title: "PICKED UP", id: 5 },
  { title: "ON HAND", id: 1 },
  { title: "INSEIDE THE PORT", id: 2 },
  { title: "SHIPPED TO TRANSIT", id: 4 },
  { title: "ARRIVED TO TRANSIT", id: 10 },
  { title: "IN SARAKHS", id: 11 },
  { title: "ON THE WAY TO DESTINATION", id: 12 },
  { title: "ARRIVED TO DESTINATION", id: 15 },
  { title: "ARRIVED TO FINAL DESTINATION", id: 17 },
];

const initialFValues = {
  id: 0,
  nameuser_id: "",
  agent_name: "",
  agent_user_id: "",
  agent_company_name: "",
  legacy_agent_id: "",
  status: "1",
  vehicle_type: "",
  vin: "",
  year: "",
  color: "",
  make: "",
  model: "",
  value: "",
  towed_from: "",
  lot_number: "",
  location_id: "",
  keys: "1",
  key_note: "",

  towing_request: {
    deliver_date: "",
    // towing_request_date: "",
    note: "",
    damaged: "0",
    pictures: "1",
  },
  vehicle_conditions: {},

  vehicle_features: {},
  file_urls: {
    photos: [],
    document_files: [],
    invoice_files: [],
  },
};

export default function VehicleModal(props) {
  const buttonRef = useRef();
  const [errorClass, setErrorClass] = useState("");
  // const [selectedUser, setSelectedUser] = useState({});
  const [agentUser, setAgentUser] = useState({});
  const [colorItems, setColorItems] = useState([]);
  const [locationItems, setLocationItems] = useState([]);
  const [vehicleCheckboxItems, setVehicleCheckboxItems] = useState([]);
  // const [vehicleConditionItems, setVehicleConditionItems] = useState([]);
  const [backErrorMessage, setBackendErros] = useState({});
  const { openPopup, setOpenPopup, addOrEdit, recordForEdit, buttonDisabled } =
    props;
  const [vehicleTypes, setVehicleTypes] = useState([]);

  const [clicked, setClicked] = useState(false);

  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    // if ("customer_user_id" in fieldValues) {
    //   temp.customer_user_id = fieldValues.customer_user_id
    //     ? ""
    //     : "This field is required.";
    // }

    setErrors({
      ...temp,
    });

    if (fieldValues === values)
      return Object.values(temp).every((x) => x === "");
  };

  const {
    values,
    setValues,
    setNestedObjectInfo,
    errors,
    setErrors,
    handleInputChange,
    resetForm,
  } = useForm(initialFValues, true, validate);

  useEffect(() => {
    if (recordForEdit != null) {
      initialFValues.agent_name = recordForEdit.agent_name;
      initialFValues.agent_company_name = recordForEdit.agent_company_name;
      initialFValues.legacy_agent_id = recordForEdit.legacy_agent_id;
      const newArray = {
        photos: [],
        document_files: [],
        invoice_files: [],
      };
      if (recordForEdit.photos) {
        recordForEdit.photos.forEach((element) => {
          newArray.photos.push(element.uploaded_name);
        });
      }
      recordForEdit.file_urls = newArray;

      const newDocumentArray = [];

      if (recordForEdit.documents) {
        recordForEdit.documents.forEach((element) => {
          newDocumentArray.push(element.uploaded_name);
        });
      }
      recordForEdit.file_urls.document_files = newDocumentArray;

      const newInvoiceArray = [];

      if (recordForEdit.invoices) {
        recordForEdit.invoices.forEach((element) => {
          newInvoiceArray.push(element.uploaded_name);
        });
      }
      recordForEdit.file_urls.invoice_files = newInvoiceArray;

      setValues({
        ...recordForEdit,
      });

      // setSelectedUser({
      //   label: recordForEdit.customer_name,
      //   value: recordForEdit.customer_user_id,
      // });
      setAgentUser({
        label: recordForEdit.agent_name,
        value: recordForEdit.agent_user_id,
      });
    } else {
      const newArray = {
        photos: [],
        document_files: [],
        invoice_files: [],
      };
      initialFValues.file_urls = newArray;
      initialFValues.agent_company_name = "";
      initialFValues.legacy_agent_id = "";
    }

    setBackendErros({});
  }, [recordForEdit, setValues, openPopup]);

  useEffect(() => {
    VehicleService.getColorItems()
      .then((response) => {
        // console.log(response);
        setColorItems(response.data ?? []);
      })
      .catch((err) => {
        console.log(err);
      });
    VehicleService.getCheckboxItems()
      .then((response) => {
        setVehicleCheckboxItems(response.data ?? []);
      })
      .catch((err) => {
        console.log(err);
      });
    // VehicleService.getConditionItems()
    //   .then((response) => {
    //     setVehicleConditionItems(response.data ?? []);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    VehicleService.getLocationItems()
      .then((response) => {
        // console.log(response);
        setLocationItems(response.data.data ?? []);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setClicked(false);
      addOrEdit(values, resetForm, setErrorClass, setBackendErros);
      setBackendErros({});
      initialFValues.agent_company_name = "";
      initialFValues.legacy_agent_id = "";
    }
    setAgentUser({});
  };

  const submitClick = () => {
    setClicked(true);
    setErrorClass("was-validated");
    buttonRef.current.click();
  };

  // const handleAutoInputChange = (e) => {
  //   setSelectedUser(e);
  //   const event = {
  //     target: {
  //       name: "customer_user_id",
  //       value: e.value,
  //     },
  //   };

  //   initialFValues.company_name = e.company_name;
  //   initialFValues.legacy_customer_id = e.legacy_customer_id;
  //   handleInputChange(event);
  // };

  const handleAgentAutoInputChange = (e) => {
    setAgentUser(e);
    const event = {
      target: {
        name: "agent_user_id",
        value: e.value,
      },
    };

    initialFValues.agent_company_name = e.agent_company_name;
    initialFValues.legacy_agent_id = e.legacy_agent_id;
    handleInputChange(event);
  };

  // const loadOptions = (inputText, callback) => {
  //   const url = `/customers-item?customer_name=${inputText}`;

  //   VehicleService.getCustomersItem(url)
  //     .then((response) => {
  //       const json = response.data.data;
  //       callback(
  //         json.map((i) => ({
  //           label: i.name,
  //           value: i.user_id,
  //           company_name: i.company_name,
  //           legacy_customer_id: i.legacy_customer_id,
  //         }))
  //       );
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  const agentLoadOptions = (inputText, callback) => {
    const url = `/agents-item?agent_name=${inputText}`;

    VehicleService.getCustomersItem(url)
      .then((response) => {
        const json = response.data.data;
        callback(
          json.map((i) => ({
            label: i.agent_name,
            value: i.agent_user_id,
            agent_company_name: i.agent_company_name,
            legacy_agent_id: i.legacy_agent_id,
          }))
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleConditionInputChange = (e) => {
    const { name, value } = e.target;
    values.vehicle_conditions[name] = value;
    setNestedObjectInfo("vehicle_conditions", values.vehicle_conditions);
  };

  const handleCheckboxInputChange = (e) => {
    const { name, value } = e.target;
    values.vehicle_features[name] = value;
    setNestedObjectInfo("vehicle_features", values.vehicle_features);
  };

  const handleTowingInputChange = (e) => {
    const { name, value } = e.target;
    const towing_request = values.towing_request;
    const newObj = { ...towing_request, [name]: value };
    setNestedObjectInfo("towing_request", newObj);
  };

  const autoFillClick = () => {
    const vin = values.vin;
    if (vin) {
      var url =
        "https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvaluesextended/" +
        vin +
        "?format=json";
      fetch(url)
        .then((res) => res.json())
        .then((res) => {
          let make = res.Results[0].Make.toUpperCase();
          let model = res.Results[0].Model.toUpperCase();
          let year = res.Results[0].ModelYear;
          let vehicle_type = res.Results[0]?.VehicleType;

          if (
            vehicle_type &&
            !vehicleTypes.find((item) => item?.title === vehicle_type)
          ) {
            setVehicleTypes([
              ...vehicleTypes,
              { title: vehicle_type, id: vehicle_type },
            ]);
          }

          getVehicleInfo(make, model, year, vehicle_type);
        })
        .catch((err) => {
          console.log(err);
          // if (err.response.status !== 422) {
          //   toastMessageShow("error", "Failed to Filed auto fill!");
          // }
        });
    } else {
      toastMessageShow("error", "please fill vin field first");
    }
  };

  const getVehicleInfo = (make, model, year, vehicle_type) => {
    const newValues = {};
    newValues.make = make;
    newValues.model = model;
    newValues.year = year;
    newValues.vehicle_type = vehicle_type;
    const newCloneValues = { ...values, ...newValues };
    setValues(newCloneValues);
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

  const storeInvoiceSuccess = (fileName) => {
    if (recordForEdit != null) {
      const colneValues = { ...values };
      colneValues.file_urls.invoice_files.push(fileName);
      setValues(colneValues);
    } else {
      initialFValues.file_urls.invoice_files.push(fileName);
    }
  };

  const removeInvoiceFile = (fileName) => {
    if (recordForEdit != null) {
      const colneValues = { ...values };

      let index = colneValues.file_urls.invoice_files
        ? colneValues.file_urls.invoice_files.findIndex((x) => x === fileName)
        : -1;
      colneValues.file_urls.invoice_files.splice(index, 1);
      setValues(colneValues);
    } else {
      let index = initialFValues.file_urls.invoice_files
        ? initialFValues.file_urls.invoice_files.findIndex(
            (x) => x === fileName
          )
        : -1;
      initialFValues.file_urls.invoice_files.splice(index, 1);
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

  const handleFocusOut = () => {
    let lot_number = "";
    if (values?.vin) {
      lot_number = values.vin.slice(-6);
    }
    setValues({ ...values, lot_number });
  };

  useEffect(() => {
    const url = `/search/vehicle-types`;

    VehicleService.getVehicleTypes(url)
      .then((response) => {
        const json = response.data;
        setVehicleTypes([{ title: "Select Type", id: "" }, ...json]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleClose = () => {
    setOpenPopup(false);
    setErrorClass("");
    resetForm();
    setBackendErros({});
    initialFValues.agent_company_name = "";
    initialFValues.legacy_agent_id = "";
    initialFValues.agent_user_id = "";
    setAgentUser({});
    setClicked(false);
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
              ? languageStrings.vehicle_update
              : languageStrings.vehicle_create}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            onSubmit={handleSubmit}
            className={`needs-validation ${errorClass}`}
          >
            <div className="row">
              <div className="col-md-6">
                <h5>Agent Info</h5>
                <div className="mb-3">
                  <label className="form-label mb-0">Agent Name</label>
                  <AsyncSelect
                    components={animatedComponet}
                    placeholder={`Agent Name`}
                    loadOptions={agentLoadOptions}
                    value={agentUser?.label ? agentUser : agentUser?.label}
                    onChange={handleAgentAutoInputChange}
                    styles={customStyles}
                    defaultOptions
                    required
                  />
                  <div className="invalid-feedback">Please provide a Agent</div>
                  {clicked && !agentUser?.value && (
                    <p style={{ color: "red" }}>
                      Please provide a valid Agent.
                    </p>
                  )}
                  {backErrorMessage.agent_user_id && (
                    <p style={{ color: "red" }}>
                      {backErrorMessage.agent_user_id[0]}
                    </p>
                  )}
                </div>
                <div className="mb-3">
                  <label className="form-label mb-0">Agent Id</label>
                  <input
                    type="text"
                    id="customername-field"
                    className="form-control"
                    placeholder="Agent ID"
                    name="legacy_agent_id"
                    value={initialFValues.legacy_agent_id}
                    onChange={handleInputChange}
                    disabled={true}
                    required
                  />
                  <div className="invalid-feedback">
                    Please provide a Agent.
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label mb-0">Agent Company Name</label>
                  <input
                    type="text"
                    id="agentname-field"
                    className="form-control"
                    placeholder="Agent Company Name"
                    name="agent_company_name"
                    value={initialFValues.agent_company_name}
                    disabled={true}
                  />
                </div>
                <h5>Customer Info</h5>
                {/* <div className="mb-3">
                  <label className="form-label mb-0">Customer Name</label>
                  <AsyncSelect
                    components={animatedComponet}
                    placeholder={`Customer Name`}
                    loadOptions={loadOptions}
                    value={
                      selectedUser?.label ? selectedUser : selectedUser?.label
                    }
                    onChange={handleAutoInputChange}
                    styles={customStyles}
                    defaultOptions
                    required
                  />
                  <div className="invalid-feedback">
                    Please provide a customer
                  </div>
                  {backErrorMessage.customer_user_id && (
                    <p style={{ color: "red" }}>
                      {backErrorMessage.customer_user_id[0]}
                    </p>
                  )}
                </div> */}
                <div className="mb-3">
                  <label className="form-label mb-0">Customer Name</label>
                  <input
                    type="text"
                    id="customername-field"
                    className="form-control"
                    placeholder="Customer Name"
                    name="customer_name"
                    value={values.customer_name}
                    onChange={handleInputChange}
                    required
                  />
                  <div className="invalid-feedback">
                    Please provide a valid Customer Name.
                  </div>
                  {backErrorMessage.customer_name && (
                    <p style={{ color: "red" }}>
                      {backErrorMessage.customer_name[0]}
                    </p>
                  )}
                </div>
                {/* <div className="mb-3">
                  <label className="form-label mb-0">Customer Id</label>
                  <input
                    type="text"
                    id="customername-field"
                    className="form-control"
                    placeholder="Customer ID"
                    name="legacy_customer_id"
                    value={initialFValues.legacy_customer_id}
                    onChange={handleInputChange}
                    disabled={true}
                    required
                  />
                  <div className="invalid-feedback">
                    Please provide a Customer.
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label mb-0">Company Name</label>
                  <input
                    type="text"
                    id="customername-field"
                    className="form-control"
                    placeholder="Customer Company Name"
                    name="company_name"
                    value={initialFValues.company_name}
                    disabled={true}
                  />
                </div> */}

                <h5>Towing Info</h5>

                <br />
                <div className="row">
                  <div className="col-md-6">
                    <h6>Damaged</h6>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-check form-radio-primary mb-3">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="damaged"
                            id="damaged1"
                            value="1"
                            onChange={handleTowingInputChange}
                            checked={values.towing_request.damaged === "1"}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="damaged1"
                          >
                            Yes
                          </label>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-check form-radio-primary mb-3">
                          <input
                            className="form-check-input"
                            type="radio"
                            id="damaged2"
                            name="damaged"
                            value="0"
                            onChange={handleTowingInputChange}
                            checked={values.towing_request.damaged === "0"}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="damaged2"
                          >
                            No
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <h6>Picture</h6>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-check form-radio-primary mb-3">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="pictures"
                            id="pictures1"
                            value="1"
                            onChange={handleTowingInputChange}
                            checked={values.towing_request.pictures === "1"}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="pictures1"
                          >
                            Yes
                          </label>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-check form-radio-primary mb-3">
                          <input
                            className="form-check-input"
                            type="radio"
                            id="pictures2"
                            name="pictures"
                            value="0"
                            onChange={handleTowingInputChange}
                            checked={values.towing_request.pictures === "0"}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="pictures2"
                          >
                            No
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <br />

                <div className="row">
                  <div className="col-md-6">
                    <h6>Key</h6>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-check form-radio-primary mb-3">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="keys"
                            id="key1"
                            value="1"
                            onChange={handleInputChange}
                            checked={values.keys == "1"}
                          />
                          <label className="form-check-label" htmlFor="key1">
                            Yes
                          </label>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-check form-radio-primary mb-3">
                          <input
                            className="form-check-input"
                            type="radio"
                            id="key2"
                            name="keys"
                            value="2"
                            onChange={handleInputChange}
                            checked={values.keys == "2"}
                          />
                          <label className="form-check-label" htmlFor="key2">
                            No
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label mb-0">Key Note</label>
                    <textarea
                      className="form-control"
                      id="exampleFormControlTextarea5"
                      name="key_note"
                      placeholder="key Note"
                      value={values.key_note}
                      onChange={handleInputChange}
                      rows="2"
                    ></textarea>
                  </div>
                </div>
                {/* <br />
                <div className="row">
                  <div className="col-md-12">
                    <div>
                      <label className="form-label mb-0">
                        Towing request date
                      </label>
                      <input
                        type="date"
                        className="form-control flatpickr-input active"
                        name="towing_request_date"
                        value={values.towing_request.towing_request_date}
                        onChange={handleTowingInputChange}
                      />
                      <div className="invalid-feedback">
                        Please provide a towing request date.
                      </div>
                    </div>
                  </div>
                </div> */}
                <br />
                <div className="row"></div>
                <br />
                <div className="row">
                  <div className="col-md-12">
                    <div>
                      <label className="form-label mb-0">Received date</label>
                      <input
                        type="date"
                        className="form-control flatpickr-input active"
                        name="deliver_date"
                        value={values.towing_request.deliver_date}
                        onChange={handleTowingInputChange}
                      />
                    </div>
                  </div>
                </div>
                <br />
                <div className="row">
                  <div className="col-md-12">
                    <label className="form-label mb-0">Note</label>
                    <textarea
                      className="form-control"
                      id="exampleFormControlTextarea5"
                      name="note"
                      placeholder="Note"
                      value={values.towing_request.note}
                      onChange={handleTowingInputChange}
                      rows="3"
                    ></textarea>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <h5>Vehicle Info</h5>
                <div className="mb-3">
                  <label className="form-label mb-0">Status</label>
                  <select
                    className="form-select form-control"
                    data-trigger
                    id="status-field"
                    name="status"
                    value={values.status}
                    onChange={handleInputChange}
                  >
                    {statusItems.map((item, index) => (
                      <option value={item.id} key={index}>
                        {item.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <div className="row">
                    <div className="col-md-9">
                      <label className="form-label mb-0">Vin</label>
                      <input
                        type="text"
                        id="customername-field"
                        className={`form-control`}
                        placeholder="Vin"
                        name="vin"
                        value={values.vin}
                        onChange={handleInputChange}
                        onBlur={handleFocusOut}
                        required
                      />
                      <div className="invalid-feedback">
                        Please provide a valid vin.
                      </div>
                      {backErrorMessage.vin && (
                        <p style={{ color: "red" }}>
                          {backErrorMessage.vin[0]}
                        </p>
                      )}
                    </div>
                    <div className="col-md-3">
                      <label className="form-label mb-0"></label>
                      <button
                        className="btn btn-info"
                        style={{ marginTop: "20px" }}
                        type="button"
                        onClick={autoFillClick}
                      >
                        Auto Fill
                      </button>
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label mb-0">Vehicle Type</label>
                  <select
                    className="form-select form-control"
                    data-trigger
                    id="status-field"
                    name="vehicle_type"
                    value={values.vehicle_type}
                    onChange={handleInputChange}
                  >
                    {vehicleTypes.map((item, index) => (
                      <option value={item.id} key={index}>
                        {item.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label mb-0">Year</label>
                  <input
                    type="text"
                    id="customername-field"
                    className="form-control"
                    placeholder="Year"
                    name="year"
                    value={values.year}
                    onChange={handleInputChange}
                    required
                  />
                  <div className="invalid-feedback">
                    Please provide a valid year.
                  </div>
                  {backErrorMessage.year && (
                    <p style={{ color: "red" }}>{backErrorMessage.year[0]}</p>
                  )}
                </div>
                <div className="mb-3">
                  <label className="form-label mb-0">Color</label>
                  <select
                    className="form-select form-control"
                    data-trigger
                    id="status-field"
                    name="color"
                    value={values.color}
                    onChange={handleInputChange}
                  >
                    <option value="">Color</option>
                    {colorItems &&
                      colorItems.map((item, index) => (
                        <option value={item.color} key={index}>
                          {item.color}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label mb-0">Make</label>
                  <input
                    type="text"
                    id="customername-field"
                    className="form-control"
                    placeholder="make"
                    name="make"
                    value={values.make}
                    onChange={handleInputChange}
                    required
                  />
                  <div className="invalid-feedback">
                    Please provide a valid make.
                  </div>
                  {backErrorMessage.make && (
                    <p style={{ color: "red" }}>{backErrorMessage.make[0]}</p>
                  )}
                </div>
                <div className="mb-3">
                  <label className="form-label mb-0">Model</label>
                  <input
                    type="text"
                    id="customername-field"
                    className="form-control"
                    placeholder="model"
                    name="model"
                    value={values.model}
                    onChange={handleInputChange}
                    required
                  />
                  <div className="invalid-feedback">
                    Please provide a valid model.
                  </div>
                  {backErrorMessage.model && (
                    <p style={{ color: "red" }}>{backErrorMessage.model[0]}</p>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label mb-0">Shipping Price ($)</label>
                  <input
                    type="text"
                    id="customername-field"
                    className="form-control"
                    placeholder="Shipping Price"
                    name="value"
                    value={values.value}
                    onChange={handleInputChange}
                  />
                </div>

                {/* <div className="mb-3">
                  <label className="form-label mb-0">Towed From</label>
                  <input
                    type="text"
                    id="customername-field"
                    className="form-control"
                    placeholder="Towed from"
                    name="towed_from"
                    value={values.towed_from}
                    onChange={handleInputChange}
                    required
                  />
                  <div className="invalid-feedback">
                    Please provide a Towed form.
                  </div>
                </div> */}
                <div className="mb-3">
                  <label className="form-label mb-0">Lot Number</label>
                  <input
                    type="text"
                    id="customername-field"
                    className="form-control"
                    placeholder="Lot No"
                    name="lot_number"
                    value={values.lot_number}
                    onChange={handleInputChange}
                    required
                  />
                  <div className="invalid-feedback">
                    Please provide a valid Lot number.
                  </div>
                  {backErrorMessage.lot_number && (
                    <p style={{ color: "red" }}>
                      {backErrorMessage.lot_number[0]}
                    </p>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label mb-0">Location</label>
                  <select
                    className="form-select form-control"
                    data-trigger
                    id="status-field"
                    name="location_id"
                    value={values.location_id ?? 0}
                    onChange={handleInputChange}
                    required="required"
                  >
                    <option value="">Select Location</option>
                    {locationItems &&
                      locationItems.map((item, index) => (
                        <option value={item.id} key={index}>
                          {item.name}
                        </option>
                      ))}
                  </select>
                  <div className="invalid-feedback">
                    Please provide a valid Location.
                  </div>
                  {backErrorMessage.location_id && (
                    <p style={{ color: "red" }}>
                      {backErrorMessage.location_id[0]}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <br />
            <div className="row">
              <div className="col-md-12">
                <div className="row">
                  <br />
                  <h5>Check options included on the vehicle</h5>
                  {/* {vehicleCheckboxItems &&
                    vehicleCheckboxItems.map((item, index) => (
                      <div className="col-md-4" key={index}>
                        <div className="form-check mb-3">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={item.name}
                            name={item.id}
                            value={item.id}
                            checked={values.vehicle_features[item.id]}
                            onChange={(e) => handleCheckboxInputChange(e)}
                          />
                          <label
                            className="form-check-label"
                            htmlFor={item.name}
                          >
                            {item.name}
                          </label>
                        </div>
                      </div>
                    ))} */}

                  {vehicleCheckboxItems &&
                    vehicleCheckboxItems.map((item, index) => (
                      <div className="col-md-3" key={index}>
                        <label className="form-check-label" htmlFor={item.name}>
                          {item.name}
                        </label>
                        <div className="form-check mb-3">
                          {item.feature_options &&
                            item.feature_options.map((singleOption, i) => (
                              <div key={`${index}_${i}`}>
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  id={`${index}_${singleOption}_${i}`}
                                  name={item.id}
                                  value={i}
                                  checked={
                                    values.vehicle_features[item.id] == i
                                  }
                                  onChange={(e) => handleCheckboxInputChange(e)}
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor={`${index}_${singleOption}_${i}`}
                                >
                                  {singleOption}
                                </label>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
            <div className="row">
              {/* <h5>Condition of vehicle</h5>
              <div className="col-md-12">
                <div className="row">
                  {vehicleConditionItems &&
                    vehicleConditionItems.map((item, index) => (
                      <div
                        className="col-md-3"
                        key={index}
                        style={{ margin: "5px 0px" }}
                      >
                        <label className="form-label mb-0">{item.name}</label>
                        <input
                          type="text"
                          id="customername-field"
                          className="form-control"
                          placeholder={item.name}
                          name={item.id}
                          value={values.vehicle_conditions[item.id]}
                          onChange={(e) => handleConditionInputChange(e)}
                        />
                      </div>
                    ))}
                </div>
              </div> */}
            </div>
            <br />
            <FileZone
              title="Vehicle Photos"
              url="/vehicles/photo-upload"
              storeSuccess={storeSuccess}
              removeFile={removeFile}
              existingFilesArray={recordForEdit ? recordForEdit.photos : []}
            />
            <br />
            <br />
            <FileZone
              title="Vehicle Documents"
              url="/vehicles/document-upload"
              storeSuccess={storeDocumentSuccess}
              removeFile={removeDocumentFile}
              existingFilesArray={recordForEdit ? recordForEdit.documents : []}
            />
            <br />
            <br />
            <FileZone
              title="Vehicle Invoices"
              url="/vehicles/document-upload"
              storeSuccess={storeInvoiceSuccess}
              removeFile={removeInvoiceFile}
              existingFilesArray={recordForEdit ? recordForEdit.invoices : []}
            />
            <button hidden type="submit" ref={buttonRef}></button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {buttonDisabled && <Spinner animation="border" size="sm" />}
          <Controls.Button
            text={recordForEdit ? languageStrings.update : languageStrings.save}
            size="medium"
            disabled={buttonDisabled}
            color="primary"
            onClick={submitClick}
          />
        </Modal.Footer>
      </Modal>
      <ToastContainer />
    </>
  );
}
