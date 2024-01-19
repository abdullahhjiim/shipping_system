import { Grid } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import Spinner from "react-bootstrap/Spinner";
import Controls from "../controls/Controls";
import { Form, useForm } from "../useForm/UseForm";

const statusItems = [
  { id: "1", title: "Active" },
  { id: "2", title: "Inactive" },
];

const initialFValues = {
  id: 0,
  name: "",
  status: "1",
  type: "1",
};

export default function PortForm(props) {
  const { addOrEdit, recordForEdit, buttonDisabled, type } = props;
  const [buttonText, setButtonText] = useState();
  const [errorClass, setErrorClass] = useState("");

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
      setButtonText("Update");
      setValues({
        ...recordForEdit,
      });
    } else {
      setButtonText("Save");
    }
    initialFValues.type = type;
  }, [recordForEdit, setValues, type]);

  return (
    <Form
      onSubmit={handleSubmit}
      className={`needs-validation ${errorClass}`}
      noValidate
    >
      <Grid container>
        <Grid item xs={12}>
          <label className="form-label mb-0">Port Name</label>

          <Controls.Input
            name="name"
            label="Port Name"
            value={values.name}
            onChange={handleInputChange}
            required="required"
          />
          <div className="invalid-feedback">Please provide a valid name.</div>
          <br />
          <Controls.Input
            name="lat"
            label="Lat"
            value={values.lat}
            onChange={handleInputChange}
            required="required"
          />
          <div className="invalid-feedback">Please provide a valid Lat.</div>
          <br />
          <Controls.Input
            name="long"
            label="Long"
            value={values.long}
            onChange={handleInputChange}
            required="required"
          />
          <div className="invalid-feedback">Please provide a valid Long.</div>
          <br />
          <Controls.RadioGroup
            name="status"
            label="Status"
            value={values.status === 1 || values.status === "1" ? "1" : "2"}
            onChange={handleInputChange}
            items={statusItems}
          />
        </Grid>
        <Grid item xs={12}>
          <div
            className="pull-right"
            style={{ display: "flex", flexDirection: "row-reverse" }}
          >
            {buttonDisabled && <Spinner animation="border" size="sm" />}

            <Controls.Button
              size="medium"
              disabled={buttonDisabled}
              type="submit"
              text={buttonText}
            />
          </div>
        </Grid>
      </Grid>
    </Form>
  );
}
