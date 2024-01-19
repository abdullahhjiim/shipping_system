import { Grid } from "@material-ui/core";
import Button from "@mui/material/Button";
import React, { useEffect } from "react";
import Controls from "../controls/Controls";
import { Form, useForm } from "../useForm/UseForm";

const locationType = [
  { id: 1, title: "Full" },
  { id: 2, title: "Mix" },
];

const statusItems = [
  { title: "ON HAND", id: 1 },
  { title: "INSEIDE THE PORT", id: 2 },
  { title: "ON THE WAY", id: 3 },
  { title: "SHIPPED", id: 4 },
  { title: "PICKED UP", id: 5 },
  { title: "ARRIVED", id: 6 },
];

const vehicleTypeItem = [
  { title: "SUV", id: "SUV" },
  { title: "Sedan", id: "Sedan" },
  { title: "Van", id: "Van" },
  { title: "Pickup", id: "Pickup" },
  { title: "Truck", id: "Truck" },
  { title: "Mortorcycle", id: "Mortorcycle" },
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
  const { addOrEdit, recordForEdit } = props;

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
    e.preventDefault();
    if (validate()) {
      addOrEdit(values, resetForm);
    }
  };

  useEffect(() => {
    if (recordForEdit != null)
      setValues({
        ...recordForEdit,
      });
  }, [recordForEdit, setValues]);

  return (
    <Form onSubmit={handleSubmit}>
      <Grid container>
        <Grid item xs={12}>
          <div className="row">
            <div className="row header-info">
              <div className="col-md-6">
                <h5>Customer Info</h5>
              </div>
              <div className="col-md-6">
                <h5>Vehicle Info</h5>
              </div>
            </div>
            <div className="col-md-6">
              <Controls.Input
                name="customer_user_id"
                label="Customer"
                value={values.customer_user_id}
                onChange={handleInputChange}
                error={errors.customer_user_id}
              />
              <Controls.Input
                name="company_name"
                label="Customer Company Name"
                value={values.company_name}
                onChange={handleInputChange}
                error={errors.company_name}
              />
            </div>
            <div className="col-md-6">
              <Controls.Select
                name="status"
                label="Status"
                value={values.status}
                onChange={handleInputChange}
                options={statusItems}
                error={errors.status}
              />
              <Controls.Select
                name="vehicle_type"
                label="Vehicle Type"
                value={values.vehicle_type}
                onChange={handleInputChange}
                options={vehicleTypeItem}
                error={errors.vehicle_type}
              />
              <span style={{ display: "flex", width: "80%" }}>
                <Controls.Input
                  name="vin"
                  label="Vin"
                  value={values.vin}
                  onChange={handleInputChange}
                  error={errors.vin}
                />
                <Button
                  size="small"
                  variant="outlined"
                  style={{ width: "100px", height: "30px", marginTop: "25px" }}
                >
                  Auto fill
                </Button>
              </span>
              <Controls.Input
                name="year"
                label="Year"
                value={values.year}
                onChange={handleInputChange}
                error={errors.year}
              />
              <Controls.Select
                name="color"
                label="Color"
                value={values.color}
                onChange={handleInputChange}
                options={statusItems}
                error={errors.color}
              />
              <Controls.Input
                name="model"
                label="Model"
                value={values.model}
                onChange={handleInputChange}
                error={errors.model}
              />
              <Controls.Input
                name="make"
                label="Make"
                value={values.make}
                onChange={handleInputChange}
                error={errors.make}
              />
              <Controls.Input
                name="hat_number"
                label="Hat"
                value={values.hat_number}
                onChange={handleInputChange}
                error={errors.hat_number}
              />
              <Controls.Input
                name="weight"
                label="Weight"
                value={values.weight}
                onChange={handleInputChange}
                error={errors.weight}
              />
              <Controls.Input
                name="value"
                label="Value"
                value={values.value}
                onChange={handleInputChange}
                error={errors.value}
              />
              <Controls.Input
                name="buyer_no"
                label="Buyer No"
                value={values.buyer_no}
                onChange={handleInputChange}
                error={errors.buyer_no}
              />
              <Controls.Input
                name="towed_from"
                label="Towed Form"
                value={values.towed_from}
                onChange={handleInputChange}
                error={errors.towed_from}
              />
              <Controls.Input
                name="lot_number"
                label="Lot No"
                value={values.lot_number}
                onChange={handleInputChange}
                error={errors.lot_number}
              />
              <Controls.Input
                name="towed_amount"
                label="Towed Amount"
                value={values.towed_amount}
                onChange={handleInputChange}
                error={errors.towed_amount}
              />
              <Controls.Input
                name="storage_amount"
                label="Storage Amount"
                value={values.storage_amount}
                onChange={handleInputChange}
                error={errors.storage_amount}
              />
              <Controls.Input
                name="title_amount"
                label="Title Amount"
                value={values.title_amount}
                onChange={handleInputChange}
                error={errors.title_amount}
              />
              <Controls.Input
                name="check_number"
                label="Check No"
                value={values.check_number}
                onChange={handleInputChange}
                error={errors.check_number}
              />
              <Controls.Input
                name="add_chgs"
                label="Add CHGS"
                value={values.add_chgs}
                onChange={handleInputChange}
                error={errors.add_chgs}
              />
              <Controls.Select
                name="auctions_at"
                label="Auction At"
                value={values.auctions_at}
                onChange={handleInputChange}
                options={auctionsItem}
                error={errors.auctions_at}
              />
              <Controls.Select
                name="location_id"
                label="Location"
                value={values.location_id}
                onChange={handleInputChange}
                options={locationType}
                error={errors.location_id}
              />
            </div>
          </div>
        </Grid>
        <Grid item xs={12}>
          <div className="footer-button">
            <Controls.Button type="submit" text="Submit" />
            <Controls.Button
              text="Reset"
              color="secondary"
              onClick={resetForm}
            />
          </div>
        </Grid>
      </Grid>
    </Form>
  );
}
