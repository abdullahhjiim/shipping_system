import { Grid } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import * as countryService from "../../services/CountryService";
import Controls from "../controls/Controls";
import { Form, useForm } from "../useForm/UseForm";
import "./consignees.css";

const initialFValues = {
  id: 0,
  consignee_name: "",
  customer_user_id: "",
  phone: "",
  consignee_address_1: "",
  consignee_address_2: "",
  country_id: "",
  state_id: "",
  city_id: "",
  zip_code: "",
};

export default function ConsigneeForm(props) {
  const [errorClass, setErrorClass] = useState("");
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
  const validate = (fieldValues = values) => {
    let temp = { ...errors };

    if ("consignee_name" in fieldValues)
      temp.consignee_name = fieldValues.consignee_name
        ? ""
        : "This field is required.";

    if ("customer_user_id" in fieldValues)
      temp.customer_user_id = fieldValues.customer_user_id
        ? ""
        : "This field is required.";

    if ("country_id" in fieldValues)
      temp.country_id = fieldValues.country_id ? "" : "This field is required.";

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
    console.log(validate());
    if (validate()) {
      addOrEdit(values, resetForm);
    }
  };

  useEffect(() => {
    if (recordForEdit != null) {
      setValues({
        ...recordForEdit,
      });
      console.log(recordForEdit);
      setCountryId(recordForEdit.country_id);
      setStateId(recordForEdit.state_id);
    }
  }, [recordForEdit, setValues]);

  return (
    <Form
      onSubmit={handleSubmit}
      className={`needs-validation ${errorClass}`}
      noValidate
    >
      <Grid container>
        <Grid item xs={12}>
          <div className="row">
            <div className="col-md-6 form-input">
              <Controls.Input
                name="customer_user_id"
                label="Customer Name"
                value={values.customer_user_id}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-md-6 form-input">
              <Controls.Input
                name="customer_name"
                label="Search consignee"
                value={values.customer_name}
                onChange={handleInputChange}
              />
            </div>

            <div className="col-md-6 form-input">
              <Controls.Input
                name="consignee_name"
                label="Consignee Name"
                value={values.consignee_name}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-md-6 form-input">
              <Controls.Input
                name="phone"
                label="phone"
                value={values.phone}
                onChange={handleInputChange}
                required="required"
                isError={errors.phone ? "error" : ""}
              />
              <div className="invalid-feedback">
                Please provide a valid phone.
              </div>
            </div>

            <div className="col-md-6 form-input">
              <Controls.Input
                name="consignee_address_1"
                label="Consignee address 1"
                value={values.consignee_address_1}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-md-6 form-input">
              <Controls.Input
                name="consignee_address_2"
                label="Consignee address 2"
                value={values.consignee_address_2}
                onChange={handleInputChange}
              />
            </div>

            <div className="col-md-6">
              <Controls.Select
                name="country_id"
                label="Country"
                value={values.country_id}
                onChange={handleCountry}
                options={countryItems}
              />
            </div>

            <div className="col-md-6 form-input">
              <Controls.Input
                name="zip_code"
                label="Zip Code"
                value={values.zip_code}
                onChange={handleInputChange}
              />
            </div>

            <div className="col-md-6">
              <Controls.Select
                name="state_id"
                label="State"
                value={values.state_id}
                onChange={handleState}
                options={stateItems}
              />
            </div>

            <div className="col-md-6">
              <Controls.Select
                name="city_id"
                label="City"
                value={values.city_id}
                onChange={handleInputChange}
                options={cityItems}
              />
            </div>
          </div>
        </Grid>
        <Grid item xs={12}>
          <br />
          <div
            className="pull-right"
            style={{ display: "flex", flexDirection: "row-reverse" }}
          >
            <Controls.Button size="medium" type="submit" text="Submit" />
          </div>
        </Grid>
      </Grid>
    </Form>
  );
}
