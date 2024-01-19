import { Grid } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import Spinner from "react-bootstrap/Spinner";
import * as countryService from "../../services/CountryService";
import Controls from "../controls/Controls";
import { Form, useForm } from "../useForm/UseForm";

const statusItems = [
  { id: "1", title: "Active" },
  { id: "2", title: "Inactive" },
];

const initialFValues = {
  id: 0,
  name: "",
  short_code: "",
  status: "1",
  country_id: "",
};

export default function StateForm(props) {
  const [countryItems, setCountry] = useState([]);
  const [buttonText, setButtonText] = useState();
  const [errorClass, setErrorClass] = useState("");

  useEffect(() => {
    const getcountry = () => {
      countryService.getAllCountryForSelect().then((response) => {
        setCountry(response.data.data);
      });
    };
    getcountry();
  }, []);

  const { addOrEdit, recordForEdit, buttonDisabled } = props;

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
    setErrorClass("was-validated");

    if (validate()) {
      addOrEdit(values, resetForm);
    }
  };

  useEffect(() => {
    if (recordForEdit != null) {
      setValues({
        ...recordForEdit,
      });
      setButtonText("Update");
    } else {
      setButtonText("Save");
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
            <div className="col-md-6">
              <label className="form-label mb-0">State Name</label>
              <Controls.Input
                name="name"
                label="State Name"
                value={values.name}
                onChange={handleInputChange}
                required="required"
              />
              <div className="invalid-feedback">
                Please provide a valid State name.
              </div>
            </div>
            <div className="col-md-6">
              <label className="form-label mb-0">Short Code</label>
              <Controls.Input
                name="short_code"
                label="Short Code"
                value={values.short_code}
                onChange={handleInputChange}
              />
            </div>

            <div className="col-md-6">
              <br />
              <label className="form-label mb-0">Select Country</label>
              <Controls.Select
                name="country_id"
                label="Select Country"
                value={values.country_id}
                onChange={handleInputChange}
                options={countryItems}
                required="required"
              />
              <div className="invalid-feedback">
                Please provide a valid Country name.
              </div>
            </div>
            <div className="col-md-6">
              <br />
              <Controls.RadioGroup
                name="status"
                label="Status"
                value={values.status === 1 || values.status === "1" ? "1" : "2"}
                onChange={handleInputChange}
                items={statusItems}
              />
            </div>
          </div>
        </Grid>
        <Grid item xs={12}>
          <div
            className="pull-right"
            style={{ display: "flex", flexDirection: "row-reverse" }}
          >
            {buttonDisabled && <Spinner animation="border" size="sm" />}

            <Controls.Button
              size="medium"
              type="submit"
              text={buttonText}
              disabled={buttonDisabled}
            />
          </div>
        </Grid>
      </Grid>
    </Form>
  );
}
