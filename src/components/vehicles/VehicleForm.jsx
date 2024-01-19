import React, { useEffect, useRef, useState } from "react";
import { Form, useForm } from "../useForm/UseForm";

const damageClaimItems = [
  { id: "", title: "" },
  { id: 1, title: "YES" },
  { id: 0, title: "NO" },
];

const claimStatusItems = [
  { title: "" },
  { title: "REJECTED", id: "0" },
  { title: "APPROVED", id: 1 },
  { title: "PENDING", id: 10 },
];

const keysItems = [
  { title: "", id: "" },
  { title: "Yes", id: "1" },
  { title: "No", id: "0" },
];

const vehicleTypeItems = [
  { title: "Select vehicle", id: "" },
  { title: "Sedan", id: "Sedan" },
  { title: "Van", id: "Van" },
  { title: "Pickup", id: "Pickup" },
  { title: "Truck", id: "Truck" },
  { title: "Mortorcycle", id: "Mortorcycle" },
];

const titleItems = [
  { title: "", id: "" },
  { title: "NO TITLE", id: "0" },
  { title: "EXPORTABLE", id: 1 },
  { title: "PENDING", id: 2 },
  { title: "BOS", id: 3 },
  { title: "LIEN", id: 4 },
  { title: "MV907", id: 5 },
  { title: "REJECTED", id: 6 },
];

const locationItems = [
  { title: "Select location", id: "" },
  { title: "LA", id: 1 },
  { title: "LA", id: 1 },
  { title: "GA", id: 2 },
  { title: "NY", id: 3 },
  { title: "TX", id: 4 },
  { title: "BALTIMORE", id: 5 },
  { title: "NEWJ-2", id: 6 },
  { title: "TEXAS", id: 7 },
  { title: "NJ", id: 8 },
];

const statusItems = [
  { title: "Select status", id: "" },
  { title: "ON HAND", id: 1 },
  { title: "INSEIDE THE PORT", id: 2 },
  { title: "ON THE WAY", id: 3 },
  { title: "SHIPPED", id: 4 },
  { title: "PICKED UP", id: 5 },
  { title: "ARRIVED", id: 6 },
  { title: "HANDED OVER", id: 7 },
];

const loadingTypeItems = [
  { title: "", id: "" },
  { title: "Full", id: 1 },
  { title: "Mix", id: 2 },
];

const noteItems = [
  { title: "", id: "" },
  { title: "Open", id: 2 },
  { title: "Closed", id: 1 },
];

const auctionsItem = [
  { title: "Select Auction", id: "" },
  { title: "Copart", id: "1" },
  { title: "IAA", id: "2" },
];

const initialFValues = {
  id: 0,
  customer_user_id: "",
  company_name: "",
  status: "",
  vehicle_type: "",
  vin: "",
  year: "",
  color: "",
  make: "",
  model: "",
  hat_number: "",
  weight: "",
  buyer_no: "",
  value: "",
  towed_from: "",
  lot_number: "",
  towed_amount: "",
  storage_amount: "",
  title_amount: "",
  check_number: "",
  add_chgs: "",
  auctions_at: "",
  location_id: "",
};

export default function VehicleForm(props) {
  const buttonRef = useRef();
  const [errorClass, setErrorClass] = useState("");
  const [customErrors, setCustomErrors] = useState({});
  const { addOrEdit, recordForEdit, submitTrigger } = props;

  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ("customer_user_id" in fieldValues) {
      temp.customer_user_id = fieldValues.customer_user_id
        ? ""
        : "This field is required.";
    }
    if ("vin" in fieldValues) {
      temp.vin = fieldValues.vin ? "" : "This field is required.";
    }
    if ("year" in fieldValues) {
      temp.year = fieldValues.year ? "" : "This field is required.";
    }
    if ("make" in fieldValues) {
      temp.make = fieldValues.make ? "" : "This field is required.";
    }
    if ("model" in fieldValues) {
      temp.model = fieldValues.model ? "" : "This field is required.";
    }
    if ("towed_from" in fieldValues) {
      temp.towed_from = fieldValues.towed_from ? "" : "This field is required.";
    }
    if ("towed_amount" in fieldValues) {
      temp.towed_amount = fieldValues.towed_amount
        ? ""
        : "This field is required.";
    }
    if ("lot_number" in fieldValues) {
      temp.lot_number = fieldValues.lot_number ? "" : "This field is required.";
    }
    if ("location_id" in fieldValues) {
      temp.location_id = fieldValues.location_id
        ? ""
        : "This field is required.";
    }

    setErrors({
      ...temp,
    });

    if (fieldValues === values)
      return Object.values(temp).every((x) => x === "");
  };

  const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
    useForm(initialFValues, true, validate);

  const handleSubmit = (e) => {
    console.log(e);
    e.preventDefault();
    addOrEdit(values, resetForm, setCustomErrors);
    if (validate()) {
      addOrEdit(values, resetForm, setCustomErrors);
    }
  };

  useEffect(() => {
    // setErrorClass("");
    console.log(submitTrigger);
    if (submitTrigger) {
      console.log(submitTrigger);
      buttonRef.current.click();
      // setErrorClass("was-validated");
    }
  }, [submitTrigger]);

  // const submitTrigger = () => {
  //     console.log('jim')
  // }

  useEffect(() => {
    if (recordForEdit != null)
      setValues({
        ...recordForEdit,
      });
  }, [recordForEdit, setValues]);

  return (
    <Form onSubmit={handleSubmit} className={`needs-validation ${errorClass}`}>
      <div className="row">
        <div className="col-md-6">
          <h5>Agent Info</h5>
          <div className="mb-3">
            <input
              type="text"
              id="agentname-field"
              className="form-control"
              placeholder="Agent"
              name="agent_user_id"
              value={values.agent_user_id}
              onChange={handleInputChange}
              required
            />
            <div className="invalid-feedback">Please provide a valid Agent Username.</div>
          </div>
          <div className="mb-3">
            <input
              type="text"
              id="agentname-field"
              className="form-control"
              placeholder="Agent ID"
              name="agent_user_id"
              value={values.agent_user_id}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              id="customername-field"
              className="form-control"
              placeholder="Customer Company Name"
              name="company_name"
              value={values.company_name}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
        <div className="col-md-6">
          <h5>Customer Info</h5>
          <div className="mb-3">
            <input
              type="text"
              id="customername-field"
              className="form-control"
              placeholder="Customer"
              name="customer_user_id"
              value={values.customer_user_id}
              onChange={handleInputChange}
              required
            />
            <div className="invalid-feedback">Please provide a valid city.</div>
          </div>
          <div className="mb-3">
            <input
              type="text"
              id="customername-field"
              className="form-control"
              placeholder="Customer ID"
              name="customer_user_id"
              value={values.customer_user_id}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              id="customername-field"
              className="form-control"
              placeholder="Customer Company Name"
              name="company_name"
              value={values.company_name}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
        <div className="col-md-6">
          <h5>Vehicle Info</h5>
          <div className="mb-3">
            <select
              className="form-control"
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
            <select
              className="form-control"
              data-trigger
              id="status-field"
              name="vehicle_type"
              value={values.vehicle_type}
              onChange={handleInputChange}
            >
              {vehicleTypeItems.map((item, index) => (
                <option value={item.id} key={index}>
                  {item.title}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <input
              type="text"
              id="customername-field"
              className={`form-control ${customErrors.vin}`}
              placeholder="Vin"
              required
              name="vin"
              value={values.vin}
              onChange={handleInputChange}
            />
            <div className="invalid-feedback">Please provide a valid vin.</div>
          </div>
          <div className="mb-3">
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
          </div>
          {/* <div className="mb-3">
            <select
              className="form-control"
              data-trigger
              name="status-field"
              id="status-field"
            >
              <option value="">Color</option>
              <option value="Active">Active</option>
              <option value="Block">Block</option>
            </select>
          </div>
          <div className="mb-3">
            <input
              type="text"
              id="customername-field"
              className="form-control"
              placeholder="make"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              id="customername-field"
              className="form-control"
              placeholder="model"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              id="customername-field"
              className="form-control"
              placeholder="Hat"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              id="customername-field"
              className="form-control"
              placeholder="Weight"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              id="customername-field"
              className="form-control"
              placeholder="Value"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              id="customername-field"
              className="form-control"
              placeholder="Buyer No"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              id="customername-field"
              className="form-control"
              placeholder="Towed form"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              id="customername-field"
              className="form-control"
              placeholder="Lot No"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              id="customername-field"
              className="form-control"
              placeholder="Towed Amount"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              id="customername-field"
              className="form-control"
              placeholder="Storage Amount"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              id="customername-field"
              className="form-control"
              placeholder="Title Amount"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              id="customername-field"
              className="form-control"
              placeholder="Check NO"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              id="customername-field"
              className="form-control"
              placeholder="Add CHGS"
              required
            />
          </div>
          <div className="mb-3">
            <select
              className="form-control"
              data-trigger
              id="status-field"
              name="auction_at"
              value={values.auctions_at}
              onChange={handleInputChange}
            >
              {auctionsItem.map((item, index) => (
                <option value={item.id} key={index}>
                  {item.title}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <select
              className="form-control"
              data-trigger
              id="status-field"
              name="location"
              value={values.location}
              onChange={handleInputChange}
            >
              {locationItems.map((item, index) => (
                <option value={item.id} key={index}>
                  {item.title}
                </option>
              ))}
            </select>
          </div> */}
        </div>
      </div>
      <button type="submit" hidden ref={buttonRef}></button>
    </Form>
  );
}
