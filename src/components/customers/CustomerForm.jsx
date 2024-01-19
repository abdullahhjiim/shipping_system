import { Grid, TextField } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import * as countryService from "../../services/CountryService";
import Controls from "../controls/Controls";
import { Form, useForm } from "../useForm/UseForm";
import "./customers.css";

const locationType = [
  { id: 1, title: "Full" },
  { id: 2, title: "Mix" },
];

const initialFValues = {
  id: 0,
  legacy_customer_id: "",
  name: "",
  email: "",
  password: "",
  phone: "",
  phone_two: "",
  company_name: "",
  address_line_1: "",
  address_line_2: "",
  country_id: "",
  state_id: "",
  city_id: "",
  zip_code: "",
  fax: "",
  trn: "",
  tax_id: "",
  other_emails: "",
  note: "",
};

export default function CustomerForm(props) {
  const [countryItems, setCountry] = useState([]);
  const [countryId, setCountryId] = useState(null);
  const [stateItems, setState] = useState([]);
  const [stateId, setStateId] = useState(null);
  const [cityItems, setCity] = useState([]);

  useEffect(() => {
    const getcountry = () => {
      countryService.getAllCountryForSelect().then((response) => {
        setCountry(response.data.data);
      });
    };
    getcountry();
  }, []);

  const handleCountry = (event) => {
    event.preventDefault();
    const getcoutryid = event.target.value;
    setCountryId(getcoutryid);
    handleInputChange(event);
    setCity([]);
  };

  useEffect(() => {
    const getstate = (countryId) => {
      countryService.getAllStateByCountry(countryId).then((response) => {
        setState(response.data.data);
      });
    };
    getstate(countryId);
  }, [countryId]);

  const handleState = (event) => {
    event.preventDefault();
    const getStateId = event.target.value;
    setStateId(getStateId);
    handleInputChange(event);
  };

  useEffect(() => {
    const getstate = (stateId) => {
      countryService.getAllCityByState(stateId).then((response) => {
        setCity(response.data.data);
      });
    };
    getstate(stateId);
  }, [stateId]);

  const { addOrEdit, recordForEdit } = props;

  console.log(recordForEdit);

  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ("name" in fieldValues)
      temp.name = fieldValues.name ? "" : "This field is required.";

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
            <div className="col-md-6 form-input">
              <Controls.Input
                name="legacy_customer_id"
                label="Customer Id"
                value={values.legacy_customer_id}
                onChange={handleInputChange}
                error={errors.legacy_customer_id}
              />
            </div>
            <div className="col-md-6 form-input">
              <Controls.Input
                name="customer_name"
                label="Customer name"
                value={values.customer_name}
                onChange={handleInputChange}
                error={errors.customer_name}
              />
            </div>

            <div className="col-md-6 form-input">
              <Controls.Input
                name="name"
                label="User Name"
                value={values.name}
                onChange={handleInputChange}
                error={errors.name}
              />
            </div>
            <div className="col-md-6 form-input">
              <Controls.Input
                name="email"
                label="Email"
                value={values.email}
                onChange={handleInputChange}
                error={errors.email}
              />
            </div>

            <div className="col-md-6 form-input">
              <Controls.Input
                name="phone"
                label="Phone"
                value={values.phone}
                onChange={handleInputChange}
                error={errors.phone}
              />
            </div>
            <div className="col-md-6 form-input">
              <Controls.Input
                name="password"
                type="password"
                label="Password"
                value={values.password}
                onChange={handleInputChange}
                error={errors.password}
              />
            </div>

            <div className="col-md-6 form-input">
              <Controls.Input
                name="trn"
                label="TRN"
                value={values.trn}
                onChange={handleInputChange}
                error={errors.trn}
              />
            </div>
            <div className="col-md-6 form-input">
              <Controls.Input
                name="company_name"
                label="Company Name"
                value={values.company_name}
                onChange={handleInputChange}
                error={errors.company_name}
              />
            </div>

            <div className="col-md-6">
              <Controls.SelectMaterial
                name="country_id"
                label="Country"
                value={values.country_id}
                onChange={handleCountry}
                options={countryItems}
                error={errors.country_id}
              />
            </div>

            <div className="col-md-6 form-input">
              <Controls.Input
                name="phone_two"
                label="Phone UAE"
                value={values.phone_two}
                onChange={handleInputChange}
                error={errors.phone_two}
              />
            </div>

            <div className="col-md-6">
              <Controls.SelectMaterial
                name="state_id"
                label="State"
                value={values.state_id}
                onChange={handleState}
                options={stateItems}
                error={errors.state_id}
              />
            </div>

            <div className="col-md-6 form-input">
              <Controls.Input
                name="address_line_1"
                label="Address 1"
                value={values.address_line_1}
                onChange={handleInputChange}
                error={errors.address_line_1}
              />
            </div>

            <div className="col-md-6">
              <Controls.SelectMaterial
                name="city_id"
                label="City"
                value={values.city_id}
                onChange={handleInputChange}
                options={cityItems}
                error={errors.city_id}
              />
            </div>

            <div className="col-md-6 form-input">
              <Controls.Input
                name="tax_id"
                label="Tax"
                value={values.tax_id}
                onChange={handleInputChange}
                error={errors.tax_id}
              />
            </div>

            <div className="col-md-6 form-input">
              <Controls.Input
                name="other_emails"
                label="Other Email"
                value={values.other_emails}
                onChange={handleInputChange}
                error={errors.other_emails}
              />
            </div>

            <div className="col-md-6 form-input">
              <Controls.Input
                name="address_line_2"
                label="Address 2"
                value={values.address_line_2}
                onChange={handleInputChange}
                error={errors.address_line_2}
              />
            </div>

            <div className="col-md-6">
              <Controls.SelectMaterial
                name="location_type"
                label="Location Type"
                value={values.location_type}
                onChange={handleInputChange}
                options={locationType}
                error={errors.location_type}
              />
            </div>

            <div className="col-md-6 form-input">
              <Controls.Input
                name="zip_code"
                label="Zip Code"
                value={values.zip_code}
                onChange={handleInputChange}
                error={errors.zip_code}
              />
            </div>
          </div>
        </Grid>

        <Grid item xs={12}>
          <TextField
            placeholder="Note"
            multiline
            minRows={3}
            maxRows={4}
            name="note"
            value={values.note}
            onChange={handleInputChange}
            error={errors.note}
            style={{ width: "91%" }}
          />
        </Grid>

        <Grid item xs={12}>
          <div
            className="pull-right"
            style={{ display: "flex", flexDirection: "row-reverse" }}
          >
            <Controls.Button size="sm" type="submit" text="Submit" />
          </div>
        </Grid>
      </Grid>
    </Form>
  );
}
