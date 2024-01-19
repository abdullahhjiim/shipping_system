import DeleteIcon from "@material-ui/icons/Delete";
import { cloneDeep } from "lodash";
import { React, useEffect, useState } from "react";
import Spinner from "react-bootstrap/Spinner";
import "react-dropzone-uploader/dist/styles.css";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import makeAnimated from "react-select/animated";
import AsyncSelect from "react-select/async";
import { ToastContainer, toast } from "react-toastify";
import {
  addToCarts,
  processStatusChange,
  vehicleIDChange,
} from "../../redux/carts/cartsSlice";
import * as ExportService from "../../services/ExportService";
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
  type: 1,
  cargo_by: "1",
  booking_number: "",
  broker_name: "",
  container_number: "",
  eta: "",
  loading_date: "",
  port_of_discharge: 24,
  port_of_loading: 1,
  arrived_to_destination_date: "",
  export_images: [],
  export_invoice_photo: [],
  container_images: [],
  empty_container_photos: [],
  contact_details: "",
  vehicle_ids: [],
  customer_company_name: "",
  file_urls: {
    photos: [],
    document_files: [],
  },
};

const Checkout = () => {
  const checkoutState = useSelector((state) => state.carts);

  const dispatch = useDispatch();
  const [errorClass, setErrorClass] = useState("");
  const [selectedUser, setSelectedUser] = useState({
    label: "Customer",
    vaule: 0,
  });
  const [selectedVinInfo, setSelectedVinInfo] = useState({
    label: "Select Vin",
    value: 0,
  });
  const [vehicles, setVehicles] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState();
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [portLoadingData, setPortLoadingData] = useState([]);
  const [portDischargeData, setPortDischargeData] = useState([]);
  const [processStatus, setProcessStatus] = useState("checkoutsTransit");

  // console.log(vehicles);
  // console.log(checkoutState);

  console.log(checkoutState.lastVehicleStatus);

  useEffect(() => {
    if (checkoutState && checkoutState.lastVehicleStatus)
      setProcessStatus(checkoutState.lastVehicleStatus);

    // console.log(window.location.pathname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    let type = 1;
    if (processStatus === "checkoutsDestination") {
      type = 2;
    }

    initialFValues.type = type;
    const cloneValues = { ...values };
    cloneValues.type = type;

    setValues(cloneValues);

    const cartItemsAdd = () => {
      let items = localStorage.getItem(processStatus);
      if (items) {
        items = JSON.parse(items);
      }

      const firstLocation = items ? items[Object.keys(items)[0]] : [];
      if (firstLocation) {
        let vehiclesArray = [];
        firstLocation.forEach((e) => {
          vehiclesArray.push(e);
        });
        setVehicles(vehiclesArray);
      } else {
        setVehicles([]);
      }
    };

    cartItemsAdd();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [processStatus]);

  // console.log(processStatus);

  useEffect(() => {
    const cartIdPass = () => {
      initialFValues.vehicle_ids = [];
      let initialVIds = [];
      vehicles.forEach((e) => {
        initialFValues.vehicle_ids.push(e.id);
        initialVIds.push(e.id);
      });

      const cloneValues = { ...values };
      cloneValues.vehicle_ids = initialVIds;
      setValues(cloneValues);

      if (checkoutState && checkoutState.allVehicleIDS) {
        let cloneVIDs = [...checkoutState.allVehicleIDS];
        let newIDs = cloneVIDs.concat(initialVIds);
        let uniQueIDs = [...new Set(newIDs)];
        dispatch(vehicleIDChange(uniQueIDs));
      }
    };

    cartIdPass();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehicles]);

  const validate = (fieldValues = values) => {
    let temp = { ...errors };

    if ("booking_number" in fieldValues)
      temp.booking_number = fieldValues.booking_number
        ? ""
        : "This field is required.";
    if ("port_of_loading" in fieldValues)
      temp.port_of_loading = fieldValues.port_of_loading
        ? ""
        : "This field is required.";
    if ("port_of_discharge" in fieldValues)
      temp.port_of_discharge = fieldValues.port_of_discharge
        ? ""
        : "This field is required.";

    setErrors({
      ...temp,
    });

    if (fieldValues === values)
      return Object.values(temp).every((x) => x === "");
  };

  const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
    useForm(initialFValues, true, validate);

  const handleSubmit = (e) => {
    setErrorClass("was-validated");

    e.preventDefault();

    if (vehicles.length === 0) {
      toastMessageShow("error", "No vin selected ! Please select a vin");
      return;
    }

    if (validate()) {
      setButtonDisabled(true);

      let type = processStatus === "checkoutsDestination" ? 2 : 1;
      const finalValues = { ...values, type };

      ExportService.insertExport(finalValues)
        .then((response) => {
          toastMessageShow("success", response.data.message);
          resetForm();
          setErrorClass("");
          setButtonDisabled(false);
          handleNextProcess(values.vehicle_ids);
        })
        .catch((err) => {
          toastMessageShow("error", "Something went Wrong  !!!");
          setButtonDisabled(false);
        });
    }
  };

  const handleNextProcess = (vehicle_ids) => {
    let items = localStorage.getItem(processStatus);
    if (items) {
      items = JSON.parse(items);
    } else {
      items = {};
    }

    if (items && Object.keys(items).length) {
      delete items[Object.keys(items)[0]];

      const stateData = cloneDeep(checkoutState[processStatus]);
      let firstIndex = Object.keys(stateData)[0];
      delete stateData[firstIndex];
      let a = new Set(checkoutState.allVehicleIDs);
      let b = new Set(vehicle_ids);
      let difference = new Set([...a].filter((x) => !b.has(x)));

      dispatch(
        addToCarts({
          type: processStatus,
          data: items,
          allVehicleIDs: [...difference],
        })
      );
    }

    localStorage.setItem(processStatus, JSON.stringify(items));
    window.location.reload();
  };

  const handleVinAutoInputChange = (e) => {
    setSelectedVinInfo(e);
  };

  const loadVinOptions = async (inputText, callback) => {
    let status = 1;
    if (checkoutState.lastVehicleStatus === "checkoutsDestination") {
      status = 10;
    }
    const url = `/vehicle-search?status=${status}&vin=${inputText ?? ""}`;
    // const response = await VehicleService.getVinsItem(url);
    // callback(response.data.data.map((i) => ({ label: i.vin, value: i.id })));

    if (inputText) {
      const response = await VehicleService.getCustomersItem(url);
      callback(response.data.data.map((i) => ({ label: i.vin, value: i.id })));
    } else {
      VehicleService.getCustomersItem(url)
        .then((response) => {
          const json = response.data.data;

          callback(json.map((i) => ({ label: i.vin, value: i.id })));
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const addVehicleInfoByVin = () => {
    const vehicleId = selectedVinInfo.value;

    if (initialFValues.vehicle_ids.indexOf(vehicleId) !== -1) {
      toastMessageShow(
        "error",
        "Vehicle already exists! May be different Location "
      );
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
          // initialFValues.vehicle_ids.push(response.data.data.id);
          setSelectedVinInfo({
            label: "Select Vin",
            value: 0,
          });

          addToCart(response.data.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const removeVehicle = (vehicle) => {
    let i = initialFValues.vehicle_ids.findIndex((x) => x === vehicle.id);
    let vehicleIndex = vehicles.findIndex((x) => x.id === vehicle.id);

    const cloneVehicls = [...vehicles];
    cloneVehicls.splice(vehicleIndex, 1);

    setVehicles(cloneVehicls);
    initialFValues.vehicle_ids.splice(i, 1);

    removeToCarts(vehicle);
  };

  const storeSuccess = (fileName) => {
    initialFValues.file_urls.photos.push(fileName);
  };

  const removeFile = (fileName) => {
    let index = initialFValues.file_urls.photos
      ? initialFValues.file_urls.photos.findIndex((x) => x === fileName)
      : -1;
    initialFValues.file_urls.photos.splice(index, 1);
  };

  const storeDocumentSuccess = (fileName) => {
    initialFValues.file_urls.document_files.push(fileName);
  };

  const removeDocumentFile = (fileName) => {
    let index = initialFValues.file_urls.document_files
      ? initialFValues.file_urls.document_files.findIndex((x) => x === fileName)
      : -1;
    initialFValues.file_urls.document_files.splice(index, 1);
  };

  const handleProcessStatus = (e) => {
    dispatch(processStatusChange(e.target.value));
    setProcessStatus(e.target.value);
    window.location.reload();
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

  const addToCart = (item) => {
    const keyVehicles =
      item.status === 1 ? "checkoutsTransit" : "checkoutsDestination";

    let allVehicleIds = checkoutState.allVehicleIDs
      ? [...checkoutState.allVehicleIDs]
      : [];

    let items = localStorage.getItem(keyVehicles);
    if (items) {
      items = JSON.parse(items);
    } else {
      items = {};
    }

    if (items && items.hasOwnProperty(item.location_id)) {
      // items[item.location_id].forEach((e) => {
      //   console.log(e, item);
      //   if (e.id === item.id) {
      //     return;
      //   } else {
      //     items[item.location_id].push(item);
      //     allVehicleIds.push(item.id);
      //   }
      // });

      let ifExits = items[item.location_id].find((el) => el.id === item.id);
      if (!ifExits) {
        items[item.location_id].push(item);
        allVehicleIds.push(item.id);
      }
    } else {
      items[item.location_id] = [item];
      allVehicleIds.push(item.id);
    }

    allVehicleIds = [...new Set(allVehicleIds)];

    localStorage.setItem(keyVehicles, JSON.stringify(items));
    dispatch(
      addToCarts({
        type: keyVehicles,
        data: items,
        allVehicleIDs: allVehicleIds,
      })
    );
  };

  const removeToCarts = (item) => {
    console.log(processStatus);
    let items = localStorage.getItem(processStatus);
    if (items) {
      items = JSON.parse(items);
    } else {
      items = {};
    }

    if (items && Object.keys(items).length) {
      let cloneArr = items[item.location_id];

      let index = cloneArr.findIndex((ele) => ele.id === item.id);
      cloneArr.splice(index, 1);

      items[item.location_id] = cloneArr;
      let cloneId = [...checkoutState.allVehicleIDs];
      let filterId = cloneId.filter((e) => e !== item.id);
      dispatch(
        addToCarts({
          type: processStatus,
          data: items,
          allVehicleIDs: [...filterId],
        })
      );
    }

    localStorage.setItem(processStatus, JSON.stringify(items));
  };

  return (
    <div className="row">
      <div className="col-md-10 offset-1 ps-0">
        <nav aria-label="breadcrumb ">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/dashboard">Home</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Checkout
            </li>
          </ol>
        </nav>
      </div>
      <div
        className="col-md-10 offset-1"
        style={{ background: "white", padding: "40px" }}
      >
        <div>
          <Form
            onSubmit={handleSubmit}
            className={`needs-validation ${errorClass}`}
            noValidate
          >
            <div className="row">
              <div className="col-md-6">
                {/* <AsyncSelect
                  components={animatedComponet}
                  loadOptions={loadVinOptions}
                  value={selectedVinInfo}
                  defaultOptions
                  onChange={handleVinAutoInputChange}
                /> */}

                <AsyncSelect
                  components={animatedComponet}
                  loadOptions={loadVinOptions}
                  value={selectedVinInfo}
                  onChange={handleVinAutoInputChange}
                  defaultOptions
                  required
                />
              </div>
              <div className="col-md-6">
                <div className="row">
                  <div className="col-md-4">
                    <div className="btn btn-info" onClick={addVehicleInfoByVin}>
                      Add
                    </div>
                  </div>
                  <div className="col-md-8">
                    <div className="row" style={{ marginTop: "8px" }}>
                      <div className="col-md-6">
                        <div className="form-check form-radio-primary mb-3">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="process_status"
                            id="process_status1"
                            value="checkoutsTransit"
                            onChange={handleProcessStatus}
                            checked={processStatus === "checkoutsTransit"}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="process_status1"
                          >
                            Transit
                          </label>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-check form-radio-primary mb-3">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="process_status"
                            id="process_status2"
                            value="checkoutsDestination"
                            onChange={handleProcessStatus}
                            checked={processStatus === "checkoutsDestination"}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="process_status2"
                          >
                            Destination
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
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
                          <td>
                            <Link
                              target="_blank"
                              to={`/vehicles/${vehicle.id}`}
                            >
                              {vehicle.vin}
                            </Link>
                          </td>
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
                              onClick={(e) => removeVehicle(vehicle)}
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
            {/* <div className="row" style={{ marginTop: "40px" }}>
              <div className="col-md-6">
                <h5>Customer Info</h5>
                <div className="mb-3">
                  <label className="form-label mb-0">
                    Select Customer Name
                  </label>
                  <AsyncSelect
                    components={animatedComponet}
                    loadOptions={loadOptions}
                    value={selectedUser}
                    defaultOptions
                    onChange={handleCustomerAutoInputChange}
                  />
                  <div className="invalid-feedback">
                    Please provide a valid Customer Name.
                  </div>
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
                  <div className="invalid-feedback">
                    Please provide a valid customer.
                  </div>
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
              </div>
            </div> */}
            <hr />
            <div className="row" style={{ marginTop: "50px" }}>
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
                </div>
              </div>
              {/* {values?.type == 2 && (
                <div className="col-md-6">
                  <div className="" style={{ height: "30px" }}></div>
                  <div className="mb-3">
                    <label className="form-label mb-0">Export Date</label>
                    <input
                      type="date"
                      className="form-control"
                      placeholder="Export Date"
                      name="export_date"
                      value={values.export_date}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              )} */}
              <div className="col-md-6 mt-4">
                <div className="" style={{ height: "30px" }}>
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
                  </div>
                </div>
              </div>
            </div>

            {/* <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label mb-0">Broker Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Broker Name"
                    name="broker_name"
                    value={values.broker_name}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div> */}

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
                </div>
              </div>
            </div>

            {initialFValues.type === 2 && (
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
                        values.cargo_by === "1" ? "CMR Number" : "Truck Number"
                      }
                      name="container_number"
                      value={values.container_number}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label mb-0">CMR date</label>
                    <input
                      type="date"
                      className="form-control"
                      placeholder="Eta Date"
                      name="cmr_date"
                      value={values.cmr_date}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            )}

            {initialFValues.type === 1 && (
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label mb-0">Ship Number</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Ship Number"
                      name="container_number"
                      value={values.container_number}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            )}

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
                </div>
              </div>

              {initialFValues.type === 2 && (
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
              )}
            </div>
            <br />

            <FileZone
              title="Exports Photos"
              url="/exports/photo-upload"
              storeSuccess={storeSuccess}
              removeFile={removeFile}
              existingFilesArray={[]}
            />
            <br />
            <br />
            <FileZone
              title="Export Documents"
              url="/exports/document-upload"
              storeSuccess={storeDocumentSuccess}
              removeFile={removeDocumentFile}
              existingFilesArray={[]}
            />

            <div
              className=""
              style={{ display: "flex", flexDirection: "row-reverse" }}
            >
              {buttonDisabled && <Spinner animation="border" size="sm" />}
              <Controls.Button
                text={"Save"}
                size="medium"
                color="primary"
                type="submit"
                disabled={buttonDisabled}
              />
            </div>
          </Form>

          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default Checkout;
